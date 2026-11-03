'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiFetch } from '@/lib/api';
import { downloadCsv } from '@/lib/download';
import { toast } from '@/components/ui/toast';
import { TableSkeleton } from '@/components/ui/loading-screen';
import {
  Users,
  Search,
  ExternalLink,
  Download,
  RefreshCw,
  Mail,
  MessageCircle,
  Clock,
  Globe,
  BookOpen,
  Zap,
  Trash2,
  AlertCircle,
  CheckCircle2,
  X,
} from 'lucide-react';

interface WaitlistEntry {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  country: string;
  course: string;
  pace: string;
  notes: string;
  createdAt: string;
}

export default function AdminWaitlistPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [courseFilter, setCourseFilter] = useState('all');
  const [paceFilter, setPaceFilter] = useState('all');
  const [selectedEntry, setSelectedEntry] = useState<WaitlistEntry | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const {
    data: entries = [],
    isLoading,
    isRefetching,
    isError,
    refetch,
  } = useQuery<WaitlistEntry[]>({
    queryKey: ['adminWaitlist'],
    queryFn: () => apiFetch('/admin/waitlist'),
    refetchInterval: 30000,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) =>
      apiFetch(`/admin/waitlist/${id}`, { method: 'DELETE' }),
    onSuccess: () => {
      toast.success('Waitlist entry removed.');
      queryClient.invalidateQueries({ queryKey: ['adminWaitlist'] });
      queryClient.invalidateQueries({ queryKey: ['adminWaitlistSidebarCount'] });
      setDeleteId(null);
      if (selectedEntry?.id === deleteId) {
        setSelectedEntry(null);
      }
    },
    onError: (err) => {
      toast.error(err?.message || 'Failed to remove entry');
    },
  });

  // Unique list of courses for filter dropdown
  const coursesList = useMemo(() => {
    const set = new Set<string>();
    entries.forEach((e) => {
      if (e.course) set.add(e.course);
    });
    return Array.from(set).sort();
  }, [entries]);

  // Unique countries count
  const uniqueCountriesCount = useMemo(() => {
    return new Set(entries.map((e) => e.country).filter(Boolean)).size;
  }, [entries]);

  // Fast-track pace count
  const fastTrackCount = useMemo(() => {
    return entries.filter((e) => e.pace === 'fast-track').length;
  }, [entries]);

  // Filtered entries
  const filteredEntries = useMemo(() => {
    const q = search.trim().toLowerCase();
    return entries.filter((item) => {
      if (courseFilter !== 'all' && item.course !== courseFilter) return false;
      if (paceFilter !== 'all' && item.pace !== paceFilter) return false;
      if (!q) return true;
      return (
        item.fullName?.toLowerCase().includes(q) ||
        item.email?.toLowerCase().includes(q) ||
        item.phone?.toLowerCase().includes(q) ||
        item.country?.toLowerCase().includes(q) ||
        item.course?.toLowerCase().includes(q) ||
        item.notes?.toLowerCase().includes(q)
      );
    });
  }, [entries, search, courseFilter, paceFilter]);

  const handleExportCsv = () => {
    if (!filteredEntries.length) return;
    const rows = [
      ['Full Name', 'Email', 'Phone', 'Country', 'Course', 'Pace', 'Notes', 'Submitted At'],
      ...filteredEntries.map((e) => [
        e.fullName,
        e.email,
        e.phone || '',
        e.country || '',
        e.course,
        e.pace === 'fast-track' ? 'Fast Track (3x/wk)' : 'Standard (2x/wk)',
        e.notes || '',
        new Date(e.createdAt).toISOString(),
      ]),
    ];
    downloadCsv(rows, `ilmbit-waitlist-${new Date().toISOString().slice(0, 10)}.csv`);
    toast.success(`Exported ${filteredEntries.length} enquiries to CSV`);
  };

  const getCleanPhone = (phone: string) => {
    return phone?.replace(/[^0-9]/g, '') || '';
  };

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6 animate-fade-in pb-16">
      {/* ─── Header ─── */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">
              Waitlist & Trial Enquiries
            </h1>
            <span className="rounded-full bg-[#eef6f2] px-3 py-1 text-xs font-bold text-[#095F46] border border-[#d6e0db]">
              {entries.length} {entries.length === 1 ? 'Lead' : 'Leads'}
            </span>
          </div>
          <p className="mt-1 text-sm text-[#56635c]">
            Real-time feed of prospective students and parents submitting the public trial form.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <Link
            href="/about#waitlist"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-xl border border-[#d6e0db] bg-white px-3.5 py-2 text-xs font-bold text-stone-700 shadow-sm transition hover:bg-stone-50 hover:text-stone-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#095F46]"
            title="Open the live public form on the website"
          >
            <ExternalLink className="h-4 w-4 text-[#095F46]" />
            <span>Open Public Form</span>
          </Link>

          <button
            onClick={() => refetch()}
            disabled={isRefetching}
            className="inline-flex items-center gap-1.5 rounded-xl border border-[#d6e0db] bg-white px-3.5 py-2 text-xs font-bold text-stone-700 shadow-sm transition hover:bg-stone-50 hover:text-stone-950 disabled:opacity-50"
            title="Refresh submissions"
          >
            <RefreshCw className={`h-4 w-4 text-stone-500 ${isRefetching ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>

          <button
            onClick={handleExportCsv}
            disabled={!filteredEntries.length}
            className="inline-flex items-center gap-2 rounded-xl bg-[#095F46] px-4 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-[#074c38] disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#095F46]"
          >
            <Download className="h-4 w-4" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* ─── Metric Cards ─── */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {/* Total Enquiries */}
        <div className="rounded-2xl border border-[#d6e0db] bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#56635c]">Total Enquiries</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#eef6f2] text-[#095F46]">
              <Users className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 text-2xl sm:text-3xl font-black text-stone-900">{entries.length}</div>
          <div className="mt-1 flex items-center gap-1 text-xs text-[#56635c]">
            <CheckCircle2 className="h-3.5 w-3.5 text-[#095F46]" />
            <span>Synced with database</span>
          </div>
        </div>

        {/* Countries */}
        <div className="rounded-2xl border border-[#d6e0db] bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#56635c]">Countries</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-700">
              <Globe className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 text-2xl sm:text-3xl font-black text-stone-900">{uniqueCountriesCount}</div>
          <div className="mt-1 text-xs text-[#56635c]">Global student reach</div>
        </div>

        {/* Fast-Track vs Standard */}
        <div className="rounded-2xl border border-[#d6e0db] bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#56635c]">Fast Track (3x/wk)</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-50 text-amber-700">
              <Zap className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 text-2xl sm:text-3xl font-black text-stone-900">{fastTrackCount}</div>
          <div className="mt-1 text-xs text-[#56635c]">
            {entries.length > 0
              ? `${Math.round((fastTrackCount / entries.length) * 100)}% of prospective students`
              : 'No requests yet'}
          </div>
        </div>

        {/* Latest Submission */}
        <div className="rounded-2xl border border-[#d6e0db] bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#56635c]">Latest Activity</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-50 text-purple-700">
              <Clock className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 text-sm sm:text-base font-bold text-stone-900 truncate">
            {entries.length > 0
              ? new Date(entries[0].createdAt).toLocaleDateString(undefined, {
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })
              : 'None recorded'}
          </div>
          <div className="mt-1 text-xs text-[#56635c]">
            {entries.length > 0 ? entries[0].fullName : 'Waiting for leads'}
          </div>
        </div>
      </div>

      {/* ─── Search & Filters Bar ─── */}
      <div className="flex flex-col gap-3 rounded-2xl border border-[#d6e0db] bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by student name, email, phone, country or notes..."
            className="w-full rounded-xl border border-stone-200 bg-stone-50/60 py-2.5 pl-10 pr-4 text-sm text-stone-900 placeholder:text-stone-400 focus:border-[#095F46] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#095F46]"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Course filter */}
          <select
            value={courseFilter}
            onChange={(e) => setCourseFilter(e.target.value)}
            className="rounded-xl border border-stone-200 bg-stone-50/60 px-3 py-2.5 text-xs font-semibold text-stone-700 focus:border-[#095F46] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#095F46]"
          >
            <option value="all">All Courses ({coursesList.length})</option>
            {coursesList.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          {/* Pace filter */}
          <select
            value={paceFilter}
            onChange={(e) => setPaceFilter(e.target.value)}
            className="rounded-xl border border-stone-200 bg-stone-50/60 px-3 py-2.5 text-xs font-semibold text-stone-700 focus:border-[#095F46] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#095F46]"
          >
            <option value="all">All Paces</option>
            <option value="standard">Standard (2 sessions/wk)</option>
            <option value="fast-track">Fast Track (3 sessions/wk)</option>
          </select>
        </div>
      </div>

      {/* ─── Table Content ─── */}
      {isLoading ? (
        <TableSkeleton rows={5} />
      ) : isError ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center text-red-700">
          <AlertCircle className="mx-auto mb-2 h-6 w-6" />
          <p className="font-bold">Failed to load waitlist entries</p>
          <p className="mt-1 text-sm text-red-600">Please verify you have administrative access.</p>
          <button
            onClick={() => refetch()}
            className="mt-3 rounded-lg bg-red-600 px-4 py-1.5 text-xs font-bold text-white hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      ) : filteredEntries.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[#d6e0db] bg-white p-12 text-center">
          <Users className="mx-auto h-10 w-10 text-stone-300" />
          <h3 className="mt-3 text-lg font-bold text-stone-900">
            {search || courseFilter !== 'all' || paceFilter !== 'all'
              ? 'No matching enquiries'
              : 'No waitlist enquiries yet'}
          </h3>
          <p className="mx-auto mt-1 max-w-sm text-sm text-[#56635c]">
            {search || courseFilter !== 'all' || paceFilter !== 'all'
              ? 'Try adjusting your search criteria or resetting the filters.'
              : 'Prospective students who submit the waitlist form on the website will appear here in real-time.'}
          </p>
          <div className="mt-5">
            <Link
              href="/about#waitlist"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl bg-[#095F46] px-5 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-[#074c38]"
            >
              <ExternalLink className="h-4 w-4" />
              <span>Test the Live Waitlist Form</span>
            </Link>
          </div>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-[#d6e0db] bg-white shadow-sm">
          <div className="overflow-x-auto" tabIndex={0} role="region" aria-label="Waitlist submissions table">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead className="border-b border-[#e5ece8] bg-[#f8faf9] text-xs font-bold uppercase tracking-wider text-[#56635c]">
                <tr>
                  <th className="px-5 py-3.5">Student / Contact</th>
                  <th className="px-4 py-3.5">Course & Pace</th>
                  <th className="px-4 py-3.5">Country</th>
                  <th className="px-4 py-3.5">Notes & Timing</th>
                  <th className="px-4 py-3.5">Received</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e5ece8]">
                {filteredEntries.map((item) => {
                  const cleanPhone = getCleanPhone(item.phone);
                  return (
                    <tr
                      key={item.id}
                      className="group transition-colors hover:bg-[#fcfdfc]"
                    >
                      {/* Name & Contact */}
                      <td className="px-5 py-4">
                        <div className="font-bold text-stone-950 text-base">{item.fullName}</div>
                        <div className="mt-0.5 flex flex-wrap items-center gap-2 text-xs text-stone-500">
                          <a
                            href={`mailto:${item.email}?subject=Ilmbit%20Learning%20Inquiry`}
                            className="inline-flex items-center gap-1 text-[#095F46] hover:underline"
                            title="Send email"
                          >
                            <Mail className="h-3 w-3" />
                            <span>{item.email}</span>
                          </a>
                          {item.phone && (
                            <>
                              <span>•</span>
                              <span className="font-mono text-stone-600">{item.phone}</span>
                            </>
                          )}
                        </div>
                      </td>

                      {/* Course & Pace */}
                      <td className="px-4 py-4">
                        <div className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-900 border border-emerald-200">
                          <BookOpen className="h-3 w-3 text-emerald-700" />
                          <span>{item.course}</span>
                        </div>
                        <div className="mt-1 text-xs font-medium text-stone-500">
                          {item.pace === 'fast-track' ? (
                            <span className="inline-flex items-center gap-1 text-amber-700 font-bold">
                              <Zap className="h-3 w-3" /> Fast Track · 3x/wk
                            </span>
                          ) : (
                            <span>Standard · 2x/wk</span>
                          )}
                        </div>
                      </td>

                      {/* Country */}
                      <td className="px-4 py-4">
                        <span className="inline-flex items-center gap-1 rounded-md bg-stone-100 px-2 py-0.5 text-xs font-semibold text-stone-700">
                          <Globe className="h-3 w-3 text-stone-500" />
                          {item.country || 'Global'}
                        </span>
                      </td>

                      {/* Notes / Preferred schedule */}
                      <td className="px-4 py-4 max-w-xs">
                        {item.notes ? (
                          <div
                            onClick={() => setSelectedEntry(item)}
                            className="cursor-pointer line-clamp-2 text-xs text-stone-700 hover:text-stone-950 bg-stone-50 p-2 rounded-lg border border-stone-200/60"
                            title="Click to view full notes"
                          >
                            {item.notes}
                          </div>
                        ) : (
                          <span className="text-xs text-stone-400 italic">No notes provided</span>
                        )}
                      </td>

                      {/* Received Date */}
                      <td className="px-4 py-4 text-xs text-stone-600 whitespace-nowrap">
                        <div className="font-semibold text-stone-800">
                          {new Date(item.createdAt).toLocaleDateString(undefined, {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </div>
                        <div className="text-[11px] text-stone-400">
                          {new Date(item.createdAt).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-4 text-right whitespace-nowrap">
                        <div className="inline-flex items-center justify-end gap-1.5">
                          {cleanPhone && (
                            <a
                              href={`https://wa.me/${cleanPhone}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-[#d6e0db] bg-white text-emerald-600 shadow-xs hover:bg-emerald-50 hover:text-emerald-700"
                              title="Message on WhatsApp"
                            >
                              <MessageCircle className="h-4 w-4" />
                            </a>
                          )}

                          <a
                            href={`mailto:${item.email}?subject=Ilmbit%20Learning%20Inquiry`}
                            className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-[#d6e0db] bg-white text-stone-600 shadow-xs hover:bg-stone-50 hover:text-stone-900"
                            title="Send email"
                          >
                            <Mail className="h-4 w-4" />
                          </a>

                          <button
                            onClick={() => setDeleteId(item.id)}
                            className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-transparent text-stone-400 hover:bg-red-50 hover:text-red-600"
                            title="Delete entry"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ─── Notes Detail Modal ─── */}
      {selectedEntry && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/60 p-4 backdrop-blur-xs"
        >
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl animate-in fade-in zoom-in-95">
            <div className="flex items-start justify-between border-b border-stone-100 pb-3">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#095F46]">
                  Lead Preferences
                </span>
                <h3 className="text-xl font-bold text-stone-950">{selectedEntry.fullName}</h3>
              </div>
              <button
                onClick={() => setSelectedEntry(null)}
                className="rounded-lg p-1.5 text-stone-400 hover:bg-stone-100 hover:text-stone-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-4 space-y-3 text-sm">
              <div className="grid grid-cols-2 gap-2 rounded-xl bg-stone-50 p-3 text-xs">
                <div>
                  <span className="font-semibold text-stone-500">Course:</span>
                  <p className="font-bold text-stone-800">{selectedEntry.course}</p>
                </div>
                <div>
                  <span className="font-semibold text-stone-500">Pace:</span>
                  <p className="font-bold text-stone-800">
                    {selectedEntry.pace === 'fast-track' ? 'Fast Track (3x/wk)' : 'Standard (2x/wk)'}
                  </p>
                </div>
                <div>
                  <span className="font-semibold text-stone-500">Email:</span>
                  <p className="font-bold text-stone-800 break-all">{selectedEntry.email}</p>
                </div>
                <div>
                  <span className="font-semibold text-stone-500">Phone:</span>
                  <p className="font-bold text-stone-800">{selectedEntry.phone || 'None'}</p>
                </div>
              </div>

              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-stone-500">
                  Notes / Preferred Timing
                </span>
                <div className="mt-1.5 whitespace-pre-wrap rounded-xl border border-stone-200 bg-white p-3.5 text-xs text-stone-800 shadow-inner">
                  {selectedEntry.notes || 'No custom notes provided.'}
                </div>
              </div>
            </div>

            <div className="mt-5 flex items-center justify-end gap-2 border-t border-stone-100 pt-3">
              {getCleanPhone(selectedEntry.phone) && (
                <a
                  href={`https://wa.me/${getCleanPhone(selectedEntry.phone)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-700"
                >
                  <MessageCircle className="h-4 w-4" />
                  <span>WhatsApp</span>
                </a>
              )}
              <a
                href={`mailto:${selectedEntry.email}?subject=Ilmbit%20Learning%20Inquiry`}
                className="inline-flex items-center gap-1.5 rounded-xl bg-[#095F46] px-4 py-2 text-xs font-bold text-white hover:bg-[#074c38]"
              >
                <Mail className="h-4 w-4" />
                <span>Send Email</span>
              </a>
              <button
                onClick={() => setSelectedEntry(null)}
                className="rounded-xl border border-stone-200 px-4 py-2 text-xs font-bold text-stone-700 hover:bg-stone-50"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── Delete Confirmation Modal ─── */}
      {deleteId && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/60 p-4 backdrop-blur-xs"
        >
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-stone-950">Remove waitlist entry?</h3>
            <p className="mt-1 text-xs text-stone-500">
              This will permanently delete this prospective student from the waitlist database.
            </p>
            <div className="mt-5 flex justify-end gap-2">
              <button
                onClick={() => setDeleteId(null)}
                className="rounded-xl border border-stone-200 px-4 py-2 text-xs font-bold text-stone-700 hover:bg-stone-50"
              >
                Cancel
              </button>
              <button
                onClick={() => deleteMutation.mutate(deleteId)}
                disabled={deleteMutation.isPending}
                className="inline-flex items-center gap-1.5 rounded-xl bg-red-600 px-4 py-2 text-xs font-bold text-white hover:bg-red-700 disabled:opacity-50"
              >
                {deleteMutation.isPending ? 'Removing...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
