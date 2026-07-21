'use client';

import { useState, useCallback, useEffect } from 'react';
import { Search, Filter, MoreHorizontal, Shield, UserX, Key, Eye, UserPlus, CheckCircle } from 'lucide-react';
import { students, lecturers } from '@/lib/mock-data';

const allUsers = [
  ...students.map(s => ({ ...s, role: 'student' as const })),
  ...lecturers.map(l => ({ id: l.id, name: l.name, email: `${l.name.split(' ').pop()?.toLowerCase()}@scholar.com`, role: 'lecturer' as const, status: l.status, country: 'Sri Lanka', tier: undefined })),
];

export default function AdminUsersPage() {
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [selectedStudentForAssignment, setSelectedStudentForAssignment] = useState<any>(null);
  const [assignmentSuccess, setAssignmentSuccess] = useState(false);
  const [showAddLecturerModal, setShowAddLecturerModal] = useState(false);
  const [addLecturerSuccess, setAddLecturerSuccess] = useState(false);

  const closeModal = useCallback(() => setSelectedStudentForAssignment(null), []);

  useEffect(() => {
    if (!selectedStudentForAssignment) return;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') closeModal(); };
    window.addEventListener('keydown', onKey);
    return () => { document.body.style.overflow = ''; window.removeEventListener('keydown', onKey); };
  }, [selectedStudentForAssignment, closeModal]);

  const filtered = allUsers.filter(u => {
    const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) || u.email?.toLowerCase().includes(search.toLowerCase());
    const matchRole = roleFilter === 'all' || u.role === roleFilter;
    return matchSearch && matchRole;
  });

  return (
    <>
      <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">User Management</h1>
        {(roleFilter === 'all' || roleFilter === 'lecturer') && (
          <button 
            onClick={() => setShowAddLecturerModal(true)}
            className="px-4 py-2 bg-[hsl(var(--primary))] text-white text-sm font-medium rounded-xl hover:shadow-lg transition-all flex items-center gap-2"
          >
            <UserPlus className="h-4 w-4" />
            Add Lecturer
          </button>
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[hsl(var(--muted-foreground))]" />
          <input type="text" placeholder="Search users..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ring))]" />
        </div>
        <div className="flex gap-2">
          {['all', 'student', 'lecturer'].map((r) => (
            <button key={r} onClick={() => setRoleFilter(r)} className={`px-3 py-2 rounded-xl text-xs font-medium transition-colors ${roleFilter === r ? 'bg-[hsl(var(--primary))] text-white' : 'bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--border))]'}`}>
              {r === 'all' ? 'All' : r.charAt(0).toUpperCase() + r.slice(1)}s
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] overflow-hidden overflow-x-auto">
        <table className="w-full min-w-[600px]">
          <thead>
            <tr className="border-b border-[hsl(var(--border))]">
              <th className="text-left py-3 px-5 text-xs font-semibold text-[hsl(var(--muted-foreground))]">User</th>
              <th className="text-left py-3 px-5 text-xs font-semibold text-[hsl(var(--muted-foreground))]">Role</th>
              <th className="text-left py-3 px-5 text-xs font-semibold text-[hsl(var(--muted-foreground))]">Status</th>
              <th className="text-right py-3 px-5 text-xs font-semibold text-[hsl(var(--muted-foreground))]">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((u) => (
              <tr key={u.id} className="border-b border-[hsl(var(--border))] last:border-0 hover:bg-[hsl(var(--muted)/0.5)]">
                <td className="py-3 px-5">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-full bg-gradient-to-br from-[hsl(168,80%,26%)] to-[hsl(168,50%,45%)] flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                      {u.name.split(' ').map(n=>n[0]).join('').slice(0,2)}
                    </div>
                    <div>
                      <div className="font-medium text-sm">{u.name}</div>
                      <div className="text-xs text-[hsl(var(--muted-foreground))]">{u.email}</div>
                    </div>
                  </div>
                </td>
                <td className="py-3 px-5">
                  <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${u.role === 'student' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' : 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400'}`}>
                    {u.role}
                  </span>
                </td>
                <td className="py-3 px-5">
                  <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${u.status === 'active' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'}`}>
                    {u.status}
                  </span>
                </td>
                <td className="py-3 px-5 text-right">
                  <div className="flex items-center justify-end gap-1">
                    {u.role === 'student' && (
                      <button onClick={() => setSelectedStudentForAssignment(u)} className="p-1.5 rounded-lg bg-[hsl(var(--primary)/0.1)] text-[hsl(var(--primary))] hover:bg-[hsl(var(--primary)/0.2)] transition-colors flex items-center gap-1.5 px-3 mr-2" title="Assign Lecturer">
                        <UserPlus className="h-4 w-4" />
                        <span className="text-xs font-medium hidden md:block">Assign Scholar</span>
                      </button>
                    )}
                    <button className="p-1.5 rounded-lg hover:bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))]" title="View"><Eye className="h-4 w-4" /></button>
                    <button className="p-1.5 rounded-lg hover:bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))]" title="Reset Password"><Key className="h-4 w-4" /></button>
                    <button className="p-1.5 rounded-lg hover:bg-[hsl(var(--destructive)/0.1)] text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--destructive))]" title="Suspend"><UserX className="h-4 w-4" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>

      {/* Assign Lecturer Modal */}
      {selectedStudentForAssignment && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} onClick={closeModal}>
          <div className="bg-[hsl(var(--card))] rounded-2xl border border-[hsl(var(--border))] shadow-2xl max-w-md w-full p-6 animate-fade-in" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-bold mb-1">Assign Lecturer</h3>
            <p className="text-sm text-[hsl(var(--muted-foreground))] mb-5">
              Select a lecturer for {selectedStudentForAssignment.name}.
            </p>
            <div className="space-y-3 mb-6 max-h-[300px] overflow-y-auto pr-2">
              {lecturers.map(l => (
                <button
                  key={l.id}
                  onClick={() => {
                    setAssignmentSuccess(true);
                    closeModal();
                    setTimeout(() => setAssignmentSuccess(false), 3000);
                  }}
                  className="w-full flex items-center justify-between p-3 rounded-xl border border-[hsl(var(--border))] hover:border-[hsl(var(--primary))] hover:bg-[hsl(var(--primary)/0.05)] transition-all text-left"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-[hsl(168,80%,26%)] to-[hsl(168,50%,45%)] flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                      {l.name.split(' ').map(n=>n[0]).join('').slice(0,2)}
                    </div>
                    <div>
                      <div className="font-semibold text-sm">{l.name}</div>
                      <div className="text-xs text-[hsl(var(--muted-foreground))]">{l.studentsCount} active students</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
            <button onClick={closeModal} className="w-full py-2.5 rounded-xl text-sm font-medium border border-[hsl(var(--border))] hover:bg-[hsl(var(--muted))]">
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Add Lecturer Modal */}
      {showAddLecturerModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} onClick={() => setShowAddLecturerModal(false)}>
          <div className="bg-[hsl(var(--card))] rounded-2xl border border-[hsl(var(--border))] shadow-2xl max-w-lg w-full p-6 animate-fade-in" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-bold mb-1">Create Lecturer Account</h3>
            <p className="text-sm text-[hsl(var(--muted-foreground))] mb-6">
              Manually onboard a vetted scholar to the platform.
            </p>
            
            <form onSubmit={(e) => {
              e.preventDefault();
              setShowAddLecturerModal(false);
              setAddLecturerSuccess(true);
              setTimeout(() => setAddLecturerSuccess(false), 4000);
            }} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5">First Name</label>
                  <input required type="text" className="w-full px-3 py-2 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--background))] text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ring))]" placeholder="e.g. Ahmed" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">Last Name</label>
                  <input required type="text" className="w-full px-3 py-2 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--background))] text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ring))]" placeholder="e.g. Al-Farsi" />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1.5">Email Address</label>
                <input required type="email" className="w-full px-3 py-2 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--background))] text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ring))]" placeholder="ahmed@example.com" />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5">Specializations (comma separated)</label>
                <input required type="text" className="w-full px-3 py-2 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--background))] text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ring))]" placeholder="e.g. Tajweed, Hifz, Fiqh" />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5">Base Hourly Rate (LKR)</label>
                <input required type="number" defaultValue="1250" className="w-full px-3 py-2 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--background))] text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ring))]" />
              </div>

              <div className="pt-2">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input type="checkbox" defaultChecked className="mt-1 h-4 w-4 rounded border-[hsl(var(--border))]" />
                  <div>
                    <div className="text-sm font-medium">Send Invitation Email</div>
                    <div className="text-xs text-[hsl(var(--muted-foreground))]">Automatically send a welcome email with a link for the lecturer to set up their password.</div>
                  </div>
                </label>
              </div>

              <div className="pt-4 flex gap-3">
                <button type="button" onClick={() => setShowAddLecturerModal(false)} className="flex-1 py-2.5 rounded-xl text-sm font-medium border border-[hsl(var(--border))] hover:bg-[hsl(var(--muted))] transition-colors">
                  Cancel
                </button>
                <button type="submit" className="flex-1 py-2.5 rounded-xl text-sm font-medium bg-[hsl(var(--primary))] text-white hover:shadow-lg transition-all">
                  Create Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Success Toast */}
      {assignmentSuccess && (
        <div className="fixed bottom-6 right-6 z-[100] animate-fade-in">
          <div className="px-5 py-3 rounded-xl bg-[hsl(var(--card))] border border-[hsl(var(--border))] shadow-lg flex items-center gap-2 text-sm font-medium text-[hsl(var(--success))]">
            <CheckCircle className="h-4 w-4" />
            Lecturer assigned successfully!
          </div>
        </div>
      )}

      {addLecturerSuccess && (
        <div className="fixed bottom-6 right-6 z-[100] animate-fade-in">
          <div className="px-5 py-3 rounded-xl bg-[hsl(var(--card))] border border-[hsl(var(--border))] shadow-lg flex items-center gap-2 text-sm font-medium text-[hsl(var(--success))]">
            <CheckCircle className="h-4 w-4" />
            Lecturer account created. Invitation email sent!
          </div>
        </div>
      )}
    </>
  );
}
