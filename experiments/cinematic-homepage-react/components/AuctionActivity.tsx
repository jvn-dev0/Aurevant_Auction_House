'use client';

import React, { useState, useEffect } from 'react';
import { LiveTelemetryBid, formatUsdAmount } from '../types';
import { Clock, ShieldAlert, Zap, Radio } from 'lucide-react';

interface AuctionActivityProps {
  initialBids: LiveTelemetryBid[];
}

export const AuctionActivity: React.FC<AuctionActivityProps> = ({ initialBids }) => {
  const [remainingSeconds, setRemainingSeconds] = useState(105); // 00:01:45
  const [extensions, setExtensions] = useState(0);
  const [bids, setBids] = useState<LiveTelemetryBid[]>(initialBids);
  const [statusMessage, setStatusMessage] = useState(
    'Anti-Sniping Engine Active: Monitoring saleroom clock (<120s extension threshold)'
  );

  const MAX_EXTENSIONS = 10;

  useEffect(() => {
    const timer = setInterval(() => {
      setRemainingSeconds((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (totalSec: number) => {
    const m = Math.floor(totalSec / 60).toString().padStart(2, '0');
    const s = (totalSec % 60).toString().padStart(2, '0');
    return `00:${m}:${s}`;
  };

  const handleSimulateBid = () => {
    if (remainingSeconds < 120 && extensions < MAX_EXTENSIONS) {
      setRemainingSeconds(120);
      setExtensions((prev) => prev + 1);
      setStatusMessage(
        `Anti-Sniping Triggered: Clock extended to 00:02:00 (Extension ${extensions + 1}/${MAX_EXTENSIONS}) • Active hold in Pre-Funded Vault`
      );

      const newBid: LiveTelemetryBid = {
        id: `bid-${Date.now()}`,
        lotNumber: 13,
        departmentName: 'Fine Art',
        paddleNumber: '#4102',
        location: 'Your Registered Terminal',
        amountUsd: 220000,
        timestamp: 'Just now',
        isUserBid: true,
      };

      setBids((prev) => [newBid, ...prev]);
    } else if (extensions >= MAX_EXTENSIONS) {
      setStatusMessage('Maximum soft-close extensions (10/10) reached. Clock will expire at 00:00:00.');
    }
  };

  return (
    <section className="cinematic-section-saleroom px-6 sm:px-12 py-24 bg-[#0e100f] border-b border-[#C5A059]/20" id="saleroom">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-12 items-center">
        {/* Left: Saleroom Explainer */}
        <div>
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-[0.2em] text-[#C5A059] mb-4">
            <Radio className="w-4 h-4 text-[#A61935] animate-pulse" />
            <span>Synchronized Saleroom Pulse</span>
          </div>

          <h3 className="font-serif text-3xl sm:text-5xl text-[#F4F0E8] leading-tight mb-4">
            The October Mixed Evening Sale
          </h3>

          <p className="font-sans text-sm font-light text-[#A7A39A] leading-relaxed mb-6">
            Live auction bidding synchronized across all six curatorial departments. Lots close with soft-close anti-sniping protection: any bid submitted within the final 120 seconds automatically resets the clock to two minutes, preventing automated snipe exploits.
          </p>

          <div className="bg-[#151817] border-l-4 border-[#C5A059] p-4 font-mono text-xs text-[#C5A059] leading-relaxed shadow-lg">
            {statusMessage}
          </div>
        </div>

        {/* Right: Live Telemetry & Anti-Sniping Trigger */}
        <div className="bg-[#151817] border border-[#C5A059]/40 p-8 rounded-sm shadow-2xl">
          <div className="text-center pb-6 mb-6 border-b border-[#C5A059]/20">
            <span className="block font-mono text-[11px] uppercase tracking-[0.16em] text-[#A7A39A] mb-2">
              Saleroom Closing Clock
            </span>
            <div className={`font-mono text-5xl font-semibold tracking-wider ${
              remainingSeconds === 0 ? 'text-[#A61935]' : remainingSeconds < 30 ? 'text-[#A61935] animate-pulse' : 'text-[#C5A059]'
            }`}>
              {remainingSeconds === 0 ? '00:00:00 [HAMMER]' : formatTime(remainingSeconds)}
            </div>
            <div className="font-mono text-[10px] text-[#A7A39A] mt-2">
              • Soft-Close Threshold: &lt;120s • Extension Count: {extensions}/{MAX_EXTENSIONS}
            </div>
          </div>

          {/* Mixed Feed */}
          <div className="space-y-2 mb-6">
            <div className="flex justify-between items-center font-mono text-[10px] uppercase text-[#A7A39A] tracking-wider mb-2">
              <span>Active Saleroom Telemetry</span>
              <span>Verified Nodes</span>
            </div>
            {bids.slice(0, 4).map((bid) => (
              <div
                key={bid.id}
                className={`flex justify-between items-center p-3 rounded-sm font-mono text-xs border ${
                  bid.isUserBid
                    ? 'bg-[#183D30] border-[#C5A059] text-[#F4F0E8] shadow-md'
                    : 'bg-[#111312] border-[#C5A059]/20 text-[#A7A39A]'
                }`}
              >
                <div>
                  <span className="text-[#C5A059] font-medium mr-2">{bid.departmentName}</span>
                  <span className="text-[10px] text-[#A7A39A]">Lot {bid.lotNumber}</span>
                </div>
                <div className="text-right">
                  <span className="font-semibold text-[#F4F0E8]">${formatUsdAmount(bid.amountUsd)} USD</span>
                  <span className="text-[10px] text-[#A7A39A] ml-2">({bid.paddleNumber})</span>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={handleSimulateBid}
            disabled={remainingSeconds === 0}
            className="w-full py-4 bg-[#A61935] hover:bg-[#8B142B] disabled:bg-[#111312] disabled:text-[#A7A39A] text-[#F4F0E8] font-mono text-xs uppercase tracking-wider font-semibold transition-all flex items-center justify-center gap-2 shadow-lg focus:outline-none focus:ring-2 focus:ring-[#A61935]"
          >
            <Zap className="w-4 h-4 text-[#F4F0E8]" />
            <span>Simulate Saleroom Bid (&lt;120s Soft-Close Extension)</span>
          </button>
        </div>
      </div>
    </section>
  );
};
