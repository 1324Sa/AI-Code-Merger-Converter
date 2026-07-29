# 🚀 Local Polyglot AI Code Merger & Transpiler Engine

> **A high-performance, 100% local, privacy-first AI platform engineered for multi-language AST-aware code merging, conflict resolution, and cross-paradigm code transpilation.**

---

## 📌 Executive Summary

Modern software engineering requires reliable code integration and seamless cross-language migration. **Local Polyglot AI Code Merger & Transpiler Engine** eliminates third-party API dependencies, recurring SaaS costs, and privacy leaks by delivering a enterprise-grade, locally hosted intelligence layer. 

Powered by **FastAPI**, **Next.js 14**, **Monaco Editor**, and local **Ollama (`qwen2.5-coder:7b`)** inference, this platform performs deep semantic analysis, detects structural conflicts, and executes idiomatic code translation across **14+ programming languages**.

---

## 🔑 Key Features & Core Capabilities

### 1. 🔀 Context-Aware Code Merging Engine
* **Beyond Text Diffs:** Unlike traditional git-diff tools, it evaluates semantic logic, function signatures, and context intent.
* **Deterministic Conflict Detection:** Pinpoints precise logical overlaps, broken bindings, state overrides, and signatures mismatches.
* **Automated Resolution Proposals:** Generates clean, refactored, and unified source code alongside detailed resolution notes when structural blockers occur.

### 2. ⚡ Multi-Language Transpiler & Migration Core
* **Idiomatic Syntax Translation:** Converts code between language paradigms while retaining behavioral equivalence and idiomatic design patterns.
* **Language Rules Compliance:** Corrects target-specific constraints including static vs. dynamic typing, memory management, concurrency primitives, and standard library conventions.
* **Architectural Adaptations:** Emits structural modification insights explaining type coercions and framework mapping choices.

---

## 🌐 Supported Programming Languages

| Domain | Languages Supported |
| :--- | :--- |
| **Systems & Low-Level** | `C`, `C++`, `Go` |
| **Enterprise & OOP** | `Java`, `C#`, `Swift` |
| **Dynamic & Scripting** | `Python`, `JavaScript`, `TypeScript`, `PHP`, `R` |
| **Web & Database** | `HTML5`, `CSS3`, `SQL` |

---

## 🏗️ Architecture & Technical Design


┌────────────────────────┐      HTTP / REST      ┌────────────────────────┐      Ollama API      ┌────────────────────────┐
│   Next.js 14 Frontend   │  ──────────────────►  │    FastAPI Backend     │  ──────────────────►  │ Local Ollama LLM Core  │
│  (Monaco Editor + TS)  │  ◄──────────────────  │  (LangChain + Pydantic)│  ◄──────────────────  │   (qwen2.5-coder:7b)   │
└────────────────────────┘                       └────────────────────────┘                       └────────────────────────┘




* **Frontend:** Next.js 14 (App Router), TypeScript, Tailwind CSS, `@monaco-editor/react`.
* **Backend Framework:** FastAPI, Uvicorn ASGI runtime, Pydantic for data validation.
* **AI Orchestration:** LangChain Core, `ChatOllama` wrapper enforcing JSON-mode responses.
* **LLM Engine:** Local Ollama runner with `qwen2.5-coder:7b`.

---

## 🛠️ Getting Started & Installation

### Prerequisites
- **Python:** `3.10+`
- **Node.js:** `18.x+`
- **Ollama Engine:** Download and install from [ollama.com](https://ollama.com)

### 1. Model Setup
Pull the coding model via terminal:
```bash
ollama pull qwen2.5-coder:7b






# Navigate to backend environment
python -m venv venv

# Activate Virtual Environment
# On Windows PowerShell:
.\venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install fastapi uvicorn pydantic langchain-ollama langchain-core

# Launch Backend API
python main.py







# Open a new terminal window
cd frontend
npm install
npm run dev



🛡️ Privacy & Security Strategy
Air-Gapped Operation: All model weights run 100% locally. Zero telemetry, tracking, or cloud outbound connections.

Zero Retention: Code snippets remain transient in RAM during evaluation and are never saved or stored.




