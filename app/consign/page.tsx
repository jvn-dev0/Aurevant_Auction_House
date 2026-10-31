'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useChronoBid } from '@/lib/context';
import { MarketplaceCategory } from '@/lib/data';
import {
  FileText,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Shield,
  Clock,
  Sparkles,
  AlertCircle,
  ShieldAlert,
  Coins,
  Gem,
  Palette,
  Watch,
  UploadCloud,
  FileUp,
  Image as ImageIcon,
  Trash2,
  Paperclip,
  Check,
  X,
} from 'lucide-react';

export interface ConsignorUploadedFile {
  id: string;
  name: string;
  sizeBytes: number;
  type: string;
  isDocument: boolean;
  simulatedProgress: number;
  uploadedAt: string;
}

export default function ConsignPage() {
  const router = useRouter();
  const { addConsignment, user } = useChronoBid();

  const [step, setStep] = useState<number>(1);
  const [ticketGenerated, setTicketGenerated] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    category: 'Fine Horology' as string,
    manufacturer: '',
    reference: '',
    year: '',
    caseMaterial: 'Stainless Steel',
    condition: 'Unpolished / Original Box & Papers',
    reserveEstimateUsd: 25000,
    collectorName: user.name || 'Alexander Vance',
    collectorEmail: user.email || 'vance@horologyvault.ch',
    collectorPhone: '+41 22 819 00 00',
    notes: 'Single owner provenance since 1982.',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Interactive File Upload State (Feature C)
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [fileError, setFileError] = useState<string | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<ConsignorUploadedFile[]>([
    {
      id: 'demo-file-1',
      name: 'specimen-macro-dial.jpg',
      sizeBytes: 2450000,
      type: 'image/jpeg',
      isDocument: false,
      simulatedProgress: 100,
      uploadedAt: 'Today',
    },
    {
      id: 'demo-file-2',
      name: 'archival-provenance-papers.pdf',
      sizeBytes: 1180000,
      type: 'application/pdf',
      isDocument: true,
      simulatedProgress: 100,
      uploadedAt: 'Today',
    },
  ]);

  const MAX_FILE_SIZE_BYTES = 15 * 1024 * 1024; // 15 MB
  const ALLOWED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp', '.pdf'];

  const validateAndAddFiles = (fileList: FileList | File[]) => {
    setFileError(null);
    const newFiles: ConsignorUploadedFile[] = [];

    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i];
      const extension = '.' + file.name.split('.').pop()?.toLowerCase();

      if (!ALLOWED_EXTENSIONS.includes(extension)) {
        setFileError(`File "${file.name}" has an unsupported format. Permitted types: JPG, PNG, WEBP, PDF.`);
        return;
      }

      if (file.size > MAX_FILE_SIZE_BYTES) {
        setFileError(`File "${file.name}" exceeds the 15 MB size limit (${(file.size / (1024 * 1024)).toFixed(1)} MB).`);
        return;
      }

      newFiles.push({
        id: `file-${Date.now()}-${i}-${Math.random().toString(36).substring(2, 6)}`,
        name: file.name,
        sizeBytes: file.size,
        type: file.type,
        isDocument: file.type.includes('pdf') || extension === '.pdf',
        simulatedProgress: 100,
        uploadedAt: 'Just now',
      });
    }

    setUploadedFiles((prev) => [...prev, ...newFiles]);
  };

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      validateAndAddFiles(e.dataTransfer.files);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndAddFiles(e.target.files);
      e.target.value = '';
    }
  };

  const removeFile = (id: string) => {
    setUploadedFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024 * 1024) {
      return `${Math.round(bytes / 1024)} KB`;
    }
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const categoryOptions = [
    { id: 'Fine Horology', icon: Watch, label: 'Fine Horology', desc: 'Vintage & Modern Timepieces, Complications' },
    { id: 'Rare Coins & Numismatics', icon: Coins, label: 'Rare Coins & Numismatics', desc: 'Ancient, Medieval, Royal & Sovereign Coinage' },
    { id: 'Haute Joaillerie', icon: Gem, label: 'Haute Joaillerie', desc: 'Signed Period Jewels, Natural Certified Gems' },
    { id: 'Fine Art', icon: Palette, label: 'Fine Art', desc: 'Old Masters, Impressionist & Contemporary Works' },
  ];

  const getCategoryFieldLabels = (cat: string) => {
    switch (cat) {
      case 'Rare Coins & Numismatics':
        return {
          makerLabel: 'Issuing Authority / Mint *',
          makerPlaceholder: 'e.g., Classical Athens, Oxford Mint, Roman Empire',
          refLabel: 'Denomination / Reference *',
          refPlaceholder: 'e.g., Silver Tetradrachm, Triple Unite (£3)',
          yearLabel: 'Strike Year / Reign *',
          yearPlaceholder: 'e.g., c. 460–455 BC, 1642, 112 AD',
          materialLabel: 'Metal Composition',
          materialOptions: ['Fine Silver (.985+)', 'Crown Gold (22k)', 'Fine Gold (24k)', 'Bronze / Aes', 'Electrum'],
        };
      case 'Haute Joaillerie':
        return {
          makerLabel: 'Maison / Jeweler *',
          makerPlaceholder: 'e.g., Cartier Paris, Van Cleef & Arpels, Boucheron',
          refLabel: 'Designation / Reference *',
          refPlaceholder: 'e.g., Art Deco Emerald Sautoir, 5ct Ruby Ring',
          yearLabel: 'Period / Era *',
          yearPlaceholder: 'e.g., Circa 1925 (Art Deco), 1958, Belle Époque',
          materialLabel: 'Mounting Metal & Purity',
          materialOptions: ['Platinum 950', '18k Yellow Gold', '18k White Gold', '18k Rose Gold', 'Platinum & Gold Bi-Metal'],
        };
      case 'Fine Art':
        return {
          makerLabel: 'Artist / Studio Hand *',
          makerPlaceholder: 'e.g., Studio of Rembrandt van Rijn, Edgar Degas',
          refLabel: 'Title / Catalogue Reference *',
          refPlaceholder: 'e.g., Portrait of a Scholar, Lemoisne No. 1184',
          yearLabel: 'Execution Year *',
          yearPlaceholder: 'e.g., 1638, 1894, Circa 1910',
          materialLabel: 'Medium & Support',
          materialOptions: ['Oil on Canvas', 'Oil on Oak Panel', 'Pastel on Paper', 'Charcoal & Wash', 'Sculptural Bronze'],
        };
      default:
        return {
          makerLabel: 'Manufacturer / Maison *',
          makerPlaceholder: 'e.g., Patek Philippe, Rolex, Heuer, Audemars Piguet',
          refLabel: 'Reference Number *',
          refPlaceholder: 'e.g., Ref. 3520D, Ref. 6239, Ref. 5402ST',
          yearLabel: 'Production Period / Year *',
          yearPlaceholder: 'e.g., Circa 1968, 1972',
          materialLabel: 'Case Metal',
          materialOptions: ['Stainless Steel', '18k Yellow Gold', '18k White Gold', '18k Rose Gold', 'Platinum 950', 'Titanium Grade 5'],
        };
    }
  };

  const fieldLabels = getCategoryFieldLabels(formData.category);

  const validateStep = (currentStep: number): boolean => {
    const newErrors: Record<string, string> = {};
    if (currentStep === 1) {
      if (!formData.category) newErrors.category = 'Please select an asset division.';
    } else if (currentStep === 2) {
      if (!formData.manufacturer.trim()) newErrors.manufacturer = `${fieldLabels.makerLabel.replace(' *', '')} is required.`;
      if (!formData.reference.trim()) newErrors.reference = `${fieldLabels.refLabel.replace(' *', '')} is required.`;
      if (!formData.year.trim()) newErrors.year = `${fieldLabels.yearLabel.replace(' *', '')} is required.`;
    } else if (currentStep === 3) {
      if (!formData.condition.trim()) newErrors.condition = 'Condition summary is required.';
      if (formData.reserveEstimateUsd <= 0) newErrors.reserve = 'Reserve valuation must be greater than zero.';
    } else if (currentStep === 4) {
      if (!formData.collectorEmail.includes('@')) newErrors.email = 'Valid email is required.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      setStep((prev) => Math.min(4, prev + 1));
    }
  };

  const handlePrev = () => {
    setStep((prev) => Math.max(1, prev - 1));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep(4)) return;

    const ticketId = addConsignment({
      category: formData.category,
      manufacturer: formData.manufacturer,
      reference: formData.reference,
      year: formData.year,
      condition: formData.condition,
      reserveEstimateUsd: Number(formData.reserveEstimateUsd),
      reserveAgreed: false,
      clientContactEmail: formData.collectorEmail,
    });

    setTicketGenerated(ticketId);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Header */}
      <div className="border-b border-stone-hairline pb-6 space-y-2">
        <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-forest/60">
          <FileText className="w-3.5 h-3.5 text-forest/70" />
          <span>Curatorial Intake & Specialist Appraisal Wizard</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-forest">
          Consign a Rare Asset
        </h1>
        <p className="font-sans text-sm sm:text-base text-forest/80 leading-relaxed">
          Submit your timepiece, rare coin, piece of haute joaillerie, or fine artwork to the ChronoBid Vault curatorial appraisal desk.
          Receive an objective specialist valuation, confidential reserve agreements, and access to our global collector saleroom.
        </p>
      </div>

      {ticketGenerated ? (
        /* Submission Success Ticket View */
        <div className="p-8 bg-paper border border-stone-hairline space-y-6 shadow-tactile">
          <div className="flex items-center gap-3 text-lime-800">
            <CheckCircle2 className="w-8 h-8 text-lime-700" />
            <div>
              <h2 className="font-serif text-2xl font-bold text-forest">
                Intake Ticket Formally Generated
              </h2>
              <span className="font-mono text-sm font-bold text-forest">
                Tracking Identifier: {ticketGenerated}
              </span>
            </div>
          </div>

          <div className="p-4 bg-paper-dark border border-stone-hairline font-mono text-xs space-y-2">
            <div className="flex justify-between border-b border-stone-hairline pb-1.5">
              <span className="text-forest/60">Asset Division:</span>
              <span className="font-bold text-forest">{formData.category}</span>
            </div>
            <div className="flex justify-between border-b border-stone-hairline pb-1.5">
              <span className="text-forest/60">Asset Reference:</span>
              <span className="font-bold text-forest">{formData.manufacturer} {formData.reference} ({formData.year})</span>
            </div>
            <div className="flex justify-between border-b border-stone-hairline pb-1.5">
              <span className="text-forest/60">Estimated Target Reserve:</span>
              <span className="font-bold text-forest">${Number(formData.reserveEstimateUsd).toLocaleString()} USD</span>
            </div>
            <div className="flex justify-between border-b border-stone-hairline pb-1.5">
              <span className="text-forest/60">Consignor Contact:</span>
              <span className="text-forest">{formData.collectorEmail}</span>
            </div>
            <div className="flex justify-between border-b border-stone-hairline pb-1.5">
              <span className="text-forest/60">Attached Media & Documentation:</span>
              <span className="font-bold text-forest">
                {uploadedFiles.length > 0
                  ? `${uploadedFiles.length} files (${uploadedFiles.filter(f => !f.isDocument).length} photos, ${uploadedFiles.filter(f => f.isDocument).length} docs) [SIMULATED]`
                  : 'None attached'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-forest/60">Current Status:</span>
              <span className="font-bold text-lime-800 bg-lime/30 px-2 py-0.5">Under Specialist Review</span>
            </div>
          </div>

          <div className="p-4 bg-amber-50 border border-amber-300 text-amber-950 font-mono text-xs space-y-1">
            <span className="font-bold uppercase text-[10px] block text-amber-900">
              Prototype Notice (Phase 1 Baseline §4.3):
            </span>
            <p className="leading-relaxed">
              The 48-hour appraisal timeline is classified strictly as [SIMULATED DEMO FEEDBACK — NOT A LEGAL SLA].
              You can track or edit reserve agreements in your consignor dashboard or inspect curatorial actions in the simulated specialist console.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Link
              href="/account/consignments"
              className="py-3 px-6 bg-forest hover:bg-forest-hover text-paper font-mono text-xs uppercase tracking-wider font-bold transition-colors flex items-center gap-2 shadow-tactile"
            >
              <span>View in Consignor Portal</span>
              <ArrowRight className="w-4 h-4 text-lime" />
            </Link>
            <Link
              href="/admin"
              className="py-3 px-5 bg-paper-dark hover:bg-stone-surface border border-stone-hairline text-forest font-mono text-xs uppercase tracking-wider flex items-center gap-1.5"
            >
              <ShieldAlert className="w-4 h-4 text-lime-700" />
              <span>Inspect in Specialist Desk [Demo]</span>
            </Link>
            <button
              type="button"
              onClick={() => {
                setTicketGenerated(null);
                setStep(1);
                setFormData({
                  category: 'Fine Horology',
                  manufacturer: '',
                  reference: '',
                  year: '',
                  caseMaterial: 'Stainless Steel',
                  condition: 'Unpolished / Original Box & Papers',
                  reserveEstimateUsd: 25000,
                  collectorName: user.name || 'Alexander Vance',
                  collectorEmail: user.email || 'vance@horologyvault.ch',
                  collectorPhone: '+41 22 819 00 00',
                  notes: '',
                });
              }}
              className="py-3 px-4 bg-paper hover:bg-paper-dark border border-stone-hairline text-forest font-mono text-xs uppercase tracking-wider"
            >
              Consign Another Lot
            </button>
          </div>
        </div>
      ) : (
        /* 4-Step Intake Wizard */
        <div className="bg-paper border border-stone-hairline shadow-tactile p-6 sm:p-8 space-y-8">
          {/* Stepper Progress Bar */}
          <div className="flex items-center justify-between font-mono text-xs pb-4 border-b border-stone-hairline">
            {[1, 2, 3, 4].map((s) => (
              <div key={s} className="flex items-center gap-2">
                <span
                  className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${
                    step === s
                      ? 'bg-lime text-forest border border-forest/20'
                      : step > s
                      ? 'bg-forest text-paper'
                      : 'bg-paper-dark text-forest/40 border border-stone-hairline'
                  }`}
                >
                  {s}
                </span>
                <span
                  className={`hidden sm:inline uppercase text-[10px] tracking-wider ${
                    step === s ? 'text-forest font-bold' : 'text-forest/50'
                  }`}
                >
                  {s === 1
                    ? 'Division'
                    : s === 2
                    ? 'Specimen Spec'
                    : s === 3
                    ? 'Condition & Reserve'
                    : 'Dispatch'}
                </span>
              </div>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* STEP 1: CATEGORY SELECTION */}
            {step === 1 && (
              <div className="space-y-4">
                <div>
                  <h3 className="font-serif text-xl font-bold text-forest">
                    Step 1: Select Asset Division
                  </h3>
                  <p className="text-xs font-mono text-forest/70 pt-0.5">
                    Choose the appropriate curatorial division for your consignment.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  {categoryOptions.map((cat) => {
                    const Icon = cat.icon;
                    const isSelected = formData.category === cat.id;
                    return (
                      <div
                        key={cat.id}
                        onClick={() => setFormData({ ...formData, category: cat.id })}
                        className={`p-4 border cursor-pointer transition-all ${
                          isSelected
                            ? 'bg-forest text-paper border-forest shadow-tactile ring-1 ring-forest'
                            : 'bg-paper hover:bg-paper-dark border-stone-hairline text-forest'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded ${isSelected ? 'bg-lime text-forest' : 'bg-paper-dark text-forest'}`}>
                            <Icon className="w-5 h-5" />
                          </div>
                          <div>
                            <span className="font-serif text-base font-bold block">{cat.label}</span>
                            <span className={`text-[11px] font-mono block ${isSelected ? 'text-paper/80' : 'text-forest/60'}`}>
                              {cat.desc}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* STEP 2: ASSET SPECIFICATION (DYNAMIC BY CATEGORY) */}
            {step === 2 && (
              <div className="space-y-4">
                <div>
                  <div className="text-[10px] font-mono uppercase tracking-widest text-forest/60">
                    Division: {formData.category}
                  </div>
                  <h3 className="font-serif text-xl font-bold text-forest">
                    Step 2: Specimen Identification & Details
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label htmlFor="consign-manufacturer" className="text-xs font-mono uppercase text-forest/80 block">
                      {fieldLabels.makerLabel}
                    </label>
                    <input
                      id="consign-manufacturer"
                      type="text"
                      value={formData.manufacturer}
                      onChange={(e) => setFormData({ ...formData, manufacturer: e.target.value })}
                      placeholder={fieldLabels.makerPlaceholder}
                      required
                      className="w-full px-3 py-2 bg-paper-dark border border-stone-hairline text-forest font-mono text-xs focus:outline-none focus:border-forest"
                    />
                    {errors.manufacturer && <span className="text-[10px] text-red-600 font-mono">{errors.manufacturer}</span>}
                  </div>

                  <div className="space-y-1">
                    <label htmlFor="consign-reference" className="text-xs font-mono uppercase text-forest/80 block">
                      {fieldLabels.refLabel}
                    </label>
                    <input
                      id="consign-reference"
                      type="text"
                      value={formData.reference}
                      onChange={(e) => setFormData({ ...formData, reference: e.target.value })}
                      placeholder={fieldLabels.refPlaceholder}
                      required
                      className="w-full px-3 py-2 bg-paper-dark border border-stone-hairline text-forest font-mono text-xs focus:outline-none focus:border-forest"
                    />
                    {errors.reference && <span className="text-[10px] text-red-600 font-mono">{errors.reference}</span>}
                  </div>

                  <div className="space-y-1">
                    <label htmlFor="consign-year" className="text-xs font-mono uppercase text-forest/80 block">
                      {fieldLabels.yearLabel}
                    </label>
                    <input
                      id="consign-year"
                      type="text"
                      value={formData.year}
                      onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                      placeholder={fieldLabels.yearPlaceholder}
                      required
                      className="w-full px-3 py-2 bg-paper-dark border border-stone-hairline text-forest font-mono text-xs focus:outline-none focus:border-forest"
                    />
                    {errors.year && <span className="text-[10px] text-red-600 font-mono">{errors.year}</span>}
                  </div>

                  <div className="space-y-1">
                    <label htmlFor="consign-metal" className="text-xs font-mono uppercase text-forest/80 block">
                      {fieldLabels.materialLabel}
                    </label>
                    <select
                      id="consign-metal"
                      value={formData.caseMaterial}
                      onChange={(e) => setFormData({ ...formData, caseMaterial: e.target.value })}
                      className="w-full px-3 py-2 bg-paper-dark border border-stone-hairline text-forest font-mono text-xs focus:outline-none focus:border-forest"
                    >
                      {fieldLabels.materialOptions.map((opt) => (
                        <option key={opt}>{opt}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3: CONDITION & FINANCIAL EXPECTATIONS */}
            {step === 3 && (
              <div className="space-y-4">
                <h3 className="font-serif text-xl font-bold text-forest">
                  Step 3: Condition, Provenance & Target Reserve
                </h3>
                <div className="space-y-4">
                  <div className="space-y-1">
                    <label htmlFor="consign-condition" className="text-xs font-mono uppercase text-forest/80 block">
                      Condition & Accompanying Artifacts / Certificates *
                    </label>
                    <textarea
                      id="consign-condition"
                      rows={3}
                      value={formData.condition}
                      onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
                      placeholder="Specify if accompanied by lab certificates (SSEF, Gübelin, NGC, PCGS), original cases, or archival provenance ledgers..."
                      required
                      className="w-full px-3 py-2 bg-paper-dark border border-stone-hairline text-forest font-mono text-xs focus:outline-none focus:border-forest"
                    />
                    {errors.condition && <span className="text-[10px] text-red-600 font-mono">{errors.condition}</span>}
                  </div>

                  {/* INTERACTIVE FILE SELECTION & DOCUMENT UPLOAD (FEATURE C) */}
                  <div className="space-y-3 pt-2">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-mono uppercase text-forest/80 block">
                        Object Photographs & Supporting Curatorial Documentation
                      </label>
                      <span className="text-[10px] font-mono text-forest/60">
                        Max 15MB per file • JPG, PNG, WEBP, PDF
                      </span>
                    </div>

                    {/* Curatorial Guidance Box */}
                    <div className="p-3 bg-paper-dark border border-stone-hairline text-xs font-mono text-forest/80 space-y-1">
                      <div className="flex items-center gap-1.5 font-bold text-forest text-[11px] uppercase">
                        <Paperclip className="w-3.5 h-3.5 text-forest/70" />
                        <span>Curatorial Documentation Guidelines:</span>
                      </div>
                      <p className="text-[11px] text-forest/70 leading-relaxed">
                        Attach high-resolution macro photographs of the front dial/obverse, movement/hallmarks, and verso. For gems, coins, and art, include PDF certificates (SSEF, Gübelin, NGC, PCGS) or provenance receipts.
                      </p>
                    </div>

                    {/* Drag & Drop Zone */}
                    <div
                      onDragOver={(e) => {
                        e.preventDefault();
                        setIsDragging(true);
                      }}
                      onDragLeave={() => setIsDragging(false)}
                      onDrop={handleFileDrop}
                      onClick={() => fileInputRef.current?.click()}
                      className={`p-6 border-2 border-dashed rounded-sm text-center cursor-pointer transition-all select-none ${
                        isDragging
                          ? 'border-forest bg-lime/20'
                          : 'border-stone-hairline bg-paper-dark/60 hover:bg-paper-dark hover:border-forest/60'
                      }`}
                    >
                      <input
                        ref={fileInputRef}
                        type="file"
                        multiple
                        accept=".jpg,.jpeg,.png,.webp,.pdf"
                        onChange={handleFileInputChange}
                        className="hidden"
                      />
                      <div className="flex flex-col items-center justify-center gap-2">
                        <div className="p-2.5 bg-paper rounded-full border border-stone-hairline text-forest">
                          <UploadCloud className="w-6 h-6 text-forest/70" />
                        </div>
                        <div>
                          <span className="font-serif text-sm font-bold text-forest block">
                            Click to select files or drag and drop object media
                          </span>
                          <span className="text-[11px] font-mono text-forest/60 block mt-0.5">
                            Permitted formats: High-res JPG, PNG, WEBP, or archival PDF
                          </span>
                        </div>
                        <span className="text-[9px] font-mono uppercase tracking-widest text-forest/50 bg-paper px-2 py-0.5 border border-stone-hairline mt-1">
                          [SIMULATED FILE SELECTION — BROWSER MEMORY ONLY — NO SERVER UPLOAD]
                        </span>
                      </div>
                    </div>

                    {/* Validation Error Banner */}
                    {fileError && (
                      <div className="p-3 bg-rose-50 border border-rose-300 text-rose-900 font-mono text-xs flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <AlertCircle className="w-4 h-4 text-rose-700 shrink-0" />
                          <span>{fileError}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => setFileError(null)}
                          className="text-rose-700 hover:text-rose-900"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    )}

                    {/* Attached File Cards */}
                    {uploadedFiles.length > 0 && (
                      <div className="space-y-2 pt-1">
                        <div className="flex items-center justify-between text-xs font-mono text-forest/70 pb-1">
                          <span>Attached Media ({uploadedFiles.length})</span>
                          <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="text-forest hover:text-lime-900 underline flex items-center gap-1"
                          >
                            <FileUp className="w-3 h-3" />
                            <span>Add More Files</span>
                          </button>
                        </div>

                        <div className="grid grid-cols-1 gap-2">
                          {uploadedFiles.map((file) => (
                            <div
                              key={file.id}
                              className="p-3 bg-paper border border-stone-hairline flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-tactile"
                            >
                              <div className="flex items-center gap-3 min-w-0">
                                <div className="p-2 bg-paper-dark border border-stone-hairline text-forest shrink-0">
                                  {file.isDocument ? (
                                    <FileText className="w-4 h-4 text-amber-800" />
                                  ) : (
                                    <ImageIcon className="w-4 h-4 text-blue-800" />
                                  )}
                                </div>
                                <div className="min-w-0">
                                  <span className="font-mono text-xs text-forest font-semibold truncate block">
                                    {file.name}
                                  </span>
                                  <div className="flex items-center gap-2 text-[10px] font-mono text-forest/60">
                                    <span>{formatFileSize(file.sizeBytes)}</span>
                                    <span>•</span>
                                    <span className="text-emerald-800 font-semibold flex items-center gap-1">
                                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                      <span>Ready for Curatorial Audit [DEMO]</span>
                                    </span>
                                  </div>
                                </div>
                              </div>

                              <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                                {/* Simulated Progress Bar */}
                                <div className="w-24 bg-paper-dark h-1.5 border border-stone-hairline overflow-hidden hidden sm:block">
                                  <div
                                    className="bg-lime h-full"
                                    style={{ width: `${file.simulatedProgress}%` }}
                                  />
                                </div>

                                <button
                                  type="button"
                                  onClick={() => removeFile(file.id)}
                                  aria-label={`Remove file ${file.name}`}
                                  className="p-1 text-forest/40 hover:text-rose-700 transition-colors"
                                  title="Remove attachment"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="space-y-1">
                    <label htmlFor="consign-reserve" className="text-xs font-mono uppercase text-forest/80 block">
                      Target Minimum Reserve (USD) *
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 font-mono text-xs text-forest/60">
                        $
                      </span>
                      <input
                        id="consign-reserve"
                        type="number"
                        value={formData.reserveEstimateUsd}
                        onChange={(e) => setFormData({ ...formData, reserveEstimateUsd: Number(e.target.value) })}
                        step="500"
                        min="1000"
                        required
                        className="w-full pl-7 pr-3 py-2 bg-paper-dark border border-stone-hairline text-forest font-mono text-xs focus:outline-none focus:border-forest"
                      />
                    </div>
                    {errors.reserve && <span className="text-[10px] text-red-600 font-mono">{errors.reserve}</span>}
                    <p className="text-[10px] font-mono text-forest/60 pt-1">
                      Our curatorial specialists will review this against recent saleroom hammer prices and issue a preliminary appraisal range.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 4: CONTACT & DISPATCH */}
            {step === 4 && (
              <div className="space-y-4">
                <h3 className="font-serif text-xl font-bold text-forest">
                  Step 4: Consignor Identification & Dispatch
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label htmlFor="consign-name" className="text-xs font-mono uppercase text-forest/80 block">
                      Collector / Consignor Name *
                    </label>
                    <input
                      id="consign-name"
                      type="text"
                      value={formData.collectorName}
                      onChange={(e) => setFormData({ ...formData, collectorName: e.target.value })}
                      required
                      className="w-full px-3 py-2 bg-paper-dark border border-stone-hairline text-forest font-mono text-xs focus:outline-none focus:border-forest"
                    />
                  </div>

                  <div className="space-y-1">
                    <label htmlFor="consign-email" className="text-xs font-mono uppercase text-forest/80 block">
                      Confidential Email Address *
                    </label>
                    <input
                      id="consign-email"
                      type="email"
                      value={formData.collectorEmail}
                      onChange={(e) => setFormData({ ...formData, collectorEmail: e.target.value })}
                      required
                      className="w-full px-3 py-2 bg-paper-dark border border-stone-hairline text-forest font-mono text-xs focus:outline-none focus:border-forest"
                    />
                    {errors.email && <span className="text-[10px] text-red-600 font-mono">{errors.email}</span>}
                  </div>
                </div>

                <div className="p-4 bg-paper-dark border border-stone-hairline font-mono text-xs space-y-1">
                  <span className="font-bold text-forest uppercase block text-[10px]">
                    Summary Intake Ledger:
                  </span>
                  <p>
                    [{formData.category}] {formData.manufacturer} {formData.reference} ({formData.year}) — ${Number(formData.reserveEstimateUsd).toLocaleString()} USD Target Reserve
                  </p>
                  <p className="text-[11px] text-forest/70 pt-0.5">
                    • Attached Media: {uploadedFiles.length} files ({uploadedFiles.filter(f => !f.isDocument).length} photos, {uploadedFiles.filter(f => f.isDocument).length} documents) [Browser-side fixture]
                  </p>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="pt-4 border-t border-stone-hairline flex items-center justify-between">
              {step > 1 ? (
                <button
                  type="button"
                  onClick={handlePrev}
                  className="py-2.5 px-4 bg-paper-dark hover:bg-stone-surface border border-stone-hairline text-forest font-mono text-xs uppercase tracking-wider flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Previous</span>
                </button>
              ) : (
                <div></div>
              )}

              {step < 4 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="py-2.5 px-5 bg-forest hover:bg-forest-hover text-paper font-mono text-xs uppercase tracking-wider font-bold flex items-center gap-1.5"
                >
                  <span>Continue</span>
                  <ArrowRight className="w-3.5 h-3.5 text-lime" />
                </button>
              ) : (
                <button
                  type="submit"
                  className="py-3 px-6 bg-lime hover:bg-lime-hover text-forest font-mono text-xs uppercase tracking-wider font-bold flex items-center gap-1.5 shadow-tactile"
                >
                  <Sparkles className="w-4 h-4 fill-forest" />
                  <span>Submit for 48h Appraisal</span>
                </button>
              )}
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
