# SecureCode AI

## Scan coverage baseline

Every scan uses a mandatory, auditable checklist. The backend requires the analysis model to return a status and evidence for each check; responses missing a check are rejected rather than shown as complete. Checks cover input and injection attacks, authorization, authentication/session management, business logic, network-request attacks, dependencies and CI/CD, security configuration, cryptography, AI/ML pipelines, and native memory/resource safety.

The scanner reports a check as `affected`, `not_affected`, `not_applicable`, or `needs_context`. `needs_context` means the submitted code cannot prove a deployment or operational control is safe; it must not be treated as a pass.

ZIP scans additionally include dependency manifests, lockfiles, application/infrastructure configuration, Docker files, and GitHub Actions workflows where present, along with source files.
