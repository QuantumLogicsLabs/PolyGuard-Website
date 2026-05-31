# Contributing to PolyGuard

Thank you for your interest in contributing to **PolyGuard** — an AI-powered multi-language code vulnerability detection system built by TeamGamma at QuantumLogicsLabs.

---

## Table of Contents

- [Project Overview](#project-overview)
- [Team Structure](#team-structure)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Contribution Areas](#contribution-areas)
- [Code Style Guidelines](#code-style-guidelines)
- [Submitting Changes](#submitting-changes)
- [Resources](#resources)

---

## Project Overview

PolyGuard is an AI-powered vulnerability detection system that supports 8 programming languages: **Python, JavaScript, PHP, Java, C, C++, Ruby, and Go**.

The system uses **GraphCodeBERT** for multiclass severity classification with 4 labels:

| Label | Class | Description |
|-------|-------|-------------|
| 0 | Safe | No vulnerability detected |
| 1 | Low | Minor issues, best practice violations |
| 2 | Medium | XSS, weak cryptography, path traversal |
| 3 | High | SQL injection, command injection, buffer overflow |

The website is built with **React + Vite** and deployed on **Vercel**.

---

## Team Structure

| Member | Role | Responsibilities |
|--------|------|-----------------|
| Maryam Fareed | Team Captain | Dataset, model coordination, LangChain integration |
| Nida | ML Engineer | Model training, evaluation |
| Noor | QA Engineer | Test cases (50+) |
| Abdul Ahad | Test Runner | Automated testing, API testing |
| New Member | Fix Suggestions | Rule-based fix module, Groq AI integration |

---

## Project Structure

```
website/
├── src/
│   ├── assets/
│   │   ├── CodingSamples.js       # Code examples for 8 languages
│   │   ├── FooterSections.js      # Footer navigation links
│   │   └── NavbarLinks.js         # Navbar navigation links
│   ├── components/
│   │   ├── home/
│   │   │   ├── APIReference.jsx   # API links section
│   │   │   ├── DeveloperGuide.jsx # Developer guide section
│   │   │   ├── Features.jsx       # Features showcase
│   │   │   ├── HeroSection.jsx    # Landing hero section
│   │   │   ├── QuickLinks.jsx     # Quick navigation links
│   │   │   ├── StatsBar.jsx       # Model stats display
│   │   │   └── SupportedLanguages.jsx  # Languages grid
│   │   ├── Footer.jsx             # Site footer
│   │   ├── Nav.jsx                # Navigation bar
│   │   ├── NotFound.jsx           # 404 component
│   │   └── ResultBlock.jsx        # Vulnerability result display
│   ├── pages/
│   │   ├── Analyzer.jsx           # Code analyzer page
│   │   ├── Architecture.jsx       # System architecture page
│   │   ├── Home.jsx               # Home/landing page
│   │   ├── ModelStatus.jsx        # Model performance page
│   │   ├── Notebook.jsx           # Training notebooks page
│   │   ├── NotFound.jsx           # 404 page
│   │   ├── Roadmap.jsx            # Project roadmap page
│   │   └── TrainingGuide.jsx      # Training guide page
│   ├── App.jsx                    # Main app with routes
│   ├── index.css                  # Global styles
│   └── main.jsx                   # Entry point
├── index.html
├── vite.config.js
├── eslint.config.js
└── README.md
```

---

## Getting Started

### Prerequisites

Make sure you have the following installed:

- **Node.js** v18 or higher
- **npm** v9 or higher
- **Git**

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/QuantumLogicsLabs/PolyGuard.git

# 2. Navigate to website folder
cd PolyGuard/website

# 3. Install dependencies
npm install

# 4. Start development server
npm run dev
```

The website will be available at `http://localhost:5173`

### Environment Setup

The website connects to the live PolyGuard API:

```
API Base URL: https://muhammadsaadamin-polyguard-api.hf.space
Analyze:      POST /analyze
Batch:        POST /analyze_batch
Health:       GET  /health
Swagger:      GET  /docs
```

No `.env` file is required for basic development — the API URL is configured in the Analyzer page.

---

## Development Workflow

### Branch Naming

Always create a new branch for your changes:

```bash
# Feature
git checkout -b feature/your-feature-name

# Bug fix
git checkout -b fix/your-bug-description

# Documentation
git checkout -b docs/what-you-are-documenting

# Model update
git checkout -b model/update-description
```

### Commit Message Format

Use clear and descriptive commit messages:

```
feat: add Medium severity examples to Analyzer page
fix: correct scoring formula in ResultBlock component
docs: update ModelStatus with GraphCodeBERT results
style: fix navbar active state highlighting
model: update F1 scores to reflect final_model results
```

### Before Committing

```bash
# Run linter
npm run lint

# Build to check for errors
npm run build

# Preview production build
npm run preview
```

---

## Contribution Areas

### 1. Website Pages

Each page has a specific purpose — contribute accordingly:

**Home Page** (`src/pages/Home.jsx`)
- Update stats in StatsBar (accuracy, F1 score, languages supported)
- Add new features to Features section
- Update supported languages list

**Analyzer Page** (`src/pages/Analyzer.jsx`)
- Fix API integration issues
- Improve result display in ResultBlock
- Add new code samples to CodingSamples.js

**Model Status Page** (`src/pages/ModelStatus.jsx`)
- Update model performance metrics after new training
- Add comparison table for multiple models
- Current best model: **GraphCodeBERT** with F1 Macro = 91.1%

**Architecture Page** (`src/pages/Architecture.jsx`)
- Update system diagrams
- Reflect multiclass classification changes (4 classes)
- Add LangChain integration when implemented

**Training Guide** (`src/pages/TrainingGuide.jsx`)
- Document new training approaches
- Add oversampling strategy explanation
- Update dataset information

**Roadmap** (`src/pages/Roadmap.jsx`)
- Mark completed milestones
- Add upcoming features
- Update timeline

### 2. Model Updates

When the ML model is updated, update these files:

```js
// src/components/home/StatsBar.jsx
// Update accuracy, F1 score, dataset size

// src/pages/ModelStatus.jsx
// Add new model comparison row

// src/pages/TrainingGuide.jsx
// Document training approach used
```

Current model metrics to reflect:

```
Model:        GraphCodeBERT (multiclass)
Classes:      4 (Safe, Low, Medium, High)
Accuracy:     93.9%
F1 Macro:     91.1%
F1 Weighted:  93.9%
Dataset:      126,112 rows
Languages:    8
```

### 3. Adding Code Samples

To add new vulnerability examples in the Analyzer:

```js
// src/assets/CodingSamples.js

const SAMPLES = {
  python: `your python code here`,
  javascript: `your js code here`,
  // add your language
  rust: `your rust code here`,
};
```

### 4. Navigation Updates

To add a new page to the navbar:

```js
// src/assets/NavbarLinks.js
const links = [
  // existing links...
  {
    id: "newpage",
    label: "NEW PAGE",
    path: "/developers/docs/new-page",
  },
];
```

Also add the route in `src/App.jsx`:

```jsx
<Route path="/developers/docs/new-page" element={<NewPage />} />
```

### 5. API Integration

The Analyzer sends requests to the PolyGuard API:

```js
// Request format
POST https://muhammadsaadamin-polyguard-api.hf.space/analyze
{
  "code": "your code here",
  "language": "python"
}

// Response format
{
  "verdict": "VULNERABLE",
  "security_score": 2.0,
  "risk_level": "high",
  "findings": ["SQL Injection detected"],
  "recommendations": ["Use parameterized queries"]
}
```

---

## Code Style Guidelines

### React Components

```jsx
// Use functional components
const MyComponent = ({ prop1, prop2 }) => {
  return (
    <div>
      {/* content */}
    </div>
  );
};

export default MyComponent;
```

### CSS Variables

The project uses CSS variables for theming — always use them instead of hardcoded colors:

```css
/* Use these variables */
var(--bg1)        /* primary background */
var(--bg2)        /* secondary background */
var(--bg3)        /* tertiary background */
var(--text1)      /* primary text */
var(--text2)      /* secondary text */
var(--text3)      /* accent text */
var(--accent)     /* main accent color */
var(--border)     /* border color */
```

### File Naming

```
Components:   PascalCase.jsx    (Nav.jsx, ResultBlock.jsx)
Assets:       camelCase.js      (NavbarLinks.js, FooterSections.js)
Pages:        PascalCase.jsx    (Analyzer.jsx, ModelStatus.jsx)
```

---

## Submitting Changes

### Pull Request Process

1. Fork the repository
2. Create your feature branch
3. Make your changes
4. Test locally (`npm run dev`)
5. Build successfully (`npm run build`)
6. Commit your changes
7. Push to your branch
8. Open a Pull Request

### Pull Request Template

```
## What does this PR do?
Brief description of changes

## Type of change
- [ ] Bug fix
- [ ] New feature
- [ ] Model update
- [ ] Documentation
- [ ] Style/UI improvement

## Pages affected
- [ ] Home
- [ ] Analyzer
- [ ] Model Status
- [ ] Architecture
- [ ] Training Guide
- [ ] Roadmap
- [ ] Notebooks

## Testing done
Describe how you tested the changes

## Screenshots (if UI changes)
Add screenshots here
```

### Review Checklist

Before requesting review, make sure:

- [ ] `npm run lint` passes with no errors
- [ ] `npm run build` completes successfully
- [ ] New pages have proper routing in `App.jsx`
- [ ] Model metrics are up to date
- [ ] API endpoints are correct
- [ ] CSS uses design system variables
- [ ] No hardcoded colors or values
- [ ] Mobile responsive layout checked

---

## Resources

| Resource | Link |
|----------|------|
| GitHub Repo | https://github.com/QuantumLogicsLabs/PolyGuard |
| Live Website | Deployed on Vercel |
| API Endpoint | https://muhammadsaadamin-polyguard-api.hf.space |
| Swagger Docs | https://muhammadsaadamin-polyguard-api.hf.space/docs |
| HuggingFace Model | https://huggingface.co/MUHAMMADSAADAMIN/PolyGuard |
| HuggingFace Space | https://huggingface.co/spaces/MUHAMMADSAADAMIN/polyguard-api |
| Training Dataset | https://drive.google.com/drive/folders/1GLYwUq0kIhaX1s5MeCYJO_2YXClMZ7bV |

---

## Questions?

If you have any questions, reach out to the team:

- **Team Captain:** Maryam Fareed
- **GitHub Issues:** Open an issue on the repository
- **Organization:** QuantumLogicsLabs

---

*PolyGuard — AI-Powered Code Vulnerability Detection | TeamGamma | QuantumLogicsLabs*