# SecureCode AI

SecureCode AI is an AI-powered vulnerability scanner that helps developers identify security issues in their applications, understand the risks, and receive guidance on how to fix them.

## How We Used GPT-5.6 and Codex

### GPT-5.6

GPT-5.6 was used as a research and planning assistant throughout the development process.

We used GPT-5.6 to:
- Research existing vulnerability scanners and compare their strengths and weaknesses.
- Analyze common application security vulnerabilities and detection approaches.
- Help define the product roadmap and prioritize features.
- Explore ways to make vulnerability reports more understandable for developers.

This research helped us design SecureCode AI around a key goal: not just detecting vulnerabilities, but helping developers understand and fix them.

### Codex

Codex was used throughout implementation to accelerate development and build core parts of the application.

We used Codex to:
- Create the foundation of the frontend and backend architecture.
- Build the application layout and server structure.
- Implement file upload and scanning workflows.
- Develop the vulnerability analysis pipeline.
- Integrate the AI chat assistant for security questions and remediation guidance.

Using Codex allowed us to spend more time improving the security workflow and user experience while reducing time spent on repetitive development tasks.

## Scan Coverage Baseline

Every scan uses a mandatory, auditable checklist. The backend requires the analysis model to return a status and evidence for each check; responses missing a check are rejected rather than shown as complete.

Checks cover:
- Input and injection attacks
- Authorization
- Authentication and session management
- Business logic vulnerabilities
- Network-request attacks
- Dependencies and CI/CD security
- Security configuration
- Cryptography
- AI/ML pipeline security
- Native memory and resource safety

The scanner reports each check as one of the following:

- `affected` — A potential vulnerability was identified.
- `not_affected` — No vulnerability was found based on available evidence.
- `not_applicable` — The check does not apply to the submitted code.
- `needs_context` — The submitted code does not provide enough information to verify safety.

`needs_context` should not be treated as a pass. It indicates that additional deployment or operational information is required.

## ZIP Scan Support

ZIP scans analyze more than just source code. When available, SecureCode AI also reviews:

- Dependency manifests
- Lockfiles
- Application configuration files
- Infrastructure configuration
- Docker files
- GitHub Actions workflows

This provides a broader view of potential security risks across an application.

## Features

- AI-powered vulnerability detection
- Security issue explanations
- Suggested remediation steps
- Interactive AI security assistant
- Multi-file project scanning
- Developer-friendly vulnerability reports
