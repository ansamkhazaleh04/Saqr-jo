import React, { useState, useRef, useEffect } from "react";
import {
  AlertTriangle, CheckCircle2, Clock, Brain,
  MessageSquare, ChevronRight, Activity, Send,
  Server, Network, User, AlertOctagon,
  GitBranch, BarChart2, Eye, Layers,
  Terminal, Copy, RefreshCw, Globe,
  Bell, Settings, TrendingUp,
} from "lucide-react";
import saqrLogo from "../imports/Saqr-JO1.png";

// ── Tokens ─────────────────────────────────────────────
const C = {
  bg:        "#05101e",
  card:      "#0a1a2e",
  cardAlt:   "#0d2040",
  border:    "#0e2a45",
  borderHi:  "#174060",
  text:      "#d6eaf8",
  muted:     "#5a8aaa",
  mutedHi:   "#8ab4cc",
  sidebar:   "#03090f",
  cyan:      "#00b4d8",
  cyanHi:    "#48cae4",
  cyanDim:   "#0096c7",
  red:       "#ef4444",
  brand:     "#c8102e",
  amber:     "#f59e0b",
  green:     "#10b981",
  violet:    "#7c3aed",
  terminal:  "#010b14",
};

type Page = "dashboard" | "alert" | "story" | "chat";
type Sev  = "critical" | "high" | "medium" | "low";
type Lang = "ar" | "en";

// ── i18n ───────────────────────────────────────────────
const tx = {
  brand:            { ar: "صقر",                              en: "Saqr"                            },
  brandSub:         { ar: "SAQR-JO · مساعد SOC الذكي",       en: "SAQR-JO · AI SOC Assistant"      },
  activeIncident:   { ar: "حادثة نشطة",                      en: "Active Incident"                  },
  navDashboard:     { ar: "لوحة التحكم",                     en: "Dashboard"                        },
  navAlert:         { ar: "تحليل التنبيه",                   en: "Alert Analysis"                   },
  navStory:         { ar: "قصة الهجوم",                      en: "Attack Story"                     },
  navChat:          { ar: "صقر AI",                          en: "Saqr AI"                          },
  navBell:          { ar: "التنبيهات",                       en: "Notifications"                    },
  navSettings:      { ar: "الإعدادات",                       en: "Settings"                         },
  analyst:          { ar: "محلل أمن سيبراني",                en: "Cybersecurity Analyst"            },
  socLevel:         { ar: "SOC المستوى الأول",               en: "SOC Level 1"                      },
  threatCritical:   { ar: "مستوى التهديد: حرج",             en: "Threat Level: Critical"           },
  dashTitle:        { ar: "لوحة مراقبة العمليات الأمنية",   en: "Security Operations Dashboard"   },
  dashSub:          { ar: "لوحة مراقبة العمليات الأمنية",           en: "Security Operations Dashboard"    },
  kpiCritical:      { ar: "تنبيهات حرجة",                   en: "Critical Alerts"                  },
  kpiHigh:          { ar: "تنبيهات عالية",                  en: "High Alerts"                      },
  kpiInvestigating: { ar: "قيد التحقيق",                    en: "Investigating"                    },
  kpiResolved:      { ar: "محلولة اليوم",                   en: "Resolved Today"                   },
  recentAlerts:     { ar: "التنبيهات الحديثة",              en: "Recent Alerts"                    },
  viewAll:          { ar: "عرض الكل",                       en: "View All"                         },
  mitreTitle:       { ar: "MITRE ATT&CK — هذا الأسبوع",    en: "MITRE ATT&CK — This Week"        },
  threatScore:      { ar: "مؤشر الخطورة الكلي",            en: "Overall Threat Score"             },
  detQuality:       { ar: "جودة الرصد",                     en: "Detection Quality"                },
  respSpeed:        { ar: "سرعة الاستجابة",                 en: "Response Speed"                   },
  mitreCov:         { ar: "تغطية MITRE",                    en: "MITRE Coverage"                   },
  high2:            { ar: "مرتفع",                          en: "High"                             },
  assign:           { ar: "تعيين لي",                       en: "Assign to Me"                     },
  closeAlert:       { ar: "إغلاق",                          en: "Close"                            },
  urgentAction:     { ar: "إجراء عاجل 🚨",                  en: "🚨 Urgent Action"                 },
  saqrAnalysis:     { ar: "تحليل صقر AI",                   en: "Saqr AI Analysis"                 },
  confidence:       { ar: "ثقة",                            en: "Confidence"                       },
  poweredBy:        { ar: "مدعوم بـ MITRE ATT&CK v14",     en: "Powered by MITRE ATT&CK v14"     },
  mitreMap:         { ar: "MITRE ATT&CK Mapping",           en: "MITRE ATT&CK Mapping"            },
  rawLog:           { ar: "السجل الخام",                    en: "Raw Log"                          },
  copy:             { ar: "نسخ",                            en: "Copy"                             },
  copied:           { ar: "تم النسخ ✓",                     en: "Copied ✓"                         },
  hide:             { ar: "إخفاء",                          en: "Hide"                             },
  show:             { ar: "عرض",                            en: "Show"                             },
  clickLog:         { ar: "انقر لعرض السجل الخام",          en: "Click to view raw log"            },
  iocs:             { ar: "مؤشرات الاختراق (IOCs)",         en: "Indicators of Compromise (IOCs)" },
  actions:          { ar: "الإجراءات الموصى بها",           en: "Recommended Actions"              },
  similar:          { ar: "تنبيهات مشابهة",                 en: "Similar Alerts"                   },
  storyTitle:       { ar: "قصة الهجوم",                     en: "Attack Story"                     },
  storySub:         { ar: "إعادة بناء سلسلة الأحداث · INC-2024-047 · بناءً على تحليل صقر AI وإطار MITRE ATT&CK", en: "Event chain reconstruction · INC-2024-047 · Based on Saqr AI & MITRE ATT&CK analysis" },
  chainInitial:     { ar: "الوصول الأولي",                  en: "Initial Access"                   },
  chainExec:        { ar: "التنفيذ",                        en: "Execution"                        },
  chainCred:        { ar: "بيانات الاعتماد",                en: "Cred. Access"                     },
  chainLateral:     { ar: "الحركة الجانبية",               en: "Lateral Movement"                 },
  chainImpact:      { ar: "التأثير",                        en: "Impact"                           },
  nowLabel:         { ar: "← الآن",                         en: "← Now"                            },
  predictedLabel:   { ar: "[متوقع]",                        en: "[Predicted]"                      },
  chatTitle:        { ar: "صقر AI — مساعد SOC الذكي",       en: "Saqr AI — SOC Assistant"          },
  chatStatus:       { ar: "متصل · يحلل INC-2024-047",      en: "Connected · Analyzing INC-2024-047" },
  chatContext:      { ar: "السياق: INC-2024-047 · Lateral Movement via PsExec · WIN-DC01 · APT-29", en: "Context: INC-2024-047 · Lateral Movement via PsExec · WIN-DC01 · APT-29" },
  chatPlaceholder:  { ar: "اسأل صقر عن هذا الحادث...",     en: "Ask Saqr about this incident..."  },
  chatDisclaimer:   { ar: "صقر يستخدم بيانات SIEM الحقيقية. تحقق دائماً قبل اتخاذ إجراءات.", en: "Saqr uses real SIEM data. Always verify before taking action." },
  chatAnalyzing:    { ar: "جاري تحليل سؤالك ومعالجة البيانات المتاحة...", en: "Analyzing your query and processing available data..." },
  copyright:        { ar: "© 2026 Saqr-JO · جميع الحقوق محفوظة · أنسام الخزاعلة", en: "© 2026 Saqr-JO · All Rights Reserved · Ansam Al-Khazaeleh" },
};

