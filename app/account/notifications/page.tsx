'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useChronoBid, NotificationCategory } from '@/lib/context';
import { AccountSubnav } from '@/components/AccountSubnav';
import {
  Bell,
  CheckCircle2,
  Check,
  Trash2,
  RotateCcw,
  ExternalLink,
  Radio,
  Clock,
  FileText,
  Shield,
  Layers,
  Sliders,
} from 'lucide-react';

export default function AccountNotificationsPage() {
  const {
    user,
    notifications,
    unreadNotificationCount,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    deleteNotification,
    resetNotifications,
  } = useChronoBid();

  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [readFilter, setReadFilter] = useState<'all' | 'unread' | 'read'>('all');

  const categories: { label: string; value: string }[] = [
    { label: 'All Categories', value: 'All' },
    { label: 'Saleroom Bids', value: 'bidding' },
    { label: 'Watchlist', value: 'watchlist' },
    { label: 'Consignments', value: 'consignments' },
    { label: 'System & Vault', value: 'system' },
  ];

  const filteredNotifications = notifications.filter((notif) => {
    if (categoryFilter !== 'All' && notif.category !== categoryFilter) {
      return false;
    }
    if (readFilter === 'unread' && notif.isRead) return false;
    if (readFilter === 'read' && !notif.isRead) return false;
    return true;
  });

  const getCategoryIcon = (category: NotificationCategory) => {
    switch (category) {
      case 'bidding':
        return <Radio className="w-4 h-4 text-emerald-700" />;
      case 'watchlist':
        return <Clock className="w-4 h-4 text-blue-700" />;
      case 'consignments':
        return <FileText className="w-4 h-4 text-amber-700" />;
      case 'system':
        return <Shield className="w-4 h-4 text-forest/70" />;
    }
  };

  const getCategoryBadgeClass = (category: NotificationCategory) => {
    switch (category) {
      case 'bidding':
        return 'bg-emerald-100 text-emerald-950 border-emerald-300';
      case 'watchlist':
        return 'bg-blue-100 text-blue-950 border-blue-300';
      case 'consignments':
        return 'bg-amber-100 text-amber-950 border-amber-300';
      case 'system':
        return 'bg-paper-dark text-forest border-stone-hairline';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Universal Secondary Account Subnav */}
      <AccountSubnav />

      {/* Unified Collector Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-stone-hairline gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-forest/60">
            <span>Unified Collector Profile</span>
            <span>•</span>
            <span>Paddle #{user.paddleNumber}</span>
            <span className="px-1.5 py-0.2 bg-lime/40 text-forest text-[10px] font-bold">
              [Collector & Consignor]
            </span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-forest mt-1">
            Notification Centre
          </h1>
        </div>

        {/* Global Action Controls */}
        <div className="flex items-center gap-2">
          {unreadNotificationCount > 0 && (
            <button
              type="button"
              onClick={markAllNotificationsAsRead}
              className="py-2 px-3.5 bg-paper border border-stone-hairline text-forest font-mono text-xs uppercase tracking-wider hover:border-forest transition-colors flex items-center gap-1.5"
            >
              <Check className="w-3.5 h-3.5 text-forest" />
              <span>Mark All as Read ({unreadNotificationCount})</span>
            </button>
          )}

          <button
            type="button"
            onClick={resetNotifications}
            className="py-2 px-3 bg-paper-dark border border-stone-hairline text-forest font-mono text-xs uppercase tracking-wider hover:border-forest transition-colors flex items-center gap-1.5"
            title="Reset to 5 demo notifications"
          >
            <RotateCcw className="w-3.5 h-3.5 text-forest/70" />
            <span className="hidden sm:inline">Reset Demo</span>
          </button>
        </div>
      </div>

      {/* Persistent Account Navigation Sub-Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-2 bg-paper-dark border border-stone-hairline font-mono text-xs">
        <div className="flex flex-wrap items-center gap-1">
          <Link
            href="/account/bids"
            className="px-3 py-1.5 text-forest/70 hover:text-forest hover:bg-paper transition-colors"
          >
            My Bids &amp; Watchlist
          </Link>
          <Link
            href="/account/consignments"
            className="px-3 py-1.5 text-forest/70 hover:text-forest hover:bg-paper transition-colors"
          >
            Consignment Tickets &amp; Sales
          </Link>
          <Link
            href="/account/notifications"
            className="px-3 py-1.5 bg-forest text-paper font-semibold shadow-tactile flex items-center gap-1.5"
          >
            <span>Notifications</span>
            {unreadNotificationCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-lime text-forest text-[10px] font-bold flex items-center justify-center">
                {unreadNotificationCount}
              </span>
            )}
          </Link>
          <Link
            href="/account/settings"
            className="px-3 py-1.5 text-forest/70 hover:text-forest hover:bg-paper transition-colors"
          >
            Paddle &amp; Preferences
          </Link>
        </div>

        <div className="hidden md:flex items-center gap-2 text-forest/60 text-[11px] pr-2">
          <span className="w-2 h-2 rounded-full bg-lime animate-pulse"></span>
          <span>Active Session Notifications</span>
        </div>
      </div>

      {/* Demo Notification Disclosure Banner */}
      <div className="p-3.5 bg-amber-50 border border-amber-300 text-amber-950 font-mono text-xs flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="bg-amber-200 text-amber-900 font-bold px-1.5 py-0.2 uppercase text-[10px]">
            [DEMO DATA]
          </span>
          <span>
            The notifications listed below simulate asynchronous saleroom floor alerts, specialist appraisal outcomes, and Pre-Funded Vault headroom updates.
          </span>
        </div>
      </div>

      {/* Filter Tabs: Category & Read State */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-hairline pb-4">
        {/* Category Filter */}
        <div className="flex flex-wrap items-center gap-1.5" role="tablist" aria-label="Notification Categories">
          {categories.map((cat) => {
            const count =
              cat.value === 'All'
                ? notifications.length
                : notifications.filter((n) => n.category === cat.value).length;

            return (
              <button
                key={cat.value}
                type="button"
                role="tab"
                aria-selected={categoryFilter === cat.value}
                onClick={() => setCategoryFilter(cat.value)}
                className={`px-3 py-1.5 text-xs font-mono uppercase tracking-wider transition-all border flex items-center gap-1.5 ${
                  categoryFilter === cat.value
                    ? 'bg-forest text-paper border-forest font-semibold shadow-tactile'
                    : 'bg-paper text-forest/70 border-stone-hairline hover:border-forest hover:text-forest'
                }`}
              >
                <span>{cat.label}</span>
                <span
                  className={`text-[10px] px-1 py-0.2 rounded ${
                    categoryFilter === cat.value ? 'bg-paper/20 text-paper' : 'bg-forest/10 text-forest/80'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Read / Unread Status Filter */}
        <div className="flex items-center gap-1 p-1 bg-paper border border-stone-hairline font-mono text-xs">
          <button
            type="button"
            onClick={() => setReadFilter('all')}
            className={`px-2.5 py-1 transition-colors ${
              readFilter === 'all' ? 'bg-forest text-paper font-semibold' : 'text-forest/70 hover:text-forest'
            }`}
          >
            All ({notifications.length})
          </button>
          <button
            type="button"
            onClick={() => setReadFilter('unread')}
            className={`px-2.5 py-1 transition-colors flex items-center gap-1 ${
              readFilter === 'unread' ? 'bg-forest text-paper font-semibold' : 'text-forest/70 hover:text-forest'
            }`}
          >
            <span>Unread</span>
            <span className="font-bold">({unreadNotificationCount})</span>
          </button>
          <button
            type="button"
            onClick={() => setReadFilter('read')}
            className={`px-2.5 py-1 transition-colors ${
              readFilter === 'read' ? 'bg-forest text-paper font-semibold' : 'text-forest/70 hover:text-forest'
            }`}
          >
            Read ({notifications.length - unreadNotificationCount})
          </button>
        </div>
      </div>

      {/* Notifications List */}
      {filteredNotifications.length > 0 ? (
        <div className="space-y-3" role="feed" aria-label="Notifications Feed">
          {filteredNotifications.map((notif) => (
            <div
              key={notif.id}
              className={`p-5 border transition-all flex flex-col sm:flex-row items-start justify-between gap-4 shadow-tactile ${
                notif.isRead
                  ? 'bg-paper/70 border-stone-hairline'
                  : 'bg-paper border-forest/60 border-l-4 border-l-lime shadow-tactile-hover'
              }`}
            >
              <div className="flex items-start gap-3.5 max-w-3xl">
                <div className="p-2 bg-paper-dark border border-stone-hairline rounded-sm mt-0.5 shrink-0">
                  {getCategoryIcon(notif.category)}
                </div>

                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`text-[10px] font-mono uppercase font-bold tracking-wider px-2 py-0.2 border ${getCategoryBadgeClass(
                        notif.category
                      )}`}
                    >
                      {notif.badge || notif.category}
                    </span>

                    {!notif.isRead && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-mono text-emerald-800 bg-emerald-100 border border-emerald-300 font-bold px-1.5 py-0.2">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
                        <span>New</span>
                      </span>
                    )}

                    <span className="text-[11px] font-mono text-forest/50">
                      {notif.timestamp}
                    </span>
                  </div>

                  <h3 className="font-serif text-lg font-bold text-forest leading-snug">
                    {notif.title}
                  </h3>

                  <p className="font-sans text-xs sm:text-sm text-forest/80 leading-relaxed">
                    {notif.description}
                  </p>

                  {notif.link && (
                    <div className="pt-1">
                      <Link
                        href={notif.link}
                        onClick={() => markNotificationAsRead(notif.id)}
                        className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-forest hover:text-lime-900 underline"
                      >
                        <span>Navigate to Relevant Screen</span>
                        <ExternalLink className="w-3 h-3" />
                      </Link>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex sm:flex-col items-center gap-2 shrink-0 self-end sm:self-center font-mono text-xs">
                {!notif.isRead ? (
                  <button
                    type="button"
                    onClick={() => markNotificationAsRead(notif.id)}
                    className="px-2.5 py-1 bg-paper-dark hover:bg-forest hover:text-paper border border-stone-hairline text-forest transition-colors flex items-center gap-1"
                    title="Mark as read"
                  >
                    <Check className="w-3 h-3" />
                    <span>Mark Read</span>
                  </button>
                ) : (
                  <span className="text-[10px] text-forest/40 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Read</span>
                  </span>
                )}

                <button
                  type="button"
                  onClick={() => deleteNotification(notif.id)}
                  aria-label="Dismiss notification"
                  className="p-1 text-forest/40 hover:text-rose-700 transition-colors"
                  title="Dismiss notification"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="py-16 text-center border border-dashed border-stone-hairline p-8 space-y-3 bg-paper shadow-tactile">
          <div className="w-12 h-12 mx-auto rounded-full bg-paper-dark border border-stone-hairline flex items-center justify-center">
            <Bell className="w-6 h-6 text-forest/50" />
          </div>
          <p className="font-serif text-xl font-bold text-forest">No notifications found</p>
          <p className="font-mono text-xs text-forest/60 max-w-md mx-auto">
            You are completely caught up. There are no notifications matching your selected category and status filters.
          </p>
          <button
            type="button"
            onClick={resetNotifications}
            className="mt-2 px-4 py-2 bg-forest text-paper font-mono text-xs uppercase tracking-wider hover:bg-forest-hover transition-colors inline-flex items-center gap-2"
          >
            <RotateCcw className="w-3.5 h-3.5 text-lime" />
            <span>Restore Demonstration Notifications</span>
          </button>
        </div>
      )}
    </div>
  );
}
