from models import Evidence


def extract_evidence(alert: dict) -> Evidence:

    win = alert["data"]["win"]
    system = win["system"]
    eventdata = win["eventdata"]
    rule = alert["rule"]

    return Evidence(
        timestamp=system["systemTime"],
        hostname=system["computer"],
        agent_name=alert["agent"]["name"],

        event_id=system["eventId"],
        severity=rule["level"],
        rule_name=rule["description"],

        source_ip=eventdata.get("ipAddress"),
        target_user=eventdata.get("targetUserName"),
        process_name=eventdata.get("processName"),
        logon_type=eventdata.get("logonType"),

        mitre_id=rule["mitre"]["id"][0],
        mitre_tactic=rule["mitre"]["tactic"][0],
        mitre_technique=rule["mitre"]["technique"][0],
    )