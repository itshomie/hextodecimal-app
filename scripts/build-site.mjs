import { cp, mkdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const dist = path.join(root, "dist");
const siteUrl = "https://hextodecimal.app";
const lastModified = "2026-06-24";
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
      "Use this decimal to hex converter to create hexadecimal notation in your browser, including large values, negative values, and multi-line batches.",
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
      "Use this hex to binary converter to expand hexadecimal values into base-2 output with validation, batch input, and programming examples.",
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
    redirectTo: "binary-to-hex",
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
      "Use this hex to ASCII converter to decode hexadecimal byte strings into readable ASCII or UTF-8 text with byte-pair validation.",
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
    redirectTo: "hex-calculator",
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
      "Use this binary calculator to run binary arithmetic in the browser and see binary, decimal, and hexadecimal results for each operation.",
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
    redirectTo: "",
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
    redirectTo: "binary-to-decimal",
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

const hasRedirect = (page) => Object.prototype.hasOwnProperty.call(page, "redirectTo");
const indexablePages = pages.filter((page) => !hasRedirect(page));
const redirectPages = pages.filter((page) => hasRedirect(page));

const navPages = indexablePages.map((page) => ({
  href: page.slug ? `/${page.slug}/` : "/",
  label: titleCase(page.keyword),
  description: page.description
}));

const relatedFor = (page) =>
  navPages
    .filter((item) => item.href !== (page.slug ? `/${page.slug}/` : "/"))
    .slice(0, 6);

const blogPosts = [
  {
    slug: "blog/how-to-convert-binary-to-decimal",
    keyword: "how to convert binary to decimal",
    title: "How to Convert Binary to Decimal Without Guessing",
    description:
      "Learn how binary to decimal conversion works, why powers of two matter, and when to use a converter instead of doing the math by hand.",
    updated: "2026-06-24",
    summary:
      "Binary looks awkward until you stop reading it like an ordinary number. This guide shows the place-value method and the small checks that prevent wrong answers.",
    relatedTools: ["binary-to-decimal", "binary-converter", "decimal-to-binary"],
    sections: [
      {
        heading: "Start by treating every digit as a switch",
        paragraphs: [
          "Binary is base 2, so every position can only be off or on. A 0 contributes nothing. A 1 contributes the value of that position. The trick is to read the positions from right to left instead of trying to read the full string as a normal decimal number.",
          "Take 1010. The rightmost digit is the ones place, then 2, then 4, then 8. The active positions are 8 and 2, so 1010 equals 10. That is the whole idea. Longer values use the same rule, just with more powers of two."
        ]
      },
      {
        heading: "Use a place-value table when the number is longer",
        paragraphs: [
          "For short values, mental math is fine. For anything longer than four or five bits, a table keeps the work honest. Write the powers of two across the top, write the bits underneath, then add only the columns where the bit is 1."
        ],
        table: {
          headers: ["Binary", "Active place values", "Decimal"],
          rows: [
            ["1010", "8 + 2", "10"],
            ["11111111", "128 + 64 + 32 + 16 + 8 + 4 + 2 + 1", "255"],
            ["100000000", "256", "256"]
          ]
        }
      },
      {
        heading: "Watch for separators and prefixes",
        paragraphs: [
          "A value copied from code may include a 0b prefix, such as 0b1010. That prefix tells humans and programming languages that the number is binary. It is not part of the value, so the digits after 0b are what matter.",
          "Spaces can mean two different things. In a lesson, 1111 0000 is often one byte written in groups for readability. In a batch converter, a space may separate two different inputs. If the value is meant to be one byte, remove the space before converting or use a tool that clearly supports grouped bytes."
        ]
      },
      {
        heading: "Do not ignore signed interpretation",
        paragraphs: [
          "Binary conversion by itself gives the mathematical value. For example, 11111111 is 255 as an unsigned byte. In signed 8-bit two's-complement, the same bit pattern can mean -1. Both answers can be correct in different contexts.",
          "That is why hardware notes, protocol docs, and programming examples usually mention a width: 8-bit, 16-bit, 32-bit, or 64-bit. If the source document does not give a width, convert the raw value first, then avoid claiming a signed result."
        ]
      },
      {
        heading: "When a converter is the safer choice",
        paragraphs: [
          "Manual conversion is useful when you are learning. A converter is safer when the value is long, when you need several values at once, or when one wrong digit would break a register setting, packet example, or classroom answer key.",
          "Use the binary to decimal converter when you need a direct answer. Use the broader binary converter when you want to compare the same input as decimal, hex, octal, and binary on one screen."
        ]
      }
    ]
  },
  {
    slug: "blog/why-ff-is-255",
    keyword: "why FF is 255",
    title: "Why FF Equals 255 in Hexadecimal",
    description:
      "A plain explanation of why hex FF converts to decimal 255, how byte values work, and why the same bits may also mean -1.",
    updated: "2026-06-24",
    summary:
      "FF is one of the first hex values people memorize, but the reason matters. This guide breaks it down without skipping the byte context.",
    relatedTools: ["", "hex-to-binary", "hex-converter", "hex-calculator"],
    sections: [
      {
        heading: "Each F means fifteen, not a letter grade",
        paragraphs: [
          "Hexadecimal is base 16. It uses the ordinary digits 0 through 9, then A through F for the values 10 through 15. So F is the largest single hex digit, and its decimal value is 15.",
          "The second part is place value. In FF, the right F is 15 ones. The left F is 15 sixteens. Add those together and you get 15 x 16 + 15, which equals 255."
        ]
      },
      {
        heading: "The byte view makes FF easier to remember",
        paragraphs: [
          "One byte has 8 bits. In binary, eight bits all turned on are written as 11111111. Split that into two groups of four bits and you get 1111 1111. Each group of 1111 maps to hex F, so the byte becomes FF.",
          "The maximum unsigned value of 8 bits is 255 because the place values add up to 128 + 64 + 32 + 16 + 8 + 4 + 2 + 1. That same total is why FF appears so often in color values, masks, protocol examples, and low-level debugging."
        ],
        table: {
          headers: ["Representation", "Value", "What it shows"],
          rows: [
            ["Hex FF", "255", "Two hex digits, both at their maximum"],
            ["Binary 11111111", "255", "Eight active bits in one byte"],
            ["Decimal 255", "FF", "The largest unsigned 8-bit value"]
          ]
        }
      },
      {
        heading: "FF is also common in colors",
        paragraphs: [
          "In web color notation, a full six-digit color such as #FF0000 is made from three byte values: red, green, and blue. The first FF means the red channel is at 255. The next two pairs are 00 and 00, so green and blue are off.",
          "That does not mean every FF is a color value. It only means color systems reuse the same byte range. When you see FF in a log, dump, address, checksum, or protocol table, the surrounding format tells you what kind of value it is."
        ]
      },
      {
        heading: "Why FF can sometimes mean -1",
        paragraphs: [
          "Unsigned FF is 255. Signed 8-bit FF is often -1 because of two's-complement interpretation. The visible characters are the same, but the rule used to interpret them is different.",
          "This is the mistake that causes many confusing bug reports. If someone asks what FF means, the careful answer is: mathematically it converts to 255, but in an 8-bit signed field it may represent -1."
        ]
      },
      {
        heading: "Use the right converter for the question",
        paragraphs: [
          "Use a hex to decimal converter when the question is simply FF to decimal. Use a hex to binary converter when you need to inspect the bits. Use a hex converter when you want decimal, binary, octal, and possible text interpretation side by side.",
          "The fastest check is still the same: F is 15, the left digit is worth sixteen times more than the right digit, and 15 x 16 + 15 equals 255."
        ]
      }
    ]
  },
  {
    slug: "blog/hex-to-ascii-explained",
    keyword: "hex to ASCII explained",
    title: "Hex to ASCII Explained with Byte Pair Examples",
    description:
      "Understand when hexadecimal bytes become readable ASCII text, why byte pairs matter, and how to spot invalid or non-text hex data.",
    updated: "2026-06-24",
    summary:
      "Hex to ASCII only works cleanly when the input is byte data. This guide explains byte pairs, readable ranges, and common paste mistakes.",
    relatedTools: ["hex-to-ascii", "binary-to-ascii", "hex-converter", "text-to-binary"],
    sections: [
      {
        heading: "Hex text decoding starts with byte pairs",
        paragraphs: [
          "ASCII text is stored as bytes. A byte is 8 bits, and 8 bits are usually written as two hex digits. That is why 48 65 6C 6C 6F can decode to Hello: each pair is one byte, and each byte maps to a character.",
          "If the input has an odd number of hex digits, one byte is incomplete. A single F is a valid hex number, but it is not a complete byte for ASCII decoding. That difference matters when you are switching between numeric conversion and text decoding."
        ]
      },
      {
        heading: "A small example is enough to see the pattern",
        paragraphs: [
          "The word Hello is a useful test because it contains common letters and no hidden control characters. Decode it pair by pair and the result is easy to verify."
        ],
        table: {
          headers: ["Hex byte", "Decimal", "ASCII character"],
          rows: [
            ["48", "72", "H"],
            ["65", "101", "e"],
            ["6C", "108", "l"],
            ["6F", "111", "o"]
          ]
        }
      },
      {
        heading: "Not every hex value is text",
        paragraphs: [
          "Hex is used for many things: addresses, colors, checksums, hashes, encrypted bytes, packet dumps, and binary files. Some of those bytes may happen to form readable characters, but that does not prove the whole value is meant to be text.",
          "If the decoded output contains replacement symbols, boxes, or many control characters, the source may be binary data instead of ASCII. In that case, numeric conversion or a format-specific parser is more useful than forcing text output."
        ]
      },
      {
        heading: "ASCII and UTF-8 are related but not identical",
        paragraphs: [
          "Plain ASCII covers values from 0 to 127. UTF-8 keeps those values the same, then uses multi-byte sequences for many other characters. That means ordinary English text usually decodes cleanly in both ASCII-style tools and UTF-8-aware tools.",
          "Problems appear when the bytes include values above 7F. They may be valid UTF-8, extended legacy encoding, or non-text data. A converter can decode the bytes, but the source format still decides whether the result is meaningful."
        ]
      },
      {
        heading: "Clean the input before blaming the converter",
        paragraphs: [
          "Copied hex often includes prefixes, commas, brackets, quotes, or labels. A strict converter rejects that extra text because guessing can hide a real paste error. Remove the surrounding markup and keep only the byte pairs.",
          "Use the hex to ASCII converter when the source is byte text. Use the hex converter when you want to compare numeric and text readings from the same input before deciding what the data represents."
        ]
      }
    ]
  }
];

const pageGuides = {
  "hex-to-decimal": {
    introHeading: "Hex values are compact, but decimal is easier to discuss",
    intro: [
      "The hex to decimal page is built for the moment when a value such as a byte, color component, address offset, register value, or error code needs to be read in base 10. Hexadecimal is efficient for machines and programmers, but decimal is the format most reports, spreadsheets, tickets, and classroom answers expect.",
      "Use this page when the source value is already hexadecimal and the next step is a plain decimal integer. The converter accepts common developer notation such as uppercase letters, lowercase letters, and optional 0x prefixes, then returns one decimal result per input value."
    ],
    stepsHeading: "How to convert hex to decimal cleanly",
    steps: [
      "Paste one hexadecimal value, or paste several values separated by spaces, commas, or line breaks.",
      "Keep only the digits 0-9 and letters A-F unless the value uses the supported 0x prefix.",
      "Read the decimal output line by line, keeping the same order as the original input.",
      "Copy the result only after checking that the direction is hex to decimal, not decimal to hex.",
      "If the source value is a fixed-width signed integer, decide the bit width before interpreting the sign."
    ],
    examplesHeading: "Hex to decimal examples",
    examples: [
      ["FF", "255", "Maximum value of an unsigned 8-bit byte."],
      ["0x2A", "42", "A common code example using the 0x prefix."],
      ["7FFFFFFF", "2147483647", "Largest positive signed 32-bit integer."]
    ],
    validationHeading: "Input rules for this page",
    validation: [
      "A valid hexadecimal integer uses base-16 digits. The letters A through F represent decimal values 10 through 15, so a value like 2A is not two decimal digits; it is two base-16 positions. The converter validates those symbols before calculating the result.",
      "Separators are treated as boundaries between separate values. If you paste labels, comments, colons, quotes, or units, remove them first. The page reports invalid input instead of silently guessing because a single unexpected character can change the meaning of a low-level value."
    ],
    formulaHeading: "How the math works",
    formula: [
      "Hexadecimal is positional. In FF, the right F means 15 ones and the left F means 15 sixteens, so the total is 15 x 16 + 15 = 255. The same pattern scales to longer values: each step to the left multiplies the place value by another 16.",
      "The converter uses integer arithmetic rather than floating-point rounding, which matters for long identifiers and high memory addresses. Very large inputs are displayed as full decimal integers so every digit remains visible."
    ],
    useCasesHeading: "Good uses for hex to decimal",
    useCases: [
      "Turning log values into numbers that are easier for non-specialists to compare.",
      "Checking byte, register, and mask examples before adding them to documentation.",
      "Converting database or API identifiers that are stored in compact base-16 form.",
      "Verifying classroom and certification exercises that ask for a base-10 answer."
    ],
    accuracy: [
      "Hex to decimal conversion does not decide signedness by itself. The visible value FF can be 255 as an unsigned byte or -1 in an 8-bit two's-complement context. This page returns the mathematical integer unless you explicitly include a minus sign.",
      "If your destination system expects a prefix or a fixed width, add that formatting after conversion. Decimal output normally does not use leading zeroes, but technical tables sometimes require a fixed number of digits for alignment."
    ],
    faq: [
      ["Does the converter support 0x prefixes?", "Yes. Values such as 0xFF and FF produce the same decimal result."],
      ["Can I paste more than one hex value?", "Yes. Separate values with spaces, commas, semicolons, or line breaks."],
      ["Why does FF return 255 instead of -1?", "The page returns the unsigned mathematical value. Signed interpretation requires a bit width, such as 8, 16, or 32 bits."]
    ]
  },
  "binary-to-decimal": {
    introHeading: "Read a bit pattern as an ordinary decimal number",
    intro: [
      "The binary to decimal page is for bit strings that need to be explained in everyday base 10. Binary is exact for switches, flags, and digital logic, but decimal is easier to compare when writing notes, checking homework, or discussing a value with someone who is not reading raw bits.",
      "This converter keeps the task narrow: enter binary digits, optionally with a 0b prefix, and get the decimal integer. It is useful for short classroom values as well as longer bit patterns copied from firmware notes, networking material, or programming examples."
    ],
    stepsHeading: "How to convert binary to decimal",
    steps: [
      "Paste the binary value using only 0 and 1, or keep a supported 0b prefix if the value came from code.",
      "Use a new line when converting several bit strings so each decimal result stays aligned with its source.",
      "Check the output for the sample value first if you are teaching or documenting the process.",
      "Remove spaces inside a single binary number unless those spaces are intended to separate multiple values.",
      "Decide whether the source is unsigned or two's-complement before treating the result as signed."
    ],
    examplesHeading: "Binary to decimal examples",
    examples: [
      ["1010", "10", "A simple four-bit classroom example."],
      ["11111111", "255", "Eight set bits in an unsigned byte."],
      ["0b100000", "32", "A power-of-two value written with a code prefix."]
    ],
    validationHeading: "Binary input rules",
    validation: [
      "Binary values only contain 0 and 1. Digits such as 2 or 9 are valid decimal digits, but they are not valid binary digits, so the page rejects them. That helps catch accidental pastes from a decimal or hexadecimal source.",
      "Grouping can be useful for humans, but this page treats separators as boundaries between values. If you want 1111 0000 to mean one byte, paste it as 11110000. If you leave the space, the converter treats it as two separate values."
    ],
    formulaHeading: "How the decimal value is built",
    formula: [
      "Each binary position is a power of two. In 1010, the leftmost 1 contributes 8, the next 0 contributes nothing, the next 1 contributes 2, and the final 0 contributes nothing. The total is 10.",
      "Longer bit strings follow the same rule. The converter performs that positional calculation directly with integer arithmetic, so it does not lose precision on values that are larger than ordinary JavaScript floating-point numbers."
    ],
    useCasesHeading: "Common binary to decimal workflows",
    useCases: [
      "Checking digital logic examples and truth-table exercises.",
      "Reading permission bits, feature flags, and compact status values.",
      "Converting packet or protocol examples into decimal fields.",
      "Explaining a bit pattern in documentation without asking readers to calculate it manually."
    ],
    accuracy: [
      "The same binary digits can mean different signed values at different widths. For example, 11111111 is 255 as an unsigned value, but it is -1 in signed 8-bit two's-complement. This page returns the unsigned mathematical value unless a minus sign is present.",
      "Leading zeroes do not change the decimal value. They may still be important in a protocol table or register map, so keep the original binary text nearby if display width matters."
    ],
    faq: [
      ["Can I use a 0b prefix?", "Yes. 0b1010 is accepted and returns 10."],
      ["Why are spaces treated as separate values?", "The page supports batch conversion, so spaces, commas, and line breaks separate entries."],
      ["Does it support fractional binary numbers?", "No. This page is for whole-number binary integers."]
    ]
  },
  "decimal-to-hex": {
    introHeading: "Write base-10 values in compact hexadecimal form",
    intro: [
      "The decimal to hex page is for values that start in ordinary base 10 but need to be used in code, documentation, memory maps, color work, or low-level troubleshooting. Decimal is readable, while hexadecimal is shorter and lines up neatly with bytes and nibbles.",
      "Enter whole decimal integers and the converter returns uppercase hexadecimal. The output is intentionally plain so it can be copied into source comments, issue trackers, tables, or debugging notes without decorative formatting getting in the way."
    ],
    stepsHeading: "How to convert decimal to hex",
    steps: [
      "Paste a whole decimal integer such as 255, 42, or 2147483647.",
      "Use one value per line when checking a batch of constants or examples.",
      "Read the hexadecimal output without a prefix, then add 0x later if your destination requires it.",
      "Keep a minus sign only when the target context expects signed hexadecimal notation.",
      "Pad the result with leading zeroes after conversion when a fixed byte width is required."
    ],
    examplesHeading: "Decimal to hex examples",
    examples: [
      ["255", "FF", "The common full-byte maximum."],
      ["42", "2A", "A small decimal value often used in examples."],
      ["2147483647", "7FFFFFFF", "The highest positive signed 32-bit integer."]
    ],
    validationHeading: "Decimal input rules",
    validation: [
      "This page accepts whole base-10 integers. It does not convert decimal fractions such as 10.5 because fractional base conversion has different rules and can create confusing repeating values.",
      "Commas are treated as separators for batch input, not as thousands separators inside one number. For one large value, paste the digits without grouping punctuation."
    ],
    formulaHeading: "How hexadecimal is produced",
    formula: [
      "Decimal to hexadecimal conversion repeatedly divides the number by 16 and records the remainders. Remainders 10 through 15 become A through F. Reading those remainders in reverse gives the hex representation.",
      "The browser implementation uses BigInt for integer pages, so values that are common in code and systems work can be converted without scientific notation or binary floating-point rounding."
    ],
    useCasesHeading: "When decimal to hex is useful",
    useCases: [
      "Preparing numeric constants for source code.",
      "Checking decimal IDs that must be entered into a hexadecimal field.",
      "Creating byte, register, or memory-offset examples for documentation.",
      "Comparing a spreadsheet value with a log entry that uses base 16."
    ],
    accuracy: [
      "Hexadecimal output does not automatically include 0x because not every destination uses that style. CSS colors, assembly listings, JSON examples, and protocol documents can each have their own prefix or width convention.",
      "If the target is a signed fixed-width field, the display form may require two's-complement formatting. Convert the value first, then apply the width rule from the system you are working with."
    ],
    faq: [
      ["Does the output include 0x?", "No. The result is the hex digits only so you can add the prefix style your destination expects."],
      ["Are lowercase hex letters supported?", "The output uses uppercase A-F for easier scanning in technical tables."],
      ["Can I convert negative decimal values?", "Yes, negative whole integers are supported where signed notation is appropriate."]
    ]
  },
  "binary-converter": {
    introHeading: "Compare one binary value across common number bases",
    intro: [
      "The binary converter page is broader than a one-way binary to decimal tool. It is for the situation where a bit pattern needs to be compared as decimal, hexadecimal, octal, and binary at the same time. That is useful when a source alternates between formats or when a team uses different notations in different documents.",
      "Choose the input base, paste the value, and review the equivalent forms together. The page is designed for quick cross-checking rather than a long lesson, so the conversion panel stays visible before the explanatory material."
    ],
    stepsHeading: "How to use the binary converter",
    steps: [
      "Confirm the input base before typing; the default is binary because most visitors arrive with bits.",
      "Paste one integer value into the input box.",
      "Compare the decimal, hexadecimal, binary, and octal rows in the result panel.",
      "Switch the base selector when the same source value is actually decimal, hex, or octal.",
      "Use the single-purpose pages when you need batch conversion from one specific base to another."
    ],
    examplesHeading: "Multi-base examples",
    examples: [
      ["11010110", "214 / D6 / 326", "One byte shown as decimal, hex, and octal."],
      ["101010", "42 / 2A / 52", "A small value that demonstrates all rows clearly."],
      ["10000000", "128 / 80 / 200", "A single high bit in an 8-bit value."]
    ],
    validationHeading: "Base selector and validation",
    validation: [
      "The valid digits depend on the selected base. Binary accepts 0 and 1, decimal accepts 0 through 9, octal accepts 0 through 7, and hexadecimal accepts 0 through 9 plus A through F. If the wrong base is selected, a value that looks correct in one notation may fail in another.",
      "This page expects one integer at a time because it displays several output rows for the same value. For long lists, use a direct converter page such as binary to decimal or decimal to binary."
    ],
    formulaHeading: "Why the same value has several names",
    formula: [
      "A number base changes the written representation, not the quantity. Binary 11010110, decimal 214, hexadecimal D6, and octal 326 all point to the same integer. Seeing the rows together makes it easier to line up documentation that uses mixed notation.",
      "Hex is especially helpful next to binary because each hex digit maps to four bits. Octal maps to groups of three bits and still appears in permissions, legacy systems, and some educational material."
    ],
    useCasesHeading: "Best uses for the binary converter",
    useCases: [
      "Comparing a bit pattern with a hex dump or decimal field.",
      "Teaching how one integer can be represented in multiple bases.",
      "Checking a small value before pasting it into a script or issue comment.",
      "Reading older references that still include octal notation."
    ],
    accuracy: [
      "The converter reports mathematical integer equivalents. It does not infer signed widths or floating-point encodings from raw bits. If you are decoding IEEE 754 floats or signed fields, use the relevant width and format specification.",
      "Leading zeroes are not preserved in numeric output. If a binary value must stay at eight, sixteen, or thirty-two bits, pad the displayed result after conversion according to your table or protocol."
    ],
    faq: [
      ["Can the input be hexadecimal?", "Yes. Change the input base selector to Hexadecimal before entering the value."],
      ["Why is there no batch mode here?", "The page shows several output formats for one value. Batch work is clearer on the direct converter pages."],
      ["Does octal still matter?", "Yes in some permissions, legacy tools, and teaching contexts, so it is included for comparison."]
    ]
  },
  "hex-converter": {
    introHeading: "Turn one hexadecimal value into several useful readings",
    intro: [
      "The hex converter page is for users who have one hexadecimal value and want more than a single answer. It shows the decimal, binary, octal, and, when byte data is present, text interpretation from the same input. That makes it useful for logs, byte strings, device output, and technical examples.",
      "Use the dedicated hex to decimal or hex to binary pages when you only need one target format. Use this page when the goal is comparison: the same value shown in the formats developers most often need side by side."
    ],
    stepsHeading: "How to use the hex converter",
    steps: [
      "Leave the input base set to Hexadecimal unless your source value is in another base.",
      "Paste a single value such as FF, D6, or 48656C6C6F.",
      "Review the decimal, hex, binary, and octal rows together.",
      "Use the ASCII row only when the input represents complete bytes, not an arbitrary numeric constant.",
      "Switch to the hex to ASCII page for byte-focused text decoding with clearer byte validation."
    ],
    examplesHeading: "Hex converter examples",
    examples: [
      ["FF", "255 / 11111111", "A byte-size value shown in common numeric forms."],
      ["D6", "214 / 11010110", "A compact hex value matched with its bit pattern."],
      ["48656C6C6F", "Hello", "A byte string that can also be read as text."]
    ],
    validationHeading: "Hex input and byte interpretation",
    validation: [
      "For numeric conversion, the input must be a valid integer in the selected base. For text interpretation, hexadecimal input also needs complete byte pairs. A value such as F is a valid number, but it is not a complete byte by itself.",
      "The ASCII or UTF-8 reading is a convenience, not a promise that every hex number is meant to be text. If the decoded row contains replacement characters or control characters, the source value may be binary data rather than readable text."
    ],
    formulaHeading: "Why hex is a useful pivot format",
    formula: [
      "Hexadecimal sits neatly between binary and decimal. One hex digit represents four bits, so pairs of hex digits represent bytes. That makes it compact enough for logs while still being easy to expand back into binary when bit-level inspection is needed.",
      "This page uses that relationship to show several views at once. The decimal row helps with everyday comparison, the binary row exposes flags and masks, and the byte text row helps when the value is encoded character data."
    ],
    useCasesHeading: "Good uses for a hex converter",
    useCases: [
      "Checking a hex dump value before writing a bug report.",
      "Comparing an address, mask, or checksum in decimal and binary.",
      "Looking for readable text inside a byte sequence.",
      "Preparing examples where readers may prefer different number bases."
    ],
    accuracy: [
      "The numeric rows treat the input as an integer. Text decoding treats the same characters as bytes. Those are different interpretations, so use the row that matches the source context.",
      "If a protocol requires fixed-width bytes, preserve leading zeroes in the source. Numeric conversion may omit them because they do not change the mathematical value."
    ],
    faq: [
      ["Can this page decode hex text?", "Yes for complete byte pairs, but the dedicated hex to ASCII page gives stricter byte-focused guidance."],
      ["Why does a valid hex number sometimes not show useful text?", "Not every hex number is encoded text. Many values are addresses, masks, checksums, or binary fields."],
      ["Can I change the input base?", "Yes. The selector lets you compare decimal, binary, hex, and octal inputs."]
    ]
  },
  "decimal-to-binary": {
    introHeading: "Show how a decimal integer is represented with bits",
    intro: [
      "The decimal to binary page is for base-10 values that need to become bit strings. It helps when a number from a spreadsheet, problem statement, API field, or user interface must be compared with binary flags, masks, or classroom examples.",
      "Enter whole decimal integers and the converter returns base-2 output. The result does not add a 0b prefix by default, which keeps the value easy to copy into worksheets, notes, and systems that already define the base elsewhere."
    ],
    stepsHeading: "How to convert decimal to binary",
    steps: [
      "Paste a whole decimal integer without thousands separators.",
      "Use line breaks for multiple values so each binary output stays easy to compare.",
      "Add a 0b prefix after conversion only if your destination code style requires it.",
      "Pad with leading zeroes after conversion when a fixed bit width is required.",
      "For signed storage, confirm the target width before using two's-complement notation."
    ],
    examplesHeading: "Decimal to binary examples",
    examples: [
      ["10", "1010", "A simple value with two set bits."],
      ["255", "11111111", "Eight bits all set to 1."],
      ["1024", "10000000000", "A power of two with one set bit."]
    ],
    validationHeading: "Decimal input rules",
    validation: [
      "This converter accepts integer decimal input. It rejects letters, base prefixes, and fractional values because the page is focused on whole-number bit representation.",
      "A leading minus sign is supported for signed notation, but the output is a mathematical negative binary value. If you need an unsigned fixed-width two's-complement display, apply the width rule from your target system."
    ],
    formulaHeading: "How decimal becomes binary",
    formula: [
      "Decimal to binary conversion repeatedly divides the number by 2 and records the remainders. Those remainders become the output bits when read from last to first. Powers of two appear as a 1 followed by zeroes.",
      "The converter keeps the arithmetic in integer form, so long values remain exact. That is important when the decimal value is an identifier, bit mask, or register value rather than a measurement."
    ],
    useCasesHeading: "Where decimal to binary helps",
    useCases: [
      "Building or checking bit masks from decimal constants.",
      "Teaching place values and powers of two.",
      "Comparing API fields with binary documentation.",
      "Preparing examples for networking, embedded systems, and digital logic."
    ],
    accuracy: [
      "Leading zeroes are not shown because they do not change the numeric value. Add them later if the target format requires exactly 8, 16, 32, or 64 bits.",
      "The result is not a floating-point binary representation. It is the base-2 integer form of the decimal value you entered."
    ],
    faq: [
      ["Does the output include 0b?", "No. The page returns the digits only so you can add the prefix if needed."],
      ["Can I convert 10.5?", "No. This page supports whole-number integer conversion."],
      ["Why did leading zeroes disappear?", "They do not affect the integer value. Add them after conversion when a fixed width matters."]
    ]
  },
  "hex-to-binary": {
    introHeading: "Expand hexadecimal into the bits behind it",
    intro: [
      "The hex to binary page is for values that are compact in base 16 but need to be inspected at the bit level. Hex is easy to scan in logs and code, while binary reveals flags, masks, permissions, and individual bit positions.",
      "Paste a hex value such as FF, 2A, or 0x80 and the converter returns the binary integer. It is useful for debugging, networking, embedded work, and lessons where the relationship between nibbles and bits needs to be visible."
    ],
    stepsHeading: "How to convert hex to binary",
    steps: [
      "Paste the hexadecimal value with digits 0-9 and letters A-F.",
      "Keep a 0x prefix if it came from code; the converter accepts it.",
      "Use separate lines for separate values instead of inserting spaces inside one value.",
      "Pad the binary output manually if you need fixed groups of four bits.",
      "Compare the result against the original hex digits when inspecting flags or masks."
    ],
    examplesHeading: "Hex to binary examples",
    examples: [
      ["FF", "11111111", "All bits set in one byte."],
      ["2A", "101010", "A small alternating bit pattern."],
      ["0x80", "10000000", "The high bit of an 8-bit byte."]
    ],
    validationHeading: "Hex input rules",
    validation: [
      "Hexadecimal input can use uppercase or lowercase letters. Values outside A-F are rejected because they belong to another notation or to surrounding text, not to the hex number.",
      "The output is the shortest binary integer representation. If you need a nibble-aligned display, add leading zeroes to make the length a multiple of four."
    ],
    formulaHeading: "The four-bit relationship",
    formula: [
      "Each hex digit maps to four binary bits: F maps to 1111, A maps to 1010, and 8 maps to 1000. That is why hexadecimal is so common in byte-level work; it compresses binary without losing the bit pattern.",
      "The converter returns a numeric binary value, so it may omit leading zeroes. For example, hex 0F and hex F have the same integer value, but 0F is often displayed as 00001111 when byte width matters."
    ],
    useCasesHeading: "When hex to binary is the right page",
    useCases: [
      "Inspecting bit masks copied from code.",
      "Checking packet bytes and protocol examples.",
      "Explaining how hex digits correspond to nibbles.",
      "Finding which bit positions are set in a register or flag field."
    ],
    accuracy: [
      "Binary output shows the mathematical value, not a fixed hardware width. If your source is a byte, word, or double word, preserve that width separately.",
      "Negative hex values are accepted with a minus sign, but two's-complement decoding still depends on the intended bit width."
    ],
    faq: [
      ["Why is 0F shown as 1111?", "Leading zeroes do not change the integer. Pad to 00001111 if you need an 8-bit display."],
      ["Can I paste 0x80?", "Yes. Optional 0x prefixes are supported."],
      ["Does it show groups of four bits?", "The result is plain binary. Add grouping after conversion if your document requires it."]
    ]
  },
  "binary-to-hexadecimal": {
    introHeading: "Group bits into formal hexadecimal notation",
    intro: [
      "The binary to hexadecimal page focuses on the full-name search intent: turning base-2 values into formal base-16 notation. It is especially useful for students and technical writers who need to show how groups of four bits become each hexadecimal digit.",
      "Use this page when the explanation matters as much as the answer. The converter gives the hex result instantly, while the guide below keeps the nibble-grouping rule visible for documentation, lessons, and debugging notes."
    ],
    stepsHeading: "How to convert binary to hexadecimal",
    steps: [
      "Paste a binary integer made only of 0 and 1.",
      "For hand checking, group the bits from right to left in sets of four.",
      "Convert each group to one hexadecimal digit.",
      "Use leading zeroes only to complete the leftmost group when explaining the process.",
      "Compare the final hex output with the converter result before publishing or submitting work."
    ],
    examplesHeading: "Binary to hexadecimal examples",
    examples: [
      ["11111111", "FF", "Two groups of 1111 become two F digits."],
      ["101010", "2A", "Padding to 0010 1010 explains the result."],
      ["10000000", "80", "The high bit of a byte in hex form."]
    ],
    validationHeading: "Binary input rules",
    validation: [
      "Only binary digits are accepted. Spaces, commas, and line breaks split separate values for batch conversion, so remove visual grouping inside one number before converting.",
      "The result uses uppercase hexadecimal letters. That makes A-F easy to distinguish in tables and matches many programming and documentation styles."
    ],
    formulaHeading: "Nibble grouping rule",
    formula: [
      "A nibble is four bits. Because 2^4 equals 16, each four-bit group maps exactly to one hexadecimal digit. This is why binary 1111 becomes F and binary 1010 becomes A.",
      "If the leftmost group has fewer than four bits, add temporary leading zeroes only for grouping. Those zeroes help explain the conversion but do not change the value."
    ],
    useCasesHeading: "When to use the hexadecimal page",
    useCases: [
      "Writing educational material that uses the formal word hexadecimal.",
      "Checking a manual conversion based on four-bit groups.",
      "Turning a binary field into the compact form used in source code.",
      "Preparing examples for digital logic, networking, and low-level programming lessons."
    ],
    accuracy: [
      "The converter treats input as an integer. It does not decode floating-point layouts, character encodings, or signed fixed-width fields unless those rules are applied separately.",
      "Leading zeroes in the original binary may matter for display width. Keep them in your notes when the value represents a byte or fixed-width register."
    ],
    faq: [
      ["Is hexadecimal the same as hex?", "Yes. Hex is the common short form of hexadecimal."],
      ["Why does 101010 become 2A?", "Group it as 0010 1010; 0010 is 2 and 1010 is A."],
      ["Can I convert several binary numbers?", "Yes. Separate them with spaces, commas, semicolons, or line breaks."]
    ]
  },
  "binary-to-hex": {
    introHeading: "A quick path from bit strings to hex digits",
    intro: [
      "The binary to hex page is the shorter, task-first version of the conversion. It is aimed at visitors who already know what hex means and simply need a compact result for code, notes, or a debugging session.",
      "Paste binary digits and the tool returns uppercase hex. The page avoids extra controls because the intent is direct: bit string in, hex value out, with enough guidance to prevent common copy and grouping mistakes."
    ],
    stepsHeading: "Fast binary to hex workflow",
    steps: [
      "Paste the binary value with no spaces inside the number.",
      "Use separate lines if you are converting several bit strings.",
      "Copy the uppercase hex result into your target note or code sample.",
      "Add a 0x prefix only if your destination language or document expects it.",
      "Use the longer binary to hexadecimal page when you need to explain the grouping process."
    ],
    examplesHeading: "Binary to hex examples",
    examples: [
      ["1101", "D", "A four-bit value that maps to one hex digit."],
      ["11110000", "F0", "A full byte split into two nibbles."],
      ["1001", "9", "A single nibble result."]
    ],
    validationHeading: "What the quick converter accepts",
    validation: [
      "The input must contain only 0 and 1, with optional separators between separate values. A value such as 10A1 is rejected because A belongs to hexadecimal output, not binary input.",
      "The output is not padded unless padding is part of the mathematical value. If the original bit string is part of an 8-bit or 16-bit field, preserve that width in your surrounding documentation."
    ],
    formulaHeading: "Why the output is shorter",
    formula: [
      "Hex is shorter because every hex digit covers four binary digits. The binary string 11110000 becomes F0 because 1111 maps to F and 0000 maps to 0.",
      "For quick work, you usually only need the result. For teaching, grouping the bits into nibbles makes the conversion easier to audit by hand."
    ],
    useCasesHeading: "Best quick-use cases",
    useCases: [
      "Converting a small bit mask while writing code.",
      "Checking a binary example before sending it in a chat or ticket.",
      "Preparing compact values for a table that already labels the base.",
      "Moving from a visual bit pattern to a shorter debugging value."
    ],
    accuracy: [
      "This page returns base-16 integer notation. It does not infer byte order, signedness, or character encoding from the bit string.",
      "When converting protocol fields, keep the original bit length nearby. A result like D may represent 1101, 00001101, or a field inside a larger word depending on context."
    ],
    faq: [
      ["Does the page add 0x?", "No. It returns only the hex digits so the result works in more contexts."],
      ["Why is my grouped binary split into multiple results?", "Spaces separate batch values. Remove spaces inside one binary number."],
      ["Is this different from binary to hexadecimal?", "The conversion is the same; this page is optimized for the shorter search phrase and quick output."]
    ]
  },
  "hex-to-ascii": {
    introHeading: "Decode hex byte pairs into readable text",
    intro: [
      "The hex to ASCII page is for byte strings such as 48 65 6C 6C 6F that need to be read as characters. It is useful when a log, packet capture, database field, or encoded example contains hex bytes and you want to see whether they form readable text.",
      "The tool accepts complete hex byte pairs with optional spaces and 0x prefixes. It decodes with UTF-8 handling in the browser, so ordinary ASCII appears directly and multi-byte text is handled using modern web text rules."
    ],
    stepsHeading: "How to decode hex to ASCII",
    steps: [
      "Paste hex bytes as pairs, such as 48 65 6C 6C 6F, or as one continuous string with an even number of digits.",
      "Keep optional 0x prefixes only at the start of byte tokens.",
      "Remove labels, quotes, offsets, and comments from the source dump before decoding.",
      "Read the decoded text and check whether replacement characters indicate non-text bytes.",
      "Use the hex converter page when the same input should also be inspected as a number."
    ],
    examplesHeading: "Hex to ASCII examples",
    examples: [
      ["48 65 6C 6C 6F", "Hello", "A simple ASCII word encoded as bytes."],
      ["41 42 43", "ABC", "Three uppercase ASCII letters."],
      ["30 78 46 46", "0xFF", "Text characters that happen to look like hex notation."]
    ],
    validationHeading: "Byte validation rules",
    validation: [
      "Text decoding requires complete bytes. A single hex digit is a valid nibble, but it is not a full byte, so this page asks for an even number of hex digits.",
      "Invalid characters are rejected instead of stripped. That prevents a pasted dump such as 48 ZZ 65 from silently becoming a different byte sequence."
    ],
    formulaHeading: "How bytes become characters",
    formula: [
      "ASCII assigns character meanings to byte values. Hex 48 is decimal 72, which maps to H; hex 65 maps to e. When the bytes are decoded in order, the characters form the output text.",
      "Modern text often uses UTF-8. Plain ASCII stays one byte per character, while characters outside the basic ASCII range may use multiple bytes. That is normal for web text and many logs."
    ],
    useCasesHeading: "When hex to ASCII helps",
    useCases: [
      "Reading text fragments in packet captures or hex dumps.",
      "Checking encoded examples in documentation.",
      "Verifying whether a byte sequence contains a readable marker or header.",
      "Teaching the relationship between byte values and characters."
    ],
    accuracy: [
      "Not every byte sequence is text. If the result includes unusual symbols or replacement characters, the input may be compressed data, encrypted data, binary structure, or text in a different encoding.",
      "ASCII control bytes may not display as visible characters. When exact byte-level inspection matters, keep the original hex alongside the decoded text."
    ],
    faq: [
      ["Can I paste bytes without spaces?", "Yes, as long as the total number of hex digits is even."],
      ["Why does the output show replacement characters?", "The bytes may not form valid readable UTF-8 text."],
      ["Does the page send my bytes to a server?", "No. Decoding runs in your browser after the page loads."]
    ]
  },
  "text-to-binary": {
    introHeading: "Encode readable text as UTF-8 binary bytes",
    intro: [
      "The text to binary page turns characters into the byte-level bit groups used by computers. It is useful for lessons, examples, simple encoding checks, and documentation that needs to show how letters become binary data.",
      "Type or paste text and the converter outputs one 8-bit group per UTF-8 byte. Plain English letters map to familiar ASCII bytes, while symbols and non-English characters may produce multiple byte groups."
    ],
    stepsHeading: "How to convert text to binary",
    steps: [
      "Enter the text exactly as it should be encoded, including spaces and punctuation.",
      "Review the output as 8-bit byte groups separated by spaces.",
      "Keep the original text nearby when explaining which byte belongs to which character.",
      "Expect multi-byte output for characters outside basic ASCII.",
      "Use binary to ASCII when you need to decode byte groups back into text."
    ],
    examplesHeading: "Text to binary examples",
    examples: [
      ["Hello", "01001000 01100101 01101100 01101100 01101111", "Five ASCII letters as five bytes."],
      ["A", "01000001", "The uppercase letter A."],
      ["Hi!", "01001000 01101001 00100001", "Letters plus punctuation."]
    ],
    validationHeading: "Text input behavior",
    validation: [
      "This page accepts ordinary text rather than numeric input. It does not treat the characters 1 and 0 as a binary number; it encodes those visible characters as text bytes.",
      "Spaces, punctuation, and line breaks are part of the input. If they appear in the text box, they will be encoded in the binary output."
    ],
    formulaHeading: "How text becomes bytes",
    formula: [
      "The browser encodes the string as UTF-8. For ASCII characters, the UTF-8 byte is the same as the ASCII code: H is hex 48, which is binary 01001000.",
      "UTF-8 uses multiple bytes for many symbols and international characters. That means one visible character can produce more than one 8-bit group, which is expected and usually correct."
    ],
    useCasesHeading: "Good uses for text to binary",
    useCases: [
      "Demonstrating character encoding in a class or tutorial.",
      "Checking simple byte output before writing documentation.",
      "Preparing examples for ASCII, UTF-8, or networking lessons.",
      "Seeing how punctuation and spaces are represented as bytes."
    ],
    accuracy: [
      "The output is byte-oriented, not a compressed or encrypted representation. It simply shows the UTF-8 bytes for the text you entered.",
      "If another system uses a legacy encoding instead of UTF-8, its byte output may differ for non-ASCII characters. Confirm the expected encoding before comparing results."
    ],
    faq: [
      ["Why does one character sometimes produce several bytes?", "UTF-8 uses multiple bytes for many characters outside basic ASCII."],
      ["Are spaces encoded?", "Yes. A space is a character and appears as its own byte group."],
      ["Is typing 1010 treated as binary?", "No. It is encoded as the four text characters 1, 0, 1, and 0."]
    ]
  },
  "hex-calculator": {
    introHeading: "Do quick arithmetic on hexadecimal values",
    intro: [
      "The hex calculator page is for arithmetic on base-16 values such as offsets, masks, checksums, and small address adjustments. It saves the extra step of converting both operands to decimal before adding, subtracting, multiplying, dividing, or taking a modulo.",
      "Enter two hex integers, choose the operation, and the result is shown in hexadecimal, decimal, and binary. That side-by-side output helps verify the answer before it is copied into code, notes, or a debugging session."
    ],
    stepsHeading: "How to use the hex calculator",
    steps: [
      "Enter the first hexadecimal integer in the first field.",
      "Enter the second hexadecimal integer in the second field.",
      "Choose add, subtract, multiply, divide, or modulo.",
      "Read the hex result first, then use the decimal and binary rows as a sanity check.",
      "Avoid division by zero and confirm whether your workflow expects integer division."
    ],
    examplesHeading: "Hex calculator examples",
    examples: [
      ["FF + 1", "100", "A byte overflow into the next hex place."],
      ["2A * 10", "2A0", "Multiplication by hex 10 shifts one hex digit."],
      ["100 - 1", "FF", "Subtracting one from hex 100 returns FF."]
    ],
    validationHeading: "Calculator input rules",
    validation: [
      "Both operands must be hexadecimal integers. Optional signs and 0x-style notation are accepted where they make sense, but unsupported characters are rejected before arithmetic runs.",
      "Division returns an integer quotient because this calculator is focused on base-conversion and systems work, where offsets and masks are usually whole-number values."
    ],
    formulaHeading: "How arithmetic is evaluated",
    formula: [
      "The operation is performed on the integer values represented by the hex inputs. The answer is then formatted back into hex and also shown in decimal and binary for comparison.",
      "Modulo returns the remainder after integer division. It is useful for alignment checks, cyclic counters, and situations where a value needs to be reduced to a range."
    ],
    useCasesHeading: "Where hex arithmetic is useful",
    useCases: [
      "Adding offsets while reading memory maps.",
      "Checking mask and flag calculations.",
      "Confirming examples before adding them to technical documentation.",
      "Comparing a hex result with decimal output from another tool."
    ],
    accuracy: [
      "This calculator does not simulate overflow for a fixed CPU width. If your target wraps at 8, 16, 32, or 64 bits, apply that width rule after calculating the mathematical result.",
      "Negative results are displayed with a minus sign. Two's-complement formatting depends on width and is intentionally not guessed."
    ],
    faq: [
      ["Does division produce fractions?", "No. Division returns the integer quotient."],
      ["Can I use lowercase hex?", "Yes. Input is case-insensitive and output is uppercase."],
      ["Does it handle overflow?", "It returns the mathematical integer result. Apply fixed-width overflow rules separately if needed."]
    ]
  },
  "hexadecimal-calculator": {
    introHeading: "A formal hexadecimal calculator for base-16 arithmetic",
    intro: [
      "The hexadecimal calculator page serves the full-term query and gives a more explicit base-16 arithmetic workspace. It is useful for learners, technical writers, and engineers who want the operation and the equivalent decimal and binary readings in one place.",
      "The calculator supports addition, subtraction, multiplication, integer division, and modulo on hexadecimal integers. It keeps the result transparent by showing the same answer in three bases."
    ],
    stepsHeading: "How to calculate with hexadecimal numbers",
    steps: [
      "Enter the first hexadecimal number using digits 0-9 and letters A-F.",
      "Enter the second hexadecimal number.",
      "Select the arithmetic operation.",
      "Check the hexadecimal answer and compare the decimal row if you need an everyday value.",
      "Use the binary row when the arithmetic affects flags, masks, or bit positions."
    ],
    examplesHeading: "Hexadecimal arithmetic examples",
    examples: [
      ["2A * 10", "2A0", "Multiplying by base sixteen shifts the hex places."],
      ["100 / 10", "10", "Hex 100 divided by hex 10 equals hex 10."],
      ["1F + 1", "20", "A carry from F into the next hex place."]
    ],
    validationHeading: "Hexadecimal calculator validation",
    validation: [
      "Inputs are treated as base-16 integers. The page rejects invalid symbols instead of assuming a nearby decimal or text meaning.",
      "Modulo and division require a nonzero second value. If the second field is zero, the calculator reports a clear validation message instead of returning an undefined result."
    ],
    formulaHeading: "Base-16 arithmetic notes",
    formula: [
      "Hexadecimal arithmetic follows the same integer rules as decimal arithmetic, but each place is worth sixteen times the place to its right. Carries happen after F, not after 9.",
      "The calculator performs the math on exact integers and formats the answer into hex, decimal, and binary. That makes it easier to verify by a second method."
    ],
    useCasesHeading: "When to use the hexadecimal calculator",
    useCases: [
      "Teaching base-16 arithmetic with visible cross-checks.",
      "Reviewing examples that use the full word hexadecimal.",
      "Checking address, offset, and alignment calculations.",
      "Verifying modulo results for cyclic or fixed-range values."
    ],
    accuracy: [
      "The tool does not assume a processor word size. If a hardware register wraps, clamps, or stores signed values, use the hardware rule after the calculator gives the mathematical result.",
      "Decimal and binary rows are derived from the same exact result, so they should match the hex row unless a fixed-width interpretation is being applied elsewhere."
    ],
    faq: [
      ["Is this different from the hex calculator?", "The arithmetic engine is the same; this page is written for the full hexadecimal calculator search intent."],
      ["Can I calculate modulo?", "Yes. Choose the modulo operation and enter a nonzero second value."],
      ["Why is multiplication by 10 special in hex?", "Hex 10 equals decimal 16, so multiplying by it shifts the value one hexadecimal place."]
    ]
  },
  "binary-calculator": {
    introHeading: "Calculate directly with binary integers",
    intro: [
      "The binary calculator page lets you add, subtract, multiply, divide, and take remainders without first converting bit strings by hand. It is useful for digital logic exercises, flag checks, and quick verification when binary is the format you are already using.",
      "Enter two binary integers and choose an operation. The result is shown in binary first, with decimal and hexadecimal rows underneath so you can cross-check the same value in more familiar or compact notation."
    ],
    stepsHeading: "How to use the binary calculator",
    steps: [
      "Enter the first binary value using only 0 and 1.",
      "Enter the second binary value.",
      "Select add, subtract, multiply, divide, or modulo.",
      "Use the decimal result to confirm the arithmetic if the binary result is long.",
      "Use the hexadecimal result when the answer needs to fit code or documentation."
    ],
    examplesHeading: "Binary calculator examples",
    examples: [
      ["1010 + 11", "1101", "Ten plus three equals thirteen."],
      ["1111 - 1", "1110", "A simple subtraction from fifteen."],
      ["1000 * 10", "10000", "Eight times two equals sixteen."]
    ],
    validationHeading: "Binary calculator input rules",
    validation: [
      "Both operands must be binary integers. Values containing 2 through 9 or A through F are rejected because they belong to other bases.",
      "Division and modulo use integer arithmetic and require a nonzero second operand. That matches the whole-number nature of bit patterns and masks."
    ],
    formulaHeading: "How binary arithmetic is shown",
    formula: [
      "The calculator converts each operand to an exact integer, performs the selected operation, and formats the result back to binary. Decimal and hex rows come from the same result.",
      "Binary carries happen when a column reaches two. For example, 1 + 1 becomes 10 in binary, just as 9 + 1 becomes 10 in decimal."
    ],
    useCasesHeading: "Good uses for binary arithmetic",
    useCases: [
      "Checking homework or digital logic examples.",
      "Adding or subtracting small bit patterns.",
      "Comparing binary math with a decimal explanation.",
      "Verifying mask operations before writing documentation."
    ],
    accuracy: [
      "This is an integer calculator, not a bitwise operator panel. It performs arithmetic operations, so it does not replace AND, OR, XOR, or shift tools.",
      "The calculator does not infer fixed-width overflow. If your target wraps at a certain number of bits, apply that rule separately."
    ],
    faq: [
      ["Can I use 0b prefixes?", "For calculator fields, enter the binary digits directly for the clearest validation."],
      ["Does division return a remainder?", "Division returns the quotient. Use modulo to get the remainder."],
      ["Does it support bitwise AND or XOR?", "No. This calculator focuses on arithmetic operations."]
    ]
  },
  "hex-to-decimal-converter": {
    introHeading: "A dedicated base-16 to base-10 converter page",
    intro: [
      "The hex to decimal converter page is a focused landing page for users who search with the word converter and expect the base-10 answer immediately. It overlaps with the home page in function, but the content is written for conversion verification, batch work, and trust in the result.",
      "Use it when the output must be decimal and the source is definitely hexadecimal. The tool accepts large integers, optional 0x prefixes, and multiple values, then returns exact decimal output without uploading the input to a server."
    ],
    stepsHeading: "How to use this hex to decimal converter",
    steps: [
      "Paste the hex value or a short batch of hex values into the input field.",
      "Keep optional 0x prefixes if they are part of the source notation.",
      "Review the decimal output in the same order as the input.",
      "Use the validation message to catch accidental non-hex characters.",
      "Copy the decimal result into your ticket, spreadsheet, lesson, or code comment."
    ],
    examplesHeading: "Converter examples",
    examples: [
      ["1F4", "500", "A compact value that expands to a round decimal number."],
      ["0x10", "16", "A base-16 place value with the code prefix."],
      ["ABCD", "43981", "A mixed letter-and-digit hex value."]
    ],
    validationHeading: "What makes this converter trustworthy",
    validation: [
      "The page validates the source base before converting. That means a value containing G, a colon, a quote, or copied label text is not treated as a best-effort guess.",
      "Batch conversion is line-friendly. If you paste several values, the output keeps the same order, which makes it easier to compare against the original list."
    ],
    formulaHeading: "Base-16 to base-10 rule",
    formula: [
      "Each position in a hex number is a power of 16. In 1F4, the 1 is worth 256, F is worth 15 x 16, and 4 is worth 4. The total is 500.",
      "The converter uses exact integer arithmetic for numeric values, so it can display long decimal results without rounding them into scientific notation."
    ],
    useCasesHeading: "Best uses for this converter page",
    useCases: [
      "Converting copied constants while writing technical notes.",
      "Checking base-conversion homework against a known tool.",
      "Normalizing hex identifiers before adding them to a spreadsheet.",
      "Explaining a base-16 value to someone who expects decimal."
    ],
    accuracy: [
      "The page reports the mathematical integer value. It does not guess two's-complement signed interpretation because that requires a known bit width.",
      "If the decimal result will be used in a system with size limits, compare it with that system's accepted range before saving it."
    ],
    faq: [
      ["Why is this separate from the home page?", "This page is written for the exact hex to decimal converter search intent and batch conversion workflow."],
      ["Can it handle ABCD?", "Yes. ABCD converts to 43981."],
      ["Does it upload my input?", "No. Conversion runs in the browser after the static page loads."]
    ]
  },
  "binary-to-ascii": {
    introHeading: "Decode binary byte groups into text",
    intro: [
      "The binary to ASCII page is for byte groups such as 01001000 01100101 that need to be read as characters. It helps with classroom examples, packet notes, simple encoded messages, and debugging snippets where the source is shown as bits rather than hex.",
      "Each group is treated as one byte after validation. The decoded output uses UTF-8 handling, so ordinary ASCII appears as expected and multi-byte sequences can be represented when the byte groups form valid UTF-8."
    ],
    stepsHeading: "How to decode binary to ASCII",
    steps: [
      "Paste one to eight binary digits per byte group.",
      "Separate byte groups with spaces, commas, or line breaks.",
      "Keep the order exactly as it appears in the source data.",
      "Check the decoded text for replacement characters or unexpected control characters.",
      "Use text to binary when you need to create byte groups from readable text."
    ],
    examplesHeading: "Binary to ASCII examples",
    examples: [
      ["01001000 01100101 01101100 01101100 01101111", "Hello", "Five byte groups decoded as a word."],
      ["01000001", "A", "One byte for uppercase A."],
      ["00110001 00110000", "10", "The text characters one and zero."]
    ],
    validationHeading: "Binary byte rules",
    validation: [
      "A byte can be written with up to eight bits on this page. Short groups are left-padded before decoding, which is useful for small examples, but fixed-width technical data is clearest when written as full 8-bit groups.",
      "Any group containing digits other than 0 or 1 is rejected. That prevents decimal or hex text from being accidentally decoded as if it were binary."
    ],
    formulaHeading: "How binary becomes characters",
    formula: [
      "Each byte group is converted from base 2 to a byte value. For example, 01001000 is decimal 72, and ASCII value 72 is H.",
      "The bytes are then decoded in order. For basic ASCII, each byte maps to one character. For UTF-8 text outside basic ASCII, several bytes may combine into one visible character."
    ],
    useCasesHeading: "Where binary to ASCII is useful",
    useCases: [
      "Checking simple encoded messages in lessons.",
      "Reading byte-level examples that are shown as bits.",
      "Verifying whether binary data contains readable text.",
      "Comparing binary, ASCII, and UTF-8 representations."
    ],
    accuracy: [
      "Binary data is not always text. If the decoded output looks wrong, the source may be compressed, encrypted, structured, or encoded with a different character set.",
      "Control characters may not be visible in the output. Keep the source byte groups when exact byte values matter."
    ],
    faq: [
      ["Do byte groups need exactly eight bits?", "Full 8-bit groups are best, but the tool accepts one to eight bits and pads short groups."],
      ["Why does 00110001 decode to 1?", "It is the ASCII byte for the character 1, not the numeric value one."],
      ["Can I paste line breaks?", "Yes. Spaces, commas, semicolons, and line breaks separate byte groups."]
    ]
  },
  "binary-to-decimal-converter": {
    introHeading: "A focused binary to decimal converter for exact answers",
    intro: [
      "The binary to decimal converter page is written for visitors who want a direct base-2 to base-10 conversion and enough supporting detail to trust the result. It is useful for homework, documentation, and technical checks where decimal output is the final answer.",
      "The converter accepts binary integers, optional 0b prefixes, and short batches. It returns exact decimal integers and validates the input so non-binary characters do not slip into the calculation."
    ],
    stepsHeading: "How to use this binary to decimal converter",
    steps: [
      "Paste a binary integer such as 1001, 100000000, or 11111111.",
      "Leave 0b prefixes in place if they came from source code.",
      "Use one line per value for batch conversion.",
      "Check validation messages for spaces inside a single intended bit string.",
      "Copy the decimal result with the original base labels when documenting the answer."
    ],
    examplesHeading: "Binary to decimal converter examples",
    examples: [
      ["1001", "9", "Eight plus one."],
      ["100000000", "256", "A power of two with one set bit."],
      ["11111111", "255", "All bits set in one byte."]
    ],
    validationHeading: "Validation for converter-style input",
    validation: [
      "The page accepts only binary digits after removing an optional 0b prefix. A digit such as 2 is a strong signal that the value was copied from another base, so the converter stops and reports the issue.",
      "Separators define separate values. If you want to show visual grouping inside one binary number, remove those spaces before using this batch-oriented converter."
    ],
    formulaHeading: "Base-2 to base-10 rule",
    formula: [
      "Each binary position is a power of two. A 1 contributes that place value and a 0 contributes nothing. Adding the active place values gives the decimal answer.",
      "The calculation is exact for integers. That matters for long bit strings because approximate floating-point conversion can hide errors in the low-order digits."
    ],
    useCasesHeading: "Best uses for the converter page",
    useCases: [
      "Submitting or checking base-conversion exercises.",
      "Translating binary fields into decimal values for documentation.",
      "Comparing firmware or protocol examples with decimal tables.",
      "Explaining a bit pattern to readers who do not work in base 2."
    ],
    accuracy: [
      "Signed interpretation depends on bit width. The converter returns the mathematical integer form, so 11111111 returns 255 unless you separately interpret it as signed 8-bit data.",
      "Leading zeroes are useful for display width but not for the decimal value. Preserve them in the original source if width matters."
    ],
    faq: [
      ["Can I paste several binary values?", "Yes. Separate them with spaces, commas, semicolons, or line breaks."],
      ["Does 0b1001 work?", "Yes. It converts to 9."],
      ["Does the converter handle signed binary?", "It returns the mathematical value. Signed two's-complement interpretation requires a bit width."]
    ]
  }
};

async function main() {
  await rm(dist, { force: true, recursive: true });
  await mkdir(path.join(dist, "assets"), { recursive: true });
  await cp(path.join(root, "src/assets/styles.css"), path.join(dist, "assets/styles.css"));
  await cp(path.join(root, "src/assets/converter.js"), path.join(dist, "assets/converter.js"));
  await cp(path.join(root, "src/assets/favicon.svg"), path.join(dist, "assets/favicon.svg"));

  for (const page of indexablePages) {
    await writePage(page.slug, renderConverterPage(page));
  }

  await writePage("blog", renderBlogIndex());
  for (const post of blogPosts) {
    await writePage(post.slug, renderBlogPost(post));
  }

  for (const page of companyPages()) {
    await writePage(page.slug, renderCompanyPage(page));
  }

  await writeFile(path.join(dist, "robots.txt"), renderRobots());
  await writeFile(path.join(dist, "sitemap.xml"), renderSitemap());
  await writeFile(path.join(dist, "_redirects"), renderRedirects());
  await writeFile(path.join(dist, "404.html"), render404());
}

async function writePage(slug, html) {
  const directory = slug ? path.join(dist, slug) : dist;
  await mkdir(directory, { recursive: true });
  await writeFile(path.join(directory, "index.html"), html);
}

function renderBlogIndex() {
  const title = "Hex, Binary, and ASCII Conversion Guides";
  const description =
    "Practical guides for hexadecimal, binary, decimal, and ASCII conversion with examples that connect directly to the free tools on HexToDecimal.app.";
  const canonical = `${siteUrl}/blog/`;
  const body = `
    <main id="main" class="main-shell" data-page-type="blog-index">
      <section class="blog-hero">
        <p class="eyebrow">Conversion guides</p>
        <h1>${escapeHtml(title)}</h1>
        <p>${escapeHtml(description)}</p>
      </section>
      <section class="related-grid" aria-label="Conversion guides">
        ${blogPosts
          .map(
            (post) => `<a class="related-card blog-card" href="/${post.slug}/">
              <strong>${escapeHtml(post.title)}</strong>
              <span>${escapeHtml(post.summary)}</span>
            </a>`
          )
          .join("")}
      </section>
      <section class="section-band" aria-labelledby="tool-shortcuts">
        <h2 id="tool-shortcuts">Use a converter instead</h2>
        <div class="related-grid">
          ${navPages
            .slice(0, 6)
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
  return layout({ title, description, canonical, body, schemaOverride: renderBlogIndexSchema(canonical, description) });
}

function renderBlogPost(post) {
  const canonical = `${siteUrl}/${post.slug}/`;
  const relatedTools = post.relatedTools
    .map((slug) => indexablePages.find((page) => page.slug === slug))
    .filter(Boolean);
  const relatedPosts = blogPosts.filter((item) => item.slug !== post.slug).slice(0, 3);
  const body = `
    <main id="main" class="main-shell" data-page-type="blog-post">
      <section class="blog-hero">
        <p class="eyebrow">Conversion guide</p>
        <h1>${escapeHtml(post.title)}</h1>
        <p>${escapeHtml(post.summary)}</p>
        <p class="blog-meta">Updated ${formatDate(post.updated)}</p>
      </section>
      <section class="content-layout" aria-label="${escapeHtml(post.keyword)} guide">
        <article class="article blog-article">
          ${renderBlogSections(post)}
        </article>
        <aside class="side-panel" aria-label="Related resources">
          <div class="side-section">
            <h2>Related tools</h2>
            <ul class="link-list">
              ${relatedTools
                .map((page) => `<li><a href="${page.slug ? `/${page.slug}/` : "/"}">${escapeHtml(titleCase(page.keyword))}</a></li>`)
                .join("")}
            </ul>
          </div>
          <div class="side-section">
            <h2>More guides</h2>
            <ul class="link-list">
              ${relatedPosts.map((item) => `<li><a href="/${item.slug}/">${escapeHtml(item.title)}</a></li>`).join("")}
            </ul>
          </div>
        </aside>
      </section>
    </main>
  `;
  return layout({
    title: post.title,
    description: post.description,
    canonical,
    body,
    schemaOverride: renderBlogPostSchema(post, canonical)
  });
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
  const related = relatedFor(page).slice(0, 4);
  const guide = pageGuides[page.tool];
  if (!guide) {
    throw new Error(`Missing guide content for ${page.tool}`);
  }

  return `
    <h2 id="how-it-works">${escapeHtml(guide.introHeading)}</h2>
    ${renderParagraphs(guide.intro)}

    <h2>${escapeHtml(guide.stepsHeading)}</h2>
    ${renderList(guide.steps, "ol")}

    <h2>${escapeHtml(guide.examplesHeading)}</h2>
    ${renderExampleTable(guide.examples)}

    <h2>${escapeHtml(guide.validationHeading)}</h2>
    ${renderParagraphs(guide.validation)}

    <h2>${escapeHtml(guide.formulaHeading)}</h2>
    ${renderParagraphs(guide.formula)}

    <h2>${escapeHtml(guide.useCasesHeading)}</h2>
    ${renderList(guide.useCases)}

    <h2>Accuracy notes</h2>
    ${renderParagraphs(guide.accuracy)}

    <h2>Related tools</h2>
    <p>If this page is close but not exactly the operation you need, the related converters below cover adjacent intents without mixing every feature into one crowded interface. You can move from ${escapeHtml(page.keyword)} to ${related
      .map((item) => `<a href="${item.href}">${escapeHtml(item.label)}</a>`)
      .join(", ")}. Keeping each page centered on one core task makes the tool faster to use and makes the explanation easier to follow.</p>

    <h2>Frequently asked questions</h2>
    ${renderFaq(guide.faq)}
  `;
}

function renderBlogSections(post) {
  const toolLinks = post.relatedTools
    .map((slug) => indexablePages.find((page) => page.slug === slug))
    .filter(Boolean)
    .map((page) => `<a href="${page.slug ? `/${page.slug}/` : "/"}">${escapeHtml(titleCase(page.keyword))}</a>`)
    .join(", ");

  return `${post.sections
    .map(
      (section) => `
        <h2>${escapeHtml(section.heading)}</h2>
        ${renderParagraphs(section.paragraphs || [])}
        ${section.table ? renderContentTable(section.table) : ""}
        ${section.list ? renderList(section.list) : ""}
      `
    )
    .join("")}
    <h2>Tools that match this guide</h2>
    <p>When you want the answer without doing every step by hand, use ${toolLinks}. These pages keep the conversion task narrow, so the result is easier to check.</p>`;
}

function renderParagraphs(paragraphs) {
  return paragraphs.map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join("");
}

function renderList(items, tag = "ul") {
  return `<${tag}>${items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</${tag}>`;
}

function renderExampleTable(rows) {
  return `
    <div class="table-wrap">
      <table class="example-table">
        <thead>
          <tr>
            <th>Input</th>
            <th>Result</th>
            <th>Why it matters</th>
          </tr>
        </thead>
        <tbody>
          ${rows
            .map(
              ([input, result, note]) => `<tr>
                <td><code>${escapeHtml(input)}</code></td>
                <td><code>${escapeHtml(result)}</code></td>
                <td>${escapeHtml(note)}</td>
              </tr>`
            )
            .join("")}
        </tbody>
      </table>
    </div>`;
}

function renderContentTable(table) {
  return `
    <div class="table-wrap">
      <table class="example-table">
        <thead>
          <tr>${table.headers.map((header) => `<th>${escapeHtml(header)}</th>`).join("")}</tr>
        </thead>
        <tbody>
          ${table.rows
            .map((row) => `<tr>${row.map((cell) => `<td>${escapeHtml(cell)}</td>`).join("")}</tr>`)
            .join("")}
        </tbody>
      </table>
    </div>`;
}

function renderFaq(faq) {
  return faq
    .map(
      ([question, answer]) => `<h3>${escapeHtml(question)}</h3>
      <p>${escapeHtml(answer)}</p>`
    )
    .join("");
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
        <p>The site is hosted on Cloudflare Pages. Cloudflare may process request and security data as part of hosting, caching, abuse prevention, and network operations. The site also uses Google Analytics to understand aggregate site usage and improve the public converter pages.</p>
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
        <p>The site uses Google Analytics to understand aggregate site usage and improve the converter pages. The site does not use advertising cookies, behavioral retargeting cookies, or login session cookies for visitors using the public converters.</p>
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
  return layout({ title: page.title, description: page.description, canonical, body, robots: "noindex,follow" });
}

function layout({ title, description, canonical, body, page, robots = "", schemaOverride = "" }) {
  const schema = page ? renderSchema(page, canonical) : schemaOverride;
  return `<!doctype html>
<html lang="en-US">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escapeHtml(title)}</title>
  <meta name="description" content="${escapeHtml(description)}">
  ${robots ? `<meta name="robots" content="${escapeHtml(robots)}">` : ""}
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
  <!-- Google tag (gtag.js) -->
  <script async src="https://www.googletagmanager.com/gtag/js?id=G-G1XNHM5L3H"></script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());

    gtag('config', 'G-G1XNHM5L3H');
  </script>
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
          <a href="/blog/">Guides</a>
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
            <a href="/blog/">Guides</a>
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
    isAccessibleForFree: true,
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD"
    }
  };
  return `<script type="application/ld+json">${JSON.stringify(data)}</script>`;
}

