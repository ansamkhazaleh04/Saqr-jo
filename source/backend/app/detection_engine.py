def analyze(evidence):
    findings = []

    # Brute Force Detection
    if evidence.get("event_id") == "4625":
        findings.append({
            "title": "Failed Windows Logon",
            "severity": "Medium",
            "reason": "Windows authentication failure detected."
        })

    # MITRE Detection
    if evidence.get("mitre_id") == "T1110":
        findings.append({
            "title": "MITRE Technique Detected",
            "severity": "High",
            "reason": "Brute Force (T1110)"
        })

    return findings
