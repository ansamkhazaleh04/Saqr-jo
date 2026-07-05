from fastapi import FastAPI, Body
from fastapi.middleware.cors import CORSMiddleware
from database import get_all_incidents, init_db

app = FastAPI(title="Saqr-JO API")

init_db()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/api/incidents")
def list_incidents():
    rows = get_all_incidents()

    incidents = []
    for row in rows:
        incidents.append({
            "id": row[0],
            "time": row[1],
            "host": row[2],
            "user": row[3],
            "process": row[4],
            "risk": row[5],
            "level": row[6],
            "findings": row[7],
            "summary": row[8],
            "mitre_ids": row[9],
            "mitre_tactics": row[10],
            "mitre_techniques": row[11],
            "saved_at": row[12],
        })

    return incidents


@app.post("/api/chat")
def chat(payload: dict = Body(...)):
    question = (payload.get("question") or "").strip().lower()

    rows = get_all_incidents()

    if not rows:
        return {"answer": "لا توجد حوادث مسجلة بعد في النظام."}

    latest = rows[0]
    (id_, time_, host, user, process, risk, level, findings,
     summary, mitre_ids, mitre_tactics, mitre_techniques, saved_at) = latest

    if any(k in question for k in ["مصدر", "source", "بدأ", "من اين", "من أين"]):
        answer = f"الحادثة الأخيرة (SAQR-{id_}) صدرت من العملية '{process}' على الجهاز '{host}'، تحت المستخدم '{user}'."

    elif any(k in question for k in ["خطورة", "risk", "severity", "درجة"]):
        answer = f"درجة الخطورة المحسوبة لهذه الحادثة هي {risk}/100، وتُصنَّف كمستوى '{level}'."

    elif any(k in question for k in ["mitre", "تكتيك", "تقنية", "technique"]):
        mid = mitre_ids or "غير محدد"
        mtac = mitre_tactics or "غير محدد"
        mtech = mitre_techniques or "غير محدد"
        answer = f"ترتبط هذه الحادثة بتصنيف MITRE ATT&CK التالي — المعرف: {mid}، التكتيك: {mtac}، التقنية: {mtech}."

    elif any(k in question for k in ["ماذا افعل", "ماذا أفعل", "توصية", "اجراء", "إجراء", "action", "خطوة"]):
        if level in ("Critical", "High"):
            answer = "أوصي بالتحقيق الفوري: عزل الجهاز المتأثر مؤقتاً، مراجعة العملية والمستخدم المسؤول، والتحقق من سجل الأوامر الكامل قبل اتخاذ أي قرار نهائي."
        else:
            answer = "المستوى الحالي لا يستدعي إجراءً عاجلاً، لكن يُنصح بمراقبة النشاط ومراجعة السياق قبل إغلاق الحادثة."

    else:
        answer = f"ملخص الحادثة الأخيرة: {summary}"

    return {"answer": answer}


@app.get("/")
def root():
    return {"status": "Saqr API is running"}