function renderBlogIndexSchema(canonical, description) {
  const data = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "HexToDecimal.app Guides",
    url: canonical,
    description,
    publisher: {
      "@type": "Organization",
      name: "HexToDecimal.app"
    }
  };
  return `<script type="application/ld+json">${JSON.stringify(data)}</script>`;
}

function renderBlogPostSchema(post, canonical) {
  const data = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    datePublished: post.updated,
    dateModified: post.updated,
    mainEntityOfPage: canonical,
    author: {
      "@type": "Organization",
      name: "HexToDecimal.app"
    },
    publisher: {
      "@type": "Organization",
      name: "HexToDecimal.app"
    }
  };
  return `<script type="application/ld+json">${JSON.stringify(data)}</script>`;
}

function renderRobots() {
  return `User-agent: *
Allow: /

Sitemap: ${siteUrl}/sitemap.xml
`;
}

function renderSitemap() {
  const urls = [
    ...indexablePages.map((page) => canonicalFor(page.slug)),
    `${siteUrl}/blog/`,
    ...blogPosts.map((post) => `${siteUrl}/${post.slug}/`)
  ];
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (url) => `  <url>
    <loc>${url}</loc>
    <lastmod>${lastModified}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${url === siteUrl + "/" ? "1.0" : "0.8"}</priority>
  </url>`
  )
  .join("\n")}
</urlset>
`;
}

function renderRedirects() {
  return redirectPages
    .flatMap((page) => {
      const from = `/${page.slug}`;
      const to = page.redirectTo ? `/${page.redirectTo}/` : "/";
      return [`${from} ${to} 301`, `${from}/ ${to} 301`];
    })
    .join("\n")
    .concat("\n");
}

function render404() {
  return layout({
    title: "Page Not Found",
    description: "The requested HexToDecimal.app page could not be found.",
    canonical: `${siteUrl}/404.html`,
    robots: "noindex,follow",
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

function formatDate(value) {
  return new Intl.DateTimeFormat("en-US", { month: "long", day: "numeric", year: "numeric" }).format(
    new Date(`${value}T00:00:00Z`)
  );
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
