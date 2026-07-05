from pydantic import BaseModel
from typing import Optional


class Evidence(BaseModel):
    timestamp: str
    hostname: str
    agent_name: str

    event_id: str
    severity: int
    rule_name: str

    source_ip: Optional[str] = None
    target_user: Optional[str] = None
    process_name: Optional[str] = None
    logon_type: Optional[str] = None

    mitre_id: Optional[str] = None
    mitre_tactic: Optional[str] = None
    mitre_technique: Optional[str] = None