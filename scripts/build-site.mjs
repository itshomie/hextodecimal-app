import { cp, mkdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const dist = path.join(root, "dist");
const siteUrl = "https://hextodecimal.app";
const supportEmail = "<!--email_off-->support@hextodecimal.app<!--/email_off-->";

const pages = [
  {
    slug: "",
    keyword: "hex to decimal",
    title: "Hex to Decimal Converter - Fast, Accurate, Free",
    description:
      "Convert hexadecimal values to decimal instantly with a clear, private, browser-based hex to decimal tool built for students, developers, and data teams.",
    tool: "hex-to-decimal",
    inputLabel: "Hexadecimal input",
    outputLabel: "Decimal output",
    placeholder: "Example: FF, 0x2A, 7fffffff",
    sample: "FF\n0x2A\n7fffffff",
    note: "Paste one hex value or a list separated by spaces, commas, or new lines.",
    intent:
      "people who need a dependable way to translate compact base-16 identifiers into ordinary base-10 numbers before debugging, reporting, or documenting a value",
    example: "FF becomes 255, 2A becomes 42, and 7FFFFFFF becomes 2147483647."
  },
  {
    slug: "binary-to-decimal",
    keyword: "binary to decimal",
    title: "Binary to Decimal Converter - Instant Base 2 to Base 10",
    description:
      "Use this binary to decimal converter to turn base-2 values into exact decimal integers with examples, validation, and clear input rules.",
    tool: "binary-to-decimal",
    inputLabel: "Binary input",
    outputLabel: "Decimal output",
    placeholder: "Example: 1010, 11111111, 0b100000",
    sample: "1010\n11111111\n0b100000",
    note: "Use only 0 and 1. The tool accepts optional 0b prefixes and multiple values.",
    intent:
      "students, programmers, and hardware learners who want the everyday decimal meaning of a base-2 pattern",
    example: "1010 becomes 10, 11111111 becomes 255, and 100000 becomes 32."
  },
  {
    slug: "decimal-to-hex",
    keyword: "decimal to hex",
    title: "Decimal to Hex Converter - Base 10 to Hexadecimal",
    description:
      "Convert decimal integers to hexadecimal notation in your browser, including large values, negative values, and multi-line batches.",
    tool: "decimal-to-hex",
    inputLabel: "Decimal input",
    outputLabel: "Hexadecimal output",
    placeholder: "Example: 255, 42, 2147483647",
    sample: "255\n42\n2147483647",
    note: "Enter whole decimal integers. Results are shown in uppercase hexadecimal.",
    intent:
      "developers and technical writers who need compact base-16 notation for memory addresses, color work, IDs, flags, and documentation",
    example: "255 becomes FF, 42 becomes 2A, and 2147483647 becomes 7FFFFFFF."
  },
  {
    slug: "binary-converter",
    keyword: "binary converter",
    title: "Binary Converter - Convert Binary, Decimal, Hex, and Octal",
    description:
      "A practical binary converter that shows decimal, hexadecimal, octal, and binary equivalents from one validated number input.",
    tool: "binary-converter",
    inputLabel: "Number input",
    outputLabel: "Converted values",
    placeholder: "Example: 11010110",
    sample: "11010110",
    note: "Choose the input base, then review the same value in the most common developer formats.",
    multiBase: true,
    defaultBase: 2,
    intent:
      "users who start from a binary value but want to compare the same number across several notations",
    example: "11010110 is 214 in decimal, D6 in hexadecimal, and 326 in octal."
  },
  {
    slug: "hex-converter",
    keyword: "hex converter",
    title: "Hex Converter - Convert Hex to Decimal, Binary, Octal, and ASCII",
    description:
      "Convert hexadecimal numbers to decimal, binary, octal, and readable text when bytes are present with this fast hex converter.",
    tool: "hex-converter",
    inputLabel: "Hex input",
    outputLabel: "Converted values",
    placeholder: "Example: 48656C6C6F or FF",
    sample: "48656C6C6F",
    note: "Use this page when you need more than one hex result from the same input.",
    multiBase: true,
    defaultBase: 16,
    intent:
      "developers who have one hexadecimal value and need several practical interpretations without jumping between different tools",
    example: "48656C6C6F can be read as a number and also as the ASCII text Hello."
  },
  {
    slug: "decimal-to-binary",
    keyword: "decimal to binary",
    title: "Decimal to Binary Converter - Base 10 to Base 2",
    description:
      "Convert decimal integers to binary safely and instantly, including long integers and batches of values.",
    tool: "decimal-to-binary",
    inputLabel: "Decimal input",
    outputLabel: "Binary output",
    placeholder: "Example: 10, 255, 1024",
    sample: "10\n255\n1024",
    note: "Enter whole decimal integers. The output uses base-2 digits with no leading prefix.",
    intent:
      "learners and engineers who need to see how a base-10 value is represented with only zeros and ones",
    example: "10 becomes 1010, 255 becomes 11111111, and 1024 becomes 10000000000."
  },
  {
    slug: "hex-to-binary",
    keyword: "hex to binary",
    title: "Hex to Binary Converter - Base 16 to Base 2",
    description:
      "Convert hexadecimal values to binary with precise validation, multi-value input, and examples for programming and networking work.",
    tool: "hex-to-binary",
    inputLabel: "Hex input",
    outputLabel: "Binary output",
    placeholder: "Example: FF, 2A, 0x80",
    sample: "FF\n2A\n0x80",
    note: "The converter accepts A-F and optional 0x prefixes.",
    intent:
      "people who need to inspect bit patterns behind flags, masks, bytes, network values, or compact hex data",
    example: "FF becomes 11111111, 2A becomes 101010, and 80 becomes 10000000."
  },
  {
    slug: "binary-to-hexadecimal",
    keyword: "binary to hexadecimal",
    title: "Binary to Hexadecimal Converter - Base 2 to Base 16",
    description:
      "Convert binary values to hexadecimal notation and learn how groups of four bits map to each hex digit.",
    tool: "binary-to-hexadecimal",
    inputLabel: "Binary input",
    outputLabel: "Hexadecimal output",
    placeholder: "Example: 11111111, 101010, 10000000",
    sample: "11111111\n101010\n10000000",
    note: "Enter binary digits only. Values may be separated by spaces, commas, or new lines.",
    intent:
      "students and developers who want the formal base-16 form of a binary number for documentation, code, or debugging",
    example: "11111111 becomes FF, 101010 becomes 2A, and 10000000 becomes 80."
  },
  {
    slug: "binary-to-hex",
    keyword: "binary to hex",
    title: "Binary to Hex Converter - Quick Base 2 to Hex",
    description:
      "A quick binary to hex converter for turning bit strings into compact hexadecimal values directly in the browser.",
    tool: "binary-to-hex",
    inputLabel: "Binary input",
    outputLabel: "Hex output",
    placeholder: "Example: 1101, 11110000, 1001",
    sample: "1101\n11110000\n1001",
    note: "Use this shorter-form page when you simply need the hex result.",
    intent:
      "searchers who type the shorter phrase and want a direct, no-distraction conversion from bits to hex digits",
    example: "1101 becomes D, 11110000 becomes F0, and 1001 becomes 9."
  },
  {
    slug: "hex-to-ascii",
    keyword: "hex to ascii",
    title: "Hex to ASCII Converter - Decode Hex Bytes to Text",
    description:
      "Decode hexadecimal byte strings into readable ASCII or UTF-8 text with validation for byte pairs and spacing.",
    tool: "hex-to-ascii",
    inputLabel: "Hex byte input",
    outputLabel: "Decoded text",
    placeholder: "Example: 48 65 6C 6C 6F",
    sample: "48 65 6C 6C 6F",
    note: "Enter pairs of hex digits. Spaces, line breaks, and 0x prefixes are accepted.",
    intent:
      "developers, analysts, and learners who have hexadecimal byte data and need to see the readable characters it represents",
    example: "48 65 6C 6C 6F decodes to Hello."
  },
  {
    slug: "text-to-binary",
    keyword: "text to binary",
    title: "Text to Binary Converter - Encode Words as Bits",
    description:
      "Convert text to binary byte output using UTF-8 encoding, with readable spacing and browser-only processing.",
    tool: "text-to-binary",
    inputLabel: "Text input",
    outputLabel: "Binary output",
    placeholder: "Example: Hello",
    sample: "Hello",
    note: "Each output group is one 8-bit byte from UTF-8 encoded text.",
    intent:
      "students, teachers, and developers who want to show how characters become bytes and bits",
    example: "Hello becomes 01001000 01100101 01101100 01101100 01101111."
  },
  {
    slug: "hex-calculator",
    keyword: "hex calculator",
    title: "Hex Calculator - Add, Subtract, Multiply, and Divide Hex",
    description:
      "Use this hex calculator for browser-based hexadecimal arithmetic with decimal and binary results shown beside the hex answer.",
    tool: "hex-calculator",
    inputLabel: "First hex value",
    outputLabel: "Calculation result",
    placeholder: "Example: FF",
    sample: "FF",
    calculator: true,
    note: "Enter two hexadecimal integers and choose an arithmetic operation.",
    intent:
      "developers who need quick arithmetic on addresses, offsets, masks, checksums, or compact base-16 values",
    example: "FF + 1 equals 100 in hex, 256 in decimal, and 100000000 in binary."
  },
  {
    slug: "hexadecimal-calculator",
    keyword: "hexadecimal calculator",
    title: "Hexadecimal Calculator - Precise Base 16 Arithmetic",
    description:
      "A hexadecimal calculator for exact base-16 addition, subtraction, multiplication, division, and modulo work.",
    tool: "hexadecimal-calculator",
    inputLabel: "First hexadecimal value",
    outputLabel: "Calculation result",
    placeholder: "Example: 2A",
    sample: "2A",
    calculator: true,
    note: "The calculator uses integer arithmetic and reports the same result in hex, decimal, and binary.",
    intent:
      "people who prefer the full term hexadecimal calculator and need transparent base-16 arithmetic rules",
    example: "2A * 10 equals 2A0 in hex, 672 in decimal, and 1010100000 in binary."
  },
  {
    slug: "binary-calculator",
    keyword: "binary calculator",
    title: "Binary Calculator - Add, Subtract, Multiply, and Divide Binary",
    description:
      "Run binary arithmetic instantly in the browser and see binary, decimal, and hexadecimal results for each operation.",
    tool: "binary-calculator",
    inputLabel: "First binary value",
    outputLabel: "Calculation result",
    placeholder: "Example: 1010",
    sample: "1010",
    calculator: true,
    note: "Enter two binary integers and choose the operation. Division returns an integer quotient.",
    intent:
      "students and engineers who need to check arithmetic on bit patterns without converting by hand first",
    example: "1010 + 11 equals 1101 in binary, 13 in decimal, and D in hex."
  },
  {
    slug: "hex-to-decimal-converter",
    keyword: "hex to decimal converter",
    title: "Hex to Decimal Converter - Convert Base 16 to Base 10",
    description:
      "A dedicated hex to decimal converter for exact base-16 to base-10 conversion, with examples, input rules, and batch support.",
    tool: "hex-to-decimal-converter",
    inputLabel: "Hexadecimal input",
    outputLabel: "Decimal output",
    placeholder: "Example: 1F4, 0x10, ABCD",
    sample: "1F4\n0x10\nABCD",
    note: "This converter supports large integers and multiple hex values at once.",
    intent:
      "searchers who specifically want a converter page that gives the base-10 answer first and explains how to trust the result",
    example: "1F4 becomes 500, 10 becomes 16, and ABCD becomes 43981."
  },
  {
    slug: "binary-to-ascii",
    keyword: "binary to ascii",
    title: "Binary to ASCII Converter - Decode Bits to Text",
    description:
      "Convert binary byte groups into ASCII or UTF-8 text, with validation for byte-sized input and clear examples.",
    tool: "binary-to-ascii",
    inputLabel: "Binary byte input",
    outputLabel: "Decoded text",
    placeholder: "Example: 01001000 01100101 01101100 01101100 01101111",
    sample: "01001000 01100101 01101100 01101100 01101111",
    note: "Enter one to eight binary digits per byte group. Spaces and new lines are accepted.",
    intent:
      "people who have binary byte data and need to recover the letters, symbols, or control characters behind it",
    example: "01001000 01100101 01101100 01101100 01101111 decodes to Hello."
  },
  {
    slug: "binary-to-decimal-converter",
    keyword: "binary to decimal converter",
    title: "Binary to Decimal Converter - Exact Base 2 to Base 10",
    description:
      "A focused binary to decimal converter for exact integer conversion, batch input, validation, and practical examples.",
    tool: "binary-to-decimal-converter",
    inputLabel: "Binary input",
    outputLabel: "Decimal output",
    placeholder: "Example: 1001, 100000000, 11111111",
    sample: "1001\n100000000\n11111111",
    note: "The converter returns exact integer results without sending input to a server.",
    intent:
      "searchers who want a dedicated converter with immediate base-10 output and enough explanation to learn the process",
    example: "1001 becomes 9, 100000000 becomes 256, and 11111111 becomes 255."
  }
];

const navPages = pages.map((page) => ({
  href: page.slug ? `/${page.slug}/` : "/",
  label: titleCase(page.keyword),
  description: page.description
}));

const relatedFor = (page) =>
  navPages
    .filter((item) => item.href !== (page.slug ? `/${page.slug}/` : "/"))
    .slice(0, 6);

const commonUseCases = [
  "checking values copied from logs, packet captures, device dashboards, and developer consoles",
  "confirming examples before publishing documentation, homework, tickets, or runbooks",
  "translating compact machine-friendly notation into a form that is easier to discuss with another person"
];

async function main() {
  await rm(dist, { force: true, recursive: true });
  await mkdir(path.join(dist, "assets"), { recursive: true });
  await cp(path.join(root, "src/assets/styles.css"), path.join(dist, "assets/styles.css"));
  await cp(path.join(root, "src/assets/converter.js"), path.join(dist, "assets/converter.js"));
  await cp(path.join(root, "src/assets/favicon.svg"), path.join(dist, "assets/favicon.svg"));

  for (const page of pages) {
    await writePage(page.slug, renderConverterPage(page));
  }

  for (const page of companyPages()) {
    await writePage(page.slug, renderCompanyPage(page));
  }

  await writeFile(path.join(dist, "robots.txt"), renderRobots());
  await writeFile(path.join(dist, "sitemap.xml"), renderSitemap());
  await writeFile(path.join(dist, "404.html"), render404());
}

async function writePage(slug, html) {
  const directory = slug ? path.join(dist, slug) : dist;
  await mkdir(directory, { recursive: true });
  await writeFile(path.join(directory, "index.html"), html);
}

function renderConverterPage(page) {
  const canonical = canonicalFor(page.slug);
  const title = page.title;
  const related = relatedFor(page);
  const body = `
    <main id="main" class="main-shell">
      <section class="hero">
        <div class="hero-copy">
          <h1>${titleCase(page.keyword)}</h1>
          <p>${leadFor(page)}</p>
          <div class="hero-actions">
            <a class="button" href="#converter">Use the converter</a>
            <a class="button secondary" href="#how-it-works">Read the guide</a>
          </div>
        </div>
        ${renderTool(page)}
      </section>
      <section class="content-layout" aria-label="${escapeHtml(page.keyword)} guide">
        <article class="article">
          ${articleFor(page)}
        </article>
        <aside class="side-panel" aria-label="Related conversion tools">
          <div class="side-section">
            <h2>Related tools</h2>
            <ul class="link-list">
              ${related
                .slice(0, 8)
                .map((item) => `<li><a href="${item.href}">${escapeHtml(item.label)}</a></li>`)
                .join("")}
            </ul>
          </div>
          <div class="side-section">
            <h2>Contact</h2>
            <p class="tool-note">Questions or feedback: <span class="email-text">${supportEmail}</span></p>
          </div>
        </aside>
      </section>
      <section class="section-band" aria-labelledby="more-tools">
        <h2 id="more-tools">More number conversion tools</h2>
        <div class="related-grid">
          ${related
            .map(
              (item) => `<a class="related-card" href="${item.href}"><strong>${escapeHtml(
                item.label
              )}</strong><span>${escapeHtml(item.description)}</span></a>`
            )
            .join("")}
        </div>
      </section>
    </main>
  `;
  return layout({ title, description: page.description, canonical, body, page });
}

function leadFor(page) {
  return `Use this ${page.keyword} tool when you need an exact result without a slow form, a sign-up screen, or a server-side upload. It is designed for ${page.intent}, and it keeps the input on your device while you work.`;
}

function renderTool(page) {
  const toolLabel = page.calculator ? "Calculator" : page.multiBase ? "Multi-base converter" : "Converter";
  const sample = escapeHtml(page.sample || "");
  if (page.calculator) {
    const secondSample = page.tool === "binary-calculator" ? "11" : page.tool === "hexadecimal-calculator" ? "10" : "1";
    return `
      <section class="tool-panel" id="converter" data-tool="${page.tool}" aria-labelledby="tool-title">
        <div class="tool-header">
          <div>
            <div class="tool-type">${toolLabel}</div>
            <h2 id="tool-title">${escapeHtml(page.title.replace(/ - .*/, ""))}</h2>
          </div>
          <button class="button secondary" type="button" data-clear>Clear</button>
        </div>
        <div class="tool-body">
          <div class="field-grid">
            <div class="field">
              <label for="value-a">${escapeHtml(page.inputLabel)}</label>
              <input id="value-a" data-a value="${sample}" inputmode="text" spellcheck="false">
            </div>
            <div class="field">
              <label for="value-b">Second value</label>
              <input id="value-b" data-b value="${escapeHtml(secondSample)}" inputmode="text" spellcheck="false">
            </div>
          </div>
          <div class="field-grid">
            <div class="field">
              <label for="operation">Operation</label>
              <select id="operation" data-op>
                <option value="+">Add (+)</option>
                <option value="-">Subtract (-)</option>
                <option value="*">Multiply (*)</option>
                <option value="/">Divide (/)</option>
                <option value="%">Modulo (%)</option>
              </select>
            </div>
            <div class="field">
              <label>${escapeHtml(page.outputLabel)}</label>
              <div class="output-box" data-output aria-live="polite"></div>
            </div>
          </div>
          <div class="tool-actions">
            <button class="button" type="button" data-copy>Copy result</button>
          </div>
          <p class="tool-note">${escapeHtml(page.note)}</p>
          <div class="status-line" data-status aria-live="polite">Ready.</div>
        </div>
      </section>`;
  }

  return `
    <section class="tool-panel" id="converter" data-tool="${page.tool}" aria-labelledby="tool-title">
      <div class="tool-header">
        <div>
          <div class="tool-type">${toolLabel}</div>
          <h2 id="tool-title">${escapeHtml(page.title.replace(/ - .*/, ""))}</h2>
        </div>
        <button class="button secondary" type="button" data-clear>Clear</button>
      </div>
      <div class="tool-body">
        ${page.multiBase ? renderBaseSelect(page) : ""}
        <div class="field-grid">
          <div class="field">
            <label for="converter-input">${escapeHtml(page.inputLabel)}</label>
            <textarea id="converter-input" data-input placeholder="${escapeHtml(page.placeholder)}" spellcheck="false">${sample}</textarea>
          </div>
          <div class="field">
            <label>${escapeHtml(page.outputLabel)}</label>
            <div class="output-box ${page.multiBase ? "multi-output" : ""}" data-output aria-live="polite"></div>
          </div>
        </div>
        <div class="tool-actions">
          <button class="button" type="button" data-copy>Copy result</button>
        </div>
        <p class="tool-note">${escapeHtml(page.note)}</p>
        <div class="status-line" data-status aria-live="polite">Ready.</div>
      </div>
    </section>`;
}

function renderBaseSelect(page) {
  const bases = [
    [2, "Binary"],
    [10, "Decimal"],
    [16, "Hexadecimal"],
    [8, "Octal"]
  ];
  return `
    <div class="field">
      <label for="input-base">Input base</label>
      <select id="input-base" data-base>
        ${bases
          .map(
            ([value, label]) =>
              `<option value="${value}" ${Number(page.defaultBase) === value ? "selected" : ""}>${label}</option>`
          )
          .join("")}
      </select>
    </div>`;
}

function articleFor(page) {
  const keywordTitle = titleCase(page.keyword);
  const related = relatedFor(page).slice(0, 4);
  const isText = ["hex-to-ascii", "text-to-binary", "binary-to-ascii"].includes(page.tool);
  const isCalculator = page.calculator;
  const inputType = isCalculator ? "two input values" : isText ? "byte or text input" : "integer input";

  return `
    <h2 id="how-it-works">What this ${escapeHtml(page.keyword)} page is for</h2>
    <p>${keywordTitle} searches usually come from a practical moment, not from abstract math curiosity. Someone has a value in one notation, a bug report, a device manual, a packet capture, a classroom worksheet, a color table, a checksum, or a line of source code, and they need the same value in a form that fits the next step. This page is built around that real intent. The converter is placed first, the result updates immediately, and the guide below explains what the answer means so you can copy it with confidence.</p>
    <p>The tool runs in your browser. That matters for small but sensitive technical details, because copied data can include internal identifiers, offsets, serial values, or diagnostic fragments. The page does not need an account, and it does not need a round trip to a remote calculator just to turn one representation into another. You can paste a single value, test the sample, clear the field, or process several values at once when the converter supports lists.</p>

    <h2>How to use the ${escapeHtml(page.keyword)} tool</h2>
    <p>Start by pasting your ${inputType} into the input area. Keep the value as plain text, using the normal digits for the source format. ${escapeHtml(page.note)} The result panel updates as soon as the input is valid. If the page reports a validation message, check for extra punctuation, unsupported digits, or a prefix that belongs to another base. For repeated work, place each value on a separate line so the output can be reviewed line by line.</p>
    <p>${escapeHtml(page.example)} This example is intentionally simple because simple examples are the fastest way to confirm that the direction is right. Once the sample result matches your expectation, replace it with your production value. Large integers are handled with browser BigInt arithmetic on numeric converter and calculator pages, so common programming values are not rounded the way they can be in floating-point-only tools.</p>

    <h2>Why this conversion matters</h2>
    <p>Number bases are different ways of writing the same quantity. Decimal is comfortable for everyday reading because it uses ten symbols. Binary is natural for bits because each digit is either on or off. Hexadecimal is compact because one hex digit represents four binary bits, which makes byte values, memory offsets, bit masks, and encoded data much easier to scan. A useful ${escapeHtml(page.keyword)} page should respect those roles instead of treating conversion as a generic text trick.</p>
    <p>In real workflows, the answer often feeds another decision. A developer may compare a constant with a log line. A student may check the steps in a base conversion assignment. A network analyst may inspect a byte. A firmware engineer may line up a bit mask. A data analyst may normalize imported identifiers. This site keeps the operation focused so the result is easy to verify before it moves into code, notes, tickets, or documentation.</p>

    <h2>Input rules and validation</h2>
    <p>Clean input prevents confusing output. Numeric converters accept whole integers and reject characters that do not belong in the selected source base. Hexadecimal values use digits 0 through 9 and letters A through F. Binary values use only 0 and 1. Decimal values use ordinary base-10 digits. Text and ASCII pages work with bytes, so their input rules are based on complete byte groups rather than arbitrary mathematical integers.</p>
    <p>When a value is invalid, the page shows a message instead of guessing. That is deliberate. Guessing can be dangerous when a single digit changes an address, permission mask, byte sequence, or classroom answer. If your source includes labels, comments, quotes, or punctuation, remove those parts first. If the input came from code, it is usually fine to keep common numeric prefixes such as <code>0x</code> for hex or <code>0b</code> for binary where the tool notes support them.</p>

    <h2>Common uses for ${escapeHtml(page.keyword)}</h2>
    <p>This tool is useful for ${commonUseCases.join(", ")}. It also helps when you need a quick sanity check during a meeting or while writing an explanation. A converter that loads quickly and keeps the tool visible at the top of the page saves time because you do not have to hunt through a long tutorial before doing the work.</p>
    <p>For programming, conversion is often tied to representation. A value may be stored one way, displayed another way, and explained in a third way. For education, seeing the source and result together makes the pattern easier to remember. For documentation, having a verified output reduces accidental typos in examples. These are small tasks, but they compound when you do them many times in a week.</p>

    <h2>Accuracy notes</h2>
    <p>${isCalculator ? "Calculator pages use integer arithmetic. Division returns the integer quotient because base conversion work most often deals with whole-number values, offsets, and bit patterns rather than decimal fractions." : "Converter pages treat numeric input as integer values. They do not silently convert fractions, because fractional base conversion has different rules and is easy to misread without an explicit format."} Negative numbers are supported on numeric conversion pages where the source format makes the sign clear. For bit-level two's-complement interpretation, decide the intended bit width first, because the same visible bits can represent different signed values depending on the width.</p>
    <p>${isText ? "For text conversion, the page uses UTF-8 byte handling in the browser. Plain ASCII characters produce the familiar one-byte results, while characters outside the basic ASCII range can use multiple bytes. That is expected and usually correct for modern web text." : "For very large values, the page displays the exact integer form rather than scientific notation. This is important for identifiers and low-level values where every digit carries meaning."} Always compare the result with the context where you plan to use it, especially when copying into a system that expects prefixes, fixed widths, leading zeroes, or grouped bytes.</p>

    <h2>How to read the result</h2>
    <p>The result is intentionally plain. It avoids decorative formatting that might make copying harder. If you need a prefix such as <code>0x</code> or <code>0b</code>, add it in the destination system according to that system's style guide. If you need a fixed byte width, pad the result on the left with zeros after conversion. The mathematical value stays the same, but the display width may matter in protocol tables, registers, and binary examples.</p>
    <p>Batch output follows the order of the input. This lets you paste a short list, convert it, and compare each line without building a spreadsheet. When you are checking many values, keep the original source nearby until you have confirmed that every line was converted in the intended direction. Copying the wrong direction is one of the most common mistakes with base tools, especially when hex and binary values appear in the same task.</p>

    <h2>Related tools</h2>
    <p>If this page is close but not exactly the operation you need, the related converters below cover adjacent intents without mixing every feature into one crowded interface. You can move from ${escapeHtml(page.keyword)} to ${related
      .map((item) => `<a href="${item.href}">${escapeHtml(item.label)}</a>`)
      .join(", ")}. Keeping each page centered on one core task makes the tool faster to use and makes the explanation easier to follow.</p>

    <h2>Frequently asked questions</h2>
    <h3>Does this ${escapeHtml(page.keyword)} tool send my input to a server?</h3>
    <p>No. The conversion logic runs in your browser after the page loads. Standard hosting logs may record that a page was requested, but the values you type into the converter are processed locally.</p>
    <h3>Can I use this page for homework or documentation?</h3>
    <p>Yes. The examples and validation messages are written to make the conversion process understandable, not just to return a number. For formal work, include the original value, the converted value, and the base labels so readers can see the direction clearly.</p>
    <h3>Why did my pasted value fail validation?</h3>
    <p>The most common reason is an extra character from the source, such as a quote, colon, separator, comment, or unit label. Remove anything that is not part of the value itself, then run the conversion again.</p>
  `;
}

function companyPages() {
  return [
    {
      slug: "about",
      title: "About HexToDecimal.app",
      description:
        "Learn why HexToDecimal.app exists and how the site approaches fast, private, practical number conversion tools.",
      body: `
        <h1>About HexToDecimal.app</h1>
        <p>HexToDecimal.app is a focused utility site for developers, students, teachers, analysts, and technical teams that need reliable base conversion without extra friction. The first version of the site is intentionally simple: each major search intent gets a dedicated page, each page contains a working browser-based tool, and the supporting guide explains the rules behind the conversion.</p>
        <p>The site is built for people in the United States first, with English content, clear examples, and direct language. It is not a general encyclopedia. It is a practical workspace for moments when a hexadecimal value needs to become decimal, a binary byte needs to become text, or a quick calculation needs to be checked before it is copied into a ticket, lesson, script, report, or code comment.</p>
        <h2>Our approach</h2>
        <p>We keep tools fast, private, and readable. Conversion happens in the browser when possible. Pages avoid sign-up walls, empty links, and distracting navigation. Explanations are written around real user intent instead of keyword stuffing. A person should be able to arrive from search, solve the task, understand the result, and move on.</p>
        <h2>Contact</h2>
        <p>For corrections, feature requests, accessibility notes, or business inquiries, contact <span class="email-text">${supportEmail}</span>.</p>`
    },
    {
      slug: "contact",
      title: "Contact HexToDecimal.app",
      description: "Contact HexToDecimal.app for support, corrections, service questions, and site feedback.",
      body: `
        <h1>Contact HexToDecimal.app</h1>
        <div class="contact-box">
          <p>Email: <span class="email-text">${supportEmail}</span></p>
          <p>We display the email address as plain text so your browser does not open a mail client automatically.</p>
        </div>
        <h2>What to include</h2>
        <p>If you are reporting a conversion issue, include the page URL, the input value, the expected result, and the result you saw. If you are requesting a new converter, include the source format, target format, and one or two example values. Clear examples help us verify behavior before changing a tool.</p>
        <h2>Response scope</h2>
        <p>HexToDecimal.app provides technical utility pages and educational explanations. We cannot review private codebases, recover accounts, or provide legal, financial, or security certification advice through the contact channel. We can review site bugs, factual corrections, accessibility issues, and business or collaboration questions.</p>`
    },
    {
      slug: "team-services",
      title: "Team Services",
      description:
        "Service information for teams that need custom converter documentation, embedded technical utilities, or internal training content.",
      body: `
        <h1>Team Services</h1>
        <p>HexToDecimal.app is primarily a public utility site, but teams sometimes need the same style of clear conversion logic inside their own documentation, onboarding material, classroom resources, or internal tools. Team services focus on practical technical content: custom converter pages, internal examples, QA checklists, and clear explanations for non-specialist readers who still need accurate results.</p>
        <h2>Services</h2>
        <ul>
          <li>Custom base-conversion documentation for engineering, education, and support teams.</li>
          <li>Review of examples involving hexadecimal, decimal, binary, ASCII, and byte-level explanations.</li>
          <li>Lightweight browser-based converter prototypes for internal training or documentation portals.</li>
          <li>Content cleanup for technical guides where number bases, bit masks, or encoded text need clearer explanations.</li>
        </ul>
        <h2>How to ask</h2>
        <p>Contact <span class="email-text">${supportEmail}</span> with the type of material you need, the audience, the timeline, and sample inputs or existing documentation. Do not send secrets, private keys, passwords, customer records, or confidential production data in an initial message.</p>`
    },
    {
      slug: "privacy-policy",
      title: "Privacy Policy",
      description: "Privacy policy for HexToDecimal.app, including browser-side conversion and contact information.",
      body: `
        <h1>Privacy Policy</h1>
        <p>Last updated: May 27, 2026.</p>
        <p>HexToDecimal.app is designed as a low-friction technical utility. The conversion tools run in your browser after the page loads. Values typed into the converter fields are not intentionally submitted to HexToDecimal.app servers by the tool itself.</p>
        <h2>Information we may receive</h2>
        <p>Like most websites, hosting infrastructure may process basic request information such as IP address, requested URL, user agent, date, time, and security-related logs. If you email us at <span class="email-text">${supportEmail}</span>, we receive the information you choose to include in that message.</p>
        <h2>How information is used</h2>
        <p>We use operational information to run, secure, debug, and improve the site. We use contact messages to respond to questions, corrections, service inquiries, or support requests. Do not send secrets, credentials, private keys, regulated personal data, or confidential production data through converter fields or email.</p>
        <h2>Third parties</h2>
        <p>The site is hosted on Cloudflare Pages. Cloudflare may process request and security data as part of hosting, caching, abuse prevention, and network operations. If analytics or additional service providers are added later, this policy will be updated to describe them.</p>
        <h2>Contact</h2>
        <p>Questions about this policy can be sent to <span class="email-text">${supportEmail}</span>.</p>`
    },
    {
      slug: "terms-of-use",
      title: "Terms of Use",
      description: "Terms of use for HexToDecimal.app tools, content, and site access.",
      body: `
        <h1>Terms of Use</h1>
        <p>Last updated: May 27, 2026.</p>
        <p>By using HexToDecimal.app, you agree to use the site responsibly and only for lawful purposes. The site provides browser-based conversion tools and educational content for general technical use.</p>
        <h2>No warranty</h2>
        <p>The tools are provided as-is. We work to keep conversions accurate and explanations clear, but you are responsible for verifying results before using them in production systems, legal documents, safety-critical work, financial decisions, or other high-risk contexts.</p>
        <h2>Acceptable use</h2>
        <p>Do not attempt to disrupt the site, probe infrastructure without permission, overload hosting resources, or use the site to process data you are not authorized to handle. Do not send secrets, passwords, private keys, or confidential production records through contact messages.</p>
        <h2>Contact</h2>
        <p>Questions about these terms can be sent to <span class="email-text">${supportEmail}</span>.</p>`
    },
    {
      slug: "cookie-policy",
      title: "Cookie Policy",
      description: "Cookie policy for HexToDecimal.app.",
      body: `
        <h1>Cookie Policy</h1>
        <p>Last updated: May 27, 2026.</p>
        <p>HexToDecimal.app does not require account cookies to use the public converter pages. The tools are available without signing in. Hosting and security providers may use limited technical cookies or similar technologies when needed to deliver, secure, or protect the site.</p>
        <h2>Current use</h2>
        <p>The site does not currently use advertising cookies, behavioral retargeting cookies, or login session cookies for visitors using the public converters. If analytics, preferences, or additional services are added, this page will be updated to describe those technologies and their purpose.</p>
        <h2>Contact</h2>
        <p>Cookie questions can be sent to <span class="email-text">${supportEmail}</span>.</p>`
    }
  ];
}

function renderCompanyPage(page) {
  const canonical = canonicalFor(page.slug);
  const body = `
    <main id="main" class="main-shell">
      <article class="company-page article">
        ${page.body}
      </article>
    </main>`;
  return layout({ title: page.title, description: page.description, canonical, body });
}

function layout({ title, description, canonical, body, page }) {
  const schema = page ? renderSchema(page, canonical) : "";
  return `<!doctype html>
<html lang="en-US">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escapeHtml(title)}</title>
  <meta name="description" content="${escapeHtml(description)}">
  <link rel="canonical" href="${canonical}">
  <meta property="og:type" content="website">
  <meta property="og:title" content="${escapeHtml(title)}">
  <meta property="og:description" content="${escapeHtml(description)}">
  <meta property="og:url" content="${canonical}">
  <meta property="og:site_name" content="HexToDecimal.app">
  <meta name="twitter:card" content="summary">
  <meta name="theme-color" content="#0f172a">
  <link rel="icon" href="/assets/favicon.svg" type="image/svg+xml">
  <link rel="shortcut icon" href="/assets/favicon.svg" type="image/svg+xml">
  <link rel="stylesheet" href="/assets/styles.css">
  ${schema}
</head>
<body>
  <a class="skip-link" href="#main">Skip to content</a>
  ${header()}
  ${body}
  ${footer()}
  <script src="/assets/converter.js" defer></script>
</body>
</html>`;
}

function header() {
  return `
    <header class="site-header">
      <div class="header-inner">
        <a class="brand" href="/" aria-label="HexToDecimal.app home">
          <span class="brand-mark">16</span>
          <span>HexToDecimal.app</span>
        </a>
        <nav class="primary-nav" aria-label="Primary navigation">
          <a href="/">Hex to decimal</a>
          <details class="nav-menu">
            <summary>Converters</summary>
            <div class="nav-panel">
              ${navPages
                .filter((item) => item.href !== "/")
                .map((item) => `<a href="${item.href}">${escapeHtml(item.label)}</a>`)
                .join("")}
            </div>
          </details>
          <a href="/hex-calculator/">Hex calculator</a>
          <a href="/binary-calculator/">Binary calculator</a>
          <a href="/about/">About</a>
          <a href="/contact/">Contact</a>
        </nav>
      </div>
    </header>`;
}

function footer() {
  const converterLinks = navPages.slice(0, 9);
  const moreLinks = navPages.slice(9);
  return `
    <footer class="site-footer">
      <div class="footer-inner">
        <div class="footer-brand">
          <a class="brand" href="/" aria-label="HexToDecimal.app home">
            <span class="brand-mark">16</span>
            <span>HexToDecimal.app</span>
          </a>
          <p>Fast English-language converters for hexadecimal, decimal, binary, ASCII, and related calculator tasks. Contact: <span class="email-text">${supportEmail}</span></p>
        </div>
        <div class="footer-columns">
          <div>
            <h2>Converters</h2>
            ${converterLinks.map((item) => `<a href="${item.href}">${escapeHtml(item.label)}</a>`).join("")}
          </div>
          <div>
            <h2>More tools</h2>
            ${moreLinks.map((item) => `<a href="${item.href}">${escapeHtml(item.label)}</a>`).join("")}
          </div>
          <div>
            <h2>Site</h2>
            <a href="/about/">About</a>
            <a href="/team-services/">Team services</a>
            <a href="/contact/">Contact</a>
            <a href="/privacy-policy/">Privacy policy</a>
            <a href="/terms-of-use/">Terms of use</a>
            <a href="/cookie-policy/">Cookie policy</a>
          </div>
        </div>
      </div>
      <div class="footer-bottom">
        <div class="footer-inner" style="display:block;padding:0;">© ${new Date().getFullYear()} HexToDecimal.app. All rights reserved.</div>
      </div>
    </footer>`;
}

function renderSchema(page, canonical) {
  const data = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: titleCase(page.keyword),
    url: canonical,
    applicationCategory: "DeveloperApplication",
    operatingSystem: "Any",
    description: page.description,
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD"
    }
  };
  const faq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: `Does this ${page.keyword} tool send my input to a server?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: "No. The conversion logic runs in your browser after the page loads."
        }
      },
      {
        "@type": "Question",
        name: `Can I use this ${page.keyword} page for homework or documentation?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. Include the original value, the converted value, and the base labels so the direction is clear."
        }
      }
    ]
  };
  return `<script type="application/ld+json">${JSON.stringify(data)}</script>
  <script type="application/ld+json">${JSON.stringify(faq)}</script>`;
}

