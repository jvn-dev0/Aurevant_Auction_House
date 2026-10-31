'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useChronoBid, ConsignmentTicket, ConsignmentStatus } from '@/lib/context';
import {
  ShieldAlert,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText,
  DollarSign,
  Send,
  XCircle,
  RotateCcw,
  Trash2,
  Sparkles,
  Layers,
  ArrowRight,
  ExternalLink,
  ChevronRight,
  UserCheck,
  Users,
  Calendar,
  Sliders,
  History,
  Shield,
  Search,
  Lock,
  Unlock,
  Check,
  Plus,
  Hash,
  Download,
} from 'lucide-react';

type AdminTab = 'consignments' | 'collectors' | 'scheduler' | 'policies' | 'audit';

interface CollectorRecord {
  paddleNumber: number;
  name: string;
  institution: string;
  jurisdiction: string;
  verificationTier: 'Tier 1: Identity Verified' | 'Tier 2: Institutional KYC / AML Cleared' | 'Tier 3: Sovereign Family Office';
  vaultHeadroomUsd: number;
  status: 'Active Saleroom' | 'Suspended / Headroom Freeze' | 'Under KYC Review';
  joinedDate: string;
}

interface AuctionSession {
  sessionId: string;
  code: string;
  title: string;
  department: string;
  status: 'Completed' | 'Live Saleroom' | 'Scheduled' | 'Curatorial Intake';
  scheduledDate: string;
  lotCount: number;
  totalEstimateUsd: number;
  realizedUsd?: number;
}

interface AuditLogEntry {
  id: string;
  timestamp: string;
  operator: string;
  actionType: 'VALUATION_ISSUED' | 'RESERVE_APPROVED' | 'PADDLE_KYC_VERIFIED' | 'POLICY_UPDATED' | 'DOCS_REQUESTED' | 'PADDLE_SUSPENDED' | 'SESSION_SCHEDULED';
  target: string;
  rationale: string;
  checksum: string;
}

const INITIAL_COLLECTORS: CollectorRecord[] = [
  {
    paddleNumber: 8402,
    name: 'Lord Sterling',
    institution: 'Mayfair Family Trust',
    jurisdiction: 'United Kingdom',
    verificationTier: 'Tier 3: Sovereign Family Office',
    vaultHeadroomUsd: 3500000,
    status: 'Active Saleroom',
    joinedDate: '12 Jan 2024',
  },
  {
    paddleNumber: 3104,
    name: 'Dr. H. Vance',
    institution: 'Geneva Horology Collection',
    jurisdiction: 'Switzerland',
    verificationTier: 'Tier 2: Institutional KYC / AML Cleared',
    vaultHeadroomUsd: 1500000,
    status: 'Active Saleroom',
    joinedDate: '04 Mar 2024',
  },
  {
    paddleNumber: 5921,
    name: 'E. Rothschild & Cie',
    institution: 'Rothschild Curatorial Trust',
    jurisdiction: 'France',
    verificationTier: 'Tier 3: Sovereign Family Office',
    vaultHeadroomUsd: 10000000,
    status: 'Active Saleroom',
    joinedDate: '18 Nov 2023',
  },
  {
    paddleNumber: 1209,
    name: 'Kenji Tanaka',
    institution: 'Tokyo Imperial Vault',
    jurisdiction: 'Japan',
    verificationTier: 'Tier 2: Institutional KYC / AML Cleared',
    vaultHeadroomUsd: 750000,
    status: 'Active Saleroom',
    joinedDate: '29 Jun 2024',
  },
  {
    paddleNumber: 7743,
    name: 'Jean-Luc Moreau',
    institution: 'Private Collector',
    jurisdiction: 'Monaco',
    verificationTier: 'Tier 1: Identity Verified',
    vaultHeadroomUsd: 250000,
    status: 'Under KYC Review',
    joinedDate: '15 Oct 2026',
  },
  {
    paddleNumber: 9021,
    name: 'Duchess of Alba Foundation',
    institution: 'Iberian Heritage Trust',
    jurisdiction: 'Spain',
    verificationTier: 'Tier 3: Sovereign Family Office',
    vaultHeadroomUsd: 5000000,
    status: 'Suspended / Headroom Freeze',
    joinedDate: '08 Aug 2024',
  },
];

const INITIAL_SESSIONS: AuctionSession[] = [
  {
    sessionId: 'SESS-17',
    code: 'CBV-2026-09-GEN',
    title: 'The Geneva Horological & Vault Rarities I',
    department: 'Fine Horology & Rare Coins',
    status: 'Completed',
    scheduledDate: '15 Oct 2026',
    lotCount: 9,
    totalEstimateUsd: 7200000,
    realizedUsd: 8450000,
  },
  {
    sessionId: 'SESS-18',
    code: 'CBV-2026-10-MAY',
    title: 'The Mayfair Curated Spring Evening Sale',
    department: 'Four Master Divisions (15 Lots)',
    status: 'Live Saleroom',
    scheduledDate: '28 Oct 2026',
    lotCount: 15,
    totalEstimateUsd: 1485000,
    realizedUsd: 28000,
  },
  {
    sessionId: 'SESS-19',
    code: 'CBV-2026-11-MCO',
    title: 'The Monaco Grand Masters & High Jewellery Session',
    department: 'Haute Joaillerie & Fine Art',
    status: 'Scheduled',
    scheduledDate: '14 Nov 2026',
    lotCount: 12,
    totalEstimateUsd: 14200000,
  },
  {
    sessionId: 'SESS-20',
    code: 'CBV-2026-12-TYO',
    title: 'The Tokyo Imperial Timepieces & Rare Numismatics',
    department: 'Fine Horology & Rare Coins',
    status: 'Curatorial Intake',
    scheduledDate: '05 Dec 2026',
    lotCount: 5,
    totalEstimateUsd: 4500000,
  },
];

const INITIAL_AUDIT_LOGS: AuditLogEntry[] = [
  {
    id: 'LOG-001',
    timestamp: '2026-10-30 15:42:10 UTC',
    operator: 'Jean-Claude Vernier (SP-8821)',
    actionType: 'VALUATION_ISSUED',
    target: 'Ticket #TK-9021 (Patek Philippe 5711/1R)',
    rationale: 'Archival ledger confirmed 2020 single-owner provenance. Valuation issued: $115,000 - $135,000 USD.',
    checksum: '0x7f8a9b2c3d4e5f60a1b2c3d4e5f60718293a4b5c6d7e8f90a1b2c3d4e5f6a1b2',
  },
  {
    id: 'LOG-002',
    timestamp: '2026-10-30 14:18:04 UTC',
    operator: 'Jean-Claude Vernier (SP-8821)',
    actionType: 'PADDLE_KYC_VERIFIED',
    target: 'Collector #8402 (Mayfair Family Trust)',
    rationale: 'Beneficial ownership and AML sanction clearances certified by curatorial compliance counsel.',
    checksum: '0x3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f90a1b2c3d4e5f60a1b2c3d4e5f607182',
  },
  {
    id: 'LOG-003',
    timestamp: '2026-10-30 11:05:22 UTC',
    operator: 'Jean-Claude Vernier (SP-8821)',
    actionType: 'RESERVE_APPROVED',
    target: 'Ticket #TK-9024 (A. Lange & Söhne Datograph)',
    rationale: 'Consignor executed digital reserve covenant at $85,000 USD. Assigned to Session 18 saleroom catalogue.',
    checksum: '0x9a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b9c8d7e6f5a4b3c2d1e0f9a8b',
  },
  {
    id: 'LOG-004',
    timestamp: '2026-10-29 18:30:00 UTC',
    operator: 'Jean-Claude Vernier (SP-8821)',
    actionType: 'POLICY_UPDATED',
    target: 'Buyer Premium Schedule Tier 1',
    rationale: 'Reconfirmed 25% schedule on hammer price up to $1,000,000 with 20% marginal rate thereafter.',
    checksum: '0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f90a1b2c3d4e5f60a1b2c3d4e5f60',
  },
  {
    id: 'LOG-005',
    timestamp: '2026-10-29 09:12:45 UTC',
    operator: 'Jean-Claude Vernier (SP-8821)',
    actionType: 'DOCS_REQUESTED',
    target: 'Ticket #TK-9023 (Audemars Piguet Royal Oak Jumbo)',
    rationale: 'Requested high-resolution macro photography of movement hallmarks and archival extract from Le Brassus.',
    checksum: '0x5e6f7a8b9c0d1e2f3a4b5c6d7e8f90a1b2c3d4e5f60a1b2c3d4e5f60718293a4',
  },
];

