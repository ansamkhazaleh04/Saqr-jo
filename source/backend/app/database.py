import sqlite3
from datetime import datetime


DB_NAME = "saqr.db"


def init_db():
    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS incidents (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            time TEXT,
            host TEXT,
            user TEXT,
            process TEXT,
            risk INTEGER,
            level TEXT,
            findings TEXT,
            summary TEXT,
            mitre_ids TEXT,
            mitre_tactics TEXT,
            mitre_techniques TEXT,
            saved_at TEXT
        )
    """)

    conn.commit()
    conn.close()


def save_incident(report: dict):
    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()

    findings_text = "; ".join(
        f"{f.get('title')} ({f.get('severity')})" for f in report.get("findings", [])
    )

    mitre_ids_text = ", ".join(report.get("mitre_ids", []))
    mitre_tactics_text = ", ".join(report.get("mitre_tactics", []))
    mitre_techniques_text = ", ".join(report.get("mitre_techniques", []))

    cursor.execute("""
        INSERT INTO incidents (time, host, user, process, risk, level, findings, summary, mitre_ids, mitre_tactics, mitre_techniques, saved_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        report.get("time"),
        report.get("host"),
        report.get("user"),
        report.get("process"),
        report.get("risk"),
        report.get("level"),
        findings_text,
        report.get("summary"),
        mitre_ids_text,
        mitre_tactics_text,
        mitre_techniques_text,
        datetime.utcnow().isoformat() + "Z"
    ))

    conn.commit()
    conn.close()


def get_all_incidents():
    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM incidents ORDER BY id DESC")
    rows = cursor.fetchall()

    conn.close()
    return rows


if __name__ == "__main__":
    init_db()
    print("✅ Database initialized/updated: saqr.db")
    