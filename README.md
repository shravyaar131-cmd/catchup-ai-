# CatchUp AI — “What Did I Miss?”

> **Intelligent Unread Chat Synthesizer & Triage Micro-App**  
> *Built for Hackathons • Zero Dependencies Required • Privacy-First Architecture*

---

## 🎯 Problem Statement
Returning to work or a project channel after hours away often means facing **80+ overwhelming unread messages** across Slack, Discord, Microsoft Teams, or WhatsApp. Users routinely miss:
- Critical blockers that stall work.
- Key decisions made in their absence.
- Urgent tasks assigned to them with tight deadlines.
- Time-sensitive announcements.

**CatchUp AI** solves this instantly by digesting raw chat transcripts and synthesizing them into an executive summary, critical decisions, evidence-backed blockers, assigned action items, and a prioritized triage matrix.

---

## ✨ Core Features

| Feature | Description |
| :--- | :--- |
| **💬 Multi-Format Chat Input** | Accepts raw copied transcripts from Slack (`[10:15 AM] Alice: ...`), Teams, WhatsApp (`10/09/2026, 14:15 - Bob: ...`), Discord, or plain `Name: Message` lines. |
| **⚡ 3 Instant Demo Scenarios** | 1-click test buttons for **Launch Crunch**, **Incident Response**, and **Weekly Product Sync**. |
| **🧠 AI Conversation Summary** | Identifies the primary discussion topic and produces 3–5 crisp, executive bullet points. |
| **📌 Decisions & Blockers** | Categorizes items into *Blockers*, *Decisions*, and *Announcements*—always displaying the **original message quote as supporting evidence**. |
| **✅ Action Items & Accountability** | Detects requested tasks and maps them to **explicitly mentioned owners**. Never invents missing assignees (marks `Unassigned / Team`). Never invents deadlines. |
| **⚖️ Priority Matrix & Rationale** | Triages items into **High**, **Medium**, and **Low** priority, accompanied by a clear 1-sentence explanation of *why* each item earned that priority (avoiding false urgency). |
| **📅 Confirmed vs. Ambiguous Deadlines** | Accurately distinguishes hard time commitments (`"by 12:30 PM"`, `"today at 6:00 PM"`) from tentative dates (`"sometime next week"`). |
| **📣 Direct @Mentions Cloud** | Surfaces all @mentioned handles and who called them out. |
| **🎨 Modern Dark Green/Teal UI** | Professional responsive dashboard with dark forest emerald accents, glassmorphic cards, priority color tags, and interactive task checkboxes. |
| **🔒 Privacy-First Guarantee** | Runs **100% locally in-browser by default** with zero data transmission. Optional Google Gemini or OpenAI mode clearly discloses external API calls. |

---

## 🚀 How to Run (Choose Any Method)

### Method 1: Instant 1-Click Launch (Easiest for Windows)
Simply double-click the **`start.bat`** file in this folder.  
It will automatically launch the local server and open CatchUp AI in your default web browser!

---

### Method 2: Zero-Install Direct Browser Open
1. Open this project folder in Windows File Explorer.
2. Double-click **`index.html`** (or right-click → *Open With* → Google Chrome / Microsoft Edge / Opera).
3. The app will open immediately. All NLP and heuristics run natively inside your browser with **0 dependencies**!

---

### Method 3: Windows PowerShell Server
Run the included PowerShell script (available out-of-the-box on every Windows PC):
```powershell
powershell -ExecutionPolicy Bypass -File server.ps1
```
The server will start at `http://localhost:8000/` and automatically pop up your browser.

---

### Method 4: Node.js or Python (If Installed)
- **Node.js**:
  ```bash
  node server.js
  ```
- **Python**:
  ```bash
  python server.py
  ```

---

## 🎤 Hackathon 2-Minute Judge Presentation Script

When demonstrating CatchUp AI to judges, follow this simple flow:

1. **The Hook (15s):**
   > *"Judges, raise your hand if you've ever returned to Slack after lunch to see 100+ unread messages and wondered: 'What did I actually miss that needs my attention right now?'"*
2. **The Problem (20s):**
   > *"People waste 20 minutes scrolling through small talk and emojis, while critical blockers and assigned deadlines get buried. Existing LLMs often hallucinate owners or mark everything as urgent."*
3. **The Live Demo (60s):**
   - Click **`⚡ Sample 1: Launch Crunch`**.
   - Show the live progress scanner as it processes the transcript.
   - Point out the **Primary Topic** spotlight: *"Notice how it detected the Stripe 500 error and launch freeze."*
   - Scroll to **Important Messages & Decisions**: *"Look at this blocker card—it quotes the exact evidence message from David so no context is lost."*
   - Scroll to **Action Items**: *"Notice that David is assigned because he explicitly committed to it, Priya was @mentioned, but the monitoring script is accurately labeled 'Unassigned'—we never hallucinate missing owners!"*
   - Point out the **Deadlines**: *"It differentiates 6:00 PM today as a Confirmed Deadline, while marketing influencer posts are flagged as Ambiguous ('sometime next week')."*
   - Check off an action item to show interactive productivity.
4. **Privacy & Architecture (25s):**
   - Point to the green status pill in the top-right:
   > *"Best of all, CatchUp AI is local-first. In default mode, all parsing happens right here on the client—no team conversations are stored or sent to 3rd-party servers. If a team wants cloud intelligence, they can connect Gemini with transparent disclosure."*

---

## 📁 Project Structure

```text
catchup-ai/
├── index.html          # Semantic, responsive HTML5 dashboard layout
├── styles.css          # Dark emerald/teal theme, glassmorphism, responsive grid
├── app.js              # Application controller, DOM rendering, export tools
├── ai-engine.js        # Local Heuristic NLP Engine + Cloud AI (Gemini/OpenAI) connector
├── sample-data.js      # 3 realistic hackathon test scenarios
├── server.ps1          # Zero-dependency Windows PowerShell local web server
├── start.bat           # 1-click Windows launcher
├── server.js           # Optional Node.js web server
├── server.py           # Optional Python web server
├── .env.example        # Template for API keys
├── .gitignore          # Git ignore rules for secrets and temporary files
└── README.md           # Documentation, architecture, and judge presentation guide
```

---

## 🔒 Privacy & Security Disclosures

- **Default Mode (Local Heuristic Engine):**  
  Your raw conversation transcripts are processed **100% locally in your browser session**. Zero bytes are sent across the internet, and nothing is persisted to any external database.
- **Cloud AI Mode (Google Gemini / OpenAI):**  
  If you opt into Cloud AI mode via the Settings drawer, requests are dispatched directly over HTTPS to the official Google or OpenAI API endpoints.
- **Key Safety:**  
  API keys are kept strictly in browser session memory. No secret keys are hardcoded in the frontend, committed to git, or sent to intermediate proxy servers.

---

## 🛠️ Testing Verification Checklist

- [x] Paste custom chat transcripts or click 3 pre-built realistic samples.
- [x] Extract primary topic and 3–5 bullet points.
- [x] Extract blockers, decisions, and announcements with supporting quotes.
- [x] Extract action items with explicit assignees and deadlines.
- [x] Triage items into High / Medium / Low with explicit reasoning.
- [x] Differentiate Confirmed vs. Ambiguous deadlines.
- [x] Interactive task completion checkbox.
- [x] Copy report to clipboard & download `.txt` export.
- [x] Verified zero dependencies required for instant execution.
