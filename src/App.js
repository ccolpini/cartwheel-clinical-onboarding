import { useState, useEffect, useRef } from "react";
import ModeBar from "./ModeBar";
import AdminView from "./AdminView";
import { BookOpen, Settings, Video, Globe, ChevronDown, Send, Shield, FileText, UserCheck, AlertTriangle, CheckCircle, Clock, MapPin, Mail, ExternalLink, Stethoscope, Zap, BarChart2, ClipboardList } from "lucide-react";

const C = {
  charcoal: "#0F1B1F", forest: "#26544F", indigo: "#394B99",
  lavender: "#B1A5F7", lightLavender: "#D8D2FB", lavXLight: "rgba(177,165,247,0.10)",
  mint: "#A7CF99", lightMint: "#D3E7CC", mintXLight: "rgba(167,207,153,0.12)",
  peach: "#EBA89B", lightPeach: "#F5D3CD",
  sand: "#F0ECE9", taupe: "#9C9283", brick: "#5C1E37", lightBrick: "#f9eaee",
  orange: "#F0702E", white: "#FFFFFF",
  sky: "#B3CEE0", lightSky: "#E8F3F9",
  bronze: "#996D1D", lightBronze: "#FFF4E0",
};

const STATE_REQUIREMENTS = {
  MA: {
    label: "Massachusetts",
    items: [
      {
        title: "CANS Certification (4–8 hours)",
        details: [
          "Required to see students with MassHealth insurance. Psychiatry providers are exempt.",
          "Complete training & exam, then email certificate to compliance@cartwheelcare.org",
          "⚠️ Your CANS name must match your legal name on license and ID. For name changes contact masscans@umassmed.edu or (774) 455-4057",
        ],
      },
      {
        title: "I-9 Verification (W2 Employees Only)",
        details: [
          "Required for full-time employees and Massachusetts part-time employees (not 1099 contractors)",
          "You'll need valid ID from the acceptable forms list and an inspector (18+, valid SSN, driver's license & email) to verify your documents in person",
        ],
      },
    ],
  },
  NY: {
    label: "New York",
    items: [
      {
        title: "Fingerprinting",
        details: [
          "Previously fingerprinted with NYESD? Email compliance@cartwheelcare.org a copy of your appointment confirmation or receipt.",
          "First time? Email compliance@cartwheelcare.org for a voucher code and instructions. Reply with your receipt once complete.",
        ],
      },
      {
        title: "Cultural Competency Training (due within 90 days of start date)",
        details: [
          "Options: CPI training (2 modules), OASAS-approved training, or Think Cultural Health (HHS) training",
          "Completed within the past year at another workplace? Submit that certificate.",
          "Email certificate to compliance@cartwheelcare.org",
        ],
      },
    ],
  },
  CO: {
    label: "Colorado",
    items: [
      {
        title: "Colorado Access Portal Trainings",
        details: [
          "You'll receive an email at your Cartwheel address to enroll. Required modules:",
          "• Comprehensive Behavioral Health Training",
          "• Quality Improvement Behavioral Health Documentation",
          "• EPSDT Overview (2-min video)",
          "• Cultural Responsiveness (45 minutes)",
          "⚠️ Already completed cultural competency training? Email certificate to compliance@cartwheelcare.org",
        ],
      },
    ],
  },
  AZ: {
    label: "Arizona",
    items: [
      {
        title: "Cultural Competency Training",
        details: [
          "Assigned in Rippling after you start",
          "Focuses on working with Native American communities",
        ],
      },
    ],
  },
  IN: {
    label: "Indiana",
    items: [
      {
        title: "CPI/CPS Background Check Form",
        details: [
          "Required by the Indiana Department of Child Services to see patients under 18",
          "You'll receive an email from the Indiana CPI/CPS portal on your start date. The link expires after 20 days — email compliance@cartwheelcare.org if it expires.",
          "⚠️ Applicants no longer need to enter previous street addresses or zip codes. Still required: Address Type, Country, Indiana City, State, County, Date Moved In/Out.",
        ],
      },
    ],
  },
  PA: {
    label: "Pennsylvania",
    items: [
      {
        title: "Submit Certificates to compliance@cartwheelcare.org",
        details: [
          "Child Abuse History Certification — no less than 60 months old",
          "Fingerprints — no less than two years old, submitted to PA-PDE-School Districts",
        ],
      },
    ],
  },
};

const FIRST_WEEK = [
  {
    num: "1",
    title: "New Employee Orientation",
    badge: "Optional but Highly Recommended",
    badgeColor: C.mint,
    details: [
      "Your start date at 11AM EST | 10AM CST | 9AM MST | 8AM PST",
      "Overview of Cartwheel led by People Team, Clinical Onboarding, and IT",
      "A Google Calendar invite (with Zoom link) will be sent to your personal email the week before your start date",
      "Can't attend? The recording will be sent to your Cartwheel email later that day",
    ],
  },
  {
    num: "2",
    title: "Setting up your Tech",
    badge: "Required",
    badgeColor: C.orange,
    details: [
      "Activate your Okta account to access your Cartwheel email",
      "All other account activation emails will be in your Cartwheel inbox",
    ],
  },
  {
    num: "3",
    title: "Async Training Modules",
    badge: "Required",
    badgeColor: C.orange,
    details: [
      "Available on your start date — complete on your own schedule during Week 1",
      "All modules in Rippling (~5 hours total): Welcome to Cartwheel, Cartwheel Care Journey, Clinical Quality (therapists only), Systems Navigation, Onboarding Skills Assessment (therapists only), HIPAA, Cybersecurity, Fraud/Waste/Abuse Compliance, CALM training, State-specific compliance",
    ],
  },
  {
    num: "4",
    title: "Credentialing Check-In",
    badge: "Optional",
    badgeColor: C.taupe,
    details: [
      "A brief 15-minute call before or during your first week to review credentialing info",
      "You may receive a phone call from the Credentialing Team — no action needed if you don't",
    ],
  },
  {
    num: "5",
    title: "1:1 with Clinical Supervisor",
    badge: "Non-independently licensed only",
    badgeColor: C.indigo,
    details: [
      "You'll receive your Clinical Supervisor assignment via email on Day 1",
      "Arrange an intro call after completing your onboarding trainings",
    ],
  },
];

const STYLE = `
@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800&family=Inter:wght@400;500;600&display=swap');
*{box-sizing:border-box;margin:0;padding:0;}
body{background:${C.sand};font-family:'Inter',system-ui,sans-serif;color:${C.charcoal};}
@keyframes fadeUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.35}}
@keyframes ringPulse{0%,100%{stroke:${C.indigo}}50%{stroke:${C.mint}}}
@keyframes floatA{0%,100%{transform:translateY(0px) rotate(0deg)}50%{transform:translateY(-10px) rotate(3deg)}}
@keyframes floatB{0%,100%{transform:translateY(0px)}50%{transform:translateY(-6px)}}
@keyframes floatC{0%,100%{transform:translateY(0px) rotate(0deg)}50%{transform:translateY(-7px) rotate(-2deg)}}
.fadeUp{animation:fadeUp 0.45s ease both;}
button{cursor:pointer;border:none;background:none;font-family:inherit;}
a{color:${C.indigo};text-decoration:none;}
a:hover{text-decoration:underline;}
::-webkit-scrollbar{width:4px;height:4px;}
::-webkit-scrollbar-track{background:transparent;}
::-webkit-scrollbar-thumb{background:rgba(15,27,31,0.15);border-radius:99px;}
`;

function WheelMark({ size = 24 }) {
  const spoke = (rot, color) => (
    <rect key={rot} x={size * 0.44} y={size * 0.1} width={size * 0.12} height={size * 0.38}
      rx={size * 0.06} fill={color} transform={`rotate(${rot} ${size / 2} ${size / 2})`} />
  );
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {[0, 180, 135, 315].map(r => spoke(r, C.lavender))}
      {[90, 270, 45, 225].map(r => spoke(r, C.orange))}
    </svg>
  );
}

function FadeIn({ children, delay = 0, style = {} }) {
  return <div className="fadeUp" style={{ animationDelay: `${delay}ms`, ...style }}>{children}</div>;
}

function SectionLabel({ children, light = false, color }) {
  return (
    <div style={{
      fontFamily: "Montserrat,sans-serif", fontWeight: 700, fontSize: 11,
      letterSpacing: "0.08em", textTransform: "uppercase",
      color: color || (light ? "rgba(255,255,255,0.55)" : C.taupe), marginBottom: 12
    }}>
      {children}
    </div>
  );
}

function SectionHead({ children }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <h2 style={{ fontFamily: "Montserrat,sans-serif", fontWeight: 700, fontSize: 20, color: C.charcoal, marginBottom: 10 }}>{children}</h2>
      <div style={{ height: 1, background: "rgba(15,27,31,0.07)" }} />
    </div>
  );
}

function HoverCard({ children, style = {} }) {
  const [hov, setHov] = useState(false);
  return (
    <div onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        transition: "all 0.18s", transform: hov ? "translateY(-2px)" : "none",
        boxShadow: hov ? "0 6px 20px rgba(15,27,31,0.1)" : "0 1px 4px rgba(15,27,31,0.05)", ...style
      }}>
      {children}
    </div>
  );
}

