from collector import get_latest_sysmon_events
from sysmon_evidence import extract_sysmon_evidence
from sysmon_detection_engine import analyze_sysmon
from risk_engine import calculate_risk
from incident_report import generate_report


print(" Saqr LIVE Sysmon Monitoring Started...\n")

events = get_latest_sysmon_events(limit=50)

print(f"Fetched {len(events)} raw events\n")

alerts = 0

for event in events:

    evidence = extract_sysmon_evidence(event)
    findings = analyze_sysmon(evidence)
    risk = calculate_risk(evidence, findings)
    report = generate_report(evidence, findings, risk)

    if findings:
        alerts += 1
        print("\n================ NEW ALERT ================\n")
        print(report)

print(f"\n✔ Finished. Alerts: {alerts}/{len(events)}")
