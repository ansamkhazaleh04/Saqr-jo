from fastapi import FastAPI, Request
import uvicorn

from evidence_extractor import extract_evidence
from detection_engine import analyze
from risk_engine import calculate_risk
from incident_report import generate_report

app = FastAPI()


@app.post("/alert")
async def receive_alert(request: Request):

    alert = await request.json()

    evidence = extract_evidence(alert)

    findings = analyze(evidence.model_dump())

    risk = calculate_risk(evidence.model_dump())

    report = generate_report(
        evidence.model_dump(),
        findings,
        risk
    )

    print("\n========== NEW ALERT ==========")
    print(report)

    return {
        "status": "received",
        "risk": risk,
        "summary": report["summary"]
    }


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
    