function TabButton({ label, active, onClick }) {
  const [hov, setHov] = useState(false);
  return (
    <button onClick={onClick} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        padding: "13px 18px", whiteSpace: "nowrap", fontFamily: "Montserrat,sans-serif",
        fontWeight: 700, fontSize: 12, color: C.indigo,
        borderBottom: active ? `2px solid ${C.indigo}` : "2px solid transparent",
        background: active ? C.lavender : hov ? C.lightLavender : "transparent",
        transition: "all 0.15s", flexShrink: 0
      }}>
      {label}
    </button>
  );
}

function CollapsibleSection({ title, summary, children, variant = "light" }) {
  const [open, setOpen] = useState(false);
  const vs = {
    light: { hd: C.white, tc: C.charcoal, sc: C.taupe, bd: C.white, br: open ? "rgba(57,75,153,0.25)" : "rgba(15,27,31,0.08)", cb: open ? C.indigo : "rgba(177,165,247,0.15)", cc: open ? C.white : C.lavender },
    indigo: { hd: `linear-gradient(135deg,${C.indigo},#2d3d85)`, tc: C.white, sc: "rgba(255,255,255,0.6)", bd: `linear-gradient(135deg,${C.indigo},#2d3d85)`, br: open ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.08)", cb: open ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.1)", cc: open ? C.white : "rgba(255,255,255,0.6)" },
    forest: { hd: `linear-gradient(135deg,${C.forest},#1d4038)`, tc: C.white, sc: "rgba(255,255,255,0.6)", bd: `linear-gradient(135deg,${C.forest},#1d4038)`, br: open ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0.06)", cb: open ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.1)", cc: open ? C.white : "rgba(255,255,255,0.6)" },
    mint: { hd: C.lightMint, tc: C.forest, sc: C.forest, bd: C.lightMint, br: open ? "rgba(38,84,79,0.3)" : "rgba(38,84,79,0.12)", cb: open ? C.forest : "rgba(38,84,79,0.12)", cc: open ? C.white : C.forest },
    lavender: { hd: C.lightLavender, tc: C.indigo, sc: C.indigo, bd: C.lightLavender, br: open ? "rgba(57,75,153,0.3)" : "rgba(57,75,153,0.15)", cb: open ? C.indigo : "rgba(57,75,153,0.1)", cc: open ? C.white : C.indigo },
  };
  const v = vs[variant] || vs.light;
  return (
    <div style={{
      borderRadius: 16, overflow: "hidden", border: `1px solid ${v.br}`,
      boxShadow: open ? "0 4px 20px rgba(15,27,31,0.1)" : "0 1px 4px rgba(15,27,31,0.05)", transition: "all 0.2s"
    }}>
      <div onClick={() => setOpen(o => !o)}
        style={{
          background: v.hd, padding: "20px 24px", cursor: "pointer",
          display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16
        }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: "Montserrat,sans-serif", fontWeight: 700, fontSize: 16, color: v.tc, marginBottom: summary ? 6 : 0 }}>{title}</div>
          {summary && <p style={{ fontSize: 13, color: v.sc, lineHeight: 1.6, maxWidth: 520 }}>{summary}</p>}
        </div>
        <div style={{
          width: 28, height: 28, borderRadius: "50%", flexShrink: 0, marginTop: 2,
          background: v.cb, display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s"
        }}>
          <ChevronDown size={13} color={v.cc} style={{ transform: open ? "rotate(180deg)" : "none", transition: "transform 0.2s" }} />
        </div>
      </div>
      <div style={{ maxHeight: open ? "900px" : 0, overflow: "hidden", transition: "max-height 0.4s ease", background: v.bd }}>
        <div style={{ padding: "4px 24px 24px" }}>{children}</div>
      </div>
    </div>
  );
}

function ProgressRing({ pct, light = false }) {
  const r = 28, circ = 2 * Math.PI * r, done = pct >= 100;
  const trackColor = light ? "rgba(255,255,255,0.2)" : "rgba(177,165,247,0.25)";
  const fillColor = light ? (done ? "#A7CF99" : "rgba(255,255,255,0.85)") : (done ? C.mint : C.lavender);
  return (
    <svg width={72} height={72}>
      <circle cx={36} cy={36} r={r} fill="none" stroke={trackColor} strokeWidth={5} />
      <circle cx={36} cy={36} r={r} fill="none" stroke={fillColor} strokeWidth={5}
        strokeDasharray={`${(pct / 100) * circ} ${circ}`} strokeDashoffset={circ / 4} strokeLinecap="round"
        style={{ transition: "stroke-dasharray 0.5s ease" }} />
      <text x={36} y={41} textAnchor="middle" fontSize={13} fontWeight={700}
        fontFamily="Montserrat,sans-serif" fill={fillColor}>{pct}%</text>
    </svg>
  );
}

function fireConfetti(canvas) {
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
  const colors = [C.lavender, C.mint, C.peach, C.orange, C.indigo, C.lightLavender, C.lightMint];
  const particles = Array.from({ length: 80 }, () => ({
    x: canvas.width / 2 + (Math.random() - 0.5) * 80,
    y: 0,
    vx: (Math.random() - 0.5) * 6,
    vy: Math.random() * 4 + 2,
    rot: Math.random() * 360,
    vr: (Math.random() - 0.5) * 8,
    w: 6 + Math.random() * 6,
    h: 10 + Math.random() * 8,
    color: colors[Math.floor(Math.random() * colors.length)],
    alpha: 1,
  }));
  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let alive = false;
    particles.forEach(p => {
      p.x += p.vx; p.y += p.vy; p.vy += 0.12;
      p.rot += p.vr; p.alpha -= 0.012;
      if (p.alpha > 0) alive = true;
      ctx.save();
      ctx.globalAlpha = Math.max(0, p.alpha);
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot * Math.PI / 180);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      ctx.restore();
    });
    if (alive) requestAnimationFrame(draw);
  }
  draw();
}

