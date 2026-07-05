# Saqr-JO System Architecture

## Core Modules

### 1. Alert Receiver
Receives alerts from Wazuh.

---

### 2. Alert Parser
Extracts important information from alerts.

---

### 3. IOC Extractor
Extracts Indicators of Compromise (IP, Hash, Domain, URL, User, Process).

---

### 4. Threat Intelligence Engine
Checks IOCs using external intelligence sources.

Examples:

- VirusTotal
- AbuseIPDB
- OTX

---

### 5. MITRE Mapping Engine
Maps alerts to MITRE ATT&CK tactics and techniques.

---

### 6. Correlation Engine
Connects multiple related alerts into one incident.

---

### 7. Intelligence Engine
Analyzes all collected evidence and generates a contextual explanation.

---

### 8. Incident Builder
Creates the final incident.

Includes:

- Timeline
- Evidence
- IOCs
- MITRE
- AI Summary

---

### 9. Analyst Console

Displays everything to the SOC analyst.