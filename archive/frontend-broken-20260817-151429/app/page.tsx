"use client";

import { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import {
  Activity,
  ArrowUpRight,
  Box,
  ChevronRight,
  Cloud,
  Cpu,
  Database,
  GitBranch,
  Globe2,
  Layers3,
  Lock,
  Menu,
  Play,
  RefreshCw,
  Server,
  ShieldCheck,
  Terminal,
  X,
  Zap,
} from "lucide-react";

const Scene3D = dynamic(() => import("@/components/konexa/konexa-3d"), {
  ssr: false,
});

type View =
  | "COMMAND"
  | "INFRASTRUCTURE"
  | "DEPLOYMENTS"
  | "MONITORING"
  | "SECURITY"
  | "LOGS";

const views: View[] = [
  "COMMAND",
  "INFRASTRUCTURE",
  "DEPLOYMENTS",
  "MONITORING",
  "SECURITY",
  "LOGS",
];

const systems = [
  { name: "AWS CORE", value: 98.7, icon: Cloud, status: "OPERATIONAL" },
  { name: "KUBERNETES", value: 96.4, icon: Box, status: "OPERATIONAL" },
  { name: "JENKINS", value: 94.8, icon: GitBranch, status: "OPERATIONAL" },
  { name: "DATABASE", value: 99.2, icon: Database, status: "OPERATIONAL" },
];

export default function Page() {
  const [active, setActive] = useState<View>("COMMAND");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [live, setLive] = useState(true);
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const metrics = useMemo(
    () => [
      ["CPU", `${(34 + Math.sin(time.getSeconds() / 5) * 8).toFixed(1)}%`],
      ["MEMORY", "61.8%"],
      ["NETWORK", `${(1.8 + Math.random() * 0.4).toFixed(2)} GB/s`],
      ["LATENCY", `${Math.round(18 + Math.random() * 5)} ms`],
    ],
    [time]
  );

  function navigate(view: View) {
    setActive(view);
    setMobileOpen(false);
  }

  return (
    <main className="min-h-screen bg-[#030303] text-white overflow-hidden selection:bg-[#d4af37] selection:text-black">
      <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(circle_at_50%_20%,rgba(212,175,55,.12),transparent_35%),radial-gradient(circle_at_80%_80%,rgba(212,175,55,.06),transparent_30%)]" />

      <header className="fixed top-0 left-0 right-0 z-50 h-20 border-b border-[#d4af37]/15 bg-black/75 backdrop-blur-2xl">
        <div className="h-full px-5 lg:px-8 flex items-center justify-between">
          <button
            onClick={() => navigate("COMMAND")}
            className="flex items-center gap-3 group"
          >
            <div className="w-11 h-11 rounded-xl border border-[#d4af37]/50 bg-gradient-to-br from-[#d4af37] to-[#6d5313] flex items-center justify-center shadow-[0_0_35px_rgba(212,175,55,.25)] group-hover:shadow-[0_0_50px_rgba(212,175,55,.45)] transition">
              <Zap className="w-6 h-6 text-black fill-black" />
            </div>

            <div className="text-left">
              <div className="tracking-[.45em] text-lg font-black text-[#e8c85a]">
                KONEXA
              </div>
              <div className="text-[8px] tracking-[.3em] text-white/40">
                DEVOPS COMMAND CENTER
              </div>
            </div>
          </button>

          <nav className="hidden xl:flex items-center gap-1">
            {views.map((item) => (
              <button
                key={item}
                onClick={() => navigate(item)}
                className={`px-4 py-2 text-[10px] tracking-[.18em] rounded-lg transition ${
                  active === item
                    ? "bg-[#d4af37]/15 text-[#e8c85a] border border-[#d4af37]/30"
                    : "text-white/45 hover:text-white hover:bg-white/5"
                }`}
              >
                {item}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setLive((v) => !v)}
              className={`hidden md:flex items-center gap-2 px-3 py-2 rounded-lg border text-[9px] tracking-widest ${
                live
                  ? "border-emerald-400/30 bg-emerald-400/5 text-emerald-300"
                  : "border-red-400/30 bg-red-400/5 text-red-300"
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  live ? "bg-emerald-400 animate-pulse" : "bg-red-400"
                }`}
              />
              {live ? "LIVE" : "PAUSED"}
            </button>

            <button
              onClick={() => setMobileOpen((v) => !v)}
              className="xl:hidden p-2 rounded-lg border border-white/10"
            >
              {mobileOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </header>

      {mobileOpen && (
        <div className="fixed top-20 left-0 right-0 z-40 bg-[#070707]/95 backdrop-blur-xl border-b border-[#d4af37]/20 p-4 xl:hidden">
          <div className="grid grid-cols-2 gap-2">
            {views.map((item) => (
              <button
                key={item}
                onClick={() => navigate(item)}
                className={`p-4 text-left rounded-xl border ${
                  active === item
                    ? "border-[#d4af37]/40 bg-[#d4af37]/10 text-[#e8c85a]"
                    : "border-white/10 text-white/50"
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      )}

      <section className="relative z-10 pt-28 px-5 lg:px-8 pb-10 max-w-[1800px] mx-auto">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-5 mb-8">
          <div>
            <div className="flex items-center gap-2 text-[#d4af37] text-[10px] tracking-[.3em] mb-3">
              <span className="w-8 h-px bg-[#d4af37]" />
              SYSTEM ONLINE
            </div>

            <h1 className="text-4xl md:text-6xl font-black tracking-tight">
              {active === "COMMAND"
                ? "COMMAND CENTER"
                : active.replace("_", " ")}
            </h1>

            <p className="mt-3 text-white/35 max-w-2xl text-sm">
              Autonomous infrastructure visibility, deployment intelligence
              and real-time operational control.
            </p>
          </div>

          <div className="text-left lg:text-right">
            <div className="text-[#d4af37] text-xs tracking-[.25em]">
              {time.toLocaleTimeString("en-IN")}
            </div>
            <div className="text-[9px] text-white/25 tracking-widest mt-1">
              MUMBAI / AP-SOUTH-1
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-[1.6fr_.8fr] gap-5">
          <div className="relative min-h-[520px] rounded-3xl overflow-hidden border border-[#d4af37]/20 bg-[#080808] shadow-[0_30px_100px_rgba(0,0,0,.65)]">
            <div className="absolute inset-0">
              <Scene3D />
            </div>

            <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black via-transparent to-black/20" />

            <div className="absolute top-6 left-6">
              <div className="text-[9px] tracking-[.3em] text-[#d4af37]">
                KONEXA CORE
              </div>
              <div className="text-xs text-white/35 mt-1">
                LIVE INFRASTRUCTURE TOPOLOGY
              </div>
            </div>

            <div className="absolute bottom-6 left-6 right-6 grid grid-cols-2 md:grid-cols-4 gap-2">
              {metrics.map(([name, value]) => (
                <div
                  key={name}
                  className="rounded-xl border border-white/10 bg-black/60 backdrop-blur-xl p-3"
                >
                  <div className="text-[8px] tracking-widest text-white/30">
                    {name}
                  </div>
                  <div className="text-lg font-bold text-[#e8c85a] mt-1">
                    {value}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-5">
            <div className="rounded-3xl border border-[#d4af37]/20 bg-gradient-to-br from-[#0d0d0d] to-[#060606] p-6">
              <div className="flex items-center justify-between mb-7">
                <div>
                  <div className="text-[9px] tracking-[.25em] text-[#d4af37]">
                    SYSTEM HEALTH
                  </div>
                  <div className="text-3xl font-black mt-2">98.7%</div>
                </div>

                <ShieldCheck className="w-9 h-9 text-[#d4af37]" />
              </div>

              <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                <div className="h-full w-[98.7%] bg-gradient-to-r from-[#6d5313] via-[#d4af37] to-[#fff0a3] shadow-[0_0_20px_rgba(212,175,55,.7)]" />
              </div>

              <div className="grid grid-cols-2 gap-3 mt-6">
                {systems.slice(0, 2).map((system) => {
                  const Icon = system.icon;
                  return (
                    <button
                      key={system.name}
                      onClick={() => navigate("INFRASTRUCTURE")}
                      className="text-left p-3 rounded-xl border border-white/10 hover:border-[#d4af37]/30 hover:bg-[#d4af37]/5 transition"
                    >
                      <Icon className="w-4 h-4 text-[#d4af37]" />
                      <div className="text-[9px] text-white/35 mt-3">
                        {system.name}
                      </div>
                      <div className="font-bold mt-1">{system.value}%</div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-[#080808] p-6">
              <div className="flex justify-between items-center mb-5">
                <div>
                  <div className="text-[9px] tracking-[.25em] text-white/35">
                    ACTIVE PIPELINE
                  </div>
                  <div className="text-xl font-bold mt-1">PRODUCTION</div>
                </div>
                <Activity className="text-[#d4af37]" />
              </div>

              <div className="space-y-3">
                {[
                  ["BUILD", "SUCCESS", "100%"],
                  ["TEST", "SUCCESS", "98%"],
                  ["DEPLOY", "RUNNING", "72%"],
                ].map(([name, status, progress]) => (
                  <button
                    key={name}
                    onClick={() => navigate("DEPLOYMENTS")}
                    className="w-full text-left rounded-xl border border-white/10 p-3 hover:border-[#d4af37]/30 transition"
                  >
                    <div className="flex justify-between text-[9px]">
                      <span className="text-white/45">{name}</span>
                      <span className="text-[#d4af37]">{status}</span>
                    </div>
                    <div className="mt-2 h-1 bg-white/5 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#d4af37]"
                        style={{ width: progress }}
                      />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-4 mt-5">
          {[
            {
              title: "INFRASTRUCTURE",
              value: "24",
              subtitle: "ACTIVE NODES",
              icon: Server,
              view: "INFRASTRUCTURE" as View,
            },
            {
              title: "DEPLOYMENTS",
              value: "142",
              subtitle: "THIS MONTH",
              icon: GitBranch,
              view: "DEPLOYMENTS" as View,
            },
            {
              title: "MONITORING",
              value: "99.9%",
              subtitle: "UPTIME",
              icon: Activity,
              view: "MONITORING" as View,
            },
            {
              title: "SECURITY",
              value: "A+",
              subtitle: "SECURITY SCORE",
              icon: Lock,
              view: "SECURITY" as View,
            },
          ].map((card) => {
            const Icon = card.icon;
            return (
              <button
                key={card.title}
                onClick={() => navigate(card.view)}
                className="group text-left relative overflow-hidden rounded-2xl border border-white/10 bg-[#080808] p-5 hover:border-[#d4af37]/40 hover:-translate-y-1 transition-all duration-300"
              >
                <div className="absolute -right-8 -top-8 w-24 h-24 rounded-full bg-[#d4af37]/5 blur-2xl group-hover:bg-[#d4af37]/15 transition" />
                <Icon className="w-5 h-5 text-[#d4af37]" />
                <div className="text-[9px] tracking-[.2em] text-white/30 mt-5">
                  {card.title}
                </div>
                <div className="text-3xl font-black mt-1">{card.value}</div>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-[8px] tracking-widest text-white/25">
                    {card.subtitle}
                  </span>
                  <ArrowUpRight className="w-4 h-4 text-white/20 group-hover:text-[#d4af37] transition" />
                </div>
              </button>
            );
          })}
        </div>

        <div className="mt-5 rounded-3xl border border-[#d4af37]/15 bg-[#070707] p-5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#d4af37]/10 border border-[#d4af37]/20 flex items-center justify-center">
                <Terminal className="text-[#d4af37]" />
              </div>
              <div>
                <div className="text-[9px] tracking-[.25em] text-[#d4af37]">
                  KONEXA CONTROL
                </div>
                <div className="text-sm font-semibold mt-1">
                  Operational intelligence by Essakimuthu Konar
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => navigate("LOGS")}
                className="px-4 py-3 rounded-xl border border-white/10 text-xs hover:border-[#d4af37]/40 transition"
              >
                OPEN LOGS
              </button>

              <button
                onClick={() => navigate("DEPLOYMENTS")}
                className="px-4 py-3 rounded-xl bg-[#d4af37] text-black font-bold text-xs hover:bg-[#f0d76b] transition flex items-center gap-2"
              >
                <Play className="w-3 h-3 fill-black" />
                DEPLOYMENTS
              </button>

              <button
                onClick={() => setLive((v) => !v)}
                className="p-3 rounded-xl border border-white/10 hover:border-[#d4af37]/40 transition"
                title="Toggle live updates"
              >
                <RefreshCw className="w-4 h-4 text-[#d4af37]" />
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
