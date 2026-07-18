import type { ScanResult, Vulnerability, ChatMessage } from "../types";

export const mockVulnerabilities: Vulnerability[] = [
  {
    id: "vuln-001",
    name: "SQL Injection",
    severity: "Very High",
    fileName: "controllers/userController.js",
    lineNumber: 42,
    owaspCategory: "A03: Injection",
    language: "JavaScript",
    description:
      "User-supplied input from the request body is concatenated directly into a SQL query string instead of being passed as a parameterized value. An attacker can inject arbitrary SQL fragments to read, modify, or delete data.",
    whyItMatters:
      "Unvalidated SQL queries are one of the most exploited vulnerabilities on the web. A successful injection here could let an attacker dump the entire users table, bypass login, or drop tables entirely — with no need for valid credentials.",
    recommendedFix:
      "Use parameterized queries or an ORM's query builder so user input is always treated as data, never as executable SQL. Never build queries with string concatenation or template literals.",
    codeBefore:
      `const query = "SELECT * FROM users WHERE email = '" + req.body.email + "'";\ndb.query(query, (err, result) => {\n  res.json(result);\n});`,
    codeAfter:
      `const query = "SELECT * FROM users WHERE email = ?";\ndb.query(query, [req.body.email], (err, result) => {\n  res.json(result);\n});`,
  },
  {
    id: "vuln-002",
    name: "Cross-Site Scripting (XSS)",
    severity: "High",
    fileName: "components/CommentList.tsx",
    lineNumber: 27,
    owaspCategory: "A03: Injection",
    language: "TypeScript",
    description:
      "Raw, unsanitized user comment content is injected into the DOM using dangerouslySetInnerHTML. Any HTML or script tags submitted by a user will be rendered and executed in every visitor's browser.",
    whyItMatters:
      "An attacker can post a comment containing a malicious <script> tag to steal session cookies, redirect users to phishing pages, or perform actions on their behalf without their knowledge.",
    recommendedFix:
      "Render user content as plain text by default. If HTML must be supported, sanitize it first with a trusted library such as DOMPurify before rendering.",
    codeBefore:
      `<div dangerouslySetInnerHTML={{ __html: comment.body }} />`,
    codeAfter:
      `import DOMPurify from "dompurify";\n\n<div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(comment.body) }} />`,
  },
  {
    id: "vuln-003",
    name: "Hardcoded API Secret",
    severity: "High",
    fileName: "services/paymentService.py",
    lineNumber: 8,
    owaspCategory: "A02: Cryptographic Failures",
    language: "Python",
    description:
      "A live payment provider secret key is committed directly in source code. Anyone with read access to the repository — including forks, CI logs, or a future public release — can extract and reuse this key.",
    whyItMatters:
      "A leaked payment API key can let an attacker issue refunds, read transaction history, or move funds under your account, often without triggering any alerts until the damage is done.",
    recommendedFix:
      "Move secrets out of source control into environment variables or a secrets manager, and rotate the exposed key immediately.",
    codeBefore:
      `STRIPE_SECRET_KEY = "sk_live_51H8x7KJ2eZvKYlo2C0ffKey"\nstripe.api_key = STRIPE_SECRET_KEY`,
    codeAfter:
      `import os\n\nstripe.api_key = os.environ["STRIPE_SECRET_KEY"]`,
  },
  {
    id: "vuln-004",
    name: "Command Injection",
    severity: "Very High",
    fileName: "utils/fileConverter.java",
    lineNumber: 61,
    owaspCategory: "A03: Injection",
    language: "Java",
    description:
      "A filename provided by the user is passed straight into a shell command used to convert uploaded files. Shell metacharacters in the filename are not escaped or validated.",
    whyItMatters:
      "An attacker who controls the filename can chain additional shell commands, potentially gaining full remote code execution on the server that processes uploads.",
    recommendedFix:
      "Avoid invoking a shell at all where possible. Use a library API instead of Runtime.exec with a shell, and strictly allow-list acceptable filename characters.",
    codeBefore:
      `String cmd = "convert " + userFileName + " output.pdf";\nRuntime.getRuntime().exec(cmd);`,
    codeAfter:
      `ProcessBuilder pb = new ProcessBuilder("convert", sanitizedFileName, "output.pdf");\npb.start();`,
  },
  {
    id: "vuln-005",
    name: "Insecure Direct Object Reference",
    severity: "Medium",
    fileName: "routes/invoices.js",
    lineNumber: 15,
    owaspCategory: "A01: Broken Access Control",
    language: "JavaScript",
    description:
      "An invoice is fetched using only the ID supplied in the URL, with no check that the requesting user actually owns that invoice.",
    whyItMatters:
      "Any authenticated user can view or modify another customer's invoices simply by changing the ID in the URL, exposing billing details and personal information across accounts.",
    recommendedFix:
      "Always verify the requested resource belongs to the authenticated user before returning it, either in the query itself or with an explicit ownership check.",
    codeBefore:
      `app.get("/invoices/:id", (req, res) => {\n  const invoice = db.getInvoiceById(req.params.id);\n  res.json(invoice);\n});`,
    codeAfter:
      `app.get("/invoices/:id", (req, res) => {\n  const invoice = db.getInvoiceById(req.params.id);\n  if (invoice.userId !== req.user.id) return res.sendStatus(403);\n  res.json(invoice);\n});`,
  },
  {
    id: "vuln-006",
    name: "Weak Cryptographic Hashing",
    severity: "Medium",
    fileName: "auth/passwordUtils.py",
    lineNumber: 12,
    owaspCategory: "A02: Cryptographic Failures",
    language: "Python",
    description:
      "Passwords are hashed with MD5, a fast, broken hash function that was never designed for password storage and offers no protection against modern GPU-based cracking.",
    whyItMatters:
      "If the password database is ever leaked, MD5 hashes can be cracked at billions of guesses per second, exposing most users' real passwords within hours.",
    recommendedFix:
      "Use a purpose-built, slow password hashing algorithm such as bcrypt or Argon2, which include salting and configurable work factors by design.",
    codeBefore:
      `import hashlib\n\ndef hash_password(password):\n    return hashlib.md5(password.encode()).hexdigest()`,
    codeAfter:
      `import bcrypt\n\ndef hash_password(password):\n    return bcrypt.hashpw(password.encode(), bcrypt.gensalt())`,
  },
  {
    id: "vuln-007",
    name: "Missing Rate Limiting on Login",
    severity: "Low",
    fileName: "routes/auth.ts",
    lineNumber: 33,
    owaspCategory: "A07: Identification and Authentication Failures",
    language: "TypeScript",
    description:
      "The login endpoint accepts unlimited authentication attempts from the same IP address or account with no throttling or lockout.",
    whyItMatters:
      "Without rate limiting, an attacker can run automated brute-force or credential-stuffing attacks against user accounts largely undetected.",
    recommendedFix:
      "Add a rate limiter (e.g. a sliding window per IP and per account) and introduce temporary lockouts or CAPTCHA after repeated failures.",
    codeBefore:
      `router.post("/login", async (req, res) => {\n  const user = await authenticate(req.body);\n  res.json({ token: user.token });\n});`,
    codeAfter:
      `router.post("/login", loginRateLimiter, async (req, res) => {\n  const user = await authenticate(req.body);\n  res.json({ token: user.token });\n});`,
  },
  {
    id: "vuln-008",
    name: "Path Traversal",
    severity: "High",
    fileName: "controllers/fileController.cpp",
    lineNumber: 19,
    owaspCategory: "A01: Broken Access Control",
    language: "C++",
    description:
      "A file path built from user input is passed to the file system without normalizing or restricting it, allowing sequences like ../../ to escape the intended directory.",
    whyItMatters:
      "An attacker could request files like ../../etc/passwd to read arbitrary files on the server's file system, potentially exposing configuration files and credentials.",
    recommendedFix:
      "Resolve the requested path to an absolute path and verify it stays within an allowed base directory before opening the file.",
    codeBefore:
      `std::string path = "uploads/" + requestedFile;\nstd::ifstream file(path);`,
    codeAfter:
      `std::filesystem::path base = std::filesystem::canonical("uploads");\nstd::filesystem::path target = std::filesystem::weakly_canonical(base / requestedFile);\nif (target.string().rfind(base.string(), 0) != 0) throw std::runtime_error("Invalid path");\nstd::ifstream file(target);`,
  },
];

