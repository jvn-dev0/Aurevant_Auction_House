'use client';

import React from 'react';
import { ArrowRight, ShieldCheck, Microscope, Scale, Building2, CheckCircle2 } from 'lucide-react';

export const ConsignmentSection: React.FC = () => {
  const steps = [
    {
      num: '01',
      title: 'Curatorial Dossier Intake',
      desc: 'Private submission of high-resolution macro photography, historical documentation, and provenance records to department specialists.',
      tag: '48-Hour Appraisal SLA',
      icon: Microscope,
    },
    {
      num: '02',
      title: 'Scientific Assay & Analysis',
      desc: 'Non-destructive XRF metallurgical testing for numismatics, dendrochronology for panel paintings, and infrared reflectography.',
      tag: 'Geneva Laboratory',
      icon: Scale,
    },
    {
      num: '03',
      title: 'Sovereign Title Verification',
      desc: 'Rigorous cross-referencing against the Art Loss Register, Interpol stolen works databases, and historical export registries.',
      tag: 'Clear Title Guarantee',
      icon: ShieldCheck,
    },
    {
      num: '04',
      title: 'Bonded Vault Custody',
      desc: 'Secure transit via armoured diplomatic courier to bonded vaults at Geneva FreePort, Singapore FreePort, or Zurich Vaults.',
      tag: 'Fully Insured Escrow',
      icon: Building2,
    },
  ];

  return (
    <section className="cinematic-section-consign px-6 sm:px-12 py-24 sm:py-32 bg-[#F4F0E8] border-b border-[#D8D0C2] text-[#182720]" id="consign">
      <div className="max-w-6xl mx-auto">
        {/* Header Block in Warm Ivory Archival Foundation */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-16 pb-8 border-b border-[#D8D0C2]">
          <div>
            <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-[#183D30] mb-3">
              <span className="w-2 h-2 rounded-full bg-[#A61935]" />
              <span>Consignor Advisory &amp; Intake Desk</span>
            </div>
            <h2 className="font-serif text-4xl sm:text-5xl text-[#182720] leading-tight">
              Consign to the Vault
            </h2>
          </div>
          <div className="mt-6 lg:mt-0 max-w-md">
            <p className="font-sans text-sm sm:text-base font-normal text-[#182720]/80 leading-relaxed">
              We accept museum-grade objects across our six curatorial disciplines. Every consignment undergoes mandatory scientific authentication and sovereign title clearance before saleroom cataloguing.
            </p>
          </div>
        </div>

        {/* Asymmetric Curatorial Workflow — Non-Boxed Editorial Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div key={step.num} className="relative group border-t-2 border-[#183D30] pt-6 flex flex-col justify-between">
                <div>
                  <div className="flex items-baseline justify-between mb-4">
                    <span className="font-serif text-3xl sm:text-4xl text-[#183D30] italic font-bold">
                      {step.num}
                    </span>
                    <Icon className="w-5 h-5 text-[#C5A059]" />
                  </div>

                  <h3 className="font-serif text-xl sm:text-2xl text-[#182720] font-semibold mb-2">
                    {step.title}
                  </h3>

                  <p className="font-sans text-sm text-[#182720]/75 leading-relaxed mb-6 font-normal">
                    {step.desc}
                  </p>
                </div>

                <div className="pt-3 border-t border-[#D8D0C2]">
                  <span className="inline-block font-mono text-[11px] uppercase tracking-wider text-[#A61935] font-semibold bg-[#A61935]/10 px-2.5 py-1 rounded-sm">
                    {step.tag}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Consignment Call-To-Action Banner */}
        <div className="bg-[#183D30] text-[#F4F0E8] p-8 sm:p-12 rounded-sm border border-[#C5A059]/40 flex flex-col md:flex-row items-center justify-between gap-8 shadow-xl">
          <div className="space-y-2 text-center md:text-left">
            <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#C5A059]">
              Direct Specialist Consultation
            </div>
            <h3 className="font-serif text-2xl sm:text-3xl text-[#F4F0E8]">
              Initiate a Private Curatorial Appraisal
            </h3>
            <p className="font-sans text-sm text-[#A7A39A] font-light max-w-xl">
              Submit your single masterpiece or comprehensive multi-category collection for confidential review by our department senior specialists.
            </p>
          </div>

          <a
            href="/consign"
            className="shrink-0 px-8 py-4 bg-[#C5A059] text-[#111312] font-mono text-xs font-semibold uppercase tracking-wider hover:bg-[#D8B26A] transition-all flex items-center gap-2 shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-[#C5A059] min-h-[48px]"
          >
            <span>Submit Collection Dossier</span>
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>

        {/* Layered Architectural Chapter Seam § 05 */}
        <div className="mt-20 pt-6 border-t border-[#D8D0C2] flex items-center justify-between text-xs font-mono text-[#182720]/70">
          <span className="text-[#183D30] tracking-widest uppercase font-semibold">§ 05 • Institutional Archival Registry</span>
          <span className="hidden sm:inline">Geneva, Switzerland • Bonded Escrow Terms</span>
        </div>
      </div>
    </section>
  );
};
