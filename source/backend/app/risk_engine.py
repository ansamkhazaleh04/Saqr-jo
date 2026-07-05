def calculate_risk(evidence, findings=None):

    findings = findings or []
    score = 0

    for finding in findings:
        severity = finding.get("severity")

        if severity == "Critical":
            score += 40
        elif severity == "High":
            score += 25
        elif severity == "Medium":
            score += 15
        elif severity == "Low":
            score += 5

    process = (evidence.get("process_image") or "").lower()
    command = (evidence.get("command_line") or "").lower()

    if "powershell" in process:
        score += 10

    if "-enc" in command or "-encodedcommand" in command:
        score += 15

    score = max(0, min(score, 100))

    return score
