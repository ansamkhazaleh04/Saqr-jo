# Saqr Incident Flow

## Objective

Describe how Saqr processes a security alert from the moment it is generated until it becomes an incident analysis.

---

## Step 1 - Receive Alert

Input:

- Wazuh Alert

Output:

- Parsed Alert

---

## Step 2 - Extract Indicators

Extract:

- Source IP
- Destination IP
- Username
- Hostname
- File Hash
- Process Name
- Event ID
- Timestamp

---

## Step 3 - Threat Intelligence

Query:

- VirusTotal
- AbuseIPDB
- Local Threat Cache

---

## Step 4 - MITRE Mapping

Identify:

- Tactic
- Technique
- Sub-Technique

---

## Step 5 - Correlation

Search for:

- Similar Alerts
- Same Host
- Same User
- Same Source IP
- Same Process
- Same Timeline

---

## Step 6 - AI Analysis

Generate:

- Incident Summary
- Attack Story
- Investigation Notes

---

## Step 7 - Analyst Review

The analyst reviews the findings.

The analyst decides whether:

- False Positive
- True Positive
- Escalation Required

---

## Step 8 - Final Incident

Generate:

- Incident Report
- Timeline
- MITRE Mapping
- IOC List
- Evidence