"use client";
import { useState, type CSSProperties, type ReactNode } from "react";

const A = "#C4553A";
const wrap: CSSProperties = { maxWidth: 1060, margin: "0 auto", padding: "0 24px" };
const BLUE = "#3b82f6";
const GREEN = "#10b981";
const AMBER = "#f59e0b";
const RED = "#ef4444";
const PURPLE = "#8b5cf6";
const GRAY = "#94a3b8";
const TEAL = "#14b8a6";

/* ── helpers ── */
function Sec({ children, id, white }: { children: ReactNode; id?: string; white?: boolean }) {
  return (
    <section id={id} style={{ background: white ? "#fff" : "#f9fafb", padding: "72px 0" }}>
      <div style={wrap}>{children}</div>
    </section>
  );
}
function Tag({ children }: { children: string }) {
  return <p style={{ color: A, fontSize: 12, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 10 }}>{children}</p>;
}
function H2({ children }: { children: ReactNode }) {
  return <h2 style={{ fontSize: 26, fontWeight: 800, color: "#1a1a2e", marginBottom: 10, lineHeight: 1.2 }}>{children}</h2>;
}
function Sub({ children }: { children: ReactNode }) {
  return <p style={{ fontSize: 15, color: "#64748b", lineHeight: 1.7, maxWidth: 700, marginBottom: 28 }}>{children}</p>;
}

/* ── flow step ── */
function FlowNode({ num, label, tool, color, gap }: { num: number; label: string; tool: string; color: string; gap?: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
      <div style={{
        width: 36, height: 36, borderRadius: "50%", background: color,
        display: "flex", alignItems: "center", justifyContent: "center",
        color: "#fff", fontSize: 14, fontWeight: 800, flexShrink: 0,
      }}>{num}</div>
      <div>
        <div style={{ fontSize: 14, fontWeight: 700, color: "#1a1a2e" }}>{label}</div>
        <div style={{ fontSize: 11, color: "#94a3b8" }}>{tool}</div>
        {gap && <div style={{ fontSize: 11, color: RED, fontWeight: 600, marginTop: 2 }}>{gap}</div>}
      </div>
    </div>
  );
}

/* ── module card ── */
function Module({ name, desc, tool, state, color, icon }: { name: string; desc: string; tool: string; state: string; color: string; icon: string }) {
  const stateColor = state === "Working" ? GREEN : state === "Degraded" ? AMBER : state === "Broken" ? RED : GRAY;
  return (
    <div style={{
      background: "#fff", borderRadius: 14, border: "1px solid #e5e7eb", padding: 20,
      borderTop: `3px solid ${color}`, position: "relative",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
        <span style={{ fontSize: 20 }}>{icon}</span>
        <span style={{ fontSize: 14, fontWeight: 700, color: "#1a1a2e" }}>{name}</span>
      </div>
      <p style={{ fontSize: 12, color: "#64748b", lineHeight: 1.6, marginBottom: 10 }}>{desc}</p>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: 10, color: "#94a3b8" }}>{tool}</span>
        <span style={{ fontSize: 10, fontWeight: 700, color: stateColor, background: `${stateColor}15`, padding: "2px 8px", borderRadius: 99 }}>{state}</span>
      </div>
    </div>
  );
}

/* ═══════ INTERACTIVE SYSTEM MAP ═══════ */

type NodeType = "tool" | "person";
interface MapNode {
  id: string; label: string; icon: string; color: string; x: number; y: number;
  type: NodeType; sub?: string; status?: string;
}
interface Edge {
  from: string; to: string; label: string; color?: string; dashed?: boolean;
}

const MAP_W = 1000;
const MAP_H = 720;

