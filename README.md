# 🦅 Saqr-JO

**Saqr-JO** is an AI-assisted Windows Security Operations (SOC) Assistant that monitors a live endpoint via **Sysmon**, detects suspicious activity in real time, maps it to the **MITRE ATT&CK** framework, calculates a dynamic risk score, stores every incident persistently, and presents it all through a professional bilingual (Arabic/English) SOC dashboard — with a built-in AI assistant that answers questions about real, stored incident data.

Unlike a typical academic prototype relying on sample/simulated data, Saqr-JO runs against a **real live Windows endpoint**, capturing and analyzing actual system activity as it happens.

---

##  What Saqr-JO Does

```
Sysmon (Real Windows Endpoint)
        │
        ▼
Live Event Collector (5s polling)
        │
        ▼
Evidence Extraction
        │
        ▼
Detection Engine (rule-based, MITRE-mapped)
        │
        ▼
Risk Scoring Engine
        │
        ▼
SQLite Database (persistent storage)
        │
        ▼
FastAPI REST API
        │
        ▼
React Dashboard (Arabic/English) + Saqr AI Assistant
```

---

##  Implemented Features

- **Live Sysmon Monitoring** — continuously polls Windows Event Log (`Microsoft-Windows-Sysmon/Operational`) for new process activity, with no reliance on Wazuh or any external SIEM.
- **Evidence Extraction** — parses raw Sysmon events into structured evidence (process, command line, parent process, user, host, timestamp).
- **Detection Engine** — rule-based detection covering:
  - Encoded / obfuscated PowerShell execution
  - PowerShell security-bypass attempts (`-ExecutionPolicy Bypass`, hidden windows)
  - Known dual-use / "living-off-the-land" tools (`certutil`, `wmic`, `psexec`, `mimikatz`, etc.)
  - Suspicious parent-child process relationships (e.g. Office spawning PowerShell/cmd)
  - Execution from suspicious paths, with a trusted-process whitelist to reduce false positives
- **MITRE ATT&CK Mapping** — every detection is tagged with a real MITRE technique ID, tactic, and technique name (e.g. `T1059.001` — Execution — PowerShell).
- **Risk Scoring Engine** — computes a 0–100 risk score based on finding severity and behavioral indicators, classified as Low / Medium / High / Critical.
- **Persistent Storage** — every incident is saved to a local SQLite database (`saqr.db`), surviving restarts.
- **REST API (FastAPI)** — exposes stored incidents (`/api/incidents`) and a rule-based analysis endpoint (`/api/chat`) that answers questions grounded in real incident data.
- **SOC Dashboard (React + TypeScript + Tailwind)** — bilingual (Arabic/English, full RTL support), showing live KPIs, a real-time incident feed, MITRE ATT&CK weekly coverage, and an overall threat score — refreshing automatically every 5 seconds.
- **Attack Story View** — reconstructs a chronological timeline from real stored incidents (not a fixed script).
- **Saqr AI Assistant** — a chat interface that answers analyst questions ("What's the source of this attack?", "What's the risk level?", "Map it to MITRE", "What should I do?") using real data pulled live from the database.
- **One-click startup** (`start_saqr.bat`) — launches the API, the live monitor, and the frontend together.

---

##  Project Structure

```
Saqr-JO/
├── source/backend/app/
│   ├── collector.py                  # Live Sysmon event collector
│   ├── sysmon_evidence.py            # Evidence extraction
│   ├── sysmon_detection_engine.py    # Detection rules + MITRE mapping
│   ├── risk_engine.py                # Risk scoring
│   ├── incident_report.py            # Incident report generation
│   ├── database.py                   # SQLite persistence layer
│   ├── api.py                        # FastAPI REST API + AI chat endpoint
│   └── saqr_live.py                  # Real-time monitoring loop (main entry point)
│
├── frontend/
│   ├── src/App.tsx                   # Full SOC dashboard UI (React + Tailwind)
│   └── imports/Saqr-JO1.png          # Saqr logo
│
└── start_saqr.bat                    # One-click launcher for all services
```

> **Note:** The project also includes an earlier Wazuh-based pipeline (`evidence_extractor.py`, `detection_engine.py`, `receiver.py`, `send_alert.py`, `wazuh_client.py`, etc.) kept for reference. The current, active pipeline is the Sysmon-based one listed above.

---

##  Running Saqr-JO

### Requirements
- Windows 10/11 with [Sysmon](https://learn.microsoft.com/en-us/sysinternals/downloads/sysmon) installed
- Python 3.10+
- Node.js (LTS)

### Setup

```bash
# Backend
cd source/backend/app
pip install fastapi uvicorn pywin32

# Frontend
cd frontend
npm install
```

### Run everything with one click

Double-click `start_saqr.bat` (Run as Administrator — Sysmon log access requires elevated privileges) from the project root. This launches:

1. The FastAPI backend on `http://127.0.0.1:8000`
2. The live Sysmon monitor (`saqr_live.py`)
3. The React frontend, opened automatically in your browser

---

##  Technology Stack

- **Backend:** Python, FastAPI, SQLite, pywin32
- **Detection:** Sysmon, Windows Event Log, MITRE ATT&CK
- **Frontend:** React, TypeScript, Tailwind CSS, Vite

---

##  Roadmap / Future Work

- Real LLM-powered analysis (Anthropic/OpenAI integration) for the Saqr AI assistant, replacing the current rule-based responder
- Expanded event coverage (network connections, file creation, registry modification — currently limited to process creation/termination)
- Attack-chain correlation across multiple related incidents
- Multi-host support (currently single-endpoint)
- Cloud/remote deployment beyond localhost

---

##  Author

Developed by **Ansam Walid Al-Khazaleh**

> *"Assist the analyst, not replace the analyst."*