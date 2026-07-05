import json

from collector import get_latest_sysmon_events
from sysmon_evidence import extract_sysmon_evidence
from sysmon_detection_engine import analyze_sysmon
from risk_engine import calculate_risk
from incident_report import generate_report


events = get_latest_sysmon_events(limit=500)

print(f"Analyzed {len(events)} events\n")

reports_found = 0

for event in events:

    evidence = extract_sysmon_evidence(event)

    findings = analyze_sysmon(evidence)

    if not findings:
        continue

    risk = calculate_risk(evidence, findings)

    report = generate_report(evidence, findings, risk)

    reports_found += 1

    print("=" * 70)
    print(json.dumps(report, indent=4, ensure_ascii=False))
    print()

print(f"\nGenerated {reports_found} incident reports.")
