import { useState } from "react";

const C = {
  charcoal: "#0F1B1F", indigo: "#394B99", lavender: "#B1A5F7", white: "#FFFFFF",
  orange: "#F0702E", forest: "#26544F", brick: "#5C1E37",
};

const PERSONA_CHIPS = [
  { key: "day1", label: "Regina", sub: "Day 1", dotColor: "#e8b96a" },
  { key: "day3", label: "Marcus", sub: "Day 3", dotColor: "#F0702E" },
  { key: "day7", label: "Priya",  sub: "Day 7", dotColor: "#e85d5d" },
];

function WheelMark({ size = 20 }) {
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

function ClinicianIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
    </svg>
  );
}

function AdminIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
  );
}

export default function ModeBar({ mode, setMode, adminPersona, setAdminPersona }) {
  const [hovClinician, setHovClinician] = useState(false);
  const [hovAdmin, setHovAdmin] = useState(false);

  const btnBase = {
    display: "flex", alignItems: "center", gap: 9,
    padding: "0 24px", height: "100%",
    fontFamily: "Montserrat,sans-serif", fontWeight: 700, fontSize: 12,
    letterSpacing: "0.04em", borderBottom: "2px solid transparent",
    transition: "all 0.2s", flexShrink: 0,
  };

  const clinicianStyle = {
    ...btnBase,
    color: mode === "clinician" ? C.white : hovClinician ? "rgba(255,255,255,0.7)" : "rgba(255,255,255,0.4)",
    borderBottomColor: mode === "clinician" ? C.lavender : "transparent",
    background: mode === "clinician" ? "rgba(177,165,247,0.06)" : hovClinician ? "rgba(255,255,255,0.03)" : "transparent",
  };

  const adminStyle = {
    ...btnBase,
    color: mode === "admin" ? C.white : hovAdmin ? "rgba(255,255,255,0.7)" : "rgba(255,255,255,0.4)",
    borderBottomColor: mode === "admin" ? C.lavender : "transparent",
    background: mode === "admin" ? "rgba(177,165,247,0.06)" : hovAdmin ? "rgba(255,255,255,0.03)" : "transparent",
  };

  return (
    <div style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 300,
      height: 42, background: C.charcoal,
      display: "flex", alignItems: "stretch",
      borderBottom: "1px solid rgba(255,255,255,0.06)",
    }}>
      {/* Logo mark */}
      <div style={{ display: "flex", alignItems: "center", padding: "0 16px 0 18px", borderRight: "1px solid rgba(255,255,255,0.07)" }}>
        <WheelMark size={18} />
      </div>

      {/* Clinician View button */}
      <button
        style={clinicianStyle}
        onClick={() => setMode("clinician")}
        onMouseEnter={() => setHovClinician(true)}
        onMouseLeave={() => setHovClinician(false)}
      >
        <ClinicianIcon />
        Clinician View
      </button>

      {/* Divider */}
      <div style={{ width: 1, background: "rgba(255,255,255,0.07)", margin: "8px 0" }} />

      {/* Admin / Ops View button */}
      <button
        style={adminStyle}
        onClick={() => setMode("admin")}
        onMouseEnter={() => setHovAdmin(true)}
        onMouseLeave={() => setHovAdmin(false)}
      >
        <AdminIcon />
        Admin / Ops View
      </button>

      {/* Persona chips — only visible in admin mode */}
      {mode === "admin" && (
        <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "0 20px", marginLeft: "auto" }}>
          <span style={{
            fontSize: 10, fontWeight: 700, fontFamily: "Montserrat,sans-serif",
            color: "rgba(255,255,255,0.25)", textTransform: "uppercase", letterSpacing: "0.1em",
          }}>
            Persona
          </span>
          {PERSONA_CHIPS.map(chip => {
            const active = adminPersona === chip.key;
            return (
              <PersonaChip
                key={chip.key}
                chip={chip}
                active={active}
                onClick={() => setAdminPersona(chip.key)}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}

function PersonaChip({ chip, active, onClick }) {
  const [hov, setHov] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: "flex", alignItems: "center", gap: 7,
        padding: "4px 12px", borderRadius: 99,
        fontFamily: "Montserrat,sans-serif", fontWeight: 700, fontSize: 11,
        border: `1.5px solid ${active ? "#B1A5F7" : hov ? "rgba(255,255,255,0.25)" : "rgba(255,255,255,0.1)"}`,
        color: active ? "#FFFFFF" : hov ? "rgba(255,255,255,0.75)" : "rgba(255,255,255,0.45)",
        background: active ? "rgba(177,165,247,0.12)" : "transparent",
        transition: "all 0.18s",
      }}
    >
      <span style={{
        width: 6, height: 6, borderRadius: "50%",
        background: chip.dotColor, flexShrink: 0,
        animation: "pulse 2s ease infinite",
      }} />
      {chip.label} · {chip.sub}
    </button>
  );
}