// ── SETUP SCREEN ──────────────────────────────────────────────────────────────
function SetupScreen({ onComplete }) {
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [state, setState] = useState("");
  const [startDate, setStartDate] = useState("");
  const roles = ["Therapist I", "Therapist II", "Therapist III", "Psychologist", "Psychiatric NP", "Licensed Counselor", "Social Worker", "Other"];
  const states = ["AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA", "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD", "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ", "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC", "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY"];
  const valid = name.trim() && role && state && startDate;
  const inputStyle = { width: "100%", border: `1px solid rgba(57,75,153,0.2)`, borderRadius: 10, padding: "11px 14px", fontSize: 14, fontFamily: "Inter,sans-serif", color: C.charcoal, background: C.white, outline: "none" };
  const selectStyle = { ...inputStyle, appearance: "none", backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23B1A5F7' d='M6 8L1 3h10z'/%3E%3C/svg%3E")`, backgroundRepeat: "no-repeat", backgroundPosition: "right 14px center", paddingRight: 36 };
  const labelStyle = { display: "block", fontFamily: "Montserrat,sans-serif", fontWeight: 700, fontSize: 11, color: C.indigo, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 };
  return (
    <div style={{ minHeight: "100vh", background: `linear-gradient(160deg,#ffffff 0%,#f8f7ff 50%,#f0faf0 100%)`, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div className="fadeUp" style={{ background: C.white, borderRadius: 24, padding: "40px 36px", maxWidth: 440, width: "100%", boxShadow: "0 16px 48px rgba(57,75,153,0.15)", position: "relative", overflow: "hidden", border: `1px solid rgba(57,75,153,0.1)` }}>
        <div style={{ position: "absolute", top: -24, right: -24, width: 90, height: 90, borderRadius: "50%", background: "rgba(177,165,247,0.18)" }} />
        <div style={{ position: "absolute", bottom: -20, left: -20, width: 70, height: 70, background: "rgba(167,207,153,0.2)", transform: "rotate(20deg)", borderRadius: 8 }} />
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 28, position: "relative" }}>
          <WheelMark size={28} />
          <div>
            <div style={{ fontFamily: "Montserrat,sans-serif", fontWeight: 800, fontSize: 16, color: C.charcoal }}>Cartwheel</div>
            <div style={{ fontFamily: "Montserrat,sans-serif", fontWeight: 400, fontSize: 10, color: C.taupe, textTransform: "uppercase", letterSpacing: "0.12em" }}>Clinical Onboarding</div>
          </div>
        </div>
        <h2 style={{ fontFamily: "Montserrat,sans-serif", fontWeight: 800, fontSize: 26, color: C.charcoal, marginBottom: 6, lineHeight: 1.2 }}>Welcome to the team.</h2>
        <p style={{ fontSize: 14, color: C.taupe, lineHeight: 1.65, marginBottom: 28 }}>Your personalized onboarding hub is ready and waiting — just add your information to get started.</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div><label style={labelStyle}>First Name</label><input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Regina" style={inputStyle} /></div>
          <div><label style={labelStyle}>Clinical Role</label>
            <select value={role} onChange={e => setRole(e.target.value)} style={selectStyle}>
              <option value="">Select your role</option>
              {roles.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
          <div><label style={labelStyle}>Primary State Serving</label>
            <select value={state} onChange={e => setState(e.target.value)} style={selectStyle}>
              <option value="">Select your state</option>
              {states.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div><label style={labelStyle}>Start Date</label>
            <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} style={inputStyle} />
          </div>
          <button onClick={() => valid && onComplete({ name: name.trim(), role, state, startDate })}
            style={{ background: valid ? `linear-gradient(135deg,${C.indigo},#2d3d85)` : "rgba(15,27,31,0.08)", color: valid ? C.white : C.taupe, border: "none", borderRadius: 12, padding: "14px", fontFamily: "Montserrat,sans-serif", fontWeight: 700, fontSize: 14, cursor: valid ? "pointer" : "default", transition: "all 0.2s", boxShadow: valid ? "0 4px 16px rgba(57,75,153,0.3)" : "none", marginTop: 4 }}>
            Open My Onboarding Hub →
          </button>
        </div>
      </div>
    </div>
  );
}

// ── DATA ──────────────────────────────────────────────────────────────────────
const CHECKLIST_GROUPS = [
  {
    key: "72hrs", label: "Complete Within 72 Hours", accent: C.brick, color: "#fce9ee", Icon: AlertTriangle, note: "Delays here will push your start date.",
    tasks: [
      { id: "c1", text: "Complete your Credentialing Survey", note: "Check email from Credentialing@cartwheelcare.org — use a computer, not mobile" },
      { id: "c2", text: "Set up your Rippling account", note: "Check spam/junk folder for the invitation email" },
    ]
  },
  {
    key: "2weeks", label: "Complete 2 Weeks Before Start", accent: C.bronze, color: C.lightBronze, Icon: Clock, note: "Required to confirm your start date.",
    tasks: [
      { id: "c3", text: "Submit your Clinical Schedule form", note: "You'll be providing 10 clinical hours per week" },
      { id: "c4", text: "Complete State Compliance requirements", note: "Check if your state requires fingerprints or certifications" },
      { id: "c5", text: "Complete Cultural Competency Training", note: "Required for Cartwheel compliance standards" },
    ]
  },
  {
    key: "beforestart", label: "Complete Before Your Start Date", accent: C.indigo, color: C.lavXLight, Icon: FileText,
    tasks: [
      { id: "c6", text: "Complete I-9 verification (W2 employees only)", note: "Full-time and MA part-time employees only" },
      { id: "c7", text: "Complete background check via Checkr", note: "Link sent after Rippling setup — expires in 7 days" },
      { id: "c8", text: "Set up direct deposit & tax withholding in Rippling" },
      { id: "c9", text: "Confirm your personal details in Rippling (legal name, address)" },
    ]
  },
  {
    key: "day1", label: "Day 1 Priorities", accent: C.forest, color: C.mintXLight, Icon: CheckCircle,
    tasks: [
      { id: "c10", text: "Log in — Orientation at 11am EST / 10am CST / 9am MST / 8am PST" },
      { id: "c11", text: "Attend New Employee Orientation (recorded if you can't make it live)" },
      { id: "c12", text: "Complete Rippling trainings: HIPAA, Cybersecurity, Harassment" },
      { id: "c13", text: "Connect with your Clinical Onboarding contact" },
    ]
  },
];

const ALL_IDS = CHECKLIST_GROUPS.flatMap(g => g.tasks.map(t => t.id));

const TABS = [
  { id: "home", label: "Home" },
  { id: "checklist", label: "Checklist" },
  { id: "credentialing", label: "Credentialing" },
  { id: "resources", label: "Resources" },
  { id: "life", label: "Life at Cartwheel" },
  { id: "tools", label: "Clinical Tools" },
  { id: "chat", label: "Ask Copilot" },
];

// ── APP ───────────────────────────────────────────────────────────────────────
export default function App() {
  const [mode, setMode] = useState("clinician");
  const [adminPersona, setAdminPersona] = useState("day1");
  const [user, setUser] = useState(null);
  const [tab, setTab] = useState("home");
  const [checks, setChecks] = useState({});
  const toggle = k => setChecks(p => ({ ...p, [k]: !p[k] }));
  const done = ALL_IDS.filter(id => checks[id]).length;
  const pct = Math.round((done / ALL_IDS.length) * 100);

  const firstName = user ? user.name.split(" ")[0] : "";

  const fmtDate = d => {
    if (!d) return null;
    const dt = new Date(d + "T12:00:00");
    return dt.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" });
  };

  return (
    <>
      <style>{STYLE}</style>
      <ModeBar mode={mode} setMode={setMode} adminPersona={adminPersona} setAdminPersona={setAdminPersona} />
      {mode === "admin" && <AdminView adminPersona={adminPersona} setAdminPersona={setAdminPersona} />}
      {mode === "clinician" && !user && <SetupScreen onComplete={setUser} />}
      {mode === "clinician" && user && <>
      {/* Fixed alert banner */}
      <div style={{ position: "fixed", top: 42, left: 0, right: 0, zIndex: 200, height: 40, background: C.brick, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "0 20px" }}>
        <AlertTriangle size={14} color={C.lightPeach} style={{ flexShrink: 0 }} />
        <p style={{ fontSize: 12, color: C.lightPeach, lineHeight: 1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
          <strong>Heads up:</strong> Delays completing your credentialing survey, Rippling setup, or clinical schedule will push your start date.
        </p>
      </div>
      {/* Sticky header */}
      <div style={{ position: "sticky", top: 82, zIndex: 100, background: "rgba(255,255,255,0.95)", backdropFilter: "blur(8px)", borderBottom: "1px solid rgba(57,75,153,0.1)", padding: "12px 28px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <WheelMark size={22} />
          <span style={{ fontFamily: "Montserrat,sans-serif", fontWeight: 800, fontSize: 15, color: C.charcoal }}>Cartwheel</span>
          <span style={{ fontFamily: "Montserrat,sans-serif", fontWeight: 500, fontSize: 10, color: C.lavender, textTransform: "uppercase", letterSpacing: "0.14em", marginLeft: 2 }}>Clinical</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ background: C.lavXLight, borderRadius: 99, padding: "4px 12px", border: `1px solid rgba(57,75,153,0.12)` }}>
            <span style={{ fontSize: 12, color: C.indigo, fontFamily: "Montserrat,sans-serif", fontWeight: 600 }}>
              {firstName} · {user.role} · {user.state}
              {user.startDate && <span style={{ opacity: 0.65 }}> · Starts {new Date(user.startDate + "T12:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>}
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 7, background: C.lightMint, borderRadius: 99, padding: "5px 13px", border: `1px solid rgba(38,84,79,0.15)` }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: C.forest, animation: "pulse 2s ease infinite" }} />
            <span style={{ fontFamily: "Montserrat,sans-serif", fontSize: 11, fontWeight: 700, color: C.forest }}>{pct}% complete</span>
          </div>
        </div>
      </div>

      {/* Hero */}
      <div style={{ background: `linear-gradient(160deg,#ffffff 0%,#f8f7ff 50%,#f0faf0 100%)`, padding: "52px 28px 0", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: 20, right: 48, width: 88, height: 88, borderRadius: "50%", background: "rgba(177,165,247,0.18)", animation: "floatA 7s ease-in-out infinite" }} />
        <div style={{ position: "absolute", top: 60, right: 160, width: 44, height: 44, background: "rgba(177,165,247,0.12)", transform: "rotate(45deg)", animation: "floatB 5s ease-in-out infinite", borderRadius: 8 }} />
        <div style={{ position: "absolute", bottom: 60, right: 60, width: 60, height: 60, borderRadius: "50%", background: "rgba(167,207,153,0.18)", animation: "floatC 8s ease-in-out infinite" }} />

        <div style={{ maxWidth: 820, margin: "0 auto" }}>
          <FadeIn delay={0}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: C.white, borderRadius: 99, padding: "6px 14px", marginBottom: 20, boxShadow: "0 2px 8px rgba(57,75,153,0.1)", border: `1px solid rgba(57,75,153,0.1)` }}>
              <div style={{ width: 7, height: 7, borderRadius: "50%", background: C.forest, animation: "pulse 2s ease infinite" }} />
              <span style={{ fontFamily: "Montserrat,sans-serif", fontSize: 11, fontWeight: 600, color: C.charcoal }}>{user.role} · Serving {user.state}</span>
            </div>
          </FadeIn>
          <FadeIn delay={80}>
            <h1 style={{ fontFamily: "Montserrat,sans-serif", fontWeight: 800, fontSize: 44, color: C.charcoal, lineHeight: 1.1, letterSpacing: "-1px", marginBottom: 10 }}>
              Welcome,<br /><span style={{ color: C.indigo }}>{firstName}.</span>
            </h1>
          </FadeIn>
          <FadeIn delay={150}>
            <p style={{ fontSize: 15, color: "rgba(15,27,31,0.6)", lineHeight: 1.8, maxWidth: 500, marginBottom: 24 }}>
              You're joining a clinical team making real impact in students' lives. This hub has everything you need to get credentialed, set up, and ready to see students.
            </p>
          </FadeIn>
          {/* Stats */}
          <FadeIn delay={260}>
            <div style={{
              display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 1,
              background: "rgba(57,75,153,0.1)",
              borderRadius: "14px 14px 0 0", overflow: "hidden",
              boxShadow: "0 2px 12px rgba(57,75,153,0.08)"
            }}>
              {[["350+", "School Districts", "Across the US"], ["1.5M", "Students", "In our care network"], ["10hrs", "Per Week", "Clinical commitment"], ["7–10", "Days", "Avg. student wait time"]].map(([n, l, s], i) => (
                <div key={i} style={{ padding: "18px 16px", background: C.white }}>
                  <div style={{ fontFamily: "Montserrat,sans-serif", fontWeight: 800, fontSize: 24, color: C.indigo }}>{n}</div>
                  <div style={{ fontFamily: "Montserrat,sans-serif", fontWeight: 600, fontSize: 11, color: C.charcoal, marginTop: 3 }}>{l}</div>
                  <div style={{ fontSize: 11, color: C.taupe, marginTop: 2 }}>{s}</div>
                </div>
              ))}
            </div>
          </FadeIn>

          {/* Tabs */}
          <FadeIn delay={300}>
            <div style={{ background: C.white, borderRadius: "0 0 14px 14px", display: "flex", overflowX: "auto" }}>
              {TABS.map(t => <TabButton key={t.id} label={t.label} active={tab === t.id} onClick={() => setTab(t.id)} />)}
            </div>
          </FadeIn>
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: 820, margin: "0 auto", padding: "36px 28px 64px" }}>
        {tab === "home" && <HomeTab checks={checks} toggle={toggle} pct={pct} done={done} user={user} fmtDate={fmtDate} />}
        {tab === "checklist" && <ChecklistTab checks={checks} toggle={toggle} done={done} pct={pct} user={user} />}
        {tab === "credentialing" && <CredentialingTab />}
        {tab === "resources" && <ResourcesTab />}
        {tab === "life" && <LifeTab />}
        {tab === "tools" && <ToolsTab />}
        {tab === "chat" && <ChatTab user={user} />}
      </div>

      <div style={{ maxWidth: 820, margin: "0 auto", padding: "0 28px 48px", borderTop: `1px solid rgba(57,75,153,0.08)` }}>
        <p style={{ fontSize: 12, color: C.taupe, lineHeight: 1.6, marginBottom: 4 }}>
          Questions? <a href="mailto:clinical.onboarding@cartwheelcare.org" style={{ color: C.indigo, fontWeight: 600 }}>clinical.onboarding@cartwheelcare.org</a>
        </p>
        <p style={{ fontSize: 10, color: C.taupe, opacity: 0.7, lineHeight: 1.7, fontStyle: "italic" }}>Information subject to change. Independent contractor status does not constitute an employment relationship.</p>
      </div>
      </>}
    </>
  );
}

