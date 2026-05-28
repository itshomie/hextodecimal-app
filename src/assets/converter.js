(function () {
  const root = document.querySelector("[data-tool]");
  if (!root) return;

  const type = root.dataset.tool;
  const input = root.querySelector("[data-input]");
  const output = root.querySelector("[data-output]");
  const status = root.querySelector("[data-status]");
  const copyButton = root.querySelector("[data-copy]");
  const clearButton = root.querySelector("[data-clear]");

  const setStatus = (message, state = "ok") => {
    if (!status) return;
    status.textContent = message;
    status.dataset.state = state;
  };

  const setOutput = (value) => {
    if (output) output.textContent = value;
  };

  const cleanIntegerToken = (token, base) => {
    let cleaned = token.trim().replace(/,/g, "");
    if (base === 16) cleaned = cleaned.replace(/^[-+]?0x/i, (match) => (match[0] === "-" ? "-" : ""));
    if (base === 2) cleaned = cleaned.replace(/^[-+]?0b/i, (match) => (match[0] === "-" ? "-" : ""));
    return cleaned;
  };

  const splitTokens = (value) =>
    value
      .split(/[\s,;]+/)
      .map((token) => token.trim())
      .filter(Boolean);

  const parseBigInt = (raw, base) => {
    const token = cleanIntegerToken(raw, base);
    const negative = token.startsWith("-");
    const unsigned = token.replace(/^[-+]/, "");
    if (!unsigned) throw new Error("Enter at least one digit.");
    const patterns = {
      2: /^[01]+$/,
      8: /^[0-7]+$/,
      10: /^\d+$/,
      16: /^[0-9a-fA-F]+$/
    };
    if (!patterns[base].test(unsigned)) {
      throw new Error(`"${raw}" is not valid base ${base}.`);
    }
    let value = 0n;
    const radix = BigInt(base);
    for (const char of unsigned.toLowerCase()) {
      const digit = BigInt(parseInt(char, base));
      value = value * radix + digit;
    }
    return negative ? -value : value;
  };

  const formatBigInt = (value, base) => {
    const negative = value < 0n;
    const abs = negative ? -value : value;
    const formatted = abs.toString(base);
    return (negative ? "-" : "") + (base === 16 ? formatted.toUpperCase() : formatted);
  };

  const convertList = (value, fromBase, toBase) => {
    const tokens = splitTokens(value);
    if (!tokens.length) return "";
    return tokens.map((token) => formatBigInt(parseBigInt(token, fromBase), toBase)).join("\n");
  };

  const normalizeHexBytes = (value) => {
    const raw = value.trim();
    if (!raw) return [];
    const parts = raw
      .split(/[\s,;]+/)
      .map((part) => part.trim().replace(/^0x/i, ""));
    if (!parts.length || parts.some((part) => !part)) throw new Error("Enter complete hexadecimal byte values.");
    if (parts.some((part) => !/^[0-9a-fA-F]+$/.test(part))) {
      throw new Error("Use only hexadecimal byte pairs, spaces, commas, semicolons, and optional 0x prefixes.");
    }
    const hex = parts.join("");
    if (hex.length % 2 !== 0) throw new Error("Hex text must contain an even number of digits.");
    const bytes = [];
    for (let i = 0; i < hex.length; i += 2) {
      bytes.push(parseInt(hex.slice(i, i + 2), 16));
    }
    return bytes;
  };

  const decodeUtf8 = (bytes) => new TextDecoder("utf-8", { fatal: false }).decode(new Uint8Array(bytes));

  const bytesToHex = (bytes) => bytes.map((byte) => byte.toString(16).padStart(2, "0").toUpperCase()).join(" ");

  const textToBytes = (value) => Array.from(new TextEncoder().encode(value));

  const bytesToBinary = (bytes) => bytes.map((byte) => byte.toString(2).padStart(8, "0")).join(" ");

  const binaryToBytes = (value) => {
    const tokens = splitTokens(value);
    if (!tokens.length) return [];
    return tokens.map((token) => {
      const stripped = token.replace(/^0b/i, "");
      if (!/^[01]{1,8}$/.test(stripped)) {
        throw new Error(`"${token}" must be one to eight binary digits.`);
      }
      return parseInt(stripped.padStart(8, "0"), 2);
    });
  };

  const getValue = (selector) => root.querySelector(selector)?.value ?? "";

  const renderMultiBase = (value, assumedBase) => {
    const baseSelect = root.querySelector("[data-base]");
    const base = baseSelect ? Number(baseSelect.value) : assumedBase;
    const parsed = parseBigInt(value.trim(), base);
    const ascii = base === 16 ? decodeUtf8(normalizeHexBytes(value)) : "";
    const rows = [
      ["Decimal", parsed.toString(10)],
      ["Hex", formatBigInt(parsed, 16)],
      ["Binary", formatBigInt(parsed, 2)],
      ["Octal", formatBigInt(parsed, 8)]
    ];
    if (ascii) rows.push(["ASCII", ascii]);
    output.innerHTML = rows
      .map(([label, result]) => `<div class="result-row"><strong>${label}</strong><span>${escapeHtml(result)}</span></div>`)
      .join("");
  };

  const escapeHtml = (value) =>
    String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");

  const calculate = () => {
    try {
      const raw = input ? input.value : "";
      if (!raw.trim() && !["hex-calculator", "hexadecimal-calculator", "binary-calculator"].includes(type)) {
        setOutput("");
        setStatus("Ready.");
        return;
      }

      if (type === "hex-to-decimal" || type === "hex-to-decimal-converter") {
        setOutput(convertList(raw, 16, 10));
      } else if (type === "binary-to-decimal" || type === "binary-to-decimal-converter") {
        setOutput(convertList(raw, 2, 10));
      } else if (type === "decimal-to-hex") {
        setOutput(convertList(raw, 10, 16));
      } else if (type === "decimal-to-binary") {
        setOutput(convertList(raw, 10, 2));
      } else if (type === "hex-to-binary") {
        setOutput(convertList(raw, 16, 2));
      } else if (type === "binary-to-hex" || type === "binary-to-hexadecimal") {
        setOutput(convertList(raw, 2, 16));
      } else if (type === "hex-to-ascii") {
        setOutput(decodeUtf8(normalizeHexBytes(raw)));
      } else if (type === "text-to-binary") {
        setOutput(bytesToBinary(textToBytes(raw)));
      } else if (type === "binary-to-ascii") {
        setOutput(decodeUtf8(binaryToBytes(raw)));
      } else if (type === "binary-converter") {
        renderMultiBase(raw, 2);
      } else if (type === "hex-converter") {
        renderMultiBase(raw, 16);
      } else if (type === "hex-calculator" || type === "hexadecimal-calculator") {
        const a = parseBigInt(getValue("[data-a]"), 16);
        const b = parseBigInt(getValue("[data-b]"), 16);
        const op = getValue("[data-op]");
        const result = applyOperation(a, b, op);
        setOutput(`Hex: ${formatBigInt(result, 16)}\nDecimal: ${result.toString(10)}\nBinary: ${formatBigInt(result, 2)}`);
      } else if (type === "binary-calculator") {
        const a = parseBigInt(getValue("[data-a]"), 2);
        const b = parseBigInt(getValue("[data-b]"), 2);
        const op = getValue("[data-op]");
        const result = applyOperation(a, b, op);
        setOutput(`Binary: ${formatBigInt(result, 2)}\nDecimal: ${result.toString(10)}\nHex: ${formatBigInt(result, 16)}`);
      }

      setStatus("Converted instantly in your browser.");
    } catch (error) {
      setOutput("");
      setStatus(error.message || "Unable to convert that input.", "error");
    }
  };

  const applyOperation = (a, b, op) => {
    if (op === "+") return a + b;
    if (op === "-") return a - b;
    if (op === "*") return a * b;
    if (op === "/") {
      if (b === 0n) throw new Error("Division by zero is not defined.");
      return a / b;
    }
    if (op === "%") {
      if (b === 0n) throw new Error("Modulo by zero is not defined.");
      return a % b;
    }
    throw new Error("Choose a supported operation.");
  };

  root.addEventListener("input", calculate);
  root.addEventListener("change", calculate);
  clearButton?.addEventListener("click", () => {
    root.querySelectorAll("textarea, input").forEach((field) => {
      field.value = "";
    });
    setOutput("");
    setStatus("Ready.");
  });
  copyButton?.addEventListener("click", async () => {
    const text = output?.textContent || "";
    if (!text.trim()) return;
    try {
      await navigator.clipboard.writeText(text);
      setStatus("Copied result to clipboard.");
    } catch {
      setStatus("Copy failed. Select the result and copy it manually.", "error");
    }
  });

  calculate();
})();