const nodes: MapNode[] = [
  // ── tools (center, well spaced) ──
  { id: "freshservice",label: "FreshService",   icon: "🎫", color: BLUE,   x: 500, y: 80,  type: "tool", sub: "Client ticketing", status: "live" },
  { id: "zapier",      label: "Zapier",         icon: "⚡", color: AMBER,  x: 500, y: 190, type: "tool", sub: "Sync glue", status: "degraded" },
  { id: "airtable",    label: "Airtable",      icon: "🗄️", color: AMBER,  x: 500, y: 320, type: "tool", sub: "Main DB — 370K/500K", status: "degraded" },
  { id: "map",         label: "Planning Map",   icon: "🗺️", color: GREEN,  x: 260, y: 460, type: "tool", sub: "Route planning", status: "live" },
  { id: "fillout",     label: "Fillout",        icon: "📝", color: GREEN,  x: 500, y: 460, type: "tool", sub: "Reporting forms", status: "live" },
  { id: "sheets",      label: "Google Sheets",  icon: "📊", color: GRAY,   x: 740, y: 460, type: "tool", sub: "Workaround", status: "workaround" },
  { id: "whatsapp",    label: "WhatsApp",       icon: "💬", color: GRAY,   x: 340, y: 590, type: "tool", sub: "Workaround", status: "workaround" },
  { id: "drona",       label: "Drona HQ",       icon: "📱", color: RED,    x: 660, y: 590, type: "tool", sub: "Abandoned", status: "dead" },
  { id: "odoo",        label: "Odoo",           icon: "🏭", color: PURPLE, x: 870, y: 320, type: "tool", sub: "ERP pilot", status: "live" },
  // ── people (well outside the tools) ──
  { id: "clients",     label: "Clients",        icon: "🏢", color: A,      x: 730, y: 80,  type: "person", sub: "7 clients" },
  { id: "planners",    label: "Planners",       icon: "📋", color: GREEN,  x: 80,  y: 400, type: "person", sub: "7-10" },
  { id: "techs",       label: "Technicians",    icon: "👷", color: BLUE,   x: 500, y: 680, type: "person", sub: "100+" },
  { id: "agents",      label: "Field Support",  icon: "✅", color: PURPLE, x: 920, y: 460, type: "person", sub: "3-4" },
  { id: "managers",    label: "Country Mgrs",   icon: "👔", color: AMBER,  x: 920, y: 190, type: "person", sub: "7+" },
  { id: "finance",     label: "Finance",        icon: "💰", color: TEAL,   x: 130, y: 190, type: "person", sub: "2-3" },
];

const edges: Edge[] = [
  // tool → tool
  { from: "freshservice", to: "zapier",   label: "tickets",           color: BLUE },
  { from: "zapier",       to: "airtable", label: "work orders",       color: AMBER, dashed: true },
  { from: "airtable",     to: "map",      label: "job locations",     color: GREEN },
  { from: "airtable",     to: "fillout",  label: "report data",       color: GREEN },
  { from: "airtable",     to: "sheets",   label: "manual exports",    color: GRAY, dashed: true },
  { from: "airtable",     to: "odoo",     label: "migration",         color: PURPLE, dashed: true },
  // people → tools
  { from: "clients",  to: "freshservice", label: "report issues" },
  { from: "planners", to: "map",          label: "build routes" },
  { from: "planners", to: "whatsapp",     label: "assign jobs" },
  { from: "techs",    to: "whatsapp",     label: "receive jobs" },
  { from: "techs",    to: "fillout",      label: "write reports" },
  { from: "techs",    to: "drona",        label: "abandoned",         color: RED, dashed: true },
  { from: "agents",   to: "airtable",     label: "validate reports" },
  { from: "managers", to: "airtable",     label: "monitor" },
  { from: "managers", to: "sheets",       label: "pull reports" },
  { from: "finance",  to: "airtable",     label: "invoicing" },
];