const t = (key: keyof typeof tx, lang: Lang) => tx[key][lang];

// ── Severity config ────────────────────────────────────
const SEV: Record<Sev, { label: Record<Lang, string>; color: string; textCls: string; bgCls: string; borderCls: string }> = {
  critical: { label: { ar: "حرج",   en: "Critical" }, color: C.red,   textCls: "text-red-400",     bgCls: "bg-red-500/10",     borderCls: "border-red-500/30"     },
  high:     { label: { ar: "عالي",  en: "High"     }, color: C.amber, textCls: "text-amber-400",   bgCls: "bg-amber-500/10",   borderCls: "border-amber-500/30"   },
  medium:   { label: { ar: "متوسط", en: "Medium"   }, color: C.cyan,  textCls: "text-cyan-400",    bgCls: "bg-cyan-500/10",    borderCls: "border-cyan-500/30"    },
  low:      { label: { ar: "منخفض", en: "Low"      }, color: C.green, textCls: "text-emerald-400", bgCls: "bg-emerald-500/10", borderCls: "border-emerald-500/30" },
};

// ── Data ───────────────────────────────────────────────
const ALERTS = [
  {
    id: "INC-2024-047", sev: "critical" as Sev,
    ar: "حركة جانبية عبر PsExec",         en: "Lateral Movement via PsExec",
    host: "WIN-DC01",  user: "corp\\admin",        srcIp: "192.168.1.105", dstIp: "192.168.1.10",
    src: "Microsoft Sentinel", ago: { ar: "منذ 3 دقائق", en: "3 min ago" }, time: "14:32",
    status: { ar: "مفتوح", en: "Open" },
    mitre: ["T1021.002", "T1078", "T1570"],
    iocs: [
      { type: "IP",      value: "192.168.1.105",  rep: "Malicious"   },
      { type: "Process", value: "psexec.exe",      rep: "Suspicious"  },
      { type: "Hash",    value: "3f4a8b2c…e9f0",  rep: "Malicious"   },
      { type: "User",    value: "corp\\admin",     rep: "Compromised" },
    ],
    rawLog: `EventID: 4688\nTimeCreated: 2024-01-15T14:32:07Z\nComputer: WIN-DC01\nSubjectUserName: admin\nSubjectDomainName: CORP\nNewProcessName: C:\\Windows\\PSEXESVC.exe\nParentProcess: C:\\Windows\\System32\\cmd.exe\nCommandLine: psexec \\\\WIN-DC01 -u CORP\\admin cmd.exe\nSourceIPAddress: 192.168.1.105`,
    analysisAr: "رصد صقر نشاطاً يشير إلى حركة جانبية ممنهجة. قام المهاجم باستخدام أداة PsExec مع بيانات اعتماد مخترقة للتنقل من LAPTOP-MK02 إلى Domain Controller. هذا يمثل مرحلة متقدمة من سلسلة الهجوم ويستوجب استجابة فورية لمنع وصول المهاجم إلى موارد الشبكة بالكامل.",
    analysisEn: "Saqr detected systematic lateral movement. The attacker used PsExec with compromised credentials to pivot from LAPTOP-MK02 to the Domain Controller. This represents an advanced stage of the attack chain requiring immediate response to prevent full network compromise.",
    actions: {
      ar: ["عزل WIN-DC01 من الشبكة فوراً", "إيقاف حساب corp\\admin وإعادة تعيين كلمة المرور", "حجب IP 192.168.1.105 على جدار الحماية", "جمع صورة جنائية (forensic image) من WIN-DC01", "مسح ذاكرة LAPTOP-MK02 للبحث عن أدوات إضافية", "مراجعة سجلات Domain Controller للـ 24 ساعة الماضية"],
      en: ["Isolate WIN-DC01 from network immediately", "Disable corp\\admin account and reset credentials", "Block 192.168.1.105 on firewall", "Collect forensic image from WIN-DC01", "Scan LAPTOP-MK02 memory for additional tools", "Review Domain Controller logs for past 24 hours"],
    },
  },
  {
    id: "INC-2024-046", sev: "high" as Sev,
    ar: "تنفيذ PowerShell مريب",            en: "Suspicious PowerShell Execution",
    host: "LAPTOP-MK02", user: "mkhaled@corp.jo",   srcIp: "192.168.2.88", dstIp: "185.220.101.47",
    src: "CrowdStrike EDR", ago: { ar: "منذ 48 دقيقة", en: "48 min ago" }, time: "13:47",
    status: { ar: "قيد التحقيق", en: "Investigating" },
    mitre: ["T1059.001", "T1027", "T1086"],
    iocs: [
      { type: "Process", value: "powershell.exe",  rep: "Suspicious" },
      { type: "Hash",    value: "d9f3c2a1…7e4d",   rep: "Malicious"  },
      { type: "IP",      value: "185.220.101.47",  rep: "Malicious"  },
    ],
    rawLog: `EventID: 4104\nTimeCreated: 2024-01-15T13:47:22Z\nComputer: LAPTOP-MK02\nScriptBlockText: powershell -enc JABjACAAPQAgACcAaAB0...\nHostApplication: powershell.exe\nCommandLine: powershell.exe -NonInteractive -enc [BASE64]`,
    analysisAr: "رصد تنفيذ أمر PowerShell مشفر بصيغة Base64 يحتوي على كود خبيث. التحليل يشير إلى محاولة تنزيل payload من خادم C2 على 185.220.101.47 المرتبط بـ APT-29.",
    analysisEn: "Detected execution of Base64-encoded PowerShell containing malicious code. Analysis indicates an attempt to download a payload from C2 server at 185.220.101.47, associated with APT-29.",
    actions: {
      ar: ["عزل LAPTOP-MK02 فوراً", "فك تشفير الأمر Base64 وتحليل المحتوى", "حجب IP 185.220.101.47", "فحص كامل للجهاز بحثاً عن persistence"],
      en: ["Isolate LAPTOP-MK02 immediately", "Decode Base64 command and analyze content", "Block 185.220.101.47", "Full system scan for persistence mechanisms"],
    },
  },
  {
    id: "INC-2024-045", sev: "high" as Sev,
    ar: "هجوم Brute Force على RDP",          en: "Brute Force Attack on RDP",
    host: "SRV-RDP-01", user: "multiple",             srcIp: "45.33.32.156", dstIp: "10.0.0.5",
    src: "FortiSIEM", ago: { ar: "منذ ساعتين", en: "2 hours ago" }, time: "12:15",
    status: { ar: "قيد التحقيق", en: "Investigating" },
    mitre: ["T1110", "T1021.001"],
    iocs: [{ type: "IP", value: "45.33.32.156", rep: "Malicious" }],
    rawLog: `450 failed login attempts in 10 min\nSourceIP: 45.33.32.156 (Tor Exit Node)\nTargetService: RDP (3389)\nTargetHost: SRV-RDP-01`,
    analysisAr: "رصد 450+ محاولة دخول فاشلة خلال 10 دقائق من عنوان IP مرتبط بـ Tor Exit Node. يُرجح هجوم Password Spray ممنهج.",
    analysisEn: "Detected 450+ failed login attempts in 10 minutes from a Tor Exit Node IP. Likely a systematic Password Spray attack targeting RDP.",
    actions: {
      ar: ["حجب IP 45.33.32.156 فوراً", "تفعيل MFA على خدمات RDP", "تغيير منفذ RDP إلى منفذ غير قياسي", "مراجعة سياسة قفل الحسابات"],
      en: ["Block 45.33.32.156 immediately", "Enable MFA on all RDP services", "Change RDP port to non-standard", "Review account lockout policy"],
    },
  },
  {
    id: "INC-2024-044", sev: "medium" as Sev,
    ar: "استعلامات DNS غير طبيعية",          en: "Anomalous DNS Queries",
    host: "WS-42", user: "user42@corp.jo",         srcIp: "192.168.5.42", dstIp: "8.8.8.8",
    src: "Cisco Umbrella", ago: { ar: "منذ 3 ساعات", en: "3 hours ago" }, time: "11:30",
    status: { ar: "قيد المراجعة", en: "Reviewing" },
    mitre: ["T1071.004", "T1568"],
    iocs: [
      { type: "Domain", value: "cdn-js[.]net",  rep: "Suspicious" },
      { type: "Domain", value: "evil-c2[.]ru",  rep: "Malicious"  },
    ],
    rawLog: `DNS Query: cdn-js.net -> NXDOMAIN (x47)\nDNS Query: evil-c2.ru -> 185.220.101.47\nSourceHost: WS-42 (192.168.5.42)`,
    analysisAr: "رصد استعلامات DNS متكررة لنطاقات مرتبطة بخوادم C2. نمط الاستعلامات يشير إلى محاولة DNS Tunneling.",
    analysisEn: "Detected repeated DNS queries to C2-associated domains. Query pattern suggests DNS Tunneling attempt.",
    actions: {
      ar: ["حجب النطاقات على DNS Firewall", "فحص WS-42 بحثاً عن malware", "تفعيل DNS logging الكامل"],
      en: ["Block domains on DNS Firewall", "Scan WS-42 for malware", "Enable full DNS logging"],
    },
  },
  {
    id: "INC-2024-043", sev: "low" as Sev,
    ar: "رصد USB غير مصرح به",               en: "Unauthorized USB Detected",
    host: "LAPTOP-HR03", user: "hrahmad@corp.jo",     srcIp: "192.168.3.15", dstIp: "—",
    src: "MS Defender", ago: { ar: "منذ 4 ساعات", en: "4 hours ago" }, time: "10:05",
    status: { ar: "مغلق", en: "Closed" },
    mitre: ["T1052.001"],
    iocs: [{ type: "Device", value: "USB VID_090C PID_1000", rep: "Unknown" }],
    rawLog: `Device: USB Mass Storage\nVID: 090C  PID: 1000\nUser: hrahmad\nHost: LAPTOP-HR03`,
    analysisAr: "تم توصيل جهاز USB خارجي بحاسوب في قسم الموارد البشرية. لم يُرصد نقل ملفات مشبوه.",
    analysisEn: "External USB device connected to HR department computer. No suspicious file transfer detected.",
    actions: {
      ar: ["التحدث مع الموظف للتحقق من الغرض", "مراجعة سجلات نقل الملفات", "تطبيق سياسة قفل USB"],
      en: ["Interview employee to verify purpose", "Review file transfer logs", "Apply USB lockdown policy"],
    },
  },
];

