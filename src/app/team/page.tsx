"use client";

import React, { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { MemberCard } from "@/components/ui/member-card";
import { Member, DOMAINS, POSITIONS } from "@/lib/types";
import { getApprovedMembers } from "@/lib/supabase";
import { Users, Search, Filter, X, UserCheck } from "lucide-react";

export default function TeamPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter states
  const [selectedDomain, setSelectedDomain] = useState<string>("All");
  const [selectedPosition, setSelectedPosition] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");

  useEffect(() => {
    async function loadTeam() {
      try {
        setLoading(true);
        const data = await getApprovedMembers();
        setMembers(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadTeam();
  }, []);

  const filteredMembers = useMemo(() => {
    return members.filter((m) => {
      const matchDomain = selectedDomain === "All" || m.domain === selectedDomain;
      const matchPosition = selectedPosition === "All" || m.position === selectedPosition;
      const matchSearch =
        searchQuery === "" ||
        m.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.srn.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.domain.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.bio.toLowerCase().includes(searchQuery.toLowerCase());

      return matchDomain && matchPosition && matchSearch;
    });
  }, [members, selectedDomain, selectedPosition, searchQuery]);

  const hasActiveFilters =
    selectedDomain !== "All" || selectedPosition !== "All" || searchQuery.trim() !== "";

  const clearFilters = () => {
    setSelectedDomain("All");
    setSelectedPosition("All");
    setSearchQuery("");
  };

  // Motion variants for staggered grid
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 16 },
    show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] as const } },
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
      {/* Header Section */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/50 border border-cyan-500/20 text-cyan-300 text-xs font-medium mb-3">
          <UserCheck className="w-3.5 h-3.5 text-cyan-400" />
          <span>Verified Student Leaders</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          Meet The Team
        </h1>
        <p className="text-zinc-400 text-sm sm:text-base mt-3 leading-relaxed">
          The talented students driving innovation, technical workshops, design systems, and
          creative operations at Embrione, PES University.
        </p>
      </div>

      {/* Filter Bar Controls */}
      <div className="bg-[#111116] border border-white/8 rounded-2xl p-4 sm:p-6 mb-8 space-y-4 shadow-lg">
        {/* Search & Position Select Row */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, SRN, skills, or domain..."
              className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-[#181820] border border-white/10 text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-cyan-400 transition-colors"
            />
            <Search className="absolute left-3 top-3 w-4 h-4 text-zinc-500" />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-3 text-zinc-500 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Position Selector */}
          <div className="w-full sm:w-56">
            <select
              value={selectedPosition}
              onChange={(e) => setSelectedPosition(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#181820] border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-400 transition-colors"
            >
              <option value="All">All Positions</option>
              {POSITIONS.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Domain Filter Chips */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs uppercase font-semibold tracking-wider text-zinc-400 flex items-center gap-1.5">
              <Filter className="w-3.5 h-3.5 text-cyan-400" />
              Domain Filter
            </span>
            {hasActiveFilters && (
              <button
                type="button"
                onClick={clearFilters}
                className="text-xs text-violet-400 hover:text-violet-300 font-medium flex items-center gap-1"
              >
                <X className="w-3 h-3" />
                Clear all filters
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setSelectedDomain("All")}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                selectedDomain === "All"
                  ? "bg-gradient-to-r from-violet-600 to-cyan-500 text-white shadow-md shadow-violet-900/30"
                  : "bg-[#181820] text-zinc-400 hover:text-white border border-white/5 hover:border-white/15"
              }`}
            >
              All Domains
            </button>
            {DOMAINS.map((domain) => (
              <button
                key={domain}
                type="button"
                onClick={() => setSelectedDomain(domain)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  selectedDomain === domain
                    ? "bg-violet-600 text-white shadow-md shadow-violet-900/30"
                    : "bg-[#181820] text-zinc-400 hover:text-white border border-white/5 hover:border-white/15"
                }`}
              >
                {domain}
              </button>
            ))}
          </div>
        </div>

        {/* Result Counter Header */}
        <div className="flex items-center justify-between text-xs text-zinc-400 pt-2 border-t border-white/5">
          <span>
            Showing <strong className="text-white">{filteredMembers.length}</strong> approved member
            {filteredMembers.length === 1 ? "" : "s"}
          </span>
          {hasActiveFilters && (
            <span className="text-cyan-400">Filtered view active</span>
          )}
        </div>
      </div>

      {/* Skeletons Loading State */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="rounded-2xl bg-[#141419] border border-white/5 p-6 animate-pulse space-y-4"
            >
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-zinc-800" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-zinc-800 rounded-md w-3/4" />
                  <div className="h-3 bg-zinc-800 rounded-md w-1/2" />
                </div>
              </div>
              <div className="h-3 bg-zinc-800 rounded-md w-full" />
              <div className="h-3 bg-zinc-800 rounded-md w-5/6" />
              <div className="h-3 bg-zinc-800 rounded-md w-2/3" />
            </div>
          ))}
        </div>
      ) : filteredMembers.length === 0 ? (
        /* Empty State */
        <div className="py-20 text-center rounded-2xl bg-[#111116] border border-white/5 p-8 max-w-md mx-auto">
          <div className="w-14 h-14 rounded-2xl bg-zinc-900 border border-white/10 flex items-center justify-center mx-auto mb-4 text-zinc-500">
            <Users className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-bold text-white">No members match these filters</h3>
          <p className="text-xs text-zinc-400 mt-1.5 leading-relaxed">
            Try adjusting your search query, domain filters, or position selection to see more
            members.
          </p>
          <button
            type="button"
            onClick={clearFilters}
            className="mt-5 px-4 py-2 rounded-xl text-xs font-semibold bg-violet-600 hover:bg-violet-500 text-white transition-colors"
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        /* Staggered Responsive Grid (1 / 2 / 3 / 4 cols) */
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          {filteredMembers.map((member) => (
            <motion.div key={member.id} variants={itemVariants}>
              <MemberCard member={member} isPreview={false} showStatus={false} />
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}