// ── HOME ──────────────────────────────────────────────────────────────────────
const BLOCK = { padding: "36px 28px" };
const BLOCK_LABEL = { fontFamily: "Montserrat,sans-serif", fontWeight: 700, fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 20 };
const HR_DARK = <div style={{ height: 1, background: "rgba(255,255,255,0.12)", margin: "0" }} />;
const HR_LIGHT = <div style={{ height: 1, background: "rgba(15,27,31,0.07)", margin: "0" }} />;

function HomeTab({ checks, toggle, pct, done, user, fmtDate }) {
  const firstName = user.name.split(" ")[0];
  const [openJ, setOpenJ] = useState(null);
  const urgentItems = [
    { id: "u1", text: "Complete Credentialing Survey", note: "Check email from Credentialing@cartwheelcare.org — use a computer", deadline: "72 hrs" },
    { id: "u2", text: "Set up Rippling account", note: "Check spam folder for the invitation email", deadline: "72 hrs" },
    { id: "u3", text: "Submit Clinical Schedule form", note: "10 clinical hours/week commitment", deadline: "2 wks" },
  ];
  const journey = [
    { key: "a", phase: "Within 72 Hours", items: ["Complete Credentialing Survey", "Set up Rippling account"] },
    { key: "b", phase: "2 Weeks Before Start", items: ["Clinical Schedule form", "State compliance", "Cultural Competency Training"] },
    { key: "c", phase: "Before Your Start Date", items: ["I-9 (W2 only)", "Background check via Checkr", "Direct deposit setup"] },
    { key: "d", phase: "Day 1", items: ["Orientation at 11am EST", "Rippling trainings", "Connect with Clinical team"] },
  ];
  return (
    <div style={{ display: "flex", flexDirection: "column", margin: "-36px -28px -64px" }}>

      {/* ── MAROON: Welcome ── */}
      <div style={{ background: C.brick, ...BLOCK, paddingTop: 48 }} className="fadeUp">
        <div style={{ ...BLOCK_LABEL, color: "rgba(255,255,255,0.5)" }}>Welcome to the team</div>
        <h1 style={{ fontFamily: "Montserrat,sans-serif", fontWeight: 800, fontSize: 36, color: C.white, marginBottom: 12, lineHeight: 1.1 }}>{firstName}.</h1>
        <p style={{ fontSize: 14, color: "rgba(255,255,255,0.8)", lineHeight: 1.75, maxWidth: 540 }}>
          You're joining as a <strong style={{ color: C.white }}>{user.role}</strong> serving <strong style={{ color: C.white }}>{user.state}</strong>.
          {user.startDate && <span> Your start date is <strong style={{ color: C.white }}>{fmtDate(user.startDate)}</strong>.</span>}
        </p>
      </div>

      {/* ── CREAM: Act Now ── */}
      <div style={{ background: C.sand, ...BLOCK }} className="fadeUp">
        <div style={{ ...BLOCK_LABEL, color: C.brick }}>Act Now — Delays Affect Your Start Date</div>
        {urgentItems.map((item, i) => (
          <div key={i}>
            <div onClick={() => toggle(item.id)} style={{ display: "flex", gap: 14, alignItems: "flex-start", padding: "16px 0", cursor: "pointer", opacity: checks[item.id] ? 0.45 : 1 }}>
              <div style={{ width: 20, height: 20, borderRadius: 4, flexShrink: 0, marginTop: 1, border: `2px solid ${checks[item.id] ? C.brick : "rgba(92,30,55,0.35)"}`, background: checks[item.id] ? C.brick : "transparent", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.15s" }}>
                {checks[item.id] && <svg width={10} height={8} viewBox="0 0 10 8"><polyline points="1,4 4,7 9,1" fill="none" stroke={C.white} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 3 }}>
                  <span style={{ fontFamily: "Montserrat,sans-serif", fontWeight: 700, fontSize: 13, color: C.charcoal, textDecoration: checks[item.id] ? "line-through" : "none" }}>{item.text}</span>
                  <span style={{ background: C.brick, color: C.white, fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 3 }}>{item.deadline}</span>
                </div>
                <div style={{ fontSize: 12, color: C.taupe }}>{item.note}</div>
              </div>
            </div>
            {i < urgentItems.length - 1 && HR_LIGHT}
          </div>
        ))}
      </div>

      {/* ── WHITE: Onboarding Path ── */}
      <div style={{ background: C.white, ...BLOCK }} className="fadeUp">
        <div style={{ ...BLOCK_LABEL, color: C.taupe }}>Your Onboarding Path</div>
        {journey.map((s, i) => {
          const isOpen = openJ === s.key;
          return (
            <div key={s.key}>
              <div onClick={() => setOpenJ(isOpen ? null : s.key)} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 0", cursor: "pointer" }}>
                <span style={{ fontFamily: "Montserrat,sans-serif", fontWeight: 700, fontSize: 14, color: C.charcoal }}>{s.phase}</span>
                <ChevronDown size={14} color={C.brick} style={{ transform: isOpen ? "rotate(180deg)" : "none", transition: "transform 0.2s", flexShrink: 0 }} />
              </div>
              <div style={{ maxHeight: isOpen ? "300px" : 0, overflow: "hidden", transition: "max-height 0.35s ease" }}>
                <div style={{ paddingBottom: 16 }}>
                  {s.items.map((item, j) => (
                    <div key={j} style={{ display: "flex", gap: 10, alignItems: "flex-start", marginBottom: j < s.items.length - 1 ? 8 : 0 }}>
                      <div style={{ width: 5, height: 5, borderRadius: "50%", background: C.brick, flexShrink: 0, marginTop: 6, opacity: 0.5 }} />
                      <span style={{ fontSize: 13, color: "#4a5568", lineHeight: 1.55 }}>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
              {i < journey.length - 1 && HR_LIGHT}
            </div>
          );
        })}
      </div>

      {/* ── MAROON: First Week ── */}
      <div style={{ background: C.brick, ...BLOCK }} className="fadeUp">
        <div style={{ ...BLOCK_LABEL, color: "rgba(255,255,255,0.5)" }}>Your First Week at Cartwheel</div>
        {FIRST_WEEK.map((step, i) => (
          <div key={i}>
            <div style={{ display: "flex", gap: 20, padding: "18px 0" }}>
              <div style={{ fontFamily: "Montserrat,sans-serif", fontWeight: 800, fontSize: 22, color: "rgba(255,255,255,0.2)", flexShrink: 0, width: 28, lineHeight: 1 }}>{step.num}</div>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6, flexWrap: "wrap" }}>
                  <span style={{ fontFamily: "Montserrat,sans-serif", fontWeight: 700, fontSize: 14, color: C.white }}>{step.title}</span>
                  <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: "rgba(255,255,255,0.45)" }}>{step.badge}</span>
                </div>
                {step.details.map((d, j) => (
                  <p key={j} style={{ fontSize: 13, color: "rgba(255,255,255,0.65)", lineHeight: 1.7, marginBottom: j < step.details.length - 1 ? 4 : 0 }}>{d}</p>
                ))}
              </div>
            </div>
            {i < FIRST_WEEK.length - 1 && HR_DARK}
          </div>
        ))}
      </div>

      {/* ── CREAM: Contacts ── */}
      <div style={{ background: C.sand, ...BLOCK, paddingBottom: 80 }} className="fadeUp">
        <div style={{ ...BLOCK_LABEL, color: C.taupe }}>Your Onboarding Contacts</div>
        {[
          { name: "Helen Contreras", role: "People Operations Associate", email: "helen@cartwheelcare.org", note: "General onboarding questions" },
          { name: "Clinical Onboarding Team", role: "Clinical setup & compliance", email: "clinical.onboarding@cartwheelcare.org", note: "Schedule, state compliance, I-9" },
          { name: "Credentialing Team", role: "Credentialing & payor enrollment", email: "Credentialing@cartwheelcare.org", note: "Survey, payor enrollment, status" },
        ].map((ct, i, arr) => (
          <div key={i}>
            <div style={{ padding: "16px 0" }}>
              <div style={{ fontFamily: "Montserrat,sans-serif", fontWeight: 700, fontSize: 14, color: C.charcoal, marginBottom: 2 }}>{ct.name}</div>
              <div style={{ fontSize: 12, color: C.taupe, marginBottom: 4 }}>{ct.role} · {ct.note}</div>
              <a href={`mailto:${ct.email}`} style={{ fontSize: 12, color: C.brick, fontWeight: 700 }}>{ct.email}</a>
            </div>
            {i < arr.length - 1 && HR_LIGHT}
          </div>
        ))}
      </div>

    </div>
  );
}