type AlertData = typeof ALERTS[number];

const TIMELINE = [
  { time: "11:22", ar: "استلام بريد تصيد احتيالي",    en: "Phishing Email Received",           tactic: "Initial Access",    tech: "T1566.001", host: "LAPTOP-MK02", state: "done"      },
  { time: "11:35", ar: "تنفيذ ماكرو خبيث في Word",     en: "Malicious Macro Executed",          tactic: "Execution",         tech: "T1204.002", host: "LAPTOP-MK02", state: "done"      },
  { time: "11:36", ar: "تنزيل payload عبر PowerShell", en: "Encoded PowerShell Download",       tactic: "Execution",         tech: "T1059.001", host: "LAPTOP-MK02", state: "done"      },
  { time: "12:10", ar: "سرقة بيانات اعتماد من LSASS", en: "LSASS Memory Dumped",               tactic: "Credential Access", tech: "T1003.001", host: "LAPTOP-MK02", state: "done"      },
  { time: "14:32", ar: "حركة جانبية عبر PsExec",        en: "Lateral Movement via PsExec",      tactic: "Lateral Movement",  tech: "T1021.002", host: "WIN-DC01",    state: "current"   },
  { time: "—",     ar: "نشر برنامج فدية (متوقع)",       en: "Ransomware Deployment (Predicted)", tactic: "Impact",            tech: "T1486",     host: "Multiple",    state: "predicted" },
];

const MITRE_GRID = [
  { ar: "الوصول الأولي",   en: "Initial Access",   n: 3 }, { ar: "التنفيذ",           en: "Execution",       n: 5 }, { ar: "الثبات",           en: "Persistence",    n: 1 },
  { ar: "رفع الصلاحيات",  en: "Privilege Esc.",   n: 2 }, { ar: "التهرب الدفاعي",   en: "Defense Evasion", n: 4 }, { ar: "بيانات الاعتماد", en: "Cred. Access",   n: 2 },
  { ar: "الاستكشاف",       en: "Discovery",        n: 3 }, { ar: "الحركة الجانبية",  en: "Lateral Move.",   n: 6 }, { ar: "جمع البيانات",     en: "Collection",     n: 1 },
  { ar: "C&C",              en: "C2",               n: 3 }, { ar: "تسريب البيانات",   en: "Exfiltration",    n: 0 }, { ar: "التأثير",          en: "Impact",         n: 0 },
];

const CHAT_INIT: { role: string; text: string; time: string }[] = [
  { role: "user", text: "صقر، ما هو مصدر الهجوم الحالي؟",                 time: "14:33" },
  { role: "saqr", text: "بناءً على تحليل IOCs المستخرجة، بدأ الهجوم برسالة تصيد إلى mkhaled@corp.jo الساعة 11:22. IP المهاجم 185.220.101.47 مرتبط بـ APT-29 (Cozy Bear). الهجوم في مرحلة الحركة الجانبية ويستهدف WIN-DC01.", time: "14:33" },
  { role: "user", text: "ما الخطوة التالية المتوقعة؟",                      time: "14:34" },
  { role: "saqr", text: "استناداً لبصمة APT-29 وإطار MITRE ATT&CK، الخطوة المرجحة هي نشر Ransomware (T1486) على الأجهزة المتصلة بـ WIN-DC01. الاحتمال: 87٪. أوصي بعزل WIN-DC01 فوراً.", time: "14:34" },
];

