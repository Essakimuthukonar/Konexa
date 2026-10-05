"use client";

import {
  Activity,
  AlertTriangle,
  Boxes,
  Cpu,
  Database,
  Gauge,
  Globe2,
  HardDrive,
  Server,
  ShieldCheck,
  Store,
  Wifi,
  Zap,
} from "lucide-react";

const metrics = [
  {
    label: "STORES",
    value: "450",
    sub: "Operational locations",
    icon: Store,
    className: "gold",
  },
  {
    label: "ASSETS",
    value: "3,165",
    sub: "Tracked devices",
    icon: Boxes,
    className: "blue",
  },
  {
    label: "SYSTEM HEALTH",
    value: "98.7%",
    sub: "All systems nominal",
    icon: ShieldCheck,
    className: "green",
  },
  {
    label: "CRITICAL",
    value: "03",
    sub: "Immediate attention",
    icon: AlertTriangle,
    className: "red",
  },
];

const services = [
  ["EC2 Infrastructure", "99.9%", "ONLINE"],
  ["Store Network", "98.7%", "ONLINE"],
  ["Device Management", "97.4%", "ONLINE"],
  ["Backup Services", "99.2%", "ONLINE"],
];

export default function OverviewPage() {
  return (
    <main className="konexa-command">
      {/* HERO */}
      <section className="hero">
        <div>
          <div className="eyebrow">
            <span className="pulse" />
            KONEXA // COMMAND CENTER
          </div>

          <h1>
            IT OPERATIONS
            <span>COMMAND CENTER</span>
          </h1>

          <p>
            Real-time infrastructure intelligence, asset visibility and
            operational health.
          </p>
        </div>

        <div className="system">
          <div className="system-ring">
            <Gauge size={34} />
            <strong>98.7%</strong>
          </div>

          <div>
            <small>SYSTEM STATUS</small>
            <b>OPERATIONAL</b>
            <em>All core services running</em>
          </div>
        </div>
      </section>

      {/* METRICS */}
      <section className="metrics">
        {metrics.map((item) => {
          const Icon = item.icon;

          return (
            <article className={`metric ${item.className}`} key={item.label}>
              <div className="metric-top">
                <span>{item.label}</span>
                <Icon size={22} />
              </div>

              <strong>{item.value}</strong>
              <small>{item.sub}</small>

              <div className="metric-line">
                <span />
              </div>
            </article>
          );
        })}
      </section>

      {/* MAIN GRID */}
      <section className="main-grid">
        {/* INFRASTRUCTURE */}
        <article className="panel infrastructure">
          <header>
            <div>
              <span className="panel-label">LIVE TELEMETRY</span>
              <h2>Infrastructure Pulse</h2>
            </div>

            <Activity className="gold-icon" />
          </header>

          <div className="graph">
            <div className="graph-grid" />

            <svg viewBox="0 0 800 260" preserveAspectRatio="none">
              <defs>
                <linearGradient id="goldLine" x1="0" x2="1">
                  <stop offset="0%" />
                  <stop offset="50%" />
                  <stop offset="100%" />
                </linearGradient>
              </defs>

              <path
                d="M0 190 C55 170 70 210 120 145 S190 165 230 115 S290 170 340 120 S410 145 450 85 S520 130 570 105 S640 145 680 70 S740 95 800 48"
                fill="none"
                stroke="url(#goldLine)"
                strokeWidth="4"
              />

              <path
                d="M0 190 C55 170 70 210 120 145 S190 165 230 115 S290 170 340 120 S410 145 450 85 S520 130 570 105 S640 145 680 70 S740 95 800 48 V260 H0Z"
                fill="url(#goldFill)"
                opacity=".08"
              />
            </svg>

            <div className="graph-value">
              <strong>98.7%</strong>
              <span>HEALTH SCORE</span>
            </div>
          </div>

          <div className="telemetry">
            <div>
              <Cpu />
              <span>CPU</span>
              <b>42%</b>
            </div>

            <div>
              <Database />
              <span>MEMORY</span>
              <b>61%</b>
            </div>

            <div>
              <HardDrive />
              <span>STORAGE</span>
              <b>37%</b>
            </div>

            <div>
              <Wifi />
              <span>NETWORK</span>
              <b>94%</b>
            </div>
          </div>
        </article>

        {/* SERVICES */}
        <article className="panel services">
          <header>
            <div>
              <span className="panel-label">INFRASTRUCTURE</span>
              <h2>Service Health</h2>
            </div>

            <Zap className="gold-icon" />
          </header>

          {services.map(([name, uptime, status]) => (
            <div className="service" key={name}>
              <div className="service-icon">
                <Server size={19} />
              </div>

              <div className="service-info">
                <b>{name}</b>
                <span>{uptime} uptime</span>
              </div>

              <div className="online">
                <i />
                {status}
              </div>
            </div>
          ))}
        </article>
      </section>

      {/* LOWER GRID */}
      <section className="lower-grid">
        <article className="panel world">
          <div className="world-glow" />
          <Globe2 size={110} className="globe" />

          <div>
            <span className="panel-label">NETWORK OPERATIONS</span>
            <h2>Store Network</h2>
            <p>450 locations monitored across the operational network.</p>
          </div>

          <div className="network-stats">
            <div>
              <b>442</b>
              <span>ONLINE</span>
            </div>

            <div>
              <b className="red-text">05</b>
              <span>WARNING</span>
            </div>

            <div>
              <b className="red-text">03</b>
              <span>CRITICAL</span>
            </div>
          </div>
        </article>

        <article className="panel activity">
          <header>
            <div>
              <span className="panel-label">LIVE FEED</span>
              <h2>Operations</h2>
            </div>
          </header>

          <div className="feed">
            <div>
              <i className="green-dot" />
              <span>Backup verification completed</span>
              <time>2m</time>
            </div>

            <div>
              <i className="green-dot" />
              <span>Device synchronization completed</span>
              <time>7m</time>
            </div>

            <div>
              <i className="yellow-dot" />
              <span>Store network latency detected</span>
              <time>12m</time>
            </div>

            <div>
              <i className="red-dot" />
              <span>03 critical incidents require attention</span>
              <time>18m</time>
            </div>
          </div>
        </article>
      </section>

      <style jsx>{`
        .konexa-command {
          min-height: 100vh;
          padding: 30px;
          color: #f4f0e7;
          position: relative;
          z-index: 2;
          overflow: hidden;
        }

        .hero {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 28px;
        }

        .eyebrow,
        .panel-label {
          color: #d6a84f;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.18em;
        }

        .eyebrow {
          display: flex;
          gap: 9px;
          align-items: center;
        }

        .pulse {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #39ff9a;
          box-shadow: 0 0 14px #39ff9a;
          animation: pulse 1.5s infinite;
        }

        h1 {
          font-size: clamp(38px, 5vw, 72px);
          line-height: 0.9;
          margin: 15px 0;
          font-weight: 900;
          letter-spacing: -0.055em;
        }

        h1 span {
          display: block;
          background: linear-gradient(90deg, #fff, #d6a84f, #fff);
          background-size: 200%;
          -webkit-background-clip: text;
          color: transparent;
          animation: shine 5s linear infinite;
        }

        .hero p {
          color: #777;
          margin: 0;
          max-width: 620px;
        }

        .system {
          display: flex;
          align-items: center;
          gap: 15px;
          padding: 18px 22px;
          border: 1px solid rgba(214, 168, 79, 0.25);
          background: rgba(10, 10, 10, 0.75);
          backdrop-filter: blur(20px);
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
        }

        .system-ring {
          width: 78px;
          height: 78px;
          border-radius: 50%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          color: #d6a84f;
          border: 1px solid rgba(214, 168, 79, 0.5);
          box-shadow:
            0 0 30px rgba(214, 168, 79, 0.15),
            inset 0 0 25px rgba(214, 168, 79, 0.08);
        }

        .system-ring strong {
          font-size: 13px;
        }

        .system small,
        .system em {
          display: block;
          color: #666;
          font-size: 9px;
          font-style: normal;
        }

        .system b {
          display: block;
          color: #39ff9a;
          font-size: 14px;
          margin: 4px 0;
        }

        .metrics {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 14px;
          margin-bottom: 14px;
        }

        .metric,
        .panel {
          background:
            linear-gradient(
              145deg,
              rgba(255, 255, 255, 0.055),
              rgba(255, 255, 255, 0.012)
            ),
            rgba(10, 10, 10, 0.78);
          border: 1px solid rgba(214, 168, 79, 0.17);
          box-shadow:
            0 25px 70px rgba(0, 0, 0, 0.45),
            inset 0 1px rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(20px);
        }

        .metric {
          padding: 20px;
          position: relative;
          overflow: hidden;
          transition: 0.3s;
        }

        .metric:hover,
        .panel:hover {
          transform: translateY(-4px);
          border-color: rgba(214, 168, 79, 0.5);
          box-shadow:
            0 30px 80px rgba(0, 0, 0, 0.65),
            0 0 35px rgba(214, 168, 79, 0.08);
        }

        .metric-top {
          display: flex;
          justify-content: space-between;
          color: #777;
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 0.14em;
        }

        .metric-top svg {
          color: #d6a84f;
        }

        .metric strong {
          display: block;
          font-size: 38px;
          margin: 18px 0 4px;
          letter-spacing: -0.05em;
        }

        .metric small {
          color: #666;
        }

        .metric-line {
          height: 2px;
          margin-top: 18px;
          background: #181818;
        }

        .metric-line span {
          display: block;
          width: 78%;
          height: 100%;
          background: #d6a84f;
          box-shadow: 0 0 12px #d6a84f;
        }

        .green .metric-line span {
          background: #39ff9a;
          box-shadow: 0 0 12px #39ff9a;
        }

        .red {
          border-color: rgba(255, 48, 79, 0.25);
        }

        .red .metric-top svg,
        .red strong {
          color: #ff304f;
        }

        .red .metric-line span {
          background: #ff304f;
          box-shadow: 0 0 15px #ff304f;
          width: 25%;
        }

        .blue .metric-top svg {
          color: #38a8ff;
        }

        .main-grid,
        .lower-grid {
          display: grid;
          grid-template-columns: 1.65fr 1fr;
          gap: 14px;
          margin-bottom: 14px;
        }

        .panel {
          padding: 22px;
          position: relative;
          overflow: hidden;
        }

        .panel header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        .panel h2 {
          margin: 5px 0 0;
          font-size: 18px;
        }

        .gold-icon {
          color: #d6a84f;
        }

        .graph {
          height: 260px;
          position: relative;
          overflow: hidden;
          background:
            linear-gradient(rgba(214, 168, 79, 0.035) 1px, transparent 1px),
            linear-gradient(
              90deg,
              rgba(214, 168, 79, 0.035) 1px,
              transparent 1px
            );
          background-size: 45px 45px;
        }

        .graph svg {
          position: absolute;
          width: 100%;
          height: 100%;
        }

        .graph-value {
          position: absolute;
          top: 18px;
          right: 20px;
          text-align: right;
        }

        .graph-value strong {
          display: block;
          color: #d6a84f;
          font-size: 30px;
        }

        .graph-value span {
          color: #555;
          font-size: 9px;
          letter-spacing: 0.12em;
        }

        .telemetry {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 8px;
          margin-top: 12px;
        }

        .telemetry div {
          padding: 12px;
          background: rgba(255, 255, 255, 0.025);
          border: 1px solid rgba(255, 255, 255, 0.05);
        }

        .telemetry svg {
          width: 15px;
          color: #d6a84f;
        }

        .telemetry span {
          display: block;
          font-size: 9px;
          color: #666;
          margin-top: 6px;
        }

        .telemetry b {
          font-size: 14px;
        }

        .service {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 14px 0;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        }

        .service-icon {
          width: 40px;
          height: 40px;
          display: grid;
          place-items: center;
          color: #d6a84f;
          background: rgba(214, 168, 79, 0.07);
          border: 1px solid rgba(214, 168, 79, 0.15);
        }

        .service-info {
          flex: 1;
        }

        .service-info b {
          display: block;
          font-size: 13px;
        }

        .service-info span {
          color: #666;
          font-size: 10px;
        }

        .online {
          color: #39ff9a;
          font-size: 9px;
          font-weight: 800;
        }

        .online i,
        .feed i {
          display: inline-block;
          width: 6px;
          height: 6px;
          border-radius: 50%;
          margin-right: 5px;
          background: #39ff9a;
          box-shadow: 0 0 8px #39ff9a;
        }

        .world {
          min-height: 240px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }

        .world-glow {
          position: absolute;
          width: 280px;
          height: 280px;
          right: -100px;
          top: -100px;
          background: #d6a84f;
          opacity: 0.06;
          filter: blur(80px);
          border-radius: 50%;
        }

        .globe {
          position: absolute;
          right: 20px;
          top: 30px;
          color: #d6a84f;
          opacity: 0.12;
        }

        .world p {
          color: #666;
          max-width: 400px;
          font-size: 12px;
        }

        .network-stats {
          display: flex;
          gap: 45px;
        }

        .network-stats b {
          display: block;
          font-size: 26px;
          color: #39ff9a;
        }

        .network-stats span {
          font-size: 9px;
          color: #666;
          letter-spacing: 0.1em;
        }

        .red-text {
          color: #ff304f !important;
        }

        .feed > div {
          display: flex;
          align-items: center;
          padding: 14px 0;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
          font-size: 12px;
        }

        .feed span {
          flex: 1;
        }

        .feed time {
          color: #555;
          font-size: 10px;
        }

        .yellow-dot {
          background: #ffd34e !important;
          box-shadow: 0 0 8px #ffd34e !important;
        }

        .red-dot {
          background: #ff304f !important;
          box-shadow: 0 0 8px #ff304f !important;
        }

        @keyframes pulse {
          50% {
            opacity: 0.35;
            transform: scale(1.5);
          }
        }

        @keyframes shine {
          to {
            background-position: 200%;
          }
        }

        @media (max-width: 1000px) {
          .metrics {
            grid-template-columns: repeat(2, 1fr);
          }

          .hero {
            flex-direction: column;
            align-items: flex-start;
            gap: 25px;
          }

          .main-grid,
          .lower-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 600px) {
          .konexa-command {
            padding: 15px;
          }

          .metrics,
          .telemetry {
            grid-template-columns: 1fr 1fr;
          }

          h1 {
            font-size: 40px;
          }

          .system {
            width: 100%;
          }
        }
      `}</style>
    </main>
  );
}