// ── CHECKLIST ─────────────────────────────────────────────────────────────────
function ChecklistTab({ checks, toggle, done, pct, user }) {
  const firstName = user.name.split(" ")[0];
  const [open, setOpen] = useState("72hrs");
  const canvasRef = useRef(null);
  const prevPct = useRef(pct);
  useEffect(() => {
    if (pct === 100 && prevPct.current < 100) fireConfetti(canvasRef.current);
    prevPct.current = pct;
  }, [pct]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <FadeIn delay={0}>
        <SectionHead>{firstName}'s Onboarding Checklist</SectionHead>
        <p style={{ fontSize: 14, color: "#4a5568", lineHeight: 1.75, marginBottom: 20 }}>Each phase has a deadline that affects your start date. Complete in order — don't let the credentialing survey slip past 72 hours.</p>
        <div style={{ background: C.brick, borderRadius: 0, padding: "28px 24px", display: "flex", gap: 20, alignItems: "center", marginBottom: 20, position: "relative", overflow: "hidden", margin: "0 -28px 20px" }}>
          <canvas ref={canvasRef} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }} />
          <ProgressRing pct={pct} light />
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: "Montserrat,sans-serif", fontWeight: 700, fontSize: 15, color: C.white, marginBottom: 6 }}>{done} of {ALL_IDS.length} tasks complete</div>
            <div style={{ background: "rgba(255,255,255,0.15)", borderRadius: 99, height: 5 }}>
              <div style={{ background: pct === 100 ? "#A7CF99" : "rgba(255,255,255,0.7)", borderRadius: 99, height: 5, width: `${pct}%`, transition: "width 0.4s ease" }} />
            </div>
            {pct === 100 && <div className="fadeUp" style={{ fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.8)", marginTop: 6 }}>You're fully onboarded. Welcome to the team!</div>}
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {CHECKLIST_GROUPS.map(group => {
            const secDone = group.tasks.filter(t => checks[t.id]).length;
            const isOpen = open === group.key;
            const isComplete = secDone === group.tasks.length;
            const GroupIcon = group.Icon;
            return (
              <div key={group.key} style={{ background: isComplete ? C.mintXLight : C.white, border: `1px solid ${isOpen ? `${group.accent}55` : isComplete ? "rgba(38,84,79,0.2)" : "rgba(15,27,31,0.08)"}`, borderRadius: 14, overflow: "hidden" }}>
                <button onClick={() => setOpen(isOpen ? null : group.key)} style={{ width: "100%", display: "flex", alignItems: "center", gap: 12, padding: "14px 16px", background: "none" }}>
                  <div style={{ width: 28, height: 28, borderRadius: "50%", flexShrink: 0, background: isOpen ? group.accent : isComplete ? "rgba(38,84,79,0.12)" : "rgba(15,27,31,0.06)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {isComplete
                      ? <svg width={12} height={10} viewBox="0 0 12 10"><polyline points="1,5 5,9 11,1" fill="none" stroke={isOpen ? C.white : C.forest} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                      : <GroupIcon size={13} color={isOpen ? C.white : group.accent} strokeWidth={2} />}
                  </div>
                  <div style={{ flex: 1, textAlign: "left" }}>
                    <span style={{ fontFamily: "Montserrat,sans-serif", fontWeight: 600, fontSize: 14, color: isComplete ? C.forest : C.charcoal }}>{group.label}</span>
                    {group.note && <div style={{ fontSize: 11, color: group.accent, marginTop: 2, fontWeight: 600 }}>{group.note}</div>}
                  </div>
                  <span style={{ fontSize: 12, color: C.taupe, marginRight: 8 }}>{secDone}/{group.tasks.length}</span>
                  <ChevronDown size={12} color={C.indigo} style={{ transform: isOpen ? "rotate(180deg)" : "none", transition: "transform 0.2s", flexShrink: 0 }} />
                </button>
                <div style={{ maxHeight: isOpen ? "800px" : 0, overflow: "hidden", transition: "max-height 0.4s ease" }}>
                  <div style={{ padding: "4px 16px 16px", background: group.color }}>
                    {group.tasks.map((task, ti) => (
                      <div key={ti}>
                        <div onClick={() => toggle(task.id)} style={{ display: "flex", gap: 12, alignItems: "flex-start", padding: "10px 0", cursor: "pointer", opacity: checks[task.id] ? 0.5 : 1 }}>
                          <div style={{ width: 20, height: 20, borderRadius: 5, flexShrink: 0, marginTop: 1, border: `2px solid ${checks[task.id] ? group.accent : `${group.accent}55`}`, background: checks[task.id] ? group.accent : "transparent", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.15s" }}>
                            {checks[task.id] && <svg width={10} height={8} viewBox="0 0 10 8"><polyline points="1,4 4,7 9,1" fill="none" stroke={C.white} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>}
                          </div>
                          <div>
                            <div style={{ fontSize: 13, color: C.charcoal, lineHeight: 1.5, textDecoration: checks[task.id] ? "line-through" : "none" }}>{task.text}</div>
                            {task.note && <div style={{ fontSize: 11, color: group.accent, marginTop: 2, fontWeight: 600 }}>{task.note}</div>}
                          </div>
                        </div>
                        {ti < group.tasks.length - 1 && <div style={{ height: 1, background: "rgba(15,27,31,0.06)" }} />}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </FadeIn>
      <FadeIn delay={80}>
        {(() => {
          const stateReqs = STATE_REQUIREMENTS[user.state];
          return (
            <div style={{ background: C.white, borderRadius: 14, padding: "20px 22px", border: "1px solid rgba(240,112,46,0.2)", boxShadow: "0 2px 10px rgba(240,112,46,0.06)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: stateReqs ? 16 : 0 }}>
                <div style={{ width: 30, height: 30, borderRadius: "50%", background: "rgba(240,112,46,0.1)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <MapPin size={14} color={C.orange} strokeWidth={2} />
                </div>
                <div>
                  <div style={{ fontFamily: "Montserrat,sans-serif", fontWeight: 700, fontSize: 14, color: C.charcoal }}>State Requirements — {user.state}</div>
                  {!stateReqs && <div style={{ fontSize: 12, color: C.taupe, marginTop: 2 }}>No additional requirements for your state. You're all set!</div>}
                </div>
              </div>
              {stateReqs && (
                <>
                  <p style={{ fontSize: 12, color: C.taupe, marginBottom: 16, lineHeight: 1.5 }}>
                    Required for clinicians seeing patients in {stateReqs.label}. Questions? <a href="mailto:compliance@cartwheelcare.org" style={{ color: C.orange, fontWeight: 600 }}>compliance@cartwheelcare.org</a>
                  </p>
                  {stateReqs.items.map((req, i) => (
                    <div key={i} style={{ marginBottom: i < stateReqs.items.length - 1 ? 16 : 0, paddingBottom: i < stateReqs.items.length - 1 ? 16 : 0, borderBottom: i < stateReqs.items.length - 1 ? "1px solid rgba(15,27,31,0.06)" : "none" }}>
                      <div style={{ fontFamily: "Montserrat,sans-serif", fontWeight: 700, fontSize: 13, color: C.orange, marginBottom: 8 }}>{req.title}</div>
                      {req.details.map((d, j) => (
                        <div key={j} style={{ display: "flex", gap: 8, alignItems: "flex-start", marginBottom: j < req.details.length - 1 ? 6 : 0 }}>
                          <div style={{ width: 4, height: 4, borderRadius: "50%", background: C.orange, flexShrink: 0, marginTop: 6, opacity: 0.5 }} />
                          <span style={{ fontSize: 12, color: "#4a5568", lineHeight: 1.6 }}>{d}</span>
                        </div>
                      ))}
                    </div>
                  ))}
                </>
              )}
            </div>
          );
        })()}
      </FadeIn>
    </div>
  );
}

// ── CREDENTIALING ─────────────────────────────────────────────────────────────
function CredentialingTab() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
      <FadeIn delay={0}>
        <div style={{ background: C.brick, borderRadius: 16, padding: "22px 24px", boxShadow: "0 4px 16px rgba(92,30,55,0.18)" }}>
          <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
            <AlertTriangle size={18} color={C.lightPeach} style={{ flexShrink: 0, marginTop: 2 }} />
            <div>
              <div style={{ fontFamily: "Montserrat,sans-serif", fontWeight: 700, fontSize: 15, color: C.white, marginBottom: 6 }}>Credentialing is the #1 delay driver</div>
              <p style={{ fontSize: 13, color: "rgba(255,255,255,0.75)", lineHeight: 1.7 }}>If your credentialing survey isn't completed within 72 hours, your start date will be pushed.</p>
            </div>
          </div>
        </div>
      </FadeIn>
      <FadeIn delay={50}>
        <SectionHead>Credentialing Survey</SectionHead>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          {[
            { Icon: Mail, title: "Check your email", desc: "Survey link from Credentialing@cartwheelcare.org within a few hours of your offer." },
            { Icon: Globe, title: "Complete on a computer", desc: "Desktop or laptop only — not mobile. Set aside 20–30 minutes." },
            { Icon: Clock, title: "Complete within 72 hours", desc: "Link expires. Email Credentialing@cartwheelcare.org if you need more time." },
            { Icon: CheckCircle, title: "Watch for follow-up", desc: "Our team may reach out to verify information. Respond promptly to stay on track." },
          ].map((step, i) => (
            <HoverCard key={i} style={{ background: C.lightLavender, borderRadius: 14, padding: "16px 18px", border: `1px solid rgba(57,75,153,0.15)`, display: "flex", gap: 12, alignItems: "flex-start" }}>
              <div style={{ width: 34, height: 34, borderRadius: "50%", flexShrink: 0, background: C.white, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 2px 8px rgba(57,75,153,0.15)` }}>
                <step.Icon size={15} color={C.indigo} strokeWidth={1.8} />
              </div>
              <div>
                <div style={{ fontFamily: "Montserrat,sans-serif", fontWeight: 700, fontSize: 13, color: C.indigo, marginBottom: 3 }}>{step.title}</div>
                <div style={{ fontSize: 12, color: "#4a5568", lineHeight: 1.6 }}>{step.desc}</div>
              </div>
            </HoverCard>
          ))}
        </div>
      </FadeIn>
      <FadeIn delay={100}>
        <SectionHead>State Compliance</SectionHead>
        <div style={{ background: C.lightLavender, borderRadius: 14, padding: "18px 20px", border: `1px solid rgba(57,75,153,0.15)`, marginBottom: 10 }}>
          <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 10 }}>
            <MapPin size={14} color={C.indigo} strokeWidth={2} />
            <span style={{ fontFamily: "Montserrat,sans-serif", fontWeight: 700, fontSize: 12, color: C.indigo, textTransform: "uppercase", letterSpacing: "0.08em" }}>State-Specific Requirements</span>
          </div>
          <p style={{ fontSize: 13, color: "#4a5568", lineHeight: 1.7 }}>Some states require fingerprints or certifications. Check the <a href="https://sites.google.com/cartwheelcare.org/cartwheelclinicalonboarding/home" target="_blank" rel="noreferrer" style={{ color: C.indigo, fontWeight: 600 }}>Clinical Onboarding Website</a> for your state's requirements.</p>
        </div>
        <div style={{ background: C.lightMint, borderRadius: 14, padding: "14px 18px", border: `1px solid rgba(38,84,79,0.15)` }}>
          <p style={{ fontSize: 13, color: C.forest, lineHeight: 1.7 }}>Completed a requirement before? Email <a href="mailto:compliance@cartwheelcare.org" style={{ color: C.forest, fontWeight: 700, textDecoration: "underline" }}>compliance@cartwheelcare.org</a> to verify.</p>
        </div>
      </FadeIn>
      <FadeIn delay={140}>
        <SectionHead>Cultural Competency Training</SectionHead>
        <div style={{ background: C.lavXLight, borderRadius: 14, padding: "18px 20px", border: `1px solid rgba(57,75,153,0.12)` }}>
          <p style={{ fontSize: 13, color: "#4a5568", lineHeight: 1.7, marginBottom: 14 }}>All clinicians must complete Cartwheel's Cultural Competency Training to meet our compliance standards.</p>
          <a href="https://drive.google.com/file/d/1en33We1N_XCOFIhMv7gfe_DNa4nYscH2/view" target="_blank" rel="noreferrer"
            style={{ display: "inline-flex", alignItems: "center", gap: 8, background: C.indigo, color: C.white, borderRadius: 10, padding: "10px 18px", fontSize: 13, fontWeight: 700, fontFamily: "Montserrat,sans-serif", textDecoration: "none" }}>
            <ExternalLink size={13} /> View Training Slidedeck
          </a>
        </div>
      </FadeIn>
      <FadeIn delay={170}>
        <SectionHead>Get Help</SectionHead>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          {[
            { title: "Credentialing questions", bg: C.lavXLight, ac: C.indigo, email: "Credentialing@cartwheelcare.org", desc: "Survey issues, payor enrollment, link expired" },
            { title: "State compliance & I-9", bg: C.mintXLight, ac: C.forest, email: "clinical.onboarding@cartwheelcare.org", desc: "Fingerprints, certifications, W2 I-9" },
          ].map((c, i) => (
            <div key={i} style={{ background: c.bg, borderRadius: 14, padding: "16px 18px", border: `1px solid ${c.ac}18` }}>
              <div style={{ fontFamily: "Montserrat,sans-serif", fontWeight: 700, fontSize: 13, color: c.ac, marginBottom: 4 }}>{c.title}</div>
              <div style={{ fontSize: 12, color: C.taupe, marginBottom: 8, lineHeight: 1.5 }}>{c.desc}</div>
              <a href={`mailto:${c.email}`} style={{ fontSize: 12, color: c.ac, fontWeight: 700 }}>{c.email}</a>
            </div>
          ))}
        </div>
      </FadeIn>
    </div>
  );
}

// ── RESOURCES ─────────────────────────────────────────────────────────────────
function ResourcesTab() {
  const tools = [
    { Icon: Settings, title: "Rippling", desc: "HR system — pay, trainings & onboarding paperwork" },
    { Icon: Globe, title: "Clinical Onboarding Website", desc: "Your primary guide — bookmark this page", link: "https://sites.google.com/cartwheelcare.org/cartwheelclinicalonboarding/home" },
    { Icon: BookOpen, title: "Guru", desc: "Internal knowledge base — access after Day 1" },
    { Icon: Video, title: "Zoom", desc: "Telehealth sessions & team meetings" },
    { Icon: FileText, title: "Clinical Schedule Form", desc: "Submit your 10hr/week availability", link: "https://docs.google.com/forms/d/e/1FAIpQLSeKeDcVkiEhdmBOKNT0S2CPEXYNlXY3YxSOctim4WLuUrdY_w/viewform" },
    { Icon: Shield, title: "Compliance Portal", desc: "State requirements, fingerprints & certifications" },
  ];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 26 }}>
      <FadeIn delay={0}>
        <SectionHead>Tools & Links</SectionHead>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          {tools.map((t, i) => (
            <HoverCard key={i} style={{ background: C.lightSky, borderRadius: 14, padding: "18px", border: `1px solid ${C.sky}` }}>
              <div style={{ marginBottom: 10 }}><t.Icon size={18} color={C.indigo} strokeWidth={1.8} /></div>
              <div style={{ fontFamily: "Montserrat,sans-serif", fontWeight: 700, fontSize: 13, color: C.indigo, marginBottom: 4 }}>{t.title}</div>
              <div style={{ fontSize: 13, color: "#2d4a6b", lineHeight: 1.55, marginBottom: t.link ? 10 : 0 }}>{t.desc}</div>
              {t.link && <a href={t.link} target="_blank" rel="noreferrer" style={{ fontSize: 12, color: C.indigo, fontWeight: 700, display: "flex", alignItems: "center", gap: 4 }}><ExternalLink size={11} /> Open</a>}
            </HoverCard>
          ))}
        </div>
      </FadeIn>
      <FadeIn delay={60}>
        <SectionHead>Key Contacts</SectionHead>
        <div style={{ background: C.white, borderRadius: 16, overflow: "hidden", border: "1px solid rgba(15,27,31,0.08)" }}>
          {[
            { name: "Helen Contreras", role: "People Operations Associate", email: "helen@cartwheelcare.org", bg: C.white },
            { name: "Clinical Onboarding", role: "Clinical setup & compliance", email: "clinical.onboarding@cartwheelcare.org", bg: "rgba(167,207,153,0.06)" },
            { name: "Credentialing Team", role: "Payor enrollment & credentialing", email: "Credentialing@cartwheelcare.org", bg: C.white },
            { name: "Compliance Team", role: "State requirements & certifications", email: "compliance@cartwheelcare.org", bg: "rgba(167,207,153,0.06)" },
          ].map((ct, i, arr) => (
            <div key={i} style={{ padding: "14px 20px", background: ct.bg, borderBottom: i < arr.length - 1 ? "1px solid rgba(15,27,31,0.05)" : "none" }}>
              <div style={{ fontFamily: "Montserrat,sans-serif", fontWeight: 700, fontSize: 13, color: C.charcoal }}>{ct.name}</div>
              <div style={{ fontSize: 12, color: C.taupe, marginTop: 1, marginBottom: 3 }}>{ct.role}</div>
              <a href={`mailto:${ct.email}`} style={{ fontSize: 12, color: C.indigo, fontWeight: 600 }}>{ct.email}</a>
            </div>
          ))}
        </div>
      </FadeIn>
      <FadeIn delay={100}>
        <SectionHead>As a 1099 Contractor</SectionHead>
        <div style={{ background: C.lightLavender, borderRadius: 14, padding: "18px 20px", border: `1px solid rgba(57,75,153,0.15)` }}>
          <SectionLabel color={C.indigo}>Important to Know</SectionLabel>
          {["You are an independent contractor — not a Cartwheel employee",
            "You are responsible for your own taxes (no withholding by Cartwheel)",
            "You'll receive a 1099-NEC at year end if you earn $600 or more",
            "I-9 verification applies to W2 employees only (full-time + MA part-time)",
            "You set your own schedule — 10 clinical hours per week is the commitment",
          ].map((text, i) => (
            <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start", marginBottom: i < 4 ? 8 : 0 }}>
              <div style={{ width: 5, height: 5, borderRadius: "50%", background: C.indigo, flexShrink: 0, marginTop: 5 }} />
              <span style={{ fontSize: 13, color: "#4a5568", lineHeight: 1.6 }}>{text}</span>
            </div>
          ))}
        </div>
      </FadeIn>
    </div>
  );
}

// ── LIFE AT CARTWHEEL ─────────────────────────────────────────────────────────
function LifeTab() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
      <FadeIn delay={0}>
        <div style={{ background: `linear-gradient(135deg,${C.indigo},#2d3d85)`, borderRadius: 20, padding: "28px", position: "relative", overflow: "hidden", boxShadow: "0 8px 28px rgba(57,75,153,0.25)" }}>
          <div style={{ position: "absolute", top: -20, right: -20, width: 100, height: 100, borderRadius: "50%", background: "rgba(255,255,255,0.05)" }} />
          <div style={{ position: "absolute", bottom: -16, right: 50, width: 60, height: 60, background: "rgba(177,165,247,0.12)", transform: "rotate(20deg)", borderRadius: 8 }} />
          <SectionLabel light>Why Clinicians Join Cartwheel</SectionLabel>
          <p style={{ fontSize: 15, color: C.lightLavender, lineHeight: 1.75, marginBottom: 10, fontWeight: 500 }}>Most clinicians have worked in settings where students wait 6–12 weeks to be seen. At Cartwheel, that wait is 7–10 days.</p>
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.45)", fontStyle: "italic" }}>Nation's largest mental health telehealth partner to K-12 schools.</p>
        </div>
      </FadeIn>
      <FadeIn delay={40}>
        <CollapsibleSection title="What We Do" variant="lavender" summary="Cartwheel partners directly with K-12 districts to make quality mental health care accessible when students need it.">
          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 10 }}>
            {[
              { Icon: UserCheck, text: "School staff refer a student in seconds through our secure portal. We confirm eligibility, match them to a multilingual clinician, and most students begin care within 7–10 days." },
              { Icon: Stethoscope, text: "Our care teams provide 1:1 therapy, parent guidance, and medication management for non-controlled substances, with warm handoffs to community partners when needed." },
              { Icon: BarChart2, text: "Schools get real-time visibility into progress while families access affordable, culturally responsive care — through Medicaid, commercial insurance, or district coverage." },
            ].map(({ Icon, text }, i) => (
              <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start", background: C.white, borderRadius: 12, padding: "14px 16px", border: `1px solid rgba(57,75,153,0.1)` }}>
                <div style={{ width: 32, height: 32, borderRadius: "50%", flexShrink: 0, background: C.lavXLight, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Icon size={14} color={C.indigo} strokeWidth={1.8} />
                </div>
                <span style={{ fontSize: 13, color: "#4a5568", lineHeight: 1.7 }}>{text}</span>
              </div>
            ))}
            <div style={{ background: C.lightMint, borderRadius: 12, padding: "14px 16px", border: `1px solid rgba(38,84,79,0.2)` }}>
              <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 6 }}>
                <Zap size={13} color={C.forest} strokeWidth={2} />
                <span style={{ fontFamily: "Montserrat,sans-serif", fontWeight: 700, fontSize: 11, color: C.forest, textTransform: "uppercase", letterSpacing: "0.08em" }}>Why it matters</span>
              </div>
              <p style={{ fontSize: 13, color: C.forest, lineHeight: 1.7, fontWeight: 500 }}>Students get fast, evidence-based support — without the 6–12 week waits that plague traditional referral systems.</p>
            </div>
          </div>
        </CollapsibleSection>
      </FadeIn>
      <FadeIn delay={70}>
        <CollapsibleSection title="What Sets Us Apart" variant="forest" summary="Remote-first, low admin burden, mission-driven — built for clinicians who want to do meaningful work.">
          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 8 }}>
            {[
              { title: "Low admin burden", desc: "We handle billing, scheduling, and payor enrollment so you can focus entirely on your students." },
              { title: "Flexible scheduling", desc: "You set your hours. 10 clinical hours per week, fully remote, on your schedule." },
              { title: "Multilingual matching", desc: "We match students to clinicians based on language, culture, and clinical fit." },
              { title: "Real outcomes", desc: "58% of students achieve full remission of anxiety. 3x reduction in moderate-to-severe depression." },
            ].map((item, i) => (
              <HoverCard key={i} style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 12, padding: "15px 18px" }}>
                <div style={{ fontFamily: "Montserrat,sans-serif", fontWeight: 700, fontSize: 13, color: C.white, marginBottom: 4 }}>{item.title}</div>
                <div style={{ fontSize: 13, color: "rgba(255,255,255,0.65)", lineHeight: 1.6 }}>{item.desc}</div>
              </HoverCard>
            ))}
          </div>
        </CollapsibleSection>
      </FadeIn>
      <FadeIn delay={100}>
        <CollapsibleSection title="Our Values" variant="mint" summary="Five values that guide how we work, make decisions, and show up for each other and for the students we serve.">
          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 8 }}>
            {[
              { name: "Human", desc: "Warmth and compassion in all relationships — not just as colleagues, but as humans." },
              { name: "Humble", desc: "We prefer learning to being right. Mission above individual preference." },
              { name: "Accountable", desc: "Clear goals, high standards, own mistakes, deliver on commitments." },
              { name: "Innovative", desc: "Push for continuous improvement. Once decided, move with conviction." },
              { name: "Resilient", desc: "Support each other in overcoming challenges with grit and fierce commitment." },
            ].map((v, i) => (
              <HoverCard key={i} style={{ background: C.lightMint, border: `1px solid rgba(38,84,79,0.15)`, borderRadius: 12, padding: "15px 18px" }}>
                <div style={{ fontFamily: "Montserrat,sans-serif", fontWeight: 700, fontSize: 13, color: C.forest, marginBottom: 4 }}>{v.name}</div>
                <div style={{ fontSize: 13, color: "rgba(38,84,79,0.75)", lineHeight: 1.6 }}>{v.desc}</div>
              </HoverCard>
            ))}
          </div>
        </CollapsibleSection>
      </FadeIn>
    </div>
  );
}

// ── CLINICAL TOOLS ────────────────────────────────────────────────────────────
function ToolsTab() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
      <FadeIn delay={0}>
        <SectionHead>Clinical Tools</SectionHead>
        <div style={{ background: `linear-gradient(135deg,${C.indigo},#2d3d85)`, borderRadius: 16, padding: "32px", textAlign: "center", boxShadow: "0 8px 28px rgba(57,75,153,0.2)" }}>
          <div style={{ width: 56, height: 56, borderRadius: "50%", background: "rgba(177,165,247,0.2)", margin: "0 auto 16px", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Stethoscope size={26} color={C.lightLavender} strokeWidth={1.5} />
          </div>
          <div style={{ fontFamily: "Montserrat,sans-serif", fontWeight: 800, fontSize: 20, color: C.indigo, background: C.white, display: "inline-block", borderRadius: 10, padding: "4px 20px", marginBottom: 12 }}>Coming Soon</div>
          <p style={{ fontSize: 14, color: "rgba(255,255,255,0.65)", lineHeight: 1.75, maxWidth: 400, margin: "0 auto" }}>This section will cover your clinical toolstack — EHR access, telehealth platform setup, scheduling, and session documentation guides.</p>
        </div>
      </FadeIn>
      <FadeIn delay={60}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10 }}>
          {["EHR & Documentation", "Telehealth Platform", "Session Scheduling", "Clinical Protocols", "Medication Management", "Referral & Handoffs"].map((label, i) => (
            <div key={i} style={{ background: `linear-gradient(135deg,${C.white} 0%,#f8f7ff 100%)`, borderRadius: 12, padding: "18px 16px", border: `1px solid rgba(57,75,153,0.1)`, textAlign: "center", boxShadow: "0 1px 4px rgba(57,75,153,0.06)" }}>
              <ClipboardList size={20} color={C.lavender} strokeWidth={1.5} style={{ margin: "0 auto 8px" }} />
              <div style={{ fontFamily: "Montserrat,sans-serif", fontWeight: 700, fontSize: 12, color: C.indigo }}>{label}</div>
              <div style={{ fontSize: 11, color: C.lavender, marginTop: 4, fontWeight: 500 }}>Coming soon</div>
            </div>
          ))}
        </div>
      </FadeIn>
    </div>
  );
}

// ── ASK COPILOT ───────────────────────────────────────────────────────────────
function ChatTab({ user }) {
  const firstName = user.name.split(" ")[0];
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);
  const SUGGESTIONS = [
    "When is my credentialing survey due?",
    "What happens if I miss the 72-hour window?",
    "Do I need to complete an I-9 as a 1099 contractor?",
    "How does payor enrollment work?",
  ];
  const send = async (text) => {
    const q = text || input.trim();
    if (!q || loading) return;
    setInput("");
    const newMessages = [...messages, { role: "user", content: q }];
    setMessages(newMessages);
    setLoading(true);
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514", max_tokens: 1000,
          system: `You are Cartwheel Copilot, a warm onboarding assistant for new Cartwheel clinical staff. The clinician's name is ${firstName}, role is ${user.role}, serving ${user.state}. They are a 1099 independent contractor. Key facts: credentialing survey within 72hrs; clinical schedule form 2 weeks before start; Rippling setup within 72hrs; I-9 for W2 only; Checkr link expires 7 days; orientation at 11am EST. Be warm, concise, 3-4 sentences.`,
          messages: newMessages.map(m => ({ role: m.role, content: m.content })),
        }),
      });
      const data = await res.json();
      const reply = data.content?.find(b => b.type === "text")?.text || "Please email clinical.onboarding@cartwheelcare.org.";
      setMessages(p => [...p, { role: "assistant", content: reply }]);
    } catch (e) {
      setMessages(p => [...p, { role: "assistant", content: "Something went wrong. Please email clinical.onboarding@cartwheelcare.org." }]);
    }
    setLoading(false);
  };
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, loading]);
  const renderMarkdown = text =>
    text.split("\n").filter(l => l.trim()).map((line, i) => {
      const bold = line.replace(/\*\*(.*?)\*\*/g, (_, m) => `<strong>${m}</strong>`);
      return <p key={i} style={{ fontSize: 14, color: C.charcoal, lineHeight: 1.7, marginBottom: 6 }} dangerouslySetInnerHTML={{ __html: bold }} />;
    });
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
      <FadeIn delay={0}>
        <div style={{ background: `linear-gradient(135deg,${C.indigo},#2d3d85)`, borderRadius: 14, padding: "14px 18px", display: "flex", alignItems: "center", gap: 12, marginBottom: 16, boxShadow: "0 4px 16px rgba(57,75,153,0.2)" }}>
          <div style={{ width: 38, height: 38, borderRadius: 10, flexShrink: 0, background: "rgba(177,165,247,0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <WheelMark size={22} />
          </div>
          <div>
            <div style={{ fontFamily: "Montserrat,sans-serif", fontWeight: 700, fontSize: 13, color: C.white }}>Cartwheel Copilot</div>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.5)" }}>Ask anything about your clinical onboarding, {firstName}</div>
          </div>
        </div>
        <div style={{ minHeight: 320, maxHeight: 420, overflowY: "auto", display: "flex", flexDirection: "column", gap: 12, marginBottom: 12 }}>
          {messages.length === 0 && (
            <div>
              <div style={{ fontFamily: "Montserrat,sans-serif", fontWeight: 700, fontSize: 11, color: C.taupe, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 10 }}>Try asking</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {SUGGESTIONS.map((s, i) => (
                  <button key={i} onClick={() => send(s)}
                    style={{ background: C.white, border: `1px solid rgba(57,75,153,0.12)`, borderRadius: 99, padding: "9px 16px", fontSize: 13, color: C.charcoal, textAlign: "left", transition: "all 0.15s", fontFamily: "inherit" }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = C.indigo; e.currentTarget.style.color = C.indigo; e.currentTarget.style.background = C.lavXLight; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(57,75,153,0.12)"; e.currentTarget.style.color = C.charcoal; e.currentTarget.style.background = C.white; }}>
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}
          {messages.map((m, i) => (
            <div key={i} className="fadeUp" style={{ display: "flex", gap: 10, flexDirection: m.role === "user" ? "row-reverse" : "row", alignItems: "flex-end" }}>
              {m.role === "assistant" && (
                <div style={{ width: 32, height: 32, borderRadius: "50%", flexShrink: 0, background: `linear-gradient(135deg,${C.indigo},#2d3d85)`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <WheelMark size={18} />
                </div>
              )}
              <div style={{
                maxWidth: "75%",
                background: m.role === "user" ? `linear-gradient(135deg,${C.forest},#1d4038)` : C.white,
                color: m.role === "user" ? C.white : C.charcoal,
                borderRadius: m.role === "user" ? "14px 14px 4px 14px" : "14px 14px 14px 4px",
                padding: "10px 14px",
                border: m.role === "assistant" ? `1px solid rgba(57,75,153,0.1)` : "none",
                boxShadow: "0 2px 8px rgba(15,27,31,0.08)"
              }}>
                {m.role === "user" ? <p style={{ fontSize: 14, lineHeight: 1.6 }}>{m.content}</p> : renderMarkdown(m.content)}
              </div>
            </div>
          ))}
          {loading && (
            <div style={{ display: "flex", gap: 10, alignItems: "flex-end" }}>
              <div style={{ width: 32, height: 32, borderRadius: "50%", flexShrink: 0, background: `linear-gradient(135deg,${C.indigo},#2d3d85)`, display: "flex", alignItems: "center", justifyContent: "center" }}><WheelMark size={18} /></div>
              <div style={{ background: C.white, borderRadius: "14px 14px 14px 4px", padding: "12px 16px", border: `1px solid rgba(57,75,153,0.1)`, display: "flex", gap: 5, alignItems: "center" }}>
                {[0, 1, 2].map(i => <div key={i} style={{ width: 7, height: 7, borderRadius: "50%", background: C.lavender, animation: `pulse 1.4s ease ${i * 0.2}s infinite` }} />)}
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>
        <div style={{ background: C.white, borderRadius: 14, padding: "8px 8px 8px 16px", border: `1px solid rgba(57,75,153,0.15)`, boxShadow: "0 2px 12px rgba(57,75,153,0.08)", display: "flex", alignItems: "center", gap: 8 }}>
          <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && send()}
            placeholder={`Ask anything, ${firstName}...`}
            style={{ flex: 1, border: "none", outline: "none", fontSize: 14, fontFamily: "Inter,sans-serif", color: C.charcoal, background: "transparent", padding: "6px 0" }} />
          <button onClick={() => send()} disabled={!input.trim() || loading}
            style={{ background: input.trim() && !loading ? `linear-gradient(135deg,${C.indigo},#2d3d85)` : "rgba(15,27,31,0.08)", border: "none", borderRadius: 10, padding: "8px 14px", display: "flex", alignItems: "center", gap: 6, transition: "all 0.15s" }}>
            <Send size={13} color={input.trim() && !loading ? C.white : C.taupe} />
            <span style={{ fontFamily: "Montserrat,sans-serif", fontWeight: 700, fontSize: 12, color: input.trim() && !loading ? C.white : C.taupe }}>Send</span>
          </button>
        </div>
        <p style={{ fontSize: 11, color: C.taupe, marginTop: 8, textAlign: "center", fontStyle: "italic" }}>Powered by Claude · Grounded in your clinical onboarding content</p>
      </FadeIn>
    </div>
  );
}