// ── UI Helpers ─────────────────────────────────────────

function SevBadge({ sev, lang }: { sev: Sev; lang: Lang }) {
  const s = SEV[sev];
  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-semibold border ${s.textCls} ${s.bgCls} ${s.borderCls}`}>
      <span className="w-1.5 h-1.5 rounded-full" style={{ background: s.color, boxShadow: `0 0 5px ${s.color}` }} />
      {s.label[lang]}
    </span>
  );
}

function MitreBadge({ tech }: { tech: string }) {
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs border font-mono-tech" style={{ borderColor: `${C.cyan}40`, color: C.cyanHi, background: `${C.cyan}12` }}>
      {tech}
    </span>
  );
}

function Card({ children, className = "", style, onClick }: { children: React.ReactNode; className?: string; style?: React.CSSProperties; onClick?: () => void }) {
  return (
    <div className={`rounded-xl border ${className}`} style={{ background: C.card, borderColor: C.border, ...style }} onClick={onClick}>
      {children}
    </div>
  );
}

function StatusDot({ state }: { state: string }) {
  if (state === "current")   return <span className="relative flex w-3 h-3"><span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-50" style={{ background: C.red }} /><span className="relative inline-flex rounded-full w-3 h-3" style={{ background: C.red }} /></span>;
  if (state === "done")      return <span className="w-3 h-3 rounded-full" style={{ background: C.green }} />;
  return                            <span className="w-3 h-3 rounded-full border-2" style={{ borderColor: C.border, background: C.bg }} />;
}

function RepBadge({ rep }: { rep: string }) {
  const cls =
    rep === "Malicious"   ? `text-red-400 bg-red-500/10 border-red-500/30` :
    rep === "Suspicious"  ? `text-amber-400 bg-amber-500/10 border-amber-500/30` :
    rep === "Compromised" ? `text-violet-400 bg-violet-500/10 border-violet-500/30` :
                            `text-cyan-400 bg-cyan-500/10 border-cyan-500/30`;
  return <span className={`px-1.5 py-0.5 rounded text-[10px] font-semibold border ${cls}`}>{rep}</span>;
}

// ── Sidebar ────────────────────────────────────────────

function Sidebar({ page, setPage, lang, setLang }: { page: Page; setPage: (p: Page) => void; lang: Lang; setLang: (l: Lang) => void }) {
  const nav = [
    { id: "dashboard" as Page, Icon: BarChart2,     key: "navDashboard" as const },
    { id: "alert"     as Page, Icon: AlertOctagon,  key: "navAlert"     as const },
    { id: "story"     as Page, Icon: GitBranch,     key: "navStory"     as const },
    { id: "chat"      as Page, Icon: MessageSquare, key: "navChat"      as const },
  ];

  return (
    <aside className="w-60 flex flex-col flex-shrink-0 border-r" style={{ background: C.sidebar, borderColor: C.border }}>
      {/* Brand */}
      <div className="px-5 py-4 border-b" style={{ borderColor: C.border }}>
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl overflow-hidden flex-shrink-0 border-2" style={{ borderColor: `${C.cyan}40` }}>
            <img src={saqrLogo} alt="Saqr" className="w-full h-full object-cover" />
          </div>
          <div>
            <div className="font-bold text-base" style={{ color: C.text }}>{t("brand", lang)}</div>
            <div className="text-[10px] font-mono-tech tracking-widest" style={{ color: C.muted }}>{t("brandSub", lang)}</div>
          </div>
        </div>
      </div>

      {/* Active incident pill */}
      <div className="mx-3 my-3 px-3 py-2.5 rounded-lg border" style={{ background: `${C.red}0d`, borderColor: `${C.red}30` }}>
        <div className="flex items-center gap-2 mb-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
          <span className="text-xs font-semibold text-red-400">{t("activeIncident", lang)}</span>
        </div>
        <div className="flex gap-1.5 flex-wrap">
          {[{ c: "3", cls: "text-red-400 bg-red-500/10" }, { c: "12", cls: "text-amber-400 bg-amber-500/10" }, { c: "32", cls: "text-cyan-400 bg-cyan-500/10" }].map((x, i) => (
            <span key={i} className={`text-xs px-1.5 py-0.5 rounded font-mono-tech ${x.cls}`}>{x.c}</span>
          ))}
        </div>
      </div>

      {/* Nav */}
      <nav className={`flex-1 px-3 space-y-0.5 ${lang === "ar" ? "text-right" : "text-left"}`}>
        {nav.map(({ id, Icon, key }) => {
          const active = page === id;
          return (
            <button key={id} onClick={() => setPage(id)}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all"
              style={{
                flexDirection: lang === "ar" ? "row" : "row",
                background: active ? `${C.cyan}15` : "transparent",
                color: active ? C.cyanHi : C.muted,
                borderLeft: lang === "en" && active ? `2px solid ${C.cyan}` : "2px solid transparent",
                borderRight: lang === "ar" && active ? `2px solid ${C.cyan}` : "2px solid transparent",
              }}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              <span>{t(key, lang)}</span>
            </button>
          );
        })}
      </nav>

      {/* Bottom utils */}
      <div className={`p-3 border-t space-y-0.5 ${lang === "ar" ? "text-right" : "text-left"}`} style={{ borderColor: C.border }}>
        <button
          onClick={() => setLang(lang === "ar" ? "en" : "ar")}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all"
          style={{ color: C.cyan }}
        >
          <Globe className="w-4 h-4" />
          <span>{lang === "ar" ? "English" : "العربية"}</span>
        </button>
        {[{ Icon: Bell, key: "navBell" as const }, { Icon: Settings, key: "navSettings" as const }].map(({ Icon, key }) => (
          <button key={key} className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm" style={{ color: C.muted }}>
            <Icon className="w-4 h-4" />
            <span>{t(key, lang)}</span>
          </button>
        ))}

        {/* User */}
        <div className="flex items-center gap-2.5 px-3 py-2 mt-1">
          <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 overflow-hidden border" style={{ borderColor: `${C.cyan}40`, background: `${C.cyan}20`, color: C.cyan }}>
            م
          </div>
          <div>
            <div className="text-xs font-semibold" style={{ color: C.text }}>{t("analyst", lang)}</div>
            <div className="text-xs" style={{ color: C.cyan }}>{t("socLevel", lang)}</div>
          </div>
        </div>

      </div>
    </aside>
  );
}

// ── Dashboard ──────────────────────────────────────────

function useLiveClock(lang: Lang) {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 30000);
    return () => clearInterval(id);
  }, []);

  const dateFormatter = new Intl.DateTimeFormat(lang === "ar" ? "ar-EG" : "en-US", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
  });
  const timeFormatter = new Intl.DateTimeFormat(lang === "ar" ? "ar-EG" : "en-US", {
    hour: "2-digit", minute: "2-digit", hour12: false,
  });

  const dateStr = dateFormatter.format(now);
  const timeStr = timeFormatter.format(now);

  return lang === "ar"
    ? `${dateStr} · آخر تحديث ${timeStr}`
    : `${dateStr} · Last update ${timeStr}`;
}

function Dashboard({ alerts, onAlertClick, lang }: { alerts: typeof ALERTS; onAlertClick: (a: AlertData) => void; lang: Lang }) {
  const isRtl = lang === "ar";
  const dashSubText = useLiveClock(lang);
  const mitreColor = (n: number) =>
    n === 0 ? "border-zinc-800 text-zinc-600" :
    n <= 2   ? `text-emerald-400 border-emerald-500/20` :
    n <= 4   ? `text-amber-400 border-amber-500/20` :
               `text-red-400 border-red-500/20`;
  const mitreBg = (n: number) =>
    n === 0 ? "bg-zinc-900/60" : n <= 2 ? "bg-emerald-500/10" : n <= 4 ? "bg-amber-500/10" : "bg-red-500/10";

  return (
    <div className="p-6 min-h-screen space-y-5" dir={isRtl ? "rtl" : "ltr"}
      style={{ background: `radial-gradient(ellipse 80% 40% at 50% -5%, ${C.cyan}06, transparent)` }}>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold" style={{ color: C.text }}>{t("dashTitle", lang)}</h1>
          <p className="text-xs mt-0.5" style={{ color: C.muted }}>{dashSubText}</p>
        </div>
        <div className="flex flex-col items-end gap-1.5">
          <span className="text-[10px] leading-relaxed" style={{ color: C.muted + "90" }}>{t("copyright", lang)}</span>
          <div className="flex items-center gap-2 px-4 py-2 rounded-lg border" style={{ background: `${C.red}12`, borderColor: `${C.red}40` }}>
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span className="text-sm font-bold text-red-400">{t("threatCritical", lang)}</span>
          </div>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { key: "kpiCritical" as const,      n: 3,  color: C.red,   Icon: AlertOctagon,  pulse: true  },
          { key: "kpiHigh" as const,           n: 12, color: C.amber, Icon: AlertTriangle, pulse: false },
          { key: "kpiInvestigating" as const,  n: 5,  color: C.cyan,  Icon: Eye,           pulse: false },
          { key: "kpiResolved" as const,       n: 8,  color: C.green, Icon: CheckCircle2,  pulse: false },
        ].map(({ key, n, color, Icon, pulse }) => (
          <Card key={key} className="p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs mb-2" style={{ color: C.muted }}>{t(key, lang)}</p>
                <div className="text-3xl font-bold font-mono-tech" style={{ color }}>{n}</div>
              </div>
              <div className="relative p-2 rounded-lg" style={{ background: `${color}18` }}>
                {pulse && <span className="absolute inset-0 rounded-lg animate-ping opacity-20" style={{ background: color }} />}
                <Icon className="w-5 h-5 relative z-10" style={{ color }} />
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-5 gap-5">
        {/* Alerts list */}
        <div className="col-span-3 space-y-2">
          <div className="flex items-center justify-between mb-1">
            <h2 className="text-sm font-semibold" style={{ color: C.mutedHi }}>{t("recentAlerts", lang)}</h2>
            <span className="text-xs cursor-pointer" style={{ color: C.cyan }}>{t("viewAll", lang)} →</span>
          </div>
          {alerts.map((alert) => {
            const s = SEV[alert.sev];
            return (
              <Card key={alert.id} className="p-4 cursor-pointer transition-all"
                style={{ borderColor: `${s.color}35`, cursor: "pointer" }}
                onClick={() => onAlertClick(alert)}>
                <div className="flex items-start gap-3">
                  <div className="w-0.5 self-stretch rounded-full flex-shrink-0" style={{ background: s.color }} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <SevBadge sev={alert.sev} lang={lang} />
                      <span className="text-xs font-mono-tech" style={{ color: C.muted }}>{alert.id}</span>
                      <span className="text-xs px-1.5 py-0.5 rounded border" style={{ borderColor: C.border, color: C.muted }}>{alert.src}</span>
                    </div>
                    <div className="font-semibold text-sm mb-1.5" style={{ color: C.text }}>{alert[lang]}</div>
                    <div className="flex items-center gap-3 text-xs flex-wrap" style={{ color: C.muted }}>
                      <span className="flex items-center gap-1"><Server className="w-3 h-3" />{alert.host}</span>
                      <span className="flex items-center gap-1"><User className="w-3 h-3" />{alert.user}</span>
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{alert.ago[lang]}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <div className="flex gap-1 flex-wrap justify-end">
                      {alert.mitre.slice(0, 2).map(tech => <MitreBadge key={tech} tech={tech} />)}
                    </div>
                    <ChevronRight className="w-4 h-4" style={{ color: C.muted }} />
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Side */}
        <div className="col-span-2 space-y-4">
          <div>
            <h2 className="text-sm font-semibold mb-2" style={{ color: C.mutedHi }}>{t("mitreTitle", lang)}</h2>
            <Card className="p-4">
              <div className="grid grid-cols-3 gap-1.5">
                {MITRE_GRID.map(({ ar, en, n }) => (
                  <div key={ar} className={`rounded-lg p-2 text-center border ${mitreColor(n)} ${mitreBg(n)}`}>
                    <div className="text-base font-bold font-mono-tech">{n}</div>
                    <div className="text-[9px] leading-tight mt-0.5">{lang === "ar" ? ar : en}</div>
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-3 mt-3 pt-3 border-t text-xs" style={{ borderColor: C.border, color: C.muted }}>
                {[{ c: C.red, l: lang === "ar" ? "عالي" : "High" }, { c: C.amber, l: lang === "ar" ? "متوسط" : "Med" }, { c: C.green, l: lang === "ar" ? "منخفض" : "Low" }].map(x => (
                  <span key={x.l} className="flex items-center gap-1"><span className="w-2 h-2 rounded" style={{ background: x.c + "80" }} />{x.l}</span>
                ))}
              </div>
            </Card>
          </div>

          <Card className="p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-semibold" style={{ color: C.text }}>{t("threatScore", lang)}</span>
              <span className="text-xs font-mono-tech text-amber-400">{t("high2", lang)}</span>
            </div>
            <div className="h-2.5 rounded-full overflow-hidden mb-2" style={{ background: `${C.muted}30` }}>
              <div className="h-full rounded-full" style={{ width: "74%", background: `linear-gradient(to right, ${C.amber}, ${C.red})` }} />
            </div>
            <div className="flex justify-between text-xs font-mono-tech mb-4" style={{ color: C.muted }}>
              <span>0</span><span className="text-amber-400 font-bold">74 / 100</span><span>100</span>
            </div>
            {[{ key: "detQuality" as const, val: 88, color: C.green }, { key: "respSpeed" as const, val: 62, color: C.amber }, { key: "mitreCov" as const, val: 71, color: C.cyan }].map(({ key, val, color }) => (
              <div key={key} className="mb-2">
                <div className="flex justify-between text-xs mb-1" style={{ color: C.muted }}>
                  <span>{t(key, lang)}</span><span style={{ color }}>{val}%</span>
                </div>
                <div className="h-1 rounded-full" style={{ background: `${C.muted}25` }}>
                  <div className="h-1 rounded-full" style={{ width: `${val}%`, background: color }} />
                </div>
              </div>
            ))}
          </Card>
        </div>
      </div>
    </div>
  );
}

// ── Alert Detail ───────────────────────────────────────

function AlertDetail({ alert, lang }: { alert: AlertData; lang: Lang }) {
  const [showRaw, setShowRaw] = useState(false);
  const [copied, setCopied]   = useState(false);
  const isRtl = lang === "ar";

  const copy = () => {
    navigator.clipboard.writeText(alert.rawLog).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const analysis = lang === "ar" ? alert.analysisAr : alert.analysisEn;
  const actions  = alert.actions[lang];

  return (
    <div className="p-6 space-y-5" dir={isRtl ? "rtl" : "ltr"}>
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <SevBadge sev={alert.sev} lang={lang} />
            <span className="text-xs font-mono-tech" style={{ color: C.muted }}>{alert.id}</span>
            <span className="text-xs px-2 py-0.5 rounded border" style={{ borderColor: C.border, color: C.muted }}>{alert.src}</span>
            <span className="text-xs px-2 py-0.5 rounded border" style={{ borderColor: C.border, color: C.muted }}>{alert.status[lang]}</span>
          </div>
          <h1 className="text-xl font-bold mb-2" style={{ color: C.text }}>{alert[lang]}</h1>
          <div className="flex items-center gap-4 text-xs flex-wrap" style={{ color: C.muted }}>
            <span className="flex items-center gap-1.5"><Server className="w-3.5 h-3.5" />{alert.host}</span>
            <span className="flex items-center gap-1.5"><User className="w-3.5 h-3.5" />{alert.user}</span>
            <span className="flex items-center gap-1.5 font-mono-tech"><Network className="w-3.5 h-3.5" />{alert.srcIp} → {alert.dstIp}</span>
            <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" />{alert.time} · {alert.ago[lang]}</span>
          </div>
        </div>
        <div className="flex gap-2 flex-shrink-0">
          <button className="px-3 py-1.5 rounded-lg text-xs border transition-all" style={{ borderColor: `${C.cyan}60`, color: C.cyan }}>{t("assign", lang)}</button>
          <button className="px-3 py-1.5 rounded-lg text-xs border" style={{ borderColor: `${C.green}60`, color: C.green }}>{t("closeAlert", lang)}</button>
          <button className="px-3 py-1.5 rounded-lg text-xs font-semibold text-white" style={{ background: C.brand }}>{t("urgentAction", lang)}</button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-5">
        <div className="col-span-2 space-y-4">
          {/* Saqr Analysis */}
          <Card className="p-5">
            <div className="flex items-center gap-2.5 mb-3 flex-wrap">
              <div className="w-7 h-7 rounded-lg overflow-hidden border-2 flex-shrink-0" style={{ borderColor: `${C.cyan}50` }}>
                <img src={saqrLogo} alt="Saqr" className="w-full h-full object-cover" />
              </div>
              <span className="font-semibold text-sm" style={{ color: C.text }}>{t("saqrAnalysis", lang)}</span>
              <span className="text-xs px-2 py-0.5 rounded font-mono-tech" style={{ background: `${C.cyan}15`, color: C.cyanHi, border: `1px solid ${C.cyan}35` }}>{t("confidence", lang)} 94%</span>
              <span className="text-xs mr-auto" style={{ color: C.muted }}>{t("poweredBy", lang)}</span>
            </div>
            <p className="text-sm leading-loose" style={{ color: C.text }}>{analysis}</p>
          </Card>

          {/* MITRE */}
          <Card className="p-5">
            <div className="font-semibold text-sm mb-3" style={{ color: C.text }}>{t("mitreMap", lang)}</div>
            <div className="flex flex-wrap gap-2">{alert.mitre.map(tech => <MitreBadge key={tech} tech={tech} />)}</div>
          </Card>

          {/* Raw log */}
          <Card className="p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4" style={{ color: C.muted }} />
                <span className="font-semibold text-sm" style={{ color: C.text }}>{t("rawLog", lang)}</span>
              </div>
              <div className="flex items-center gap-3">
                <button onClick={copy} className="text-xs flex items-center gap-1" style={{ color: copied ? C.green : C.muted }}>
                  <Copy className="w-3 h-3" />{copied ? t("copied", lang) : t("copy", lang)}
                </button>
                <button onClick={() => setShowRaw(v => !v)} className="text-xs" style={{ color: C.muted }}>
                  {showRaw ? t("hide", lang) : t("show", lang)}
                </button>
              </div>
            </div>
            {showRaw ? (
              <pre className="text-xs rounded-lg p-4 overflow-x-auto leading-relaxed font-mono-tech" dir="ltr" style={{ background: C.terminal, color: "#5af78e", border: `1px solid ${C.border}` }}>
                {alert.rawLog}
              </pre>
            ) : (
              <div className="text-xs rounded-lg p-3 text-center cursor-pointer" style={{ background: C.terminal, color: C.muted, border: `1px dashed ${C.border}` }} onClick={() => setShowRaw(true)}>
                {t("clickLog", lang)}
              </div>
            )}
          </Card>
        </div>

        <div className="space-y-4">
          {/* IOCs */}
          <Card className="p-4">
            <div className="font-semibold text-sm mb-3" style={{ color: C.text }}>{t("iocs", lang)}</div>
            <div className="space-y-2">
              {alert.iocs.map((ioc, i) => (
                <div key={i} className="text-xs rounded-lg p-2.5" style={{ background: C.terminal }}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono-tech" style={{ color: C.cyan }}>[{ioc.type}]</span>
                    <RepBadge rep={ioc.rep} />
                  </div>
                  <div className="font-mono-tech truncate" dir="ltr" style={{ color: C.text }}>{ioc.value}</div>
                </div>
              ))}
            </div>
          </Card>

          {/* Actions */}
          <Card className="p-4">
            <div className="font-semibold text-sm mb-3" style={{ color: C.text }}>{t("actions", lang)}</div>
            <div className="space-y-2.5">
              {actions.map((action, i) => (
                <div key={i} className="flex items-start gap-2.5 text-xs" style={{ color: C.text }}>
                  <span className="flex-shrink-0 w-5 h-5 rounded-full border flex items-center justify-center text-[10px] font-bold mt-0.5" style={{ borderColor: `${C.cyan}60`, color: C.cyan }}>
                    {i + 1}
                  </span>
                  <span style={{ lineHeight: 1.7 }}>{action}</span>
                </div>
              ))}
            </div>
          </Card>

          {/* Similar */}
          <Card className="p-4">
            <div className="font-semibold text-sm mb-2" style={{ color: C.text }}>{t("similar", lang)}</div>
            <div className="space-y-1.5 text-xs" style={{ color: C.muted }}>
              <div className="flex items-center gap-2"><span className="w-1 h-1 rounded-full bg-amber-500" />INC-2024-039 — PsExec SRV-FILE-02</div>
              <div className="flex items-center gap-2"><span className="w-1 h-1 rounded-full bg-amber-500" />INC-2024-031 — WMI Lateral Movement</div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

// ── Attack Story ───────────────────────────────────────

function AttackStory({ lang, events }: { lang: Lang; events?: typeof TIMELINE }) {
  const isRtl = lang === "ar";
  const timelineData = events && events.length > 0 ? events : TIMELINE;
  const chain = [
    t("chainInitial", lang), t("chainExec", lang),
    t("chainCred", lang),    t("chainLateral", lang),
    t("chainImpact", lang),
  ];

  return (
    <div className="p-6" dir={isRtl ? "rtl" : "ltr"}>
      <div className="mb-6">
        <h1 className="text-xl font-bold mb-1" style={{ color: C.text }}>{t("storyTitle", lang)}</h1>
        <p className="text-sm" style={{ color: C.muted }}>{t("storySub", lang)}</p>
      </div>

      {/* Kill chain */}
      <Card className="p-4 mb-6">
        <div className="flex items-center overflow-x-auto gap-0 text-xs">
          {chain.map((step, i) => {
            const isPast    = i < 3;
            const isCurrent = i === 3;
            const color     = isCurrent ? C.red : isPast ? C.green : C.muted + "50";
            return (
              <React.Fragment key={step}>
                <div className="flex flex-col items-center px-3 flex-shrink-0">
                  <div className="w-2.5 h-2.5 rounded-full mb-1" style={{ background: color }} />
                  <span style={{ color: isCurrent ? C.red : isPast ? C.green : C.muted }}>{step}</span>
                </div>
                {i < chain.length - 1 && (
                  <div className="flex-1 h-px min-w-5" style={{ background: isPast ? C.green : C.border }} />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </Card>

      <div className="max-w-2xl">
        <div className="relative">
          <div className="absolute right-[22px] top-4 bottom-4 w-px" style={{ background: `linear-gradient(to bottom, ${C.green}, ${C.red} 70%, ${C.border})` }} />
          <div className="space-y-1">
            {timelineData.map((ev, i) => {
              const isCurrent = ev.state === "current";
              const isPred    = ev.state === "predicted";
              const isDone    = ev.state === "done";
              return (
                <div key={i} className="flex gap-4 pb-4">
                  <div className="flex-shrink-0 w-11 flex justify-center pt-4">
                    <StatusDot state={ev.state} />
                  </div>
                  <div className="flex-1">
                    <Card className="p-4" style={{ borderColor: isCurrent ? `${C.red}50` : isDone ? `${C.green}30` : C.border, opacity: isPred ? 0.6 : 1 }}>
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div>
                          <div className="font-semibold text-sm" style={{ color: C.text }}>
                            {lang === "ar" ? ev.ar : ev.en}
                            {isPred    && <span className="ms-2 text-xs font-normal text-amber-400 font-mono-tech">{t("predictedLabel", lang)}</span>}
                            {isCurrent && <span className="ms-2 text-xs font-semibold text-red-400 animate-pulse">{t("nowLabel", lang)}</span>}
                          </div>
                          <div className="text-xs mt-0.5" style={{ color: C.muted }}>{lang === "ar" ? ev.en : ev.ar}</div>
                        </div>
                        <span className="text-xs font-mono-tech flex-shrink-0" style={{ color: C.muted }}>{ev.time}</span>
                      </div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <MitreBadge tech={ev.tech} />
                        <span className="text-xs px-2 py-0.5 rounded border" style={{ borderColor: C.border, color: C.muted }}>{ev.tactic}</span>
                        <span className="flex items-center gap-1 text-xs" style={{ color: C.muted }}><Server className="w-3 h-3" />{ev.host}</span>
                      </div>
                    </Card>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Saqr Chat ──────────────────────────────────────────

function SaqrChat({ messages, input, setInput, onSend, lang }: {
  messages: { role: string; text: string; time: string }[];
  input: string;
  setInput: (v: string) => void;
  onSend: () => void;
  lang: Lang;
}) {
  const bottomRef = useRef<HTMLDivElement>(null);
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const quickPrompts = lang === "ar"
    ? ["اشرح هذا التنبيه", "ما مستوى الخطورة؟", "أنشئ تقرير الحادثة", "خطوات الاستجابة الفورية", "ربط بـ MITRE ATT&CK"]
    : ["Explain this alert", "What is the severity?", "Generate incident report", "Immediate response steps", "Map to MITRE ATT&CK"];

  const isRtl = lang === "ar";

  return (
    <div className="flex flex-col h-screen" dir={isRtl ? "rtl" : "ltr"}>
      {/* Header */}
      <div className="px-6 py-4 border-b flex items-center justify-between" style={{ borderColor: C.border }}>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl overflow-hidden border-2 flex-shrink-0" style={{ borderColor: `${C.cyan}50` }}>
            <img src={saqrLogo} alt="Saqr" className="w-full h-full object-cover" />
          </div>
          <div>
            <div className="font-bold text-sm" style={{ color: C.text }}>{t("chatTitle", lang)}</div>
            <div className="flex items-center gap-2 text-xs" style={{ color: C.muted }}>
              <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
              {t("chatStatus", lang)}
            </div>
          </div>
        </div>
        <button className="p-1.5 rounded-lg border" style={{ borderColor: C.border, color: C.muted }}>
          <RefreshCw className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Context */}
      <div className="mx-6 mt-4 px-4 py-2.5 rounded-lg text-xs flex items-center gap-2" style={{ background: `${C.cyan}10`, border: `1px solid ${C.cyan}30`, color: C.cyanHi }}>
        <Layers className="w-3.5 h-3.5 flex-shrink-0" />
        {t("chatContext", lang)}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === "user" ? (isRtl ? "justify-start" : "justify-end") : (isRtl ? "justify-end" : "justify-start")}`}>
            <div className="max-w-lg">
              {msg.role === "saqr" && (
                <div className={`flex items-center gap-1.5 mb-1.5 ${isRtl ? "justify-end" : "justify-start"}`}>
                  <div className="w-5 h-5 rounded overflow-hidden"><img src={saqrLogo} alt="Saqr" className="w-full h-full object-cover" /></div>
                  <span className="text-xs font-semibold" style={{ color: C.cyan }}>Saqr</span>
                  <span className="text-xs" style={{ color: C.muted }}>{msg.time}</span>
                </div>
              )}
              <div className="px-4 py-3 rounded-xl text-sm" style={{
                background: msg.role === "user" ? C.card : `${C.cyan}10`,
                border: `1px solid ${msg.role === "user" ? C.border : `${C.cyan}30`}`,
                color: C.text,
                lineHeight: 1.75,
              }}>
                {msg.text}
              </div>
              {msg.role === "user" && (
                <div className={`flex mt-1 ${isRtl ? "justify-start" : "justify-end"}`}>
                  <span className="text-xs" style={{ color: C.muted }}>{msg.time}</span>
                </div>
              )}
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Quick prompts */}
      <div className="px-6 pb-3 flex gap-2 flex-wrap">
        {quickPrompts.map(q => (
          <button key={q} onClick={() => setInput(q)} className="text-xs px-3 py-1.5 rounded-full border transition-all" style={{ borderColor: C.borderHi, color: C.muted }}>
            {q}
          </button>
        ))}
      </div>

      {/* Input */}
      <div className="px-6 pb-6 pt-2 border-t" style={{ borderColor: C.border }}>
        <div className="flex gap-3 items-center rounded-xl border p-3" style={{ background: C.card, borderColor: C.borderHi }}>
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && onSend()}
            placeholder={t("chatPlaceholder", lang)}
            className="flex-1 bg-transparent text-sm outline-none"
            style={{ color: C.text }}
            dir={isRtl ? "rtl" : "ltr"}
          />
          <button onClick={onSend} className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: C.cyan }}>
            <Send className="w-4 h-4" style={{ color: C.bg }} />
          </button>
        </div>
        <p className="text-[10px] mt-2 text-center" style={{ color: C.muted + "70" }}>{t("chatDisclaimer", lang)}</p>
      </div>
    </div>
  );
}

