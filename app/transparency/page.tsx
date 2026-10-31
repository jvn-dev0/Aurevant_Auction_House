'use client';

import React from 'react';
import Link from 'next/link';
import {
  Activity,
  Compass,
  FileCheck,
  Shield,
  Layers,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';

export default function TransparencyPage() {
  const matrix = [
    {
      dimension: '1. User Authentication & Security',
      prototype: 'Client-side React state, arbitrary test PIN 123456, 5-attempt mock throttling alert (unapproved draft assumption).',
      production: 'Passkey / FIDO2 cryptographic biometric login, RFC-compliant email magic link with rate-limited hardware security module.',
      status: 'Sandbox Simulation Only',
    },
    {
      dimension: '2. Bidding Engine & WebSocket Telemetry',
      prototype: 'In-memory React Context state with simulated floor bot counter-bidding.',
      production: 'Distributed Redis pub/sub clustered engine with sub-5ms low-latency WebSocket event loop.',
      status: 'Sandbox Simulation Only',
    },
    {
      dimension: '3. Soft-Close Clock & Anti-Sniping',
      prototype: 'Client-side countdown interval, soft-close reset to 00:02:00, 10-extension limit (ADR-012).',
      production: 'Authoritative atomic-clock synchronized saleroom timestamping with millisecond audit trails.',
      status: 'Approved Logic Prototype',
    },
    {
      dimension: '4. Multi-Currency Calculation',
      prototype: 'Fixed demonstration multipliers derived from ECB reference rates dated 16 Oct 2026 (ADR-021).',
      production: 'Live institutional FX spot feed updated tick-by-tick with automatic hedge rate locking.',
      status: 'Fixed Multiplier Simulation',
    },
    {
      dimension: '5. Consignment Intake & Appraisal',
      prototype: 'Interactive 4-step wizard generating CBV-INTAKE-XXXX ticket with simulated 48h demo notice.',
      production: 'Certified specialist panel appraisal, physical intake receipt, and legally binding reserve contract.',
      status: 'Simulated Demo Feedback',
    },
    {
      dimension: '6. Escrow Custody & Payment Settlement',
      prototype: 'Demonstration invoice view with simulated settlement toggle [DEMO PAYMENT LINK].',
      production: 'Segregated Swiss trust banking escrow account with dual-key cryptographic settlement.',
      status: 'Proposed Future Service (Not Operational)',
    },
    {
      dimension: '7. Logistics & Armored Custody Transit',
      prototype: 'Educational workflow specification and custody diagram.',
      production: 'Malca-Amit / Ferrari Group armored couriers with real-time GPS telemetry and Lloyd’s transit insurance.',
      status: 'Proposed Future Service (Not Operational)',
    },
    {
      dimension: '8. Photographic Catalog Assets',
      prototype: 'Stone Surface #EDE7DC monogram fallback card (CLS < 0.02) for all 6 provisional watch references.',
      production: 'High-magnification 8K multi-angle studio photography with verified institutional copyright clearance.',
      status: 'Governed Monogram Fallback',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Header */}
      <div className="border-b border-stone-hairline pb-8 space-y-3">
        <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-forest/60">
          <Activity className="w-3.5 h-3.5 text-forest/70" />
          <span>Governance & Forensic Standards</span>
        </div>
        <h1 className="font-serif text-4xl sm:text-5xl font-bold text-forest">
          Audit & Transparency Covenant
        </h1>
        <p className="font-sans text-sm sm:text-base text-forest/80 max-w-3xl leading-relaxed">
          ChronoBid Vault was founded on a simple premise: in high-value horology, trust cannot rely on marketing adjectives.
          It must be grounded in physical measurement, mechanical data, and open governance.
        </p>
      </div>

      {/* 3 Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-paper border border-stone-hairline space-y-3">
          <div className="w-10 h-10 bg-paper-dark border border-stone-hairline flex items-center justify-center text-forest">
            <Activity className="w-5 h-5" />
          </div>
          <h3 className="font-serif text-xl font-bold text-forest">
            I. Acoustic Calibre Diagnostics
          </h3>
          <p className="text-xs font-sans text-forest/70 leading-relaxed">
            We reject vague statements like &ldquo;running well.&rdquo; Every watch is tested across 6 positions using calibrated Timegrapher acoustic sensors to record daily rate, balance amplitude, and escapement beat error.
          </p>
        </div>

        <div className="p-6 bg-paper border border-stone-hairline space-y-3">
          <div className="w-10 h-10 bg-paper-dark border border-stone-hairline flex items-center justify-center text-forest">
            <Compass className="w-5 h-5" />
          </div>
          <h3 className="font-serif text-xl font-bold text-forest">
            II. Non-Destructive Microscopy
          </h3>
          <p className="text-xs font-sans text-forest/70 leading-relaxed">
            Every dial, hand set, bezel insert, and case hallmark is scrutinized under 40x stereomicroscopy and 365nm UV luminescence to detect dial restoration, reluming, or laser welding.
          </p>
        </div>

        <div className="p-6 bg-paper border border-stone-hairline space-y-3">
          <div className="w-10 h-10 bg-paper-dark border border-stone-hairline flex items-center justify-center text-forest">
            <FileCheck className="w-5 h-5" />
          </div>
          <h3 className="font-serif text-xl font-bold text-forest">
            III. Provenance Extraction
          </h3>
          <p className="text-xs font-sans text-forest/70 leading-relaxed">
            We maintain direct relationships with manufacture archival departments (Patek Philippe, Audemars Piguet, Omega) to verify movement serial registers and case delivery records.
          </p>
        </div>
      </div>

      {/* Acoustic Timegrapher Audit Standard Template (TC-R06) */}
      <div className="border border-stone-hairline bg-paper p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-stone-hairline gap-2">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-forest/60 block">
              Standardized Diagnostic Benchmark
            </span>
            <h3 className="font-serif text-2xl font-bold text-forest">
              Timegrapher 6-Position Acoustic Audit Template
            </h3>
          </div>
          <span className="text-[10px] font-mono px-2 py-1 bg-lime text-forest font-bold uppercase">
            Mandatory Lot Invariant
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs border border-stone-hairline">
            <thead className="bg-paper-dark border-b border-stone-hairline text-forest/80 uppercase text-[10px]">
              <tr>
                <th className="p-3 border-r border-stone-hairline">Position</th>
                <th className="p-3 border-r border-stone-hairline">Rate (s/d)</th>
                <th className="p-3 border-r border-stone-hairline">Amplitude</th>
                <th className="p-3 border-r border-stone-hairline">Beat Error</th>
                <th className="p-3">Compliance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-hairline/60">
              <tr>
                <td className="p-3 border-r border-stone-hairline font-semibold">1. Dial Up (CH)</td>
                <td className="p-3 border-r border-stone-hairline text-forest font-bold">+1.8 s/d</td>
                <td className="p-3 border-r border-stone-hairline">298°</td>
                <td className="p-3 border-r border-stone-hairline">0.1 ms</td>
                <td className="p-3 text-lime-800 font-bold">PASS (Chronometer Grade)</td>
              </tr>
              <tr>
                <td className="p-3 border-r border-stone-hairline font-semibold">2. Dial Down (FH)</td>
                <td className="p-3 border-r border-stone-hairline text-forest font-bold">+2.2 s/d</td>
                <td className="p-3 border-r border-stone-hairline">292°</td>
                <td className="p-3 border-r border-stone-hairline">0.1 ms</td>
                <td className="p-3 text-lime-800 font-bold">PASS (Chronometer Grade)</td>
              </tr>
              <tr>
                <td className="p-3 border-r border-stone-hairline font-semibold">3. Crown Up (VG)</td>
                <td className="p-3 border-r border-stone-hairline text-forest font-bold">-0.8 s/d</td>
                <td className="p-3 border-r border-stone-hairline">275°</td>
                <td className="p-3 border-r border-stone-hairline">0.2 ms</td>
                <td className="p-3 text-lime-800 font-bold">PASS (Chronometer Grade)</td>
              </tr>
              <tr>
                <td className="p-3 border-r border-stone-hairline font-semibold">4. Crown Down (VB)</td>
                <td className="p-3 border-r border-stone-hairline text-forest font-bold">+3.1 s/d</td>
                <td className="p-3 border-r border-stone-hairline">280°</td>
                <td className="p-3 border-r border-stone-hairline">0.2 ms</td>
                <td className="p-3 text-lime-800 font-bold">PASS (Chronometer Grade)</td>
              </tr>
              <tr>
                <td className="p-3 border-r border-stone-hairline font-semibold">5. Crown Left (HB)</td>
                <td className="p-3 border-r border-stone-hairline text-forest font-bold">+0.5 s/d</td>
                <td className="p-3 border-r border-stone-hairline">272°</td>
                <td className="p-3 border-r border-stone-hairline">0.3 ms</td>
                <td className="p-3 text-lime-800 font-bold">PASS (Chronometer Grade)</td>
              </tr>
              <tr>
                <td className="p-3 border-r border-stone-hairline font-semibold">6. Crown Right (HG)</td>
                <td className="p-3 border-r border-stone-hairline text-forest font-bold">+1.2 s/d</td>
                <td className="p-3 border-r border-stone-hairline">278°</td>
                <td className="p-3 border-r border-stone-hairline">0.1 ms</td>
                <td className="p-3 text-lime-800 font-bold">PASS (Chronometer Grade)</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* FULL 8-DIMENSION DEMO VS PRODUCTION MATRIX (TC-R06) */}
      <div className="border border-stone-hairline bg-paper p-6 sm:p-8 space-y-6">
        <div className="pb-4 border-b border-stone-hairline">
          <span className="text-xs font-mono uppercase tracking-widest text-forest/60 block">
            System Architecture Truth Matrix
          </span>
          <h3 className="font-serif text-2xl font-bold text-forest">
            Full 8-Dimension Prototype vs. Production Transparency Matrix
          </h3>
          <p className="text-xs font-sans text-forest/70 mt-1">
            Mandatory disclosure matrix delineating prototype simulation boundaries from proposed future production infrastructure.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs border border-stone-hairline">
            <thead className="bg-paper-dark border-b border-stone-hairline text-forest/80 uppercase text-[10px]">
              <tr>
                <th className="p-3 border-r border-stone-hairline w-1/4">System Dimension</th>
                <th className="p-3 border-r border-stone-hairline w-1/3">Phase 2 Prototype Implementation</th>
                <th className="p-3 border-r border-stone-hairline w-1/3">Future Production Architecture</th>
                <th className="p-3">Governance Classification</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-hairline/60">
              {matrix.map((row) => (
                <tr key={row.dimension} className="hover:bg-paper-dark/20 transition-colors">
                  <td className="p-3 border-r border-stone-hairline font-bold text-forest">
                    {row.dimension}
                  </td>
                  <td className="p-3 border-r border-stone-hairline text-forest/80">
                    {row.prototype}
                  </td>
                  <td className="p-3 border-r border-stone-hairline text-forest/90">
                    {row.production}
                  </td>
                  <td className="p-3 font-semibold">
                    <span className="px-2 py-0.5 bg-paper-dark border border-stone-hairline text-[10px] block">
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