function renderRobots() {
  return `User-agent: *
Allow: /

Sitemap: ${siteUrl}/sitemap.xml
`;
}

function renderSitemap() {
  const urls = [
    ...pages.map((page) => canonicalFor(page.slug)),
    ...companyPages().map((page) => canonicalFor(page.slug))
  ];
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (url) => `  <url>
    <loc>${url}</loc>
    <changefreq>weekly</changefreq>
    <priority>${url === siteUrl + "/" ? "1.0" : "0.8"}</priority>
  </url>`
  )
  .join("\n")}
</urlset>
`;
}

function render404() {
  return layout({
    title: "Page Not Found",
    description: "The requested HexToDecimal.app page could not be found.",
    canonical: `${siteUrl}/404.html`,
    body: `
      <main id="main" class="main-shell">
        <article class="company-page article">
          <h1>Page not found</h1>
          <p>The page you requested is not available. Use the converter links below to continue.</p>
          <ul>
            ${navPages.map((item) => `<li><a href="${item.href}">${escapeHtml(item.label)}</a></li>`).join("")}
          </ul>
        </article>
      </main>`
  });
}

function canonicalFor(slug) {
  return slug ? `${siteUrl}/${slug}/` : `${siteUrl}/`;
}

function titleCase(value) {
  const smallWords = new Set(["to", "and", "or"]);
  return value
    .split(" ")
    .map((word, index) => {
      const lower = word.toLowerCase();
      if (lower === "ascii") return "ASCII";
      if (smallWords.has(lower) && index > 0) return lower;
      return lower.charAt(0).toUpperCase() + lower.slice(1);
    })
    .join(" ");
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