// ── Live Data Integration ────────────────────────────────

type ApiIncident = {
  id: number;
  time: string;
  host: string;
  user: string;
  process: string;
  risk: number;
  level: string;
  findings: string;
  summary: string;
  saved_at: string;
};

const API_URL = "http://127.0.0.1:8000/api/incidents";

function severityFromLevel(level: string): Sev {
  if (level === "Critical") return "critical";
  if (level === "High")     return "high";
  if (level === "Medium")   return "medium";
  return "low";
}

function mapIncidentToAlert(inc: ApiIncident): AlertData {
  const sev = severityFromLevel(inc.level);
  const timePart = inc.time ? inc.time.split("T")[1]?.slice(0, 5) : "--:--";

  return {
    id: `SAQR-${inc.id}`,
    sev,
    ar: inc.findings || "نشاط مشبوه مكتشف",
    en: inc.findings || "Suspicious activity detected",
    host: inc.host || "Unknown",
    user: inc.user || "Unknown",
    srcIp: "127.0.0.1",
    dstIp: "—",
    src: "Saqr Sysmon Engine",
    ago: { ar: "مباشر", en: "Live" },
    time: timePart || "--:--",
    status: { ar: "مفتوح", en: "Open" },
    mitre: [],
    iocs: [
      { type: "Process", value: inc.process || "Unknown", rep: sev === "critical" || sev === "high" ? "Malicious" : "Suspicious" },
    ],
    rawLog: `Host: ${inc.host}\nUser: ${inc.user}\nProcess: ${inc.process}\nRisk Score: ${inc.risk}/100\nFindings: ${inc.findings}\nSummary: ${inc.summary}`,
    analysisAr: inc.summary || "لا يوجد تحليل إضافي متاح.",
    analysisEn: inc.summary || "No additional analysis available.",
    actions: {
      ar: ["مراجعة العملية والمستخدم المسؤول", "التحقق من سياق تنفيذ الأمر", "تصعيد الحادثة إذا استمر النشاط"],
      en: ["Review the process and responsible user", "Verify the command execution context", "Escalate if activity persists"],
    },
  } as AlertData;
}