export const mockScanResult: ScanResult = {
  summary: {
    securityScore: 78,
    riskStatus: "Moderate Risk",
    vulnerabilitiesFound: mockVulnerabilities.length,
    highSeverity: mockVulnerabilities.filter(
      (v) => v.severity === "Very High" || v.severity === "High"
    ).length,
    mediumSeverity: mockVulnerabilities.filter((v) => v.severity === "Medium")
      .length,
    lowSeverity: mockVulnerabilities.filter((v) => v.severity === "Low")
      .length,
    scannedFileName: "project-source.zip",
    scannedLanguage: "JavaScript",
    linesScanned: 1284,
    scanDurationMs: 2140,
    checksReviewed: 38,
    checksNeedContext: 6,
  },
  vulnerabilities: mockVulnerabilities,
};

export const mockChatMessages: ChatMessage[] = [
  {
    id: "msg-1",
    role: "user",
    content: "Explain this vulnerability.",
    timestamp: "10:41 AM",
  },
  {
    id: "msg-2",
    role: "ai",
    content:
      "This SQL query directly concatenates user input into the query string, which means anyone can type something like ' OR '1'='1 into the email field and bypass the WHERE clause entirely. That's how attackers dump full tables or log in without a password.",
    timestamp: "10:41 AM",
  },
  {
    id: "msg-3",
    role: "user",
    content: "How urgent is this compared to the others?",
    timestamp: "10:42 AM",
  },
  {
    id: "msg-4",
    role: "ai",
    content:
      "This one and the command injection on line 61 are your top priorities — both are rated Very High because they can lead to full data exposure or remote code execution with very little effort from an attacker. I'd fix these two first.",
    timestamp: "10:42 AM",
  },
];

export const suggestedQuestions: string[] = [
  "How would an attacker exploit this?",
  "Show me the safest fix for this file.",
  "Which vulnerability should I fix first?",
  "Explain this like I'm new to security.",
];
