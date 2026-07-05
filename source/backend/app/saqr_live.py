import time
from collector import get_latest_sysmon_events
from sysmon_evidence import extract_sysmon_evidence
from sysmon_detection_engine import analyze_sysmon
from risk_engine import calculate_risk
from incident_report import generate_report
from database import init_db, save_incident


CHECK_INTERVAL_SECONDS = 5
FETCH_LIMIT = 20

init_db()

seen_keys = set()


def make_unique_key(event: dict) -> str:
    return f"{event.get('Event ID')}|{event.get('Date')}|{event.get('ProcessId')}"


print("🦅 Saqr LIVE Monitoring Started")
print(f"Checking Sysmon every {CHECK_INTERVAL_SECONDS} seconds...\n")
print("Press CTRL+C to stop.\n")

try:
    while True:

        events = get_latest_sysmon_events(limit=FETCH_LIMIT)

        new_events = []

        for event in events:
            key = make_unique_key(event)
            if key not in seen_keys:
                seen_keys.add(key)
                new_events.append(event)

        for event in new_events:

            evidence = extract_sysmon_evidence(event)
            findings = analyze_sysmon(evidence)

            if not findings:
                continue

            risk = calculate_risk(evidence, findings)
            report = generate_report(evidence, findings, risk)

            print("\n================ NEW ALERT ================\n")
            print(report)
            save_incident(report)

        time.sleep(CHECK_INTERVAL_SECONDS)

except KeyboardInterrupt:
    print("\n\n🛑 Saqr Monitoring Stopped.")
    