function SystemMap() {
  const [hovered, setHovered] = useState<string | null>(null);
  const nodeMap = Object.fromEntries(nodes.map(n => [n.id, n]));
  const isConn = (id: string) => !hovered || id === hovered || edges.some(e => (e.from === hovered && e.to === id) || (e.to === hovered && e.from === id));
  const isEdgeConn = (e: Edge) => !hovered || e.from === hovered || e.to === hovered;
  const stColors: Record<string, string> = { live: GREEN, degraded: AMBER, dead: RED, workaround: GRAY };

  // get connections for hovered node
  const hoveredConns = hovered ? edges.filter(e => e.from === hovered || e.to === hovered).map(e => {
    const otherId = e.from === hovered ? e.to : e.from;
    const other = nodeMap[otherId];
    return { icon: other?.icon || "", name: other?.label || "", action: e.label, color: e.color || "#94a3b8" };
  }) : [];

  return (
    <div style={{ display: "flex", gap: 24, alignItems: "flex-start" }}>
      {/* Map */}
      <div style={{ position: "relative", width: "100%", aspectRatio: `${MAP_W}/${MAP_H}`, maxWidth: MAP_W, flex: 1 }}>
        <svg viewBox={`0 0 ${MAP_W} ${MAP_H}`} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }}>
          {edges.map((e, i) => {
            const f = nodeMap[e.from], t = nodeMap[e.to];
            if (!f || !t) return null;
            const act = isEdgeConn(e);
            const col = act ? (e.color || "#94a3b8") : "#e5e7eb";
            const dx = t.x - f.x, dy = t.y - f.y, d = Math.sqrt(dx * dx + dy * dy);
            const r = 38;
            const sx = f.x + (dx / d) * r, sy = f.y + (dy / d) * r;
            const ex = t.x - (dx / d) * r, ey = t.y - (dy / d) * r;
            return (
              <line key={i} x1={sx} y1={sy} x2={ex} y2={ey} stroke={col}
                strokeWidth={act && hovered ? 2 : 1.2} strokeDasharray={e.dashed ? "6,4" : "none"}
                opacity={act ? 1 : 0.08} />
            );
          })}
        </svg>
        <div style={{ position: "absolute", inset: 0 }}>
          {nodes.map(n => {
            const act = isConn(n.id);
            const isTool = n.type === "tool";
            const sz = isTool ? 60 : 52;
            const left = `${(n.x / MAP_W) * 100}%`;
            const top = `${(n.y / MAP_H) * 100}%`;
            return (
              <div key={n.id}
                onMouseEnter={() => setHovered(n.id)} onMouseLeave={() => setHovered(null)}
                style={{
                  position: "absolute", left, top, transform: `translate(-50%,-50%) ${hovered === n.id ? "scale(1.1)" : "scale(1)"}`,
                  display: "flex", flexDirection: "column", alignItems: "center", gap: 3,
                  cursor: "pointer", transition: "opacity 0.2s, transform 0.15s", opacity: act ? 1 : 0.12,
                  zIndex: hovered === n.id ? 10 : 1,
                }}>
                <div style={{
                  width: sz, height: sz, borderRadius: isTool ? "50%" : 14,
                  background: hovered === n.id ? `${n.color}18` : "#fff",
                  border: `2px solid ${n.color}`, display: "flex", alignItems: "center", justifyContent: "center",
                  position: "relative", boxShadow: hovered === n.id ? `0 4px 16px ${n.color}25` : "0 1px 4px rgba(0,0,0,0.06)",
                }}>
                  <span style={{ fontSize: sz * 0.38 }}>{n.icon}</span>
                  {isTool && n.status && <div style={{ position: "absolute", bottom: -2, right: -2, width: 12, height: 12, borderRadius: "50%", background: stColors[n.status] || GRAY, border: "2px solid #fff" }} />}
                </div>
                <span style={{ fontSize: 11, fontWeight: 700, color: "#1a1a2e", textAlign: "center", whiteSpace: "nowrap" }}>{n.label}</span>
                {n.sub && <span style={{ fontSize: 9, color: "#94a3b8", textAlign: "center", whiteSpace: "nowrap", marginTop: -2 }}>{n.sub}</span>}
              </div>
            );
          })}
        </div>
      </div>

      {/* Side panel — shows connections on hover */}
      <div style={{ width: 220, flexShrink: 0, position: "sticky", top: 80 }}>
        {hovered && nodeMap[hovered] ? (
          <div style={{
            background: "#fff", borderRadius: 14, border: `2px solid ${nodeMap[hovered].color}30`,
            padding: 16, boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
              <span style={{ fontSize: 20 }}>{nodeMap[hovered].icon}</span>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#1a1a2e" }}>{nodeMap[hovered].label}</div>
                <div style={{ fontSize: 10, color: "#94a3b8" }}>{nodeMap[hovered].sub}</div>
              </div>
            </div>
            <div style={{ fontSize: 10, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>Connections</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {hoveredConns.map((c, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 14 }}>{c.icon}</span>
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 600, color: "#1a1a2e" }}>{c.name}</div>
                    <div style={{ fontSize: 10, color: c.color }}>{c.action}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div style={{ background: "#f8fafc", borderRadius: 14, padding: 20, textAlign: "center" }}>
            <p style={{ fontSize: 12, color: "#94a3b8" }}>Hover a node to see its connections</p>
          </div>
        )}
      </div>
    </div>
  );
}

/* ── main page ── */
export default function SystemDesign() {
  const [activeView, setActiveView] = useState<"tools" | "users" | "flow" | "modules">("tools");

  const views = [
    { key: "tools" as const, label: "System Map" },
    { key: "flow" as const, label: "End-to-End Flow" },
    { key: "modules" as const, label: "Modules" },
  ];

  return (
    <>
      <style>{`
        .sys-bubble:hover { transform: scale(1.08) !important; }
        .view-btn { transition: all 0.2s; cursor: pointer; }
        .view-btn:hover { transform: translateY(-1px); }
        @keyframes pulse-dot { 0%,100% { opacity: 1; } 50% { opacity: 0.4; } }
        @keyframes flow-in { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
        .flow-item { animation: flow-in 0.4s ease both; }
        .connector-line { position: absolute; background: #e2e8f0; }
        @keyframes dash-flow { to { stroke-dashoffset: -20; } }
      `}</style>

      {/* nav */}
      <header style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 50, background: "rgba(255,255,255,0.85)", backdropFilter: "blur(12px)", borderBottom: "1px solid #e5e7eb" }}>
        <div style={{ ...wrap, display: "flex", alignItems: "center", justifyContent: "space-between", height: 56 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 28, height: 28, borderRadius: 8, background: A, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ color: "#fff", fontWeight: 800, fontSize: 13 }}>B</span>
            </div>
            <span style={{ fontSize: 13, color: "#94a3b8" }}>Bloq.it</span>
            <span style={{ color: "#cbd5e1" }}>/</span>
            <span style={{ fontSize: 13, fontWeight: 700 }}>System Design</span>
          </div>
          <div className="nav-links" style={{ display: "flex", gap: 4 }}>
            {["tools", "flow", "modules"].map(id => (
              <a key={id} href={`#${id}`} style={{ fontSize: 12, color: "#64748b", textDecoration: "none", padding: "6px 12px", borderRadius: 8 }}>{id}</a>
            ))}
          </div>
        </div>
      </header>

      {/* hero */}
      <section style={{ paddingTop: 120, paddingBottom: 60, background: "#fff" }}>
        <div style={wrap}>
          <p style={{ color: A, fontSize: 12, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 12 }}>AS-IS / MARCH 2026</p>
          <h1 style={{ fontSize: 36, fontWeight: 800, color: "#1a1a2e", lineHeight: 1.15, marginBottom: 14, maxWidth: 600 }}>
            FlowOps System Design
          </h1>
          <p style={{ fontSize: 16, color: "#64748b", lineHeight: 1.7, maxWidth: 600, marginBottom: 32 }}>
            How our tools, people, and processes connect today — and where the gaps are.
          </p>

          {/* view toggle */}
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {views.map(v => (
              <button key={v.key} className="view-btn" onClick={() => setActiveView(v.key)} style={{
                padding: "10px 20px", borderRadius: 99, border: activeView === v.key ? `2px solid ${A}` : "2px solid #e5e7eb",
                background: activeView === v.key ? `${A}08` : "#fff", color: activeView === v.key ? A : "#64748b",
                fontSize: 13, fontWeight: 600, cursor: "pointer",
              }}>{v.label}</button>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ VIEW: System Map (Tools + Users + Connections) ═══════ */}
      {(activeView === "tools" || activeView === "users") && (
        <Sec id="tools" white>
          <Tag>SYSTEM MAP</Tag>
          <H2>How everything connects</H2>
          <Sub>Hover any node to see what it connects to. Circles = tools. Rounded squares = people.</Sub>

          {/* legend */}
          <div style={{ display: "flex", gap: 16, marginBottom: 24, flexWrap: "wrap" }}>
            {([["Live", GREEN], ["Degraded", AMBER], ["Abandoned", RED], ["Workaround", GRAY]] as const).map(([l, c]) => (
              <div key={l} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <div style={{ width: 10, height: 10, borderRadius: "50%", background: c }} />
                <span style={{ fontSize: 11, color: "#64748b" }}>{l}</span>
              </div>
            ))}
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{ width: 16, height: 16, borderRadius: "50%", border: "2px solid #cbd5e1" }} />
              <span style={{ fontSize: 11, color: "#64748b" }}>Tool</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{ width: 16, height: 16, borderRadius: 5, border: "2px solid #cbd5e1" }} />
              <span style={{ fontSize: 11, color: "#64748b" }}>Person</span>
            </div>
          </div>

          <SystemMap />
        </Sec>
      )}

      {/* ═══════ VIEW: End-to-End Flow ═══════ */}
      {activeView === "flow" && (
        <Sec id="flow" white>
          <Tag>END-TO-END FLOW</Tag>
          <H2>From client issue to invoice</H2>
          <Sub>How a single job flows through our systems today. Red = gap or pain point.</Sub>

          <div style={{ maxWidth: 500, margin: "0 auto" }}>
            {([
              { num: 1, label: "Client reports issue", tool: "FreshService", color: BLUE },
              { num: 2, label: "Ticket synced to Airtable", tool: "Zapier (breaks sometimes)", color: AMBER, gap: "Sync fails silently — jobs get lost" },
              { num: 3, label: "Work order created", tool: "Airtable", color: AMBER },
              { num: 4, label: "Planner sees it on map", tool: "Planning Map", color: GREEN },
              { num: 5, label: "Planner assigns to technician", tool: "WhatsApp (manually)", color: RED, gap: "No scheduling tool — just a message" },
              { num: 6, label: "Tech drives to site", tool: "No tool (own GPS / memory)", color: RED, gap: "No optimized route — wastes ~1hr/day" },
              { num: 7, label: "Tech does the work", tool: "On-site", color: GREEN },
              { num: 8, label: "Tech fills report", tool: "Fillout", color: GREEN },
              { num: 9, label: "Agent reviews report", tool: "Airtable (manually, ~15 min)", color: RED, gap: "Bottleneck — 50+ hrs/day manual review" },
              { num: 10, label: "Job closed & invoiced", tool: "Airtable", color: AMBER, gap: "€186K+ sitting unvalidated" },
            ]).map((step, i) => (
              <div key={i} className="flow-item" style={{ animationDelay: `${i * 0.06}s` }}>
                <FlowNode {...step} />
                {i < 9 && (
                  <div style={{ marginLeft: 17, padding: "4px 0" }}>
                    <div style={{ width: 2, height: 28, background: step.gap ? `${RED}40` : "#e2e8f0" }} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </Sec>
      )}

      {/* ═══════ VIEW: Modules ═══════ */}
      {activeView === "modules" && (
        <Sec id="modules" white>
          <Tag>MODULES</Tag>
          <H2>9 modules that could be products</H2>
          <Sub>Functional areas inside our current system. Each could be a standalone product or service.</Sub>

          <div className="g3">
            <Module icon="🎫" name="Ticketing & Triage" desc="Client reports issue, ticket created, classified, handed to ops" tool="FreshService + Zapier + Airtable" state="Working" color={BLUE} />
            <Module icon="📋" name="Work Order Management" desc="Jobs created, assigned to techs, tracked through stages" tool="Airtable" state="Degraded" color={AMBER} />
            <Module icon="🗺️" name="Planning & Scheduling" desc="Planner looks at map, manually assigns jobs and builds routes" tool="Planning Map + WhatsApp" state="Working" color={GREEN} />
            <Module icon="🔧" name="Field Execution" desc="Tech receives job, drives there, does the work" tool="WhatsApp + memory" state="Broken" color={RED} />
            <Module icon="📝" name="Reporting" desc="Tech fills form after each job — photos, answers, parts used" tool="Fillout → Airtable" state="Working" color={GREEN} />
            <Module icon="✅" name="Validation & QC" desc="Agent reviews report, checks quality, approves or rejects" tool="Airtable (manual)" state="Degraded" color={AMBER} />
            <Module icon="💰" name="Invoicing" desc="Billable work tracked, invoices prepared, partner costs reconciled" tool="Airtable" state="Degraded" color={AMBER} />
            <Module icon="📦" name="Asset & Inventory" desc="Locker locations, hardware status, spare parts tracking" tool="Airtable (Partners & Inventory)" state="Degraded" color={AMBER} />
            <Module icon="📊" name="Analytics" desc="Performance data, SLA tracking, productivity metrics" tool="Google Sheets (manual exports)" state="Broken" color={RED} />
          </div>

          {/* summary bar */}
          <div style={{ marginTop: 32, display: "flex", gap: 12, flexWrap: "wrap" }}>
            {([
              ["Working", 3, GREEN],
              ["Degraded", 4, AMBER],
              ["Broken", 2, RED],
            ] as const).map(([label, count, color]) => (
              <div key={label} style={{
                flex: 1, minWidth: 140, background: `${color}08`, border: `1.5px solid ${color}30`,
                borderRadius: 12, padding: "14px 18px", textAlign: "center",
              }}>
                <div style={{ fontSize: 28, fontWeight: 800, color }}>{count}</div>
                <div style={{ fontSize: 12, color: "#64748b" }}>{label}</div>
              </div>
            ))}
          </div>
        </Sec>
      )}

      {/* key gaps — always visible */}
      <Sec id="gaps">
        <Tag>KEY GAPS</Tag>
        <H2>What&apos;s missing</H2>
        <div className="g2" style={{ marginTop: 8 }}>
          {([
            { icon: "📱", title: "No field app", desc: "Biggest gap. Techs have no tool between getting a job on WhatsApp and filling a Fillout report.", color: RED },
            { icon: "🗺️", title: "No routing", desc: "Planners eyeball routes. Techs drive whatever path they want. ~100 hrs/day wasted.", color: RED },
            { icon: "📍", title: "No real-time visibility", desc: "Nobody knows where techs are or how the day is going until it's over.", color: AMBER },
            { icon: "🤖", title: "No automation in validation", desc: "Every single report reviewed manually. 50+ hrs/day of human review.", color: AMBER },
            { icon: "🔗", title: "Fragile integrations", desc: "Zapier is the only glue between FreshService and Airtable. It breaks regularly.", color: AMBER },
            { icon: "💾", title: "No single source of truth", desc: "Data scattered across Airtable, Sheets, FreshService, WhatsApp. Nobody trusts the numbers.", color: RED },
          ]).map((g, i) => (
            <div key={i} style={{
              background: "#fff", borderRadius: 14, border: "1px solid #e5e7eb", padding: 20,
              borderLeft: `4px solid ${g.color}`, display: "flex", gap: 14, alignItems: "flex-start",
            }}>
              <span style={{ fontSize: 24, flexShrink: 0 }}>{g.icon}</span>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: "#1a1a2e", marginBottom: 4 }}>{g.title}</div>
                <div style={{ fontSize: 13, color: "#64748b", lineHeight: 1.6 }}>{g.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </Sec>

      {/* footer */}
      <section style={{ background: "#1a1a2e", padding: "48px 0" }}>
        <div style={{ ...wrap, textAlign: "center" }}>
          <p style={{ color: "#94a3b8", fontSize: 14, lineHeight: 1.7, maxWidth: 500, margin: "0 auto" }}>
            9 tools. 6 personas. 2 workarounds pretending to be systems. This is what we&apos;re working with — and what we need to fix.
          </p>
          <p style={{ color: "#475569", fontSize: 12, marginTop: 16 }}>Bloq.it FlowOps — March 2026</p>
        </div>
      </section>
    </>
  );
}
