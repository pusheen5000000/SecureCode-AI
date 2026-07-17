export type CoverageStatus = "affected" | "not_affected" | "not_applicable" | "needs_context";

export interface SecurityCheck {
  id: string;
  category: string;
  name: string;
  guidance: string;
}

// This is deliberately explicit: a scan is only complete when every check has
// an outcome. Add new checks here as the scanner's security baseline evolves.
export const SECURITY_CHECKS: readonly SecurityCheck[] = [
  ["INJ-SQL", "Input validation & injection", "SQL injection", "Look for unparameterized SQL and ORM raw queries."],
  ["INJ-XSS-STORED", "Input validation & injection", "Stored XSS", "Trace persisted untrusted content to HTML or script sinks."],
  ["INJ-XSS-REFLECTED", "Input validation & injection", "Reflected XSS", "Trace request input to HTML or script sinks."],
  ["INJ-XSS-DOM", "Input validation & injection", "DOM-based XSS", "Check browser sources flowing to dangerous DOM sinks."],
  ["INJ-CMD", "Input validation & injection", "OS command injection", "Check shell/process execution with untrusted input."],
  ["INJ-PATH", "Input validation & injection", "Path traversal", "Check file paths derived from untrusted input."],
  ["INJ-XXE", "Input validation & injection", "XML external entity injection", "Check XML parser configuration and entity resolution."],
  ["INJ-LDAP-NOSQL", "Input validation & injection", "LDAP/NoSQL injection", "Check object/query construction from untrusted input."],
  ["AUTHZ-IDOR", "Broken access control", "IDOR / horizontal privilege escalation", "Check ownership enforcement on object references."],
  ["AUTHZ-VERTICAL", "Broken access control", "Vertical privilege escalation", "Check role and permission enforcement."],
  ["AUTHZ-FUNCTION", "Broken access control", "Missing function-level access control", "Check sensitive routes and actions for authorization."],
  ["AUTH-CREDENTIAL-STUFFING", "Authentication & session management", "Credential stuffing", "Check login abuse protections."],
  ["AUTH-BRUTE-FORCE", "Authentication & session management", "Brute force / password spraying", "Check throttling, lockout, and monitoring."],
  ["AUTH-SESSION", "Authentication & session management", "Session hijacking / fixation", "Check token generation, rotation, cookies, and invalidation."],
  ["AUTH-MFA", "Authentication & session management", "Weak or bypassable MFA", "Check MFA enforcement on login and sensitive actions."],
  ["LOGIC-WORKFLOW", "Business logic & design", "Workflow bypass", "Check state transitions and server-side completion checks."],
  ["LOGIC-RACE", "Business logic & design", "Race conditions / TOCTOU", "Check check-then-use operations and concurrent updates."],
  ["LOGIC-RATE-LIMIT", "Business logic & design", "Rate-limiting failure", "Check abuse-prone endpoints for limits."],
  ["NET-SSRF", "Network & request manipulation", "Server-side request forgery", "Check outbound requests using untrusted URLs or hosts."],
  ["NET-CSRF", "Network & request manipulation", "Cross-site request forgery", "Check state-changing browser flows for CSRF defenses."],
  ["NET-REDIRECT", "Network & request manipulation", "Open redirect", "Check user-controlled redirect destinations."],
  ["SUPPLY-VULNERABLE", "Supply chain & dependencies", "Vulnerable or outdated components", "Inspect manifests and lockfiles for known vulnerable dependencies."],
  ["SUPPLY-CONFUSION", "Supply chain & dependencies", "Dependency confusion / typosquatting", "Inspect registry settings and ambiguous private package names."],
  ["SUPPLY-CICD", "Supply chain & dependencies", "Insecure CI/CD pipeline", "Inspect workflow and build configuration for untrusted execution and weak permissions."],
  ["CONFIG-DEFAULTS", "Security misconfiguration", "Default credentials", "Check deployment and service configuration."],
  ["CONFIG-ERRORS", "Security misconfiguration", "Verbose errors / information leakage", "Check production error handling and logging exposure."],
  ["CONFIG-STORAGE", "Security misconfiguration", "Exposed cloud storage", "Check storage and infrastructure configuration."],
  ["CONFIG-HEADERS", "Security misconfiguration", "Insecure HTTP headers / CORS", "Check CSP, security headers, cookies, and CORS."],
  ["CRYPTO-TRANSPORT", "Cryptographic failures", "Insecure data transmission", "Check plaintext protocols and TLS enforcement."],
  ["CRYPTO-WEAK", "Cryptographic failures", "Weak cryptographic algorithms", "Check MD5, SHA-1, RC4, weak modes, and password hashing."],
  ["CRYPTO-SECRETS", "Cryptographic failures", "Hardcoded secrets", "Check source and configuration for credentials and private keys."],
  ["CRYPTO-KEYS", "Cryptographic failures", "Weak entropy or key rotation", "Check random sources, key lifecycle, and rotation."],
  ["AI-PROMPT", "AI & ML pipeline", "Prompt injection", "Check LLM inputs, instruction boundaries, tools, and retrieval."],
  ["AI-OUTPUT", "AI & ML pipeline", "Insecure AI output handling", "Check model output flowing to HTML, code, queries, or commands."],
  ["AI-POISONING", "AI & ML pipeline", "Data poisoning", "Check training and retrieval data provenance and approval."],
  ["NATIVE-BUFFER", "Memory & resource exhaustion", "Buffer overflow", "Check native memory operations and bounds."],
  ["NATIVE-INTEGER", "Memory & resource exhaustion", "Integer overflow", "Check arithmetic used for sizes, allocation, and authorization."],
  ["NATIVE-RESOURCE", "Memory & resource exhaustion", "Memory leaks / resource exhaustion", "Check cleanup, limits, pools, and unbounded work."],
].map(([id, category, name, guidance]) => ({ id, category, name, guidance }));

export const securityChecklistForPrompt = SECURITY_CHECKS.map(
  (check) => `- ${check.id} | ${check.category} | ${check.name}: ${check.guidance}`
).join("\n");
