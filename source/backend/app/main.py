from fastapi import FastAPI

app = FastAPI(
    title="Saqr-JO",
    description="AI-Powered SOC Assistant",
    version="0.1.0"
)


@app.get("/")
def home():
    return {
        "project": "Saqr-JO",
        "status": "Running",
        "version": "0.1.0"
    }