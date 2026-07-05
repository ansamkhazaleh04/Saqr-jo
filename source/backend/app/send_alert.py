import json
import requests

with open("../sample_data/sample_alert.json", "r", encoding="utf-8") as f:
    alert = json.load(f)

response = requests.post(
    "http://127.0.0.1:8000/alert",
    json=alert
)

print(response.status_code)
print(response.json())
