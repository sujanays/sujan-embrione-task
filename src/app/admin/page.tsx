"use client";

import React, { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { Member, MemberStatus } from "@/lib/types";
import {
  getAllMembers,
  updateMemberStatus,
  deleteMember,
  authenticateAdmin,
  checkAdminSession,
  logOutAdmin,
  isUsingMock,
} from "@/lib/supabase";
import { StatusBadge } from "@/components/ui/status-badge";
import { StatCard } from "@/components/ui/stat-card";
import {
  Shield,
  Lock,
  Mail,
  LogOut,
  Check,
  X,
  Trash2,
  AlertTriangle,
  Loader2,
  Clock,
  CheckCircle2,
  XCircle,
  Users,
  Search,
  ExternalLink,
  GraduationCap,
  Sparkles,
} from "lucide-react";

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [authLoading, setAuthLoading] = useState<boolean>(true);

  // Login form state
  const [emailInput, setEmailInput] = useState<string>("admin@embrione.pes.edu");
  const [passwordInput, setPasswordInput] = useState<string>("EmbrioneAdmin@2026");
  const [loginSubmitting, setLoginSubmitting] = useState<boolean>(false);
  const [loginError, setLoginError] = useState<string>("");

  // Dashboard state
  const [members, setMembers] = useState<Member[]>([]);
  const [loadingMembers, setLoadingMembers] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<"pending" | "approved" | "rejected" | "all">("pending");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Delete modal state
  const [memberToDelete, setMemberToDelete] = useState<Member | null>(null);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  useEffect(() => {
    const hasSession = checkAdminSession();
    setIsAuthenticated(hasSession);
    setAuthLoading(false);

    if (hasSession) {
      loadMembers();
    }
  }, []);

  const loadMembers = async () => {
    try {
      setLoadingMembers(true);
      const data = await getAllMembers();
      setMembers(data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load members roster");
    } finally {
      setLoadingMembers(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    setLoginSubmitting(true);

    try {
      const res = await authenticateAdmin(emailInput.trim(), passwordInput);
      if (!res.success) {
        setLoginError(res.error || "Authentication failed. Check email or password.");
        toast.error("Invalid credentials or authorization failed.");
      } else {
        setIsAuthenticated(true);
        toast.success("Welcome, Embrione Administrator!");
        loadMembers();
      }
    } catch (err) {
      setLoginError("Login error. Please try again.");
    } finally {
      setLoginSubmitting(false);
    }
  };

  const handleLogout = () => {
    logOutAdmin();
    setIsAuthenticated(false);
    toast.info("Logged out successfully");
  };

  const handleStatusChange = async (member: Member, newStatus: MemberStatus) => {
    setActionLoadingId(member.id);
    const prevMembers = [...members];

    // Optimistic update
    setMembers((prev) =>
      prev.map((m) => (m.id === member.id ? { ...m, status: newStatus } : m))
    );

    try {
      await updateMemberStatus(member.id, newStatus);
      toast.success(
        newStatus === "approved"
          ? `Approved ${member.full_name}`
          : `Rejected ${member.full_name}`
      );
    } catch (err) {
      setMembers(prevMembers);
      toast.error("Status update failed. Reverting changes.");
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleConfirmDelete = async () => {
    if (!memberToDelete) return;
    const targetId = memberToDelete.id;
    setActionLoadingId(targetId);

    const prevMembers = [...members];
    // Optimistic update
    setMembers((prev) => prev.filter((m) => m.id !== targetId));

    try {
      await deleteMember(targetId);
      toast.success(`Deleted ${memberToDelete.full_name}`);
      setMemberToDelete(null);
    } catch (err) {
      setMembers(prevMembers);
      toast.error("Failed to delete member");
    } finally {
      setActionLoadingId(null);
    }
  };

  // Metrics counts
  const counts = useMemo(() => {
    const pending = members.filter((m) => m.status === "pending").length;
    const approved = members.filter((m) => m.status === "approved").length;
    const rejected = members.filter((m) => m.status === "rejected").length;
    return { pending, approved, rejected, total: members.length };
  }, [members]);

  // Filtered members list
  const filteredMembers = useMemo(() => {
    return members.filter((m) => {
      const matchesTab = activeTab === "all" || m.status === activeTab;
      const matchesSearch =
        searchQuery === "" ||
        m.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.srn.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.domain.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.email.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesTab && matchesSearch;
    });
  }, [members, activeTab, searchQuery]);

  if (authLoading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-violet-400" />
      </div>
    );
  }

  // Login View
  if (!isAuthenticated) {
    return (
      <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center px-4 py-12">
        <div className="relative w-full max-w-md">
          {/* Ambient Glow */}
          <div className="absolute -inset-1 bg-gradient-to-r from-violet-600 to-cyan-500 rounded-3xl blur-xl opacity-20" />

          <div className="relative bg-[#111116] border border-white/10 rounded-2xl p-8 shadow-2xl">
            <div className="flex flex-col items-center text-center mb-6">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-violet-600 to-cyan-500 p-0.5 mb-4 shadow-lg shadow-violet-500/20">
                <div className="w-full h-full bg-[#0d0d12] rounded-[14px] flex items-center justify-center">
                  <Shield className="w-7 h-7 text-cyan-300" />
                </div>
              </div>
              <h1 className="text-2xl font-bold text-white tracking-tight">Admin Moderation</h1>
              <p className="text-xs text-zinc-400 mt-1 max-w-xs">
                Restricted portal for Embrione club leads. Review registration submissions and manage team roster.
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs uppercase font-semibold tracking-wider text-zinc-400 mb-2">
                  Admin Email
                </label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    placeholder="admin@embrione.pes.edu"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#181820] border border-white/10 text-white placeholder-zinc-500 focus:outline-none focus:border-cyan-400 text-sm"
                  />
                  <Mail className="absolute right-3.5 top-3 w-4 h-4 text-zinc-500 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase font-semibold tracking-wider text-zinc-400 mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    type="password"
                    required
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#181820] border border-white/10 text-white placeholder-zinc-500 focus:outline-none focus:border-cyan-400 text-sm"
                  />
                  <Lock className="absolute right-3.5 top-3 w-4 h-4 text-zinc-500 pointer-events-none" />
                </div>
              </div>

              {loginError && (
                <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-500/30 text-rose-300 text-xs">
                  {loginError}
                </div>
              )}

              <button
                type="submit"
                disabled={loginSubmitting}
                className="w-full py-3 rounded-xl font-bold text-sm bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-500 hover:opacity-95 text-white shadow-lg shadow-violet-950/40 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {loginSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Verifying Credentials...</span>
                  </>
                ) : (
                  <span>Sign In as Admin</span>
                )}
              </button>
            </form>

            {/* Quick Helper Credentials Note */}
            <div className="mt-6 pt-5 border-t border-white/5 text-center text-xs text-zinc-400 space-y-1">
              <p className="text-zinc-300 font-medium">Default Credentials from Spec:</p>
              <p className="font-mono text-[11px] text-cyan-300">admin@embrione.pes.edu</p>
              <p className="font-mono text-[11px] text-zinc-300">EmbrioneAdmin@2026</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Authenticated Dashboard View
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/8">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Admin Moderation Center
            </h1>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-violet-950 text-violet-300 border border-violet-500/30">
              {isUsingMock ? "DEMO STORE" : "SUPABASE LIVE"}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Review pending registrations, approve candidates for the team directory, or purge entries.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={loadMembers}
            disabled={loadingMembers}
            className="px-3.5 py-2 rounded-xl text-xs font-medium text-zinc-300 hover:text-white bg-[#141419] border border-white/10 hover:border-white/20 transition-colors flex items-center gap-2"
          >
            <Clock className={`w-3.5 h-3.5 ${loadingMembers ? "animate-spin" : ""}`} />
            <span>Refresh</span>
          </button>
          <button
            type="button"
            onClick={handleLogout}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold text-rose-300 hover:text-white bg-rose-950/40 hover:bg-rose-900/50 border border-rose-500/30 transition-colors flex items-center gap-1.5"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Metrics Counter Cards (Section 4.2) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 my-6">
        <StatCard
          title="Pending Review"
          value={counts.pending}
          icon={Clock}
          variant="pending"
          description="Awaiting action"
          active={activeTab === "pending"}
          onClick={() => setActiveTab("pending")}
        />
        <StatCard
          title="Approved"
          value={counts.approved}
          icon={CheckCircle2}
          variant="approved"
          description="Live on /team"
          active={activeTab === "approved"}
          onClick={() => setActiveTab("approved")}
        />
        <StatCard
          title="Rejected"
          value={counts.rejected}
          icon={XCircle}
          variant="rejected"
          description="Hidden"
          active={activeTab === "rejected"}
          onClick={() => setActiveTab("rejected")}
        />
        <StatCard
          title="Total Profiles"
          value={counts.total}
          icon={Users}
          variant="total"
          description="All submissions"
          active={activeTab === "all"}
          onClick={() => setActiveTab("all")}
        />
      </div>

      {/* Filter Tabs & Search Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
        {/* Status Tabs */}
        <div className="flex items-center p-1 bg-[#141419] border border-white/10 rounded-xl w-full sm:w-auto">
          {(["pending", "approved", "rejected", "all"] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`flex-1 sm:flex-initial px-4 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
                activeTab === tab
                  ? "bg-violet-600 text-white shadow-md shadow-violet-900/30"
                  : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              {tab} ({tab === "all" ? counts.total : counts[tab]})
            </button>
          ))}
        </div>

        {/* Search input */}
        <div className="relative w-full sm:w-72">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, SRN, domain..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#141419] border border-white/10 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-cyan-400 transition-colors"
          />
          <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-zinc-500" />
        </div>
      </div>

      {/* Members Grid / Moderation List */}
      {loadingMembers ? (
        <div className="py-20 flex flex-col items-center justify-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-violet-400" />
          <span className="text-xs text-zinc-400">Loading registrations...</span>
        </div>
      ) : filteredMembers.length === 0 ? (
        <div className="py-16 text-center rounded-2xl bg-[#121217] border border-white/5 p-8">
          <Users className="w-10 h-10 text-zinc-600 mx-auto mb-3" />
          <h3 className="text-sm font-semibold text-zinc-300">No members found</h3>
          <p className="text-xs text-zinc-500 mt-1 max-w-sm mx-auto">
            {searchQuery
              ? `No profiles matched "${searchQuery}". Try clearing search.`
              : `No profiles with status "${activeTab}".`}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredMembers.map((member) => (
            <div
              key={member.id}
              className="bg-[#121217] border border-white/8 hover:border-white/15 rounded-2xl p-5 flex flex-col justify-between gap-4 transition-all"
            >
              <div>
                {/* Header row: Avatar + Identity */}
                <div className="flex items-start gap-3.5 mb-3">
                  <div className="relative w-12 h-12 rounded-full overflow-hidden border border-white/10 bg-zinc-900 shrink-0">
                    {member.avatar_url ? (
                      <Image
                        src={member.avatar_url}
                        alt={member.full_name}
                        fill
                        sizes="48px"
                        className="object-cover"
                        unoptimized={member.avatar_url.startsWith("data:")}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-violet-950 text-white font-bold text-sm">
                        {member.full_name.charAt(0)}
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="font-semibold text-white text-base truncate">
                        {member.full_name}
                      </h3>
                      <StatusBadge status={member.status} showIcon={false} />
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-zinc-400 mt-0.5 font-mono">
                      <span>{member.srn}</span>
                      <span>·</span>
                      <span className="text-cyan-300">{member.domain}</span>
                    </div>
                  </div>
                </div>

                {/* Sub-info: Branch, Sem, Position, Email */}
                <div className="space-y-1.5 text-xs text-zinc-300 pt-2 border-t border-white/5">
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-500">Position</span>
                    <span className="font-medium text-zinc-200">{member.position}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-500">Academic</span>
                    <span>
                      {member.branch} · Sem {member.semester}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-500">Email</span>
                    <span className="text-zinc-400 font-mono text-[11px] truncate max-w-[170px]">
                      {member.email}
                    </span>
                  </div>
                </div>

                {/* Bio snippet */}
                <div className="mt-3 p-3 rounded-xl bg-[#171720] border border-white/5">
                  <p className="text-xs text-zinc-300 leading-relaxed line-clamp-3">
                    {member.bio}
                  </p>
                  <span className="text-[10px] text-zinc-500 mt-1 block">
                    {member.bio.length} characters
                  </span>
                </div>
              </div>

              {/* Action Buttons Row */}
              <div className="pt-3 border-t border-white/5 flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5">
                  {member.status !== "approved" && (
                    <button
                      type="button"
                      disabled={actionLoadingId === member.id}
                      onClick={() => handleStatusChange(member, "approved")}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-950/60 hover:bg-emerald-900/80 text-emerald-300 border border-emerald-500/30 flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Approve</span>
                    </button>
                  )}

                  {member.status !== "rejected" && (
                    <button
                      type="button"
                      disabled={actionLoadingId === member.id}
                      onClick={() => handleStatusChange(member, "rejected")}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 border border-rose-500/30 flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                      <span>Reject</span>
                    </button>
                  )}
                </div>

                <button
                  type="button"
                  disabled={actionLoadingId === member.id}
                  onClick={() => setMemberToDelete(member)}
                  className="p-2 rounded-lg text-zinc-500 hover:text-rose-400 hover:bg-rose-950/30 transition-colors"
                  title="Delete registration"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal Dialog */}
      <AnimatePresence>
        {memberToDelete && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md p-6 rounded-2xl bg-[#141419] border border-white/10 shadow-2xl space-y-4"
            >
              <div className="flex items-center gap-3 text-rose-400">
                <div className="p-2.5 rounded-xl bg-rose-950/50 border border-rose-500/30">
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-base">Delete Registration</h3>
                  <p className="text-xs text-zinc-400">This action cannot be undone.</p>
                </div>
              </div>

              <p className="text-xs text-zinc-300 leading-relaxed">
                Are you sure you want to permanently delete the registration record for{" "}
                <span className="font-semibold text-white">{memberToDelete.full_name}</span> (
                {memberToDelete.srn})?
              </p>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setMemberToDelete(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-zinc-300 hover:text-white bg-white/5 border border-white/10"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmDelete}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-rose-600 hover:bg-rose-500 text-white transition-colors flex items-center gap-1.5"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Confirm Delete</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
