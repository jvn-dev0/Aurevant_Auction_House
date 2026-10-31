'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useChronoBid } from '@/lib/context';
import { Clock, FileText, Bell, Sliders, Shield, User } from 'lucide-react';

export function AccountSubnav() {
  const pathname = usePathname();
  const { user, unreadNotificationCount } = useChronoBid();

  const accountTabs = [
    {
      label: 'Bids & Watchlist',
      href: '/account/bids',
      icon: Clock,
    },
    {
      label: 'Consignments & Sales',
      href: '/account/consignments',
      icon: FileText,
    },
    {
      label: 'Notification Centre',
      href: '/account/notifications',
      icon: Bell,
      badgeCount: unreadNotificationCount,
    },
    {
      label: 'Paddle & Vault Settings',
      href: '/account/settings',
      icon: Sliders,
    },
  ];

  return (
    <div className="border-b border-stone-hairline bg-paper/60 backdrop-blur-sm -mt-2 mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 py-2">
        {/* Navigation Tabs */}
        <nav className="flex flex-wrap items-center gap-1.5" aria-label="Account Secondary Navigation">
          {accountTabs.map((tab) => {
            const isActive = pathname === tab.href;
            const Icon = tab.icon;
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={`px-3 py-1.5 font-mono text-xs uppercase tracking-wider transition-all border flex items-center gap-2 ${
                  isActive
                    ? 'bg-forest text-paper border-forest font-semibold shadow-tactile'
                    : 'bg-paper text-forest/70 border-stone-hairline hover:border-forest hover:text-forest'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
                {tab.badgeCount !== undefined && tab.badgeCount > 0 && (
                  <span
                    className={`px-1.5 py-0.2 text-[9px] font-bold rounded-full ${
                      isActive ? 'bg-lime text-forest' : 'bg-forest text-lime'
                    }`}
                  >
                    {tab.badgeCount}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Collector Profile Badge & Curatorial Desk Quick Link */}
        <div className="flex items-center gap-2 font-mono text-xs">
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-paper-dark border border-stone-hairline text-forest/80 text-[11px]">
            <User className="w-3 h-3 text-forest/60" />
            <span className="font-bold text-forest">#{user.paddleNumber}</span>
            <span className="text-[9px] px-1 py-0.2 bg-forest text-paper font-semibold">
              Collector & Consignor
            </span>
          </div>

          <Link
            href="/admin"
            className="px-2.5 py-1 bg-paper border border-stone-hairline text-forest/70 hover:text-forest hover:border-forest text-[11px] flex items-center gap-1 transition-colors"
            title="Open Curatorial Administration Console"
          >
            <Shield className="w-3 h-3 text-lime-700" />
            <span className="hidden md:inline">Specialist Desk</span>
            <span className="text-[9px] bg-lime text-forest font-bold px-1 py-0.2">DEMO</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
