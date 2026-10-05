"use client";

import { useState } from "react";
import KonexaCore3D from "./konexa-core-3d";

const navigation = [
  "OVERVIEW",
  "INFRASTRUCTURE",
  "SERVERS",
  "APPLICATIONS",
  "DEPLOYMENTS",
  "MONITORING",
  "BACKUPS",
  "LOGS",
];

const metrics = [
  ["CPU LOAD", "42%", "+4.2%"],
  ["MEMORY", "68%", "-2.1%"],
  ["STORAGE", "34%", "+1.4%"],
  ["UPTIME", "99.98%", "+0.02%"],
];

export default function CommandCenter() {
  const [active, setActive] = useState("OVERVIEW");
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <main className="command-center">
      <div className="cinematic-grid" />

      <header className="top-hud">
        <div className="brand">
          <div className="brand-mark">K</div>
          <div>
            <b>KONEXA</b>
            <span>COMMAND CENTER</span>
          </div>
        </div>

        <div className="system-status">
          <i />
          SYSTEM OPERATIONAL
        </div>

        <div className="hud-meta">
          LIVE&nbsp;&nbsp; • &nbsp;&nbsp;AP-SOUTH-1&nbsp;&nbsp; • &nbsp;&nbsp;24.7ms
        </div>
      </header>

      <aside className="side-hud">
        <div className="side-title">OPERATIONS</div>

        {navigation.map((item) => (
          <button
            key={item}
            className={active === item ? "nav active" : "nav"}
            onClick={() => setActive(item)}
          >
            <span>{active === item ? "◆" : "◇"}</span>
            {item}
          </button>
        ))}

        <div className="side-footer">
          <span>SECURITY</span>
          <strong>99.9%</strong>
        </div>
      </aside>

      <section className="main-stage">
        <div className="section-heading">
          <span>01 / COMMAND MATRIX</span>
          <h1>{active}</h1>
        </div>

        <div className="core-zone">
          <KonexaCore3D />

          <button
            className="orbit-node node-one"
            onClick={() => setActive("INFRASTRUCTURE")}
          >
            <b>INFRA</b>
            <small>ONLINE</small>
          </button>

          <button
            className="orbit-node node-two"
            onClick={() => setActive("DEPLOYMENTS")}
          >
            <b>CI/CD</b>
            <small>ACTIVE</small>
          </button>

          <button
            className="orbit-node node-three"
            onClick={() => setActive("MONITORING")}
          >
            <b>MONITOR</b>
            <small>LIVE</small>
          </button>

          <button
            className="orbit-node node-four"
            onClick={() => setActive("SECURITY")}
          >
            <b>SECURITY</b>
            <small>SECURE</small>
          </button>
        </div>

        <div className="telemetry-grid">
          {metrics.map(([name, value, change]) => (
            <button
              className="hud-card"
              key={name}
              onClick={() => setSelected(name)}
            >
              <span>{name}</span>
              <strong>{value}</strong>
              <small>{change}</small>
              <div className="mini-chart">
                <i />
                <i />
                <i />
                <i />
                <i />
                <i />
                <i />
              </div>
            </button>
          ))}
        </div>

        <div className="lower-grid">
          <section className="panel">
            <div className="panel-title">
              <span>LIVE DEPLOYMENTS</span>
              <b>VIEW ALL →</b>
            </div>

            {["production-v42", "staging-v43", "dev-v44"].map((item, i) => (
              <button
                className="deployment"
                key={item}
                onClick={() => setSelected(item)}
              >
                <i className={i === 1 ? "warning" : ""} />
                <span>
                  <strong>{item}</strong>
                  <small>{i === 0 ? "DEPLOYED" : i === 1 ? "BUILDING" : "QUEUED"}</small>
                </span>
                <em>{i === 0 ? "12s" : i === 1 ? "48%" : "—"}</em>
              </button>
            ))}
          </section>

          <section className="panel security">
            <div className="panel-title">
              <span>SECURITY POSTURE</span>
              <b>SECURE</b>
            </div>

            <div className="security-ring">
              <div>
                <strong>99.9</strong>
                <small>%</small>
              </div>
            </div>

            <div className="security-stats">
              <span>THREATS <b>0</b></span>
              <span>FIREWALL <b>ACTIVE</b></span>
              <span>AUTH <b>SECURE</b></span>
            </div>
          </section>
        </div>
      </section>

      {selected && (
        <div className="detail-overlay" onClick={() => setSelected(null)}>
          <div className="detail-panel" onClick={(e) => e.stopPropagation()}>
            <span>TELEMETRY DETAIL</span>
            <h2>{selected}</h2>
            <div className="detail-value">OPERATIONAL</div>
            <p>Live KONEXA operational telemetry is being monitored.</p>
            <button onClick={() => setSelected(null)}>CLOSE ×</button>
          </div>
        </div>
      )}
    </main>
  );
}
