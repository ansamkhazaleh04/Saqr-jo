import json

from evidence_extractor import extract_evidence
from detection_engine import analyze
from risk_engine import calculate_risk
from incident_report import generate_report

with open("../sample_data/sample_alert.json", "r") as file:
    alert = json.load(file)

evidence = extract_evidence(alert)

print("=== Evidence ===")
print(evidence.model_dump_json(indent=4))

findings = analyze(evidence.model_dump())

print("\n=== Detection Results ===")
for finding in findings:
    print(finding)

risk = calculate_risk(evidence.model_dump())

print("\n=== Risk Score ===")
print(f"{risk}/100")

report = generate_report(evidence.model_dump(), findings, risk)

print("\n=== Incident Report ===")
print(json.dumps(report, indent=4, ensure_ascii=False))
