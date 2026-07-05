from datetime import datetime


def generate_report(evidence: dict, findings: list, risk: int):

    if risk >= 80:
        level = "Critical"
    elif risk >= 60:
        level = "High"
    elif risk >= 30:
        level = "Medium"
    else:
        level = "Low"

    mitre_ids = []
    mitre_tactics = []
    mitre_techniques = []

    for f in findings:
        if f.get("mitre_id"):
            mitre_ids.append(f["mitre_id"])
        if f.get("mitre_tactic"):
            mitre_tactics.append(f["mitre_tactic"])
        if f.get("mitre_technique"):
            mitre_techniques.append(f["mitre_technique"])

    return {
        "time": datetime.utcnow().isoformat() + "Z",
        "host": evidence.get("hostname"),
        "user": evidence.get("user"),
        "process": evidence.get("process_image"),

        "risk": risk,
        "level": level,
        "findings": findings,

        "mitre_ids": mitre_ids,
        "mitre_tactics": mitre_tactics,
        "mitre_techniques": mitre_techniques,

        "summary": f"{evidence.get('process_image')} -> {level} ({risk})"
    }