type TimelineEvent = {
  time: string;
  ar: string;
  en: string;
  tactic: string;
  tech: string;
  host: string;
  state: string;
};

function mapIncidentToTimelineEvent(inc: ApiIncident, isLast: boolean): TimelineEvent {
  const timePart = inc.time ? inc.time.split("T")[1]?.slice(0, 5) : "--:--";
  const techList = (inc.mitre_ids || "").split(",").map(s => s.trim()).filter(Boolean);
  const tacticList = (inc.mitre_tactics || "").split(",").map(s => s.trim()).filter(Boolean);

  return {
    time: timePart || "--:--",
    ar: inc.findings || "نشاط مشبوه",
    en: inc.findings || "Suspicious activity",
    tactic: tacticList[0] || "Unknown",
    tech: techList[0] || "—",
    host: inc.host || "Unknown",
    state: isLast ? "current" : "done",
  };
}

// ── Root ───────────────────────────────────────────────

export default function App() {
  const [page, setPage]           = useState<Page>("dashboard");
  const [selected, setSelected]   = useState<AlertData>(ALERTS[0]);
  const [lang, setLang]           = useState<Lang>("ar");
  const [chatInput, setChatInput] = useState("");
  const [messages, setMessages]   = useState([...CHAT_INIT]);
  const [liveAlerts, setLiveAlerts] = useState<AlertData[]>([]);
  const [liveTimeline, setLiveTimeline] = useState<TimelineEvent[]>([]);

  useEffect(() => {
    const fetchIncidents = () => {
      fetch(API_URL)
        .then(res => res.json())
        .then((data: ApiIncident[]) => {
          const mapped = data.map(mapIncidentToAlert);
          setLiveAlerts(mapped);

          const sortedAsc = [...data].sort((a, b) => (a.time || "").localeCompare(b.time || ""));
          const timeline = sortedAsc.map((inc, i) =>
            mapIncidentToTimelineEvent(inc, i === sortedAsc.length - 1)
          );
          setLiveTimeline(timeline);
        })
        .catch(() => {
          // الـ API مش شغال أو مش وصلنا له — نتجاهل بصمت ونكمل بالبيانات التجريبية
        });
    };

    fetchIncidents();
    const interval = setInterval(fetchIncidents, 5000);
    return () => clearInterval(interval);
  }, []);

  const displayedAlerts = liveAlerts.length > 0 ? liveAlerts : ALERTS;
  const displayedTimeline = liveTimeline.length > 0 ? liveTimeline : TIMELINE;

  const openAlert = (alert: AlertData) => { setSelected(alert); setPage("alert"); };

  const sendMessage = () => {
    if (!chatInput.trim()) return;
    const text = chatInput;
    const nowLabel = new Date().toLocaleTimeString(lang === "ar" ? "ar-EG" : "en-US", { hour: "2-digit", minute: "2-digit" });

    setMessages(prev => [...prev, { role: "user", text, time: nowLabel }]);
    setChatInput("");

    fetch("http://127.0.0.1:8000/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question: text }),
    })
      .then(res => res.json())
      .then(data => {
        const replyTime = new Date().toLocaleTimeString(lang === "ar" ? "ar-EG" : "en-US", { hour: "2-digit", minute: "2-digit" });
        setMessages(prev => [...prev, {
          role: "saqr",
          text: data.answer || t("chatAnalyzing", lang),
          time: replyTime,
        }]);
      })
      .catch(() => {
        const replyTime = new Date().toLocaleTimeString(lang === "ar" ? "ar-EG" : "en-US", { hour: "2-digit", minute: "2-digit" });
        setMessages(prev => [...prev, {
          role: "saqr",
          text: t("chatAnalyzing", lang),
          time: replyTime,
        }]);
      });
  };

  return (
    <div
      className="flex h-screen overflow-hidden"
      style={{
        background: C.bg,
        color: C.text,
        backgroundImage: `linear-gradient(${C.border}28 1px, transparent 1px), linear-gradient(90deg, ${C.border}28 1px, transparent 1px)`,
        backgroundSize: "28px 28px",
      }}
    >
      <Sidebar page={page} setPage={setPage} lang={lang} setLang={setLang} />
      <main className="flex-1 overflow-y-auto">
        {page === "dashboard" && <Dashboard alerts={displayedAlerts} onAlertClick={openAlert} lang={lang} />}
        {page === "alert"     && <AlertDetail alert={selected} lang={lang} />}
        {page === "story"     && <AttackStory lang={lang} events={displayedTimeline} />}
        {page === "chat"      && <SaqrChat messages={messages} input={chatInput} setInput={setChatInput} onSend={sendMessage} lang={lang} />}
      </main>
    </div>
  );
}
