SUSPICIOUS_TOOL_NAMES = [
    "mimikatz",
    "psexec",
    "certutil",
    "regsvr32",
    "wmic",
    "bitsadmin",
    "cscript",
    "wscript",
]

ENCODED_POWERSHELL_FLAGS = [
    "-enc",
    "-e ",
    "-encodedcommand",
]

POWERSHELL_BYPASS_FLAGS = [
    "-noprofile",
    "-windowstyle hidden",
    "-executionpolicy bypass",
    "-nop -w hidden",
]

SUSPICIOUS_PARENT_CHILD = [
    ("winword.exe", "powershell.exe"),
    ("winword.exe", "cmd.exe"),
    ("excel.exe", "powershell.exe"),
    ("excel.exe", "cmd.exe"),
    ("outlook.exe", "powershell.exe"),
    ("outlook.exe", "cmd.exe"),
]

SUSPICIOUS_PATHS = [
    "\\AppData\\Local\\Temp",
    "\\Downloads",
    "\\Users\\Public",
]

TRUSTED_PROCESS_NAMES = [
    "zoom.exe",
    "discord.exe",
    "slack.exe",
    "teams.exe",
    "spotify.exe",
    "onedrive.exe",
    "code.exe",
    "chrome.exe",
    "msedge.exe",
    "firefox.exe",
]


def is_trusted(process_image: str) -> bool:
    for trusted in TRUSTED_PROCESS_NAMES:
        if trusted in process_image:
            return True
    return False


def analyze_sysmon(evidence: dict) -> list:
    findings = []

    process_image = (evidence.get("process_image") or "").lower()
    command_line = (evidence.get("command_line") or "").lower()
    parent_image = (evidence.get("parent_image") or "").lower()

    process_is_trusted = is_trusted(process_image)

    for tool in SUSPICIOUS_TOOL_NAMES:
        if tool in process_image or tool in command_line:
            findings.append({
                "title": "Suspicious Tool Detected",
                "severity": "High",
                "reason": f"Detected usage of '{tool}'",
                "mitre_id": "T1105",
                "mitre_tactic": "Command and Control",
                "mitre_technique": "Ingress Tool Transfer",
            })
            break

    if "powershell" in process_image:
        for flag in ENCODED_POWERSHELL_FLAGS:
            if flag in command_line:
                findings.append({
                    "title": "Encoded PowerShell Command",
                    "severity": "Critical",
                    "reason": f"PowerShell executed with encoded flag '{flag.strip()}'",
                    "mitre_id": "T1059.001",
                    "mitre_tactic": "Execution",
                    "mitre_technique": "PowerShell",
                })
                break

        for flag in POWERSHELL_BYPASS_FLAGS:
            if flag in command_line:
                findings.append({
                    "title": "PowerShell Security Bypass Attempt",
                    "severity": "High",
                    "reason": f"PowerShell executed with bypass flag '{flag.strip()}'",
                    "mitre_id": "T1562.001",
                    "mitre_tactic": "Defense Evasion",
                    "mitre_technique": "Disable or Modify Tools",
                })
                break

    for parent, child in SUSPICIOUS_PARENT_CHILD:
        if parent in parent_image and child in process_image:
            findings.append({
                "title": "Suspicious Parent-Child Process",
                "severity": "Critical",
                "reason": f"'{parent}' spawned '{child}' (possible macro/exploit execution)",
                "mitre_id": "T1204.002",
                "mitre_tactic": "Execution",
                "mitre_technique": "Malicious File",
            })
            break

    if not process_is_trusted:
        for path in SUSPICIOUS_PATHS:
            if path.lower() in process_image:
                findings.append({
                    "title": "Process Running From Suspicious Path",
                    "severity": "Medium",
                    "reason": f"Process executed from {path}",
                    "mitre_id": "T1036.005",
                    "mitre_tactic": "Defense Evasion",
                    "mitre_technique": "Masquerading",
                })
                break

    return findings