export default function AdminSpecialistPage() {
  const {
    consignments,
    updateConsignmentStatus,
    clearConsignments,
    resetConsignments,
    currentBidUsd,
    highestBidderPaddle,
    remainingSeconds,
    formatPrice,
    addToast,
  } = useChronoBid();

  // Navigation tab state
  const [activeTab, setActiveTab] = useState<AdminTab>('consignments');

  // Tab 1: Consignment Review Desk State
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [selectedTicketId, setSelectedTicketId] = useState<string>(
    consignments[0]?.ticketId || ''
  );
  const [valuationLow, setValuationLow] = useState<string>('20000');
  const [valuationHigh, setValuationHigh] = useState<string>('28000');
  const [specialistNote, setSpecialistNote] = useState<string>(
    'Archival provenance verified against manufacturer ledgers. Condition consistent with Grade 9.2.'
  );
  const [requestDocNote, setRequestDocNote] = useState<string>(
    'Please submit high-resolution photographs of movement hallmarks and archival service papers.'
  );
  const [declineReason, setDeclineReason] = useState<string>(
    'Does not align with curatorial thresholds for the upcoming premier catalog session.'
  );

  // Tab 2: Collector Registry State
  const [collectors, setCollectors] = useState<CollectorRecord[]>(INITIAL_COLLECTORS);
  const [collectorSearch, setCollectorSearch] = useState<string>('');

  // Tab 3: Auction Scheduler State
  const [sessions, setSessions] = useState<AuctionSession[]>(INITIAL_SESSIONS);
  const [newSessionTitle, setNewSessionTitle] = useState('');
  const [newSessionDept, setNewSessionDept] = useState('Fine Horology');
  const [newSessionDate, setNewSessionDate] = useState('2026-12-18');
  const [newSessionLots, setNewSessionLots] = useState('10');
  const [newSessionEstimate, setNewSessionEstimate] = useState('2500000');

  // Tab 4: Fee & Policy Configuration State
  const [bpTier1, setBpTier1] = useState('25.0');
  const [bpTier1Ceiling, setBpTier1Ceiling] = useState('1000000');
  const [bpTier2, setBpTier2] = useState('20.0');
  const [consignorCommission, setConsignorCommission] = useState('10.0');
  const [reserveFloor, setReserveFloor] = useState('10000');
  const [softCloseThreshold, setSoftCloseThreshold] = useState('120');
  const [softCloseExtension, setSoftCloseExtension] = useState('120');
  const [policySaved, setPolicySaved] = useState(false);

  // Tab 5: Audit Log State
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(INITIAL_AUDIT_LOGS);
  const [auditFilter, setAuditFilter] = useState<string>('All');

  const selectedTicket =
    consignments.find((t) => t.ticketId === selectedTicketId) || consignments[0];

  const filteredTickets =
    filterStatus === 'All'
      ? consignments
      : consignments.filter((t) => t.status === filterStatus);

  // Tab 1 Action Handlers
  const handleIssueValuation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTicket) return;
    const low = parseInt(valuationLow, 10);
    const high = parseInt(valuationHigh, 10);
    if (isNaN(low) || isNaN(high) || low <= 0 || high < low) {
      addToast('Please enter a valid valuation range (Low <= High).', 'warning');
      return;
    }
    updateConsignmentStatus(selectedTicket.ticketId, 'Valuation Issued', low, high, specialistNote);

    // Append to audit log
    const newLog: AuditLogEntry = {
      id: `LOG-00${auditLogs.length + 1}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC',
      operator: 'Jean-Claude Vernier (SP-8821)',
      actionType: 'VALUATION_ISSUED',
      target: `Ticket #${selectedTicket.ticketId} (${selectedTicket.manufacturer} ${selectedTicket.reference})`,
      rationale: `Valuation issued: $${low.toLocaleString()} - $${high.toLocaleString()} USD. Note: ${specialistNote}`,
      checksum: '0x' + Math.random().toString(16).substring(2, 10) + Math.random().toString(16).substring(2, 10),
    };
    setAuditLogs([newLog, ...auditLogs]);
  };

  const handleRequestDocs = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTicket) return;
    updateConsignmentStatus(
      selectedTicket.ticketId,
      'Information Requested',
      selectedTicket.valuationEstimateLowUsd,
      selectedTicket.valuationEstimateHighUsd,
      requestDocNote
    );
  };

  const handleApproveReserve = () => {
    if (!selectedTicket) return;
    updateConsignmentStatus(
      selectedTicket.ticketId,
      'Reserve Approved',
      selectedTicket.valuationEstimateLowUsd || selectedTicket.reserveEstimateUsd,
      selectedTicket.valuationEstimateHighUsd || Math.round(selectedTicket.reserveEstimateUsd * 1.3),
      'Reserve price approved by Curatorial Specialist Desk for upcoming auction.'
    );

    const newLog: AuditLogEntry = {
      id: `LOG-00${auditLogs.length + 1}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC',
      operator: 'Jean-Claude Vernier (SP-8821)',
      actionType: 'RESERVE_APPROVED',
      target: `Ticket #${selectedTicket.ticketId} (${selectedTicket.manufacturer} ${selectedTicket.reference})`,
      rationale: `Reserve approved and cleared for catalog saleroom placement.`,
      checksum: '0x' + Math.random().toString(16).substring(2, 10) + Math.random().toString(16).substring(2, 10),
    };
    setAuditLogs([newLog, ...auditLogs]);
  };

  const handleDecline = () => {
    if (!selectedTicket) return;
    updateConsignmentStatus(
      selectedTicket.ticketId,
      'Consignment Declined',
      undefined,
      undefined,
      declineReason
    );
  };

  // Tab 2 Action Handlers
  const handleToggleCollectorStatus = (paddleNumber: number) => {
    setCollectors((prev) =>
      prev.map((c) => {
        if (c.paddleNumber === paddleNumber) {
          const newStatus =
            c.status === 'Active Saleroom'
              ? 'Suspended / Headroom Freeze'
              : 'Active Saleroom';
          addToast(
            `Paddle #${paddleNumber} status changed to: ${newStatus}`,
            newStatus === 'Active Saleroom' ? 'success' : 'warning'
          );
          return { ...c, status: newStatus };
        }
        return c;
      })
    );
  };

  const handleUpgradeTier = (paddleNumber: number) => {
    setCollectors((prev) =>
      prev.map((c) => {
        if (c.paddleNumber === paddleNumber) {
          const tiers: CollectorRecord['verificationTier'][] = [
            'Tier 1: Identity Verified',
            'Tier 2: Institutional KYC / AML Cleared',
            'Tier 3: Sovereign Family Office',
          ];
          const currIdx = tiers.indexOf(c.verificationTier);
          const nextTier = tiers[(currIdx + 1) % tiers.length];
          addToast(`Paddle #${paddleNumber} upgraded to: ${nextTier}`, 'success');
          return { ...c, verificationTier: nextTier };
        }
        return c;
      })
    );
  };

  // Tab 3 Action Handlers
  const handleScheduleSession = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSessionTitle.trim()) {
      addToast('Please enter an auction session title.', 'warning');
      return;
    }
    const newSession: AuctionSession = {
      sessionId: `SESS-${sessions.length + 17}`,
      code: `CBV-2026-${(sessions.length + 1).toString().padStart(2, '0')}-CUR`,
      title: newSessionTitle.trim(),
      department: newSessionDept,
      status: 'Curatorial Intake',
      scheduledDate: newSessionDate,
      lotCount: parseInt(newSessionLots, 10) || 8,
      totalEstimateUsd: parseInt(newSessionEstimate, 10) || 2000000,
    };
    setSessions([...sessions, newSession]);
    setNewSessionTitle('');
    addToast(`Session "${newSession.title}" added to auction schedule.`, 'success');

    const newLog: AuditLogEntry = {
      id: `LOG-00${auditLogs.length + 1}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC',
      operator: 'Jean-Claude Vernier (SP-8821)',
      actionType: 'SESSION_SCHEDULED',
      target: `${newSession.sessionId}: ${newSession.title}`,
      rationale: `Curatorial session scheduled for ${newSessionDate} (${newSession.department}).`,
      checksum: '0x' + Math.random().toString(16).substring(2, 10) + Math.random().toString(16).substring(2, 10),
    };
    setAuditLogs([newLog, ...auditLogs]);
  };

  // Tab 4 Action Handlers
  const handleSavePolicies = (e: React.FormEvent) => {
    e.preventDefault();
    setPolicySaved(true);
    addToast('Curatorial and fee policies updated successfully.', 'success');
    setTimeout(() => setPolicySaved(false), 3000);

    const newLog: AuditLogEntry = {
      id: `LOG-00${auditLogs.length + 1}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC',
      operator: 'Jean-Claude Vernier (SP-8821)',
      actionType: 'POLICY_UPDATED',
      target: 'House Fee & Soft-Close Policy Matrix',
      rationale: `BP Tier 1: ${bpTier1}%, Tier 2: ${bpTier2}%, Consignor: ${consignorCommission}%, Soft-Close: ${softCloseThreshold}s.`,
      checksum: '0x' + Math.random().toString(16).substring(2, 10) + Math.random().toString(16).substring(2, 10),
    };
    setAuditLogs([newLog, ...auditLogs]);
  };

  const handleResetPolicies = () => {
    setBpTier1('25.0');
    setBpTier1Ceiling('1000000');
    setBpTier2('20.0');
    setConsignorCommission('10.0');
    setReserveFloor('10000');
    setSoftCloseThreshold('120');
    setSoftCloseExtension('120');
    addToast('Fee schedules reset to house defaults.', 'info');
  };

  const statusColorMap: Record<ConsignmentStatus, string> = {
    'Under Specialist Review': 'bg-amber-100 text-amber-900 border-amber-300',
    'Information Requested': 'bg-orange-100 text-orange-900 border-orange-300',
    'Valuation Issued': 'bg-lime/40 text-forest border-lime',
    'Reserve Approved': 'bg-emerald-100 text-emerald-950 border-emerald-400',
    'Consignment Declined': 'bg-stone-200 text-stone-800 border-stone-300',
    'Inspection Scheduled': 'bg-blue-100 text-blue-950 border-blue-300',
  };

  const filteredCollectors = collectors.filter(
    (c) =>
      c.name.toLowerCase().includes(collectorSearch.toLowerCase()) ||
      c.institution.toLowerCase().includes(collectorSearch.toLowerCase()) ||
      c.paddleNumber.toString().includes(collectorSearch) ||
      c.jurisdiction.toLowerCase().includes(collectorSearch.toLowerCase())
  );

  const filteredAuditLogs = auditFilter === 'All'
    ? auditLogs
    : auditLogs.filter((log) => log.actionType === auditFilter);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Top Banner / Disclaimer */}
      <div className="p-4 bg-paper-dark border border-forest/20 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-forest text-paper">
            <ShieldAlert className="w-5 h-5 text-lime" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-serif text-2xl font-bold text-forest">
                Curatorial Specialist Review Desk &amp; Administration Console
              </h1>
              <span className="px-2 py-0.5 bg-lime text-forest text-[10px] font-mono font-bold uppercase tracking-wider">
                [SANDBOX SIMULATION — NOT REAL TRANSACTIONS]
              </span>
            </div>
            <p className="text-xs font-mono text-forest/70">
              Operator: Jean-Claude Vernier • Senior Horological & Rare Asset Specialist Desk • Desk #SP-8821
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono">
          <Link
            href="/account/consignments"
            className="px-3 py-1.5 bg-paper border border-stone-hairline text-forest hover:border-forest flex items-center gap-1.5"
          >
            <span>Consignor View</span>
            <ExternalLink className="w-3 h-3" />
          </Link>
          <Link
            href="/consign"
            className="px-3 py-1.5 bg-forest text-paper hover:bg-forest-hover flex items-center gap-1.5"
          >
            <span>Consign Wizard</span>
            <ExternalLink className="w-3 h-3 text-lime" />
          </Link>
        </div>
      </div>

      {/* Saleroom Floor Monitor & Inflow Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 font-mono text-xs">
        <div className="p-4 bg-paper border border-stone-hairline space-y-1">
          <span className="text-[10px] uppercase text-forest/60 block">Active Intake Queue</span>
          <span className="text-2xl font-bold text-forest block">{consignments.length} Lots</span>
          <span className="text-[11px] text-forest/70">Multi-Category Inflow</span>
        </div>
        <div className="p-4 bg-paper border border-stone-hairline space-y-1">
          <span className="text-[10px] uppercase text-forest/60 block">Under Active Audit</span>
          <span className="text-2xl font-bold text-forest block">
            {consignments.filter((t) => t.status === 'Under Specialist Review' || t.status === 'Inspection Scheduled').length} Lots
          </span>
          <span className="text-[11px] text-amber-800 font-semibold">Specialist Review Queue</span>
        </div>
        <div className="p-4 bg-paper border border-stone-hairline space-y-1">
          <span className="text-[10px] uppercase text-forest/60 block">Approved for Saleroom</span>
          <span className="text-2xl font-bold text-forest block">
            {consignments.filter((t) => t.status === 'Reserve Approved').length} Lots
          </span>
          <span className="text-[11px] text-emerald-800 font-semibold">Catalog Ready</span>
        </div>
        <div className="p-4 bg-paper border border-stone-hairline space-y-1">
          <span className="text-[10px] uppercase text-forest/60 block">Live Saleroom Ask</span>
          <span className="text-2xl font-bold text-forest block">{formatPrice(currentBidUsd)}</span>
          <span className="text-[11px] text-forest/70">
            Leader: #{highestBidderPaddle} • Clock: {Math.floor(remainingSeconds / 60)}m {remainingSeconds % 60}s
          </span>
        </div>
      </div>

      {/* 5-Tab Operational Navigation Bar */}
      <div className="border-b border-stone-hairline">
        <div className="flex flex-wrap gap-2" role="tablist" aria-label="Administrator Console Modules">
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'consignments'}
            onClick={() => setActiveTab('consignments')}
            className={`px-4 py-2.5 font-mono text-xs uppercase tracking-wider transition-all border-b-2 flex items-center gap-2 ${
              activeTab === 'consignments'
                ? 'border-forest text-forest font-bold bg-paper-dark'
                : 'border-transparent text-forest/70 hover:text-forest hover:border-stone-hairline'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>1. Consignment Review Desk</span>
            <span className="px-1.5 py-0.2 bg-lime/40 text-forest text-[10px] font-bold">
              {consignments.length}
            </span>
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'collectors'}
            onClick={() => setActiveTab('collectors')}
            className={`px-4 py-2.5 font-mono text-xs uppercase tracking-wider transition-all border-b-2 flex items-center gap-2 ${
              activeTab === 'collectors'
                ? 'border-forest text-forest font-bold bg-paper-dark'
                : 'border-transparent text-forest/70 hover:text-forest hover:border-stone-hairline'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>2. Collector Registry & Verification</span>
            <span className="px-1.5 py-0.2 bg-paper text-forest text-[10px] border border-stone-hairline">
              {collectors.length}
            </span>
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'scheduler'}
            onClick={() => setActiveTab('scheduler')}
            className={`px-4 py-2.5 font-mono text-xs uppercase tracking-wider transition-all border-b-2 flex items-center gap-2 ${
              activeTab === 'scheduler'
                ? 'border-forest text-forest font-bold bg-paper-dark'
                : 'border-transparent text-forest/70 hover:text-forest hover:border-stone-hairline'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>3. Auction Session Scheduler</span>
            <span className="px-1.5 py-0.2 bg-paper text-forest text-[10px] border border-stone-hairline">
              {sessions.length}
            </span>
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'policies'}
            onClick={() => setActiveTab('policies')}
            className={`px-4 py-2.5 font-mono text-xs uppercase tracking-wider transition-all border-b-2 flex items-center gap-2 ${
              activeTab === 'policies'
                ? 'border-forest text-forest font-bold bg-paper-dark'
                : 'border-transparent text-forest/70 hover:text-forest hover:border-stone-hairline'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>4. Fee & Policy Configuration</span>
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'audit'}
            onClick={() => setActiveTab('audit')}
            className={`px-4 py-2.5 font-mono text-xs uppercase tracking-wider transition-all border-b-2 flex items-center gap-2 ${
              activeTab === 'audit'
                ? 'border-forest text-forest font-bold bg-paper-dark'
                : 'border-transparent text-forest/70 hover:text-forest hover:border-stone-hairline'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span>5. Administrative Audit Log</span>
            <span className="px-1.5 py-0.2 bg-forest text-paper text-[10px]">
              {auditLogs.length}
            </span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: CONSIGNMENT REVIEW DESK (PRESERVED & ENHANCED)                    */}
      {/* ========================================================================= */}
      {activeTab === 'consignments' && (
        <div className="space-y-6">
          {/* Filter Tabs & Test Helper Controls */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-hairline pb-4">
            <div className="flex flex-wrap items-center gap-1.5" role="tablist" aria-label="Consignment Filter">
              {['All', 'Under Specialist Review', 'Information Requested', 'Valuation Issued', 'Reserve Approved', 'Consignment Declined'].map((status) => (
                <button
                  key={status}
                  type="button"
                  role="tab"
                  aria-selected={filterStatus === status}
                  onClick={() => setFilterStatus(status)}
                  className={`px-3 py-1 text-xs font-mono uppercase tracking-wider transition-all border ${
                    filterStatus === status
                      ? 'bg-forest text-paper border-forest font-semibold'
                      : 'bg-paper text-forest/70 border-stone-hairline hover:border-forest hover:text-forest'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>

            {/* Demo State Controls */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={resetConsignments}
                className="px-2.5 py-1 bg-paper border border-stone-hairline text-forest text-xs font-mono hover:border-forest flex items-center gap-1"
                title="Reset queue to 5 multi-category demonstration tickets"
              >
                <RotateCcw className="w-3 h-3 text-forest/70" />
                <span>Reset Demo</span>
              </button>
              <button
                type="button"
                onClick={clearConsignments}
                className="px-2.5 py-1 bg-paper border border-stone-hairline text-forest text-xs font-mono hover:border-forest flex items-center gap-1"
                title="Empty all consignment tickets to test empty state"
              >
                <Trash2 className="w-3 h-3 text-rose-700" />
                <span>Clear Queue</span>
              </button>
            </div>
          </div>

          {/* Main Review Grid: List Column (Left) + Detail & Action Column (Right) */}
          {consignments.length === 0 ? (
            <div className="p-12 text-center bg-paper border border-stone-hairline space-y-4">
              <div className="w-12 h-12 mx-auto rounded-full bg-paper-dark border border-stone-hairline flex items-center justify-center">
                <FileText className="w-6 h-6 text-forest/50" />
              </div>
              <h3 className="font-serif text-2xl font-bold text-forest">Consignment Queue Empty</h3>
              <p className="text-xs font-mono text-forest/70 max-w-md mx-auto">
                Zero active intake tickets on file. All pending lots have been audited, or the queue was cleared for prototype empty state testing.
              </p>
              <button
                type="button"
                onClick={resetConsignments}
                className="py-2.5 px-4 bg-forest text-paper font-mono text-xs uppercase tracking-wider inline-flex items-center gap-2"
              >
                <RotateCcw className="w-3.5 h-3.5 text-lime" />
                <span>Restore Multi-Category Demonstration Tickets</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left Column: Tickets Queue (lg:col-span-5) */}
              <div className="lg:col-span-5 space-y-3">
                <div className="text-xs font-mono uppercase tracking-widest text-forest/60 pb-1">
                  Intake Submissions ({filteredTickets.length})
                </div>

                {filteredTickets.map((ticket) => {
                  const isSelected = selectedTicket?.ticketId === ticket.ticketId;
                  return (
                    <div
                      key={ticket.ticketId}
                      onClick={() => setSelectedTicketId(ticket.ticketId)}
                      className={`p-4 bg-paper border cursor-pointer transition-all ${
                        isSelected
                          ? 'border-forest ring-1 ring-forest shadow-tactile'
                          : 'border-stone-hairline hover:border-forest/60'
                      }`}
                    >
                      <div className="flex items-center justify-between pb-2">
                        <span className="font-mono text-[10px] text-forest/60 tracking-wider">
                          {ticket.ticketId} • {ticket.submittedAt}
                        </span>
                        <span
                          className={`text-[10px] font-mono px-2 py-0.5 border font-semibold ${
                            statusColorMap[ticket.status] || 'bg-paper text-forest'
                          }`}
                        >
                          {ticket.status}
                        </span>
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5">
                          {ticket.category && (
                            <span className="text-[9px] font-mono uppercase px-1.5 py-0.2 bg-forest text-paper">
                              {ticket.category}
                            </span>
                          )}
                          <h4 className="font-serif text-base font-bold text-forest leading-tight">
                            {ticket.manufacturer} {ticket.reference}
                          </h4>
                        </div>
                        <div className="flex justify-between items-baseline text-xs font-mono text-forest/70 pt-1">
                          <span>Reserve Ask: ${ticket.reserveEstimateUsd.toLocaleString()} USD</span>
                          <span className="text-[10px] text-forest/50">{ticket.year}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Right Column: Active Ticket Inspector & Action Desk (lg:col-span-7) */}
              {selectedTicket && (
                <div className="lg:col-span-7 space-y-6 bg-paper border border-stone-hairline p-6 shadow-tactile">
                  {/* Header of Selected Ticket */}
                  <div className="border-b border-stone-hairline pb-4 space-y-2">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono uppercase tracking-widest text-forest/60 font-semibold">
                          Dossier: {selectedTicket.ticketId}
                        </span>
                        {selectedTicket.category && (
                          <span className="px-2 py-0.5 bg-forest text-paper text-[10px] font-mono uppercase">
                            {selectedTicket.category}
                          </span>
                        )}
                      </div>
                      <span
                        className={`text-xs font-mono px-2.5 py-1 border font-semibold ${
                          statusColorMap[selectedTicket.status] || 'bg-paper text-forest'
                        }`}
                      >
                        {selectedTicket.status}
                      </span>
                    </div>

                    <h2 className="font-serif text-2xl font-bold text-forest">
                      {selectedTicket.manufacturer} {selectedTicket.reference}
                    </h2>
                    <div className="text-xs font-mono text-forest/70">
                      Production Period: {selectedTicket.year} • Client: {selectedTicket.clientContactEmail || 'confidential@client.ch'}
                    </div>
                  </div>

                  {/* Physical Spec & Condition Ledger */}
                  <div className="p-4 bg-paper-dark border border-stone-hairline space-y-3 font-mono text-xs">
                    <div className="flex justify-between border-b border-stone-hairline pb-1.5">
                      <span className="text-forest/60">Condition & Provenance Notes:</span>
                      <span className="text-forest text-right max-w-sm">{selectedTicket.condition}</span>
                    </div>
                    <div className="flex justify-between border-b border-stone-hairline pb-1.5">
                      <span className="text-forest/60">Consignor Target Reserve:</span>
                      <span className="font-bold text-forest">${selectedTicket.reserveEstimateUsd.toLocaleString()} USD</span>
                    </div>
                    {selectedTicket.valuationEstimateLowUsd && (
                      <div className="flex justify-between border-b border-stone-hairline pb-1.5">
                        <span className="text-forest/60">Specialist Valuation Range:</span>
                        <span className="font-bold text-emerald-900">
                          ${selectedTicket.valuationEstimateLowUsd.toLocaleString()} – ${selectedTicket.valuationEstimateHighUsd?.toLocaleString()} USD
                        </span>
                      </div>
                    )}
                    {selectedTicket.specialistNotes && (
                      <div className="space-y-1 pt-1">
                        <span className="text-forest/60 block">Recorded Specialist Curatorial Memo:</span>
                        <p className="font-sans text-xs text-forest/90 bg-paper p-2.5 border border-stone-hairline leading-relaxed">
                          {selectedTicket.specialistNotes}
                        </p>
                      </div>
                    )}
                    <div className="flex justify-between pt-1 text-[11px]">
                      <span className="text-forest/60">Consignor Reserve Digital Agreement:</span>
                      <span className={selectedTicket.reserveAgreed ? 'text-emerald-800 font-bold' : 'text-amber-800'}>
                        {selectedTicket.reserveAgreed ? '✓ Formally Signed by Consignor' : 'Pending Consignor Signature'}
                      </span>
                    </div>
                  </div>

                  {/* Curatorial Specialist Action Desk */}
                  <div className="space-y-6 pt-2">
                    <h3 className="font-serif text-lg font-bold text-forest border-b border-stone-hairline pb-2 flex items-center gap-2">
                      <UserCheck className="w-4 h-4 text-forest" />
                      <span>Curatorial Actions for Ticket #{selectedTicket.ticketId}</span>
                    </h3>

                    {/* Action 1: Issue Official Specialist Valuation */}
                    <form onSubmit={handleIssueValuation} className="p-4 bg-paper-dark border border-stone-hairline space-y-3">
                      <div className="flex items-center gap-2 text-xs font-mono uppercase font-bold text-forest">
                        <DollarSign className="w-3.5 h-3.5 text-lime-700" />
                        <span>1. Issue Official Catalog Valuation Range</span>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label htmlFor="val-low-input" className="block text-[10px] font-mono uppercase text-forest/70 mb-1">
                            Low Valuation (USD)
                          </label>
                          <input
                            id="val-low-input"
                            type="number"
                            value={valuationLow}
                            onChange={(e) => setValuationLow(e.target.value)}
                            className="w-full px-2.5 py-1.5 bg-paper border border-stone-hairline text-forest font-mono text-xs focus:outline-none focus:border-forest"
                            required
                          />
                        </div>
                        <div>
                          <label htmlFor="val-high-input" className="block text-[10px] font-mono uppercase text-forest/70 mb-1">
                            High Valuation (USD)
                          </label>
                          <input
                            id="val-high-input"
                            type="number"
                            value={valuationHigh}
                            onChange={(e) => setValuationHigh(e.target.value)}
                            className="w-full px-2.5 py-1.5 bg-paper border border-stone-hairline text-forest font-mono text-xs focus:outline-none focus:border-forest"
                            required
                          />
                        </div>
                      </div>
                      <div>
                        <label htmlFor="spec-note-input" className="block text-[10px] font-mono uppercase text-forest/70 mb-1">
                          Curatorial Valuation Notes & Condition Rationale
                        </label>
                        <textarea
                          id="spec-note-input"
                          rows={2}
                          value={specialistNote}
                          onChange={(e) => setSpecialistNote(e.target.value)}
                          className="w-full px-2.5 py-1.5 bg-paper border border-stone-hairline text-forest font-mono text-xs focus:outline-none focus:border-forest"
                          required
                        />
                      </div>
                      <button
                        type="submit"
                        className="w-full py-2 bg-lime hover:bg-lime-hover text-forest font-mono text-xs uppercase tracking-wider font-bold transition-colors border border-forest/20 flex items-center justify-center gap-1.5 shadow-tactile"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Issue Valuation to Consignor</span>
                      </button>
                    </form>

                    {/* Action 2: Request Supporting Provenance Documents */}
                    <form onSubmit={handleRequestDocs} className="p-4 bg-paper-dark border border-stone-hairline space-y-3">
                      <div className="flex items-center gap-2 text-xs font-mono uppercase font-bold text-forest">
                        <FileText className="w-3.5 h-3.5 text-orange-700" />
                        <span>2. Request Supporting Archival / Provenance Documentation</span>
                      </div>
                      <textarea
                        rows={2}
                        value={requestDocNote}
                        onChange={(e) => setRequestDocNote(e.target.value)}
                        aria-label="Documentation clarification request notes"
                        className="w-full px-2.5 py-1.5 bg-paper border border-stone-hairline text-forest font-mono text-xs focus:outline-none focus:border-forest"
                        required
                      />
                      <button
                        type="submit"
                        className="w-full py-2 bg-paper hover:bg-paper-dark text-forest font-mono text-xs uppercase tracking-wider font-semibold transition-colors border border-stone-hairline flex items-center justify-center gap-1.5"
                      >
                        <Send className="w-3.5 h-3.5 text-orange-700" />
                        <span>Request Documentation Clarification</span>
                      </button>
                    </form>

                    {/* Action 3 & 4: Approve Reserve or Decline Lot */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                      <button
                        type="button"
                        onClick={handleApproveReserve}
                        className="py-2.5 px-4 bg-forest hover:bg-forest-hover text-paper font-mono text-xs uppercase tracking-wider font-bold transition-colors flex items-center justify-center gap-1.5 shadow-tactile"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-lime" />
                        <span>Approve Reserve & Saleroom Placement</span>
                      </button>

                      <button
                        type="button"
                        onClick={handleDecline}
                        className="py-2.5 px-4 bg-stone-200 hover:bg-stone-300 text-stone-900 font-mono text-xs uppercase tracking-wider transition-colors border border-stone-hairline flex items-center justify-center gap-1.5"
                      >
                        <XCircle className="w-3.5 h-3.5 text-rose-700" />
                        <span>Decline Consignment</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: COLLECTOR REGISTRY & VERIFICATION                                  */}
      {/* ========================================================================= */}
      {activeTab === 'collectors' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-hairline pb-4">
            <div>
              <h2 className="font-serif text-2xl font-bold text-forest">
                Collector Registry & KYC Verification Desk
              </h2>
              <p className="text-xs font-mono text-forest/70 mt-0.5">
                Manage registered bidder paddles, institutional KYC tiers, and Buyer Vault headroom limits.
              </p>
            </div>

            {/* Search Input */}
            <div className="relative w-full sm:w-72">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-forest/40" />
              <input
                type="text"
                placeholder="Search paddle, collector, trust..."
                value={collectorSearch}
                onChange={(e) => setCollectorSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 bg-paper border border-stone-hairline text-xs font-mono text-forest placeholder:text-forest/40 focus:outline-none focus:border-forest"
              />
            </div>
          </div>

          {/* Registry Stats Summary */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-xs">
            <div className="p-4 bg-paper border border-stone-hairline">
              <span className="text-[10px] uppercase text-forest/60 block">Total Registered Paddles</span>
              <span className="text-xl font-bold text-forest">{collectors.length} Collectors</span>
              <span className="text-[11px] text-forest/70">6 Active Jurisdictions</span>
            </div>
            <div className="p-4 bg-paper border border-stone-hairline">
              <span className="text-[10px] uppercase text-forest/60 block">Institutional & Tier 3 Cleared</span>
              <span className="text-xl font-bold text-emerald-900">
                {collectors.filter((c) => c.verificationTier.includes('Tier 3') || c.verificationTier.includes('Tier 2')).length} Qualified
              </span>
              <span className="text-[11px] text-emerald-800">AML / Sovereign Compliance Passed</span>
            </div>
            <div className="p-4 bg-paper border border-stone-hairline">
              <span className="text-[10px] uppercase text-forest/60 block">Aggregate Vault Headroom</span>
              <span className="text-xl font-bold text-forest">
                ${collectors.reduce((sum, c) => sum + c.vaultHeadroomUsd, 0).toLocaleString()} USD
              </span>
              <span className="text-[11px] text-forest/70">Pre-Funded Saleroom Capacity</span>
            </div>
          </div>

          {/* Collectors Table */}
          <div className="bg-paper border border-stone-hairline overflow-x-auto shadow-tactile">
            <table className="w-full text-left font-mono text-xs">
              <thead className="bg-paper-dark border-b border-stone-hairline text-forest/70 uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="py-3 px-4">Paddle #</th>
                  <th className="py-3 px-4">Collector / Institution</th>
                  <th className="py-3 px-4">Jurisdiction</th>
                  <th className="py-3 px-4">Verification Tier</th>
                  <th className="py-3 px-4">Vault Headroom</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Curatorial Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-hairline">
                {filteredCollectors.map((col) => (
                  <tr key={col.paddleNumber} className="hover:bg-paper-dark/50 transition-colors">
                    <td className="py-3 px-4 font-bold text-forest">#{col.paddleNumber}</td>
                    <td className="py-3 px-4">
                      <div className="font-serif font-bold text-sm text-forest">{col.name}</div>
                      <div className="text-[10px] text-forest/60">{col.institution}</div>
                    </td>
                    <td className="py-3 px-4 text-forest/80">{col.jurisdiction}</td>
                    <td className="py-3 px-4">
                      <span className="inline-block px-2 py-0.5 bg-paper-dark border border-stone-hairline text-[10px] text-forest">
                        {col.verificationTier}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-bold text-forest">
                      ${col.vaultHeadroomUsd.toLocaleString()} USD
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-block px-2 py-0.5 border text-[10px] font-semibold ${
                          col.status === 'Active Saleroom'
                            ? 'bg-emerald-100 text-emerald-950 border-emerald-300'
                            : col.status === 'Suspended / Headroom Freeze'
                            ? 'bg-rose-100 text-rose-950 border-rose-300'
                            : 'bg-amber-100 text-amber-950 border-amber-300'
                        }`}
                      >
                        {col.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => handleUpgradeTier(col.paddleNumber)}
                          className="px-2 py-1 bg-paper border border-stone-hairline hover:border-forest text-[10px] text-forest flex items-center gap-1"
                          title="Cycle verification tier"
                        >
                          <Shield className="w-3 h-3 text-forest/70" />
                          <span>Tier</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleToggleCollectorStatus(col.paddleNumber)}
                          className={`px-2 py-1 border text-[10px] flex items-center gap-1 ${
                            col.status === 'Active Saleroom'
                              ? 'bg-rose-50 border-rose-200 text-rose-800 hover:bg-rose-100'
                              : 'bg-emerald-50 border-emerald-200 text-emerald-800 hover:bg-emerald-100'
                          }`}
                        >
                          {col.status === 'Active Saleroom' ? (
                            <>
                              <Lock className="w-3 h-3 text-rose-700" />
                              <span>Freeze</span>
                            </>
                          ) : (
                            <>
                              <Unlock className="w-3 h-3 text-emerald-700" />
                              <span>Activate</span>
                            </>
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: AUCTION SESSION SCHEDULER                                          */}
      {/* ========================================================================= */}
      {activeTab === 'scheduler' && (
        <div className="space-y-6">
          <div className="border-b border-stone-hairline pb-4">
            <h2 className="font-serif text-2xl font-bold text-forest">
              Auction Session Scheduler & Saleroom Calibre
            </h2>
            <p className="text-xs font-mono text-forest/70 mt-0.5">
              Curatorial calendar of completed, active, and upcoming catalogue sessions.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left 8 cols: Existing Sessions List */}
            <div className="lg:col-span-8 space-y-4">
              <div className="text-xs font-mono uppercase tracking-widest text-forest/60">
                Scheduled Catalogues ({sessions.length})
              </div>

              <div className="space-y-3">
                {sessions.map((sess) => (
                  <div
                    key={sess.sessionId}
                    className="p-5 bg-paper border border-stone-hairline space-y-3 shadow-tactile"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-hairline pb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold px-2 py-0.5 bg-forest text-paper">
                          {sess.sessionId}
                        </span>
                        <span className="font-mono text-xs text-forest/60">
                          {sess.code}
                        </span>
                      </div>
                      <span
                        className={`text-xs font-mono px-2.5 py-0.5 border font-semibold ${
                          sess.status === 'Live Saleroom'
                            ? 'bg-lime/40 text-forest border-lime'
                            : sess.status === 'Completed'
                            ? 'bg-stone-200 text-stone-800 border-stone-300'
                            : sess.status === 'Scheduled'
                            ? 'bg-blue-100 text-blue-950 border-blue-300'
                            : 'bg-amber-100 text-amber-950 border-amber-300'
                        }`}
                      >
                        {sess.status}
                      </span>
                    </div>

                    <div>
                      <h3 className="font-serif text-xl font-bold text-forest">
                        {sess.title}
                      </h3>
                      <div className="text-xs font-mono text-forest/70 mt-0.5">
                        Focus: {sess.department} • Scheduled: {sess.scheduledDate}
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2 pt-2 border-t border-stone-hairline text-xs font-mono">
                      <div>
                        <span className="text-[10px] text-forest/60 uppercase block">Capacity</span>
                        <span className="font-bold text-forest">{sess.lotCount} Lots</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-forest/60 uppercase block">Total Estimate</span>
                        <span className="font-bold text-forest">${sess.totalEstimateUsd.toLocaleString()} USD</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-forest/60 uppercase block">Realised / Current</span>
                        <span className="font-bold text-emerald-900">
                          {sess.realizedUsd ? `$${sess.realizedUsd.toLocaleString()} USD` : 'Pending Session'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right 4 cols: Schedule New Session Form */}
            <div className="lg:col-span-4 bg-paper border border-stone-hairline p-5 space-y-4 shadow-tactile">
              <div className="border-b border-stone-hairline pb-2 flex items-center gap-2">
                <Plus className="w-4 h-4 text-forest" />
                <h3 className="font-serif text-lg font-bold text-forest">
                  Draft New Auction Session
                </h3>
              </div>

              <form onSubmit={handleScheduleSession} className="space-y-3 font-mono text-xs">
                <div>
                  <label className="block text-[10px] uppercase text-forest/70 mb-1">
                    Session Title
                  </label>
                  <input
                    type="text"
                    value={newSessionTitle}
                    onChange={(e) => setNewSessionTitle(e.target.value)}
                    placeholder="e.g. The Zurich Rare Calibres"
                    className="w-full px-2.5 py-1.5 bg-paper-dark border border-stone-hairline text-forest text-xs focus:outline-none focus:border-forest"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase text-forest/70 mb-1">
                    Primary Department Focus
                  </label>
                  <select
                    value={newSessionDept}
                    onChange={(e) => setNewSessionDept(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-paper-dark border border-stone-hairline text-forest text-xs focus:outline-none focus:border-forest"
                  >
                    <option value="Fine Horology">Fine Horology</option>
                    <option value="Haute Joaillerie">Haute Joaillerie</option>
                    <option value="Rare Coins & Medals">Rare Coins & Medals</option>
                    <option value="Fine Art & Sculpture">Fine Art & Sculpture</option>
                    <option value="Multi-Category Evening Sale">Multi-Category Evening Sale</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] uppercase text-forest/70 mb-1">
                    Scheduled Date
                  </label>
                  <input
                    type="date"
                    value={newSessionDate}
                    onChange={(e) => setNewSessionDate(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-paper-dark border border-stone-hairline text-forest text-xs focus:outline-none focus:border-forest"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] uppercase text-forest/70 mb-1">
                      Lot Capacity
                    </label>
                    <input
                      type="number"
                      value={newSessionLots}
                      onChange={(e) => setNewSessionLots(e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-paper-dark border border-stone-hairline text-forest text-xs focus:outline-none focus:border-forest"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase text-forest/70 mb-1">
                      Target Low ($)
                    </label>
                    <input
                      type="number"
                      value={newSessionEstimate}
                      onChange={(e) => setNewSessionEstimate(e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-paper-dark border border-stone-hairline text-forest text-xs focus:outline-none focus:border-forest"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-forest hover:bg-forest-hover text-paper font-mono text-xs uppercase tracking-wider font-bold transition-colors shadow-tactile flex items-center justify-center gap-1.5 mt-2"
                >
                  <Calendar className="w-3.5 h-3.5 text-lime" />
                  <span>Schedule Session</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: FEE & POLICY CONFIGURATION                                         */}
      {/* ========================================================================= */}
      {activeTab === 'policies' && (
        <div className="space-y-6">
          <div className="border-b border-stone-hairline pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="font-serif text-2xl font-bold text-forest">
                Fee Schedule & Curatorial Policy Configuration
              </h2>
              <p className="text-xs font-mono text-forest/70 mt-0.5">
                Regulate saleroom buyer's premiums, consignor commissions, reserve thresholds, and anti-sniping soft-close timers.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleResetPolicies}
                className="px-3 py-1.5 bg-paper border border-stone-hairline text-forest text-xs font-mono hover:border-forest flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5 text-forest/70" />
                <span>Reset House Defaults</span>
              </button>
            </div>
          </div>

          <form onSubmit={handleSavePolicies} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Buyer's Premium Matrix Card */}
              <div className="p-5 bg-paper border border-stone-hairline space-y-4 shadow-tactile">
                <div className="flex items-center gap-2 border-b border-stone-hairline pb-2">
                  <DollarSign className="w-4 h-4 text-forest" />
                  <h3 className="font-serif text-lg font-bold text-forest">
                    Buyer's Premium Schedule (Marginal Tiers)
                  </h3>
                </div>

                <div className="space-y-3 font-mono text-xs">
                  <div>
                    <label className="block text-[10px] uppercase text-forest/70 mb-1">
                      Tier 1 Rate (% on hammer price up to ceiling)
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        step="0.5"
                        value={bpTier1}
                        onChange={(e) => setBpTier1(e.target.value)}
                        className="w-32 px-2.5 py-1.5 bg-paper-dark border border-stone-hairline text-forest font-bold text-xs focus:outline-none focus:border-forest"
                      />
                      <span className="text-forest/70">% on hammer price</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase text-forest/70 mb-1">
                      Tier 1 Ceiling Threshold (USD)
                    </label>
                    <input
                      type="number"
                      step="100000"
                      value={bpTier1Ceiling}
                      onChange={(e) => setBpTier1Ceiling(e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-paper-dark border border-stone-hairline text-forest font-bold text-xs focus:outline-none focus:border-forest"
                    />
                    <span className="text-[10px] text-forest/50">Hammer prices exceeding $1,000,000 trigger Tier 2 discount</span>
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase text-forest/70 mb-1">
                      Tier 2 Rate (% on marginal amount above ceiling)
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        step="0.5"
                        value={bpTier2}
                        onChange={(e) => setBpTier2(e.target.value)}
                        className="w-32 px-2.5 py-1.5 bg-paper-dark border border-stone-hairline text-forest font-bold text-xs focus:outline-none focus:border-forest"
                      />
                      <span className="text-forest/70">% on excess amount</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Consignor Commission & Minimum Reserve Floor */}
              <div className="p-5 bg-paper border border-stone-hairline space-y-4 shadow-tactile">
                <div className="flex items-center gap-2 border-b border-stone-hairline pb-2">
                  <FileText className="w-4 h-4 text-forest" />
                  <h3 className="font-serif text-lg font-bold text-forest">
                    Consignor Settlement & Intake Floor
                  </h3>
                </div>

                <div className="space-y-3 font-mono text-xs">
                  <div>
                    <label className="block text-[10px] uppercase text-forest/70 mb-1">
                      Standard Consignor Commission Rate (%)
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        step="0.5"
                        value={consignorCommission}
                        onChange={(e) => setConsignorCommission(e.target.value)}
                        className="w-32 px-2.5 py-1.5 bg-paper-dark border border-stone-hairline text-forest font-bold text-xs focus:outline-none focus:border-forest"
                      />
                      <span className="text-forest/70">% deducted from hammer at settlement</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase text-forest/70 mb-1">
                      Minimum Curatorial Reserve Floor (USD)
                    </label>
                    <input
                      type="number"
                      step="1000"
                      value={reserveFloor}
                      onChange={(e) => setReserveFloor(e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-paper-dark border border-stone-hairline text-forest font-bold text-xs focus:outline-none focus:border-forest"
                    />
                    <span className="text-[10px] text-forest/50">Minimum lot valuation accepted into catalog intake</span>
                  </div>
                </div>
              </div>

              {/* Saleroom Timing & Soft-Close Anti-Sniping Policy */}
              <div className="p-5 bg-paper border border-stone-hairline space-y-4 shadow-tactile md:col-span-2">
                <div className="flex items-center gap-2 border-b border-stone-hairline pb-2">
                  <Clock className="w-4 h-4 text-forest" />
                  <h3 className="font-serif text-lg font-bold text-forest">
                    Saleroom Timing & Anti-Sniping (Soft-Close Engine)
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono text-xs">
                  <div>
                    <label className="block text-[10px] uppercase text-forest/70 mb-1">
                      Anti-Sniping Trigger Window (Seconds)
                    </label>
                    <input
                      type="number"
                      value={softCloseThreshold}
                      onChange={(e) => setSoftCloseThreshold(e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-paper-dark border border-stone-hairline text-forest font-bold text-xs focus:outline-none focus:border-forest"
                    />
                    <span className="text-[10px] text-forest/50">Bids placed within 120s of clock expiry trigger extension</span>
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase text-forest/70 mb-1">
                      Clock Extension Duration (Seconds)
                    </label>
                    <input
                      type="number"
                      value={softCloseExtension}
                      onChange={(e) => setSoftCloseExtension(e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-paper-dark border border-stone-hairline text-forest font-bold text-xs focus:outline-none focus:border-forest"
                    />
                    <span className="text-[10px] text-forest/50">Resets clock back to 120s upon competitive counter-bid</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-paper-dark border border-stone-hairline">
              <span className="text-xs font-mono text-forest/70">
                Changes apply immediately across active client bidding simulations.
              </span>

              <button
                type="submit"
                className="py-2.5 px-6 bg-forest hover:bg-forest-hover text-paper font-mono text-xs uppercase tracking-wider font-bold transition-colors shadow-tactile flex items-center gap-2"
              >
                <Check className="w-4 h-4 text-lime" />
                <span>Save Curatorial Policy Matrix</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 5: ADMINISTRATIVE ACTIVITY AUDIT LOG                                   */}
      {/* ========================================================================= */}
      {activeTab === 'audit' && (
        <div className="space-y-6">
          <div className="border-b border-stone-hairline pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="font-serif text-2xl font-bold text-forest">
                Administrative Activity Audit Log (Immutable Ledger)
              </h2>
              <p className="text-xs font-mono text-forest/70 mt-0.5">
                Chronological cryptographically simulated record of all specialist determinations and policy updates.
              </p>
            </div>

            {/* Filter by action type */}
            <div className="flex items-center gap-2">
              <select
                value={auditFilter}
                onChange={(e) => setAuditFilter(e.target.value)}
                aria-label="Filter audit log by action type"
                className="px-2.5 py-1.5 bg-paper border border-stone-hairline text-xs font-mono text-forest focus:outline-none focus:border-forest"
              >
                <option value="All">All Action Types</option>
                <option value="VALUATION_ISSUED">VALUATION_ISSUED</option>
                <option value="RESERVE_APPROVED">RESERVE_APPROVED</option>
                <option value="PADDLE_KYC_VERIFIED">PADDLE_KYC_VERIFIED</option>
                <option value="POLICY_UPDATED">POLICY_UPDATED</option>
                <option value="DOCS_REQUESTED">DOCS_REQUESTED</option>
                <option value="SESSION_SCHEDULED">SESSION_SCHEDULED</option>
              </select>

              <button
                type="button"
                onClick={() => addToast('Audit ledger exported to curatorial archive.', 'info')}
                className="px-3 py-1.5 bg-paper-dark border border-stone-hairline text-forest text-xs font-mono hover:border-forest flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5 text-forest/70" />
                <span className="hidden sm:inline">Export Ledger</span>
              </button>
            </div>
          </div>

          {/* Audit Log Entries List */}
          <div className="space-y-3">
            {filteredAuditLogs.map((entry) => (
              <div
                key={entry.id}
                className="p-4 bg-paper border border-stone-hairline space-y-2 font-mono text-xs shadow-tactile"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-hairline pb-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 bg-forest text-paper text-[10px] font-bold">
                      {entry.actionType}
                    </span>
                    <span className="text-forest/60 text-[11px]">{entry.timestamp}</span>
                  </div>
                  <span className="text-[10px] text-forest/50">Operator: {entry.operator}</span>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                  <span className="font-bold text-forest">{entry.target}</span>
                </div>

                <p className="font-sans text-xs text-forest/80 leading-relaxed bg-paper-dark p-2 border border-stone-hairline">
                  {entry.rationale}
                </p>

                <div className="flex items-center justify-between text-[9px] text-forest/50 pt-1">
                  <span className="flex items-center gap-1">
                    <Hash className="w-3 h-3 text-forest/40" />
                    <span className="font-mono">Ledger Checksum: {entry.checksum}</span>
                  </span>
                  <span className="text-emerald-800 font-semibold">✓ Verified Chain State</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
