# Security Policy — PolyGuard

## Overview

PolyGuard is an AI-powered code vulnerability detection system developed by **TeamGamma at QuantumLogicsLabs**. We take the security of our project seriously — including the security of our API, model, website, and all related infrastructure.

This document outlines how to report security vulnerabilities responsibly.

---

## Supported Versions

The following versions of PolyGuard are currently supported with security updates:

| Component | Version | Status |
|-----------|---------|--------|
| PolyGuard Website | Latest (Vercel) | ✅ Supported |
| PolyGuard API (HuggingFace Spaces) | v3.0 | ✅ Supported |
| GraphCodeBERT Model | final_model | ✅ Supported |
| PolyGuard API (ngrok/Colab) | Any | ⚠️ Development only |
| Older model versions | v1, v2 | ❌ Not supported |

---

## Scope

### In Scope

The following are within scope for security reports:

**Website (React/Vite)**
- Cross-Site Scripting (XSS) in the Analyzer page
- Sensitive data exposure in the frontend
- Insecure API calls or exposed credentials
- Broken access control on any page
- Dependency vulnerabilities (`npm audit`)

**API (FastAPI on HuggingFace Spaces)**
- Injection attacks via the `/analyze` endpoint
- Authentication bypass (if auth is implemented)
- Denial of Service via malicious code input
- Exposed environment variables or secrets
- CORS misconfiguration

**Model & Data**
- Prompt injection attacks against the model
- Model inversion or extraction attacks
- Adversarial inputs that bypass vulnerability detection
- Data poisoning concerns

**Infrastructure**
- Exposed ngrok tokens or API keys in public code
- Hardcoded secrets in any committed file
- Insecure Google Drive sharing settings

### Out of Scope

The following are **not** in scope:

- Vulnerabilities in HuggingFace's own platform infrastructure
- Vulnerabilities in Vercel's hosting infrastructure
- Social engineering attacks against team members
- Physical security issues
- Denial of Service attacks against third-party services
- Issues in test/development environments (local Colab)
- Intentionally vulnerable code samples in `CodingSamples.js` — these are demo examples

---

## Reporting a Vulnerability

### How to Report

**Please do NOT open a public GitHub issue for security vulnerabilities.**

Instead, report security issues through one of these private channels:

**Option 1 — GitHub Private Security Advisory (Preferred)**
1. Go to the [PolyGuard repository](https://github.com/QuantumLogicsLabs/PolyGuard)
2. Click **Security** tab
3. Click **Report a vulnerability**
4. Fill in the details

**Option 2 — Direct Contact**
Contact the team captain directly:
- **Maryam Fareed** — Team Captain, QuantumLogicsLabs

### What to Include in Your Report

Please provide as much of the following information as possible:

```
1. DESCRIPTION
   Clear description of the vulnerability

2. AFFECTED COMPONENT
   Website / API / Model / Infrastructure

3. STEPS TO REPRODUCE
   Step-by-step instructions to reproduce

4. PROOF OF CONCEPT
   Code, screenshots, or video demonstrating the issue

5. IMPACT
   What can an attacker do with this vulnerability?

6. SUGGESTED FIX
   If you have a suggestion for how to fix it

7. YOUR CONTACT
   How we can reach you for follow-up
```

### Example Report Format

```
Title: XSS vulnerability in Analyzer page via code input

Component: Website — Analyzer.jsx

Description:
The code input field in the Analyzer page does not sanitize
HTML before rendering, allowing an attacker to inject
malicious scripts via the code textarea.

Steps to Reproduce:
1. Go to /developers/docs/analyzer
2. Enter the following in the code field:
   <script>alert('XSS')</script>
3. Click Analyze
4. The script executes in the browser

Impact:
An attacker could steal session cookies or redirect users
to malicious sites.

Suggested Fix:
Sanitize input using DOMPurify before rendering any
user-provided content.
```

---

## Response Timeline

We commit to the following response times:

| Action | Timeline |
|--------|----------|
| Acknowledge receipt of report | Within 48 hours |
| Initial assessment | Within 5 days |
| Status update | Weekly until resolved |
| Fix deployed | Within 14 days for critical issues |
| Public disclosure | After fix is deployed |

> **Note:** As this is a university project with a June 6 deadline, response times may vary. Critical security issues affecting the live API or website will be prioritized.

---

## Severity Classification

We classify vulnerabilities using the following severity levels, consistent with our model's classification system:

| Severity | CVSS Score | Examples | Response Time |
|----------|-----------|---------|---------------|
| 🔴 Critical | 9.0–10.0 | RCE, full data breach, API takeover | 24–48 hours |
| 🟠 High | 7.0–8.9 | SQL injection, auth bypass, XSS | 3–5 days |
| 🟡 Medium | 4.0–6.9 | Info exposure, CSRF, path traversal | 7–14 days |
| 🟢 Low | 0.1–3.9 | Minor info leak, best practice issues | Next release |

---

## Known Security Considerations

### Intentional Vulnerability Examples

The following files contain **intentionally vulnerable code** for demonstration purposes. These are not security issues:

```
src/assets/CodingSamples.js
```

This file contains vulnerable code samples (SQL injection, XSS, buffer overflow, etc.) that are used to demonstrate PolyGuard's detection capabilities in the Analyzer page. These are expected and intentional.

### API Rate Limiting

The PolyGuard API hosted on HuggingFace Spaces does not currently implement rate limiting. Very large or malicious inputs may cause slowdowns. This is a known limitation.

### Model Adversarial Inputs

The GraphCodeBERT model may be fooled by adversarially crafted code that looks clean but contains obfuscated vulnerabilities. This is a known limitation of ML-based detection systems and an area of active research.

### ngrok Token

The ngrok token used in development (`app.py`) should never be committed to a public repository. If you find an exposed ngrok token in any committed file, please report it immediately.

---

## Security Best Practices for Contributors

If you are contributing to PolyGuard, follow these security practices:

**Never commit:**
- API keys or tokens (ngrok, HuggingFace, Groq)
- Database passwords
- Google Drive credentials
- Any secret starting with `sk-`, `hf_`, or similar

**Always use:**
```python
# Good — environment variables
import os
API_KEY = os.environ.get("API_KEY")

# Bad — hardcoded secrets
API_KEY = "sk-prod-abc123"  # NEVER DO THIS
```

**Before committing, check:**
```bash
# Check for accidentally committed secrets
git diff --staged | grep -i "api_key\|password\|secret\|token"

# Run npm security audit
npm audit
```

---

## Disclosure Policy

We follow **Coordinated Vulnerability Disclosure (CVD)**:

1. Reporter submits vulnerability privately
2. We acknowledge and investigate
3. We develop and test a fix
4. Fix is deployed to production
5. We notify the reporter
6. Public disclosure after fix is live (typically 90 days maximum)

We will credit security researchers who responsibly disclose vulnerabilities, unless they prefer to remain anonymous.

---

## Hall of Fame

We acknowledge security researchers who help improve PolyGuard:

| Researcher | Vulnerability | Date |
|------------|--------------|------|
| *Be the first!* | | |

---

## Contact

| Role | Contact |
|------|---------|
| Team Captain | Maryam Fareed |
| Organization | QuantumLogicsLabs |
| GitHub | https://github.com/QuantumLogicsLabs/PolyGuard |
| HuggingFace | https://huggingface.co/MUHAMMADSAADAMIN/PolyGuard |

---

*PolyGuard — AI-Powered Code Vulnerability Detection | TeamGamma | QuantumLogicsLabs*

*This security policy was last updated: May 2026*
