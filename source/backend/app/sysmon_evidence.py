def extract_sysmon_evidence(event: dict) -> dict:

    return {
        "event_id": event.get("Event ID"),
        "timestamp": event.get("Date"),
        "hostname": event.get("Computer"),
        "user": event.get("User Account") or event.get("User Name") or event.get("User"),

        "process_image": event.get("Image"),
        "command_line": event.get("CommandLine"),

        "parent_image": event.get("ParentImage"),
        "parent_command_line": event.get("ParentCommandLine"),
    }