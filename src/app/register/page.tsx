"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import confetti from "canvas-confetti";
import { motion, AnimatePresence } from "framer-motion";
import { MemberCard } from "@/components/ui/member-card";
import {
  DOMAINS,
  POSITIONS,
  BRANCHES,
  Domain,
  Position,
  Branch,
  Member,
} from "@/lib/types";
import { toWebP, validateImageFile } from "@/lib/image-utils";
import { submitMemberRegistration, uploadAvatarFile } from "@/lib/supabase";
import {
  User,
  Mail,
  ChevronDown,
  ChevronUp,
  Loader2,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  UploadCloud,
  FileCheck,
} from "lucide-react";
import { LinkedInIcon, GitHubIcon } from "@/components/ui/icons";

const registrationSchema = z.object({
  full_name: z
    .string()
    .min(2, "Full name must be at least 2 characters")
    .max(60, "Name is too long"),
  domain: z.string().min(1, "Domain selection is required"),
  position: z.string().min(1, "Position selection is required"),
  srn: z
    .string()
    .toUpperCase()
    .regex(
      /^PES[12][A-Z]{2}\d{2}[A-Z]{2,3}\d{3}$/,
      "Must be a valid PES SRN (e.g. PES1UG23CS001)"
    ),
  email: z.string().email("Enter a valid PES or personal email"),
  linkedin_url: z
    .string()
    .optional()
    .refine((val) => !val || val.startsWith("https://"), {
      message: "LinkedIn URL must start with https://",
    }),
  github_url: z
    .string()
    .optional()
    .refine((val) => !val || val.startsWith("https://"), {
      message: "GitHub URL must start with https://",
    }),
  branch: z.string().min(1, "Branch is required"),
  semester: z.number().min(1, "Semester 1-8").max(8, "Semester 1-8"),
  bio: z
    .string()
    .min(150, "Bio must be at least 150 characters")
    .max(200, "Bio cannot exceed 200 characters"),
});

type FormData = z.infer<typeof registrationSchema>;

export default function RegisterPage() {
  const [avatarBlob, setAvatarBlob] = useState<Blob | null>(null);
  const [avatarPreviewUrl, setAvatarPreviewUrl] = useState<string>("");
  const [avatarFileName, setAvatarFileName] = useState<string>("");
  const [isConvertingImage, setIsConvertingImage] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmittedSuccess, setIsSubmittedSuccess] = useState(false);
  const [mobilePreviewExpanded, setMobilePreviewExpanded] = useState(true);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<FormData>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      full_name: "",
      domain: "Web Development",
      position: "Member",
      srn: "",
      email: "",
      linkedin_url: "",
      github_url: "",
      branch: "CSE",
      semester: 3,
      bio: "",
    },
    mode: "onChange",
  });

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = form;

  // Live watched values for preview card
  const watchedValues = watch();
  const bioValue = watchedValues.bio || "";
  const bioLength = bioValue.length;
  const isBioValid = bioLength >= 150 && bioLength <= 200;

  const previewMemberData: Partial<Member> = {
    full_name: watchedValues.full_name,
    domain: watchedValues.domain as Domain,
    position: watchedValues.position as Position,
    srn: watchedValues.srn,
    branch: watchedValues.branch as Branch,
    semester: Number(watchedValues.semester) || 1,
    bio: watchedValues.bio,
    avatar_url: avatarPreviewUrl,
    linkedin_url: watchedValues.linkedin_url,
    github_url: watchedValues.github_url,
    status: "pending",
  };

  // Image handling & WebP conversion
  const handlePhotoSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validation = validateImageFile(file);
    if (!validation.valid) {
      toast.error(validation.error || "Invalid image file");
      return;
    }

    try {
      setIsConvertingImage(true);
      const convertedBlob = await toWebP(file, 800, 0.85);
      setAvatarBlob(convertedBlob);
      setAvatarFileName(file.name.replace(/\.[^/.]+$/, "") + ".webp");

      if (avatarPreviewUrl) {
        URL.revokeObjectURL(avatarPreviewUrl);
      }
      const newUrl = URL.createObjectURL(convertedBlob);
      setAvatarPreviewUrl(newUrl);

      toast.success("Photo optimized to WebP and ready for preview!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to convert image to WebP format");
    } finally {
      setIsConvertingImage(false);
    }
  };

  const onSubmit = async (values: FormData) => {
    try {
      setIsSubmitting(true);
      let uploadedAvatarUrl: string | null = null;

      if (avatarBlob) {
        uploadedAvatarUrl = await uploadAvatarFile(avatarBlob);
      }

      const res = await submitMemberRegistration({
        full_name: values.full_name.trim(),
        domain: values.domain as Domain,
        position: values.position as Position,
        srn: values.srn.trim().toUpperCase(),
        email: values.email.trim(),
        linkedin_url: values.linkedin_url ? values.linkedin_url.trim() : null,
        github_url: values.github_url ? values.github_url.trim() : null,
        branch: values.branch as Branch,
        semester: Number(values.semester),
        bio: values.bio.trim(),
        avatar_url: uploadedAvatarUrl,
      });

      if (!res.success) {
        throw new Error(res.error || "Submission failed");
      }

      setIsSubmittedSuccess(true);
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#8b5cf6", "#22d3ee", "#10b981"],
      });

      toast.success("Thanks! Your profile is submitted and awaiting admin approval.", {
        duration: 5000,
      });

      reset();
      setAvatarBlob(null);
      setAvatarPreviewUrl("");
      setAvatarFileName("");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error submitting registration";
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
      {/* Title Header */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-950/50 border border-violet-500/20 text-violet-300 text-xs font-medium mb-3">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>Spring 2026 Recruitment</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Join the Embrione Roster
        </h1>
        <p className="text-zinc-400 text-sm sm:text-base mt-2 max-w-2xl">
          Submit your profile for moderation. Watch your live official Embrione member card
          render in real-time as you enter your details.
        </p>
      </div>

      {/* Success State */}
      <AnimatePresence>
        {isSubmittedSuccess && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="mb-8 p-6 sm:p-8 rounded-2xl bg-emerald-950/30 border border-emerald-500/30 flex flex-col sm:flex-row items-center justify-between gap-4"
          >
            <div className="flex items-center gap-4 text-center sm:text-left">
              <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-6 h-6 text-emerald-400" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Application Received!</h3>
                <p className="text-sm text-emerald-300/80 mt-0.5">
                  Your profile is pending admin approval. You can view approved members in the team directory.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setIsSubmittedSuccess(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-zinc-300 hover:text-white bg-white/5 border border-white/10"
              >
                Submit Another
              </button>
              <Link
                href="/team"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-emerald-500 text-black hover:bg-emerald-400 transition-colors"
              >
                <span>View Team</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Sticky Mini-Bar Preview Toggle */}
      <div className="block lg:hidden mb-6 sticky top-20 z-40">
        <button
          type="button"
          onClick={() => setMobilePreviewExpanded(!mobilePreviewExpanded)}
          className="w-full flex items-center justify-between px-4 py-3 rounded-2xl bg-[#141419]/90 backdrop-blur-xl border border-white/15 shadow-xl text-sm font-semibold text-white"
        >
          <span className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            Live Card Preview {mobilePreviewExpanded ? "(Tap to collapse)" : "(Tap to expand)"}
          </span>
          {mobilePreviewExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        <AnimatePresence>
          {mobilePreviewExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-3 overflow-hidden"
            >
              <MemberCard member={previewMemberData} isPreview={true} showStatus={true} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Split Screen Layout (Desktop: Form Left, Sticky Preview Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Left Column: Form */}
        <div className="lg:col-span-7 bg-[#111115] border border-white/8 rounded-2xl p-6 sm:p-8 shadow-xl">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Full Name */}
            <div>
              <label className="block text-xs uppercase font-semibold tracking-wider text-zinc-300 mb-2">
                Full Name <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="e.g. Aarav Sharma"
                  {...register("full_name")}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#181820] border border-white/10 text-white placeholder-zinc-500 focus:outline-none focus:border-cyan-400 transition-colors text-sm"
                />
                <User className="absolute right-3.5 top-3 w-4 h-4 text-zinc-500 pointer-events-none" />
              </div>
              {errors.full_name && (
                <p className="text-xs text-rose-400 mt-1.5">{errors.full_name.message}</p>
              )}
            </div>

            {/* Domain & Position Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs uppercase font-semibold tracking-wider text-zinc-300 mb-2">
                  Domain <span className="text-rose-400">*</span>
                </label>
                <select
                  {...register("domain")}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#181820] border border-white/10 text-white focus:outline-none focus:border-cyan-400 transition-colors text-sm"
                >
                  {DOMAINS.map((d) => (
                    <option key={d} value={d} className="bg-[#181820] text-white">
                      {d}
                    </option>
                  ))}
                </select>
                {errors.domain && (
                  <p className="text-xs text-rose-400 mt-1.5">{errors.domain.message}</p>
                )}
              </div>

              <div>
                <label className="block text-xs uppercase font-semibold tracking-wider text-zinc-300 mb-2">
                  Position <span className="text-rose-400">*</span>
                </label>
                <select
                  {...register("position")}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#181820] border border-white/10 text-white focus:outline-none focus:border-cyan-400 transition-colors text-sm"
                >
                  {POSITIONS.map((p) => (
                    <option key={p} value={p} className="bg-[#181820] text-white">
                      {p}
                    </option>
                  ))}
                </select>
                {errors.position && (
                  <p className="text-xs text-rose-400 mt-1.5">{errors.position.message}</p>
                )}
              </div>
            </div>

            {/* SRN & Email Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs uppercase font-semibold tracking-wider text-zinc-300 mb-2">
                  SRN <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  placeholder="PES1UG23CS001"
                  {...register("srn")}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#181820] border border-white/10 text-white uppercase placeholder-zinc-500 focus:outline-none focus:border-cyan-400 transition-colors text-sm font-mono"
                />
                {errors.srn && (
                  <p className="text-xs text-rose-400 mt-1.5">{errors.srn.message}</p>
                )}
              </div>

              <div>
                <label className="block text-xs uppercase font-semibold tracking-wider text-zinc-300 mb-2">
                  Email <span className="text-rose-400">*</span>
                </label>
                <div className="relative">
                  <input
                    type="email"
                    placeholder="student@embrione.pes.edu"
                    {...register("email")}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#181820] border border-white/10 text-white placeholder-zinc-500 focus:outline-none focus:border-cyan-400 transition-colors text-sm"
                  />
                  <Mail className="absolute right-3.5 top-3 w-4 h-4 text-zinc-500 pointer-events-none" />
                </div>
                {errors.email && (
                  <p className="text-xs text-rose-400 mt-1.5">{errors.email.message}</p>
                )}
              </div>
            </div>

            {/* Branch & Semester Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs uppercase font-semibold tracking-wider text-zinc-300 mb-2">
                  Branch <span className="text-rose-400">*</span>
                </label>
                <select
                  {...register("branch")}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#181820] border border-white/10 text-white focus:outline-none focus:border-cyan-400 transition-colors text-sm"
                >
                  {BRANCHES.map((b) => (
                    <option key={b} value={b} className="bg-[#181820] text-white">
                      {b}
                    </option>
                  ))}
                </select>
                {errors.branch && (
                  <p className="text-xs text-rose-400 mt-1.5">{errors.branch.message}</p>
                )}
              </div>

              <div>
                <label className="block text-xs uppercase font-semibold tracking-wider text-zinc-300 mb-2">
                  Semester (1–8) <span className="text-rose-400">*</span>
                </label>
                <select
                  {...register("semester", { valueAsNumber: true })}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#181820] border border-white/10 text-white focus:outline-none focus:border-cyan-400 transition-colors text-sm"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                    <option key={s} value={s} className="bg-[#181820] text-white">
                      Semester {s}
                    </option>
                  ))}
                </select>
                {errors.semester && (
                  <p className="text-xs text-rose-400 mt-1.5">{errors.semester.message}</p>
                )}
              </div>
            </div>

            {/* Social Links Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs uppercase font-semibold tracking-wider text-zinc-300 mb-2">
                  LinkedIn URL <span className="text-zinc-500 font-normal">(optional)</span>
                </label>
                <div className="relative">
                  <input
                    type="url"
                    placeholder="https://linkedin.com/in/username"
                    {...register("linkedin_url")}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#181820] border border-white/10 text-white placeholder-zinc-500 focus:outline-none focus:border-cyan-400 transition-colors text-sm"
                  />
                  <LinkedInIcon className="absolute right-3.5 top-3 w-4 h-4 text-zinc-500 pointer-events-none" />
                </div>
                {errors.linkedin_url && (
                  <p className="text-xs text-rose-400 mt-1.5">{errors.linkedin_url.message}</p>
                )}
              </div>

              <div>
                <label className="block text-xs uppercase font-semibold tracking-wider text-zinc-300 mb-2">
                  GitHub URL <span className="text-zinc-500 font-normal">(optional)</span>
                </label>
                <div className="relative">
                  <input
                    type="url"
                    placeholder="https://github.com/username"
                    {...register("github_url")}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#181820] border border-white/10 text-white placeholder-zinc-500 focus:outline-none focus:border-cyan-400 transition-colors text-sm"
                  />
                  <GitHubIcon className="absolute right-3.5 top-3 w-4 h-4 text-zinc-500 pointer-events-none" />
                </div>
                {errors.github_url && (
                  <p className="text-xs text-rose-400 mt-1.5">{errors.github_url.message}</p>
                )}
              </div>
            </div>

            {/* Bio Field with Live Character Counter */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs uppercase font-semibold tracking-wider text-zinc-300">
                  Bio <span className="text-rose-400">*</span>
                </label>
                <span
                  className={`text-xs font-mono font-medium px-2 py-0.5 rounded ${
                    isBioValid
                      ? "text-emerald-400 bg-emerald-950/40 border border-emerald-500/30"
                      : "text-rose-400 bg-rose-950/40 border border-rose-500/30"
                  }`}
                >
                  {bioLength}/200 characters (150–200 required)
                </span>
              </div>
              <textarea
                rows={3}
                placeholder="Write a concise overview of your technical interests, projects, or passions (must be between 150 and 200 characters)..."
                {...register("bio")}
                className={`w-full px-4 py-3 rounded-xl bg-[#181820] border text-white placeholder-zinc-500 focus:outline-none transition-colors text-sm leading-relaxed ${
                  bioLength > 0 && !isBioValid
                    ? "border-rose-500/60 focus:border-rose-400"
                    : "border-white/10 focus:border-cyan-400"
                }`}
              />
              {errors.bio && (
                <p className="text-xs text-rose-400 mt-1.5">{errors.bio.message}</p>
              )}
            </div>

            {/* Profile Picture Upload & WebP Conversion */}
            <div>
              <label className="block text-xs uppercase font-semibold tracking-wider text-zinc-300 mb-2">
                Profile Picture <span className="text-zinc-500 font-normal">(.png, .jpg, max 5MB)</span>
              </label>

              <div
                onClick={() => fileInputRef.current?.click()}
                className="cursor-pointer border-2 border-dashed border-white/10 hover:border-violet-500/50 rounded-2xl p-4 sm:p-5 text-center bg-[#181820]/60 hover:bg-[#181820] transition-colors"
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/png, image/jpeg, image/jpg, image/webp"
                  className="hidden"
                  onChange={handlePhotoSelect}
                />

                <div className="flex flex-col items-center justify-center gap-2">
                  {isConvertingImage ? (
                    <div className="flex items-center gap-2 text-cyan-400 py-2">
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span className="text-xs font-medium">Optimizing image to WebP...</span>
                    </div>
                  ) : avatarFileName ? (
                    <div className="flex items-center gap-2 text-emerald-400 py-1">
                      <FileCheck className="w-5 h-5 text-emerald-400" />
                      <span className="text-xs font-medium">{avatarFileName} (Ready)</span>
                      <span className="text-[11px] text-zinc-400">· Click to change</span>
                    </div>
                  ) : (
                    <>
                      <div className="w-10 h-10 rounded-xl bg-violet-950/50 border border-violet-500/20 flex items-center justify-center text-violet-300">
                        <UploadCloud className="w-5 h-5" />
                      </div>
                      <p className="text-xs text-zinc-300 font-medium">
                        Click or drag image to upload avatar
                      </p>
                      <p className="text-[11px] text-zinc-500">
                        Automatically compressed and converted to WebP on device
                      </p>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting || isConvertingImage}
              className="w-full py-3.5 px-6 rounded-xl font-bold text-sm tracking-wide bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-500 hover:opacity-95 text-white shadow-lg shadow-violet-950/40 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Submitting to Embrione Moderation...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-cyan-200" />
                  <span>Submit Profile for Review</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right Column: Sticky Live Card Preview (Desktop) */}
        <div className="hidden lg:block lg:col-span-5 sticky top-24 space-y-4">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs uppercase font-bold tracking-wider text-zinc-400 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              Live Interactive Card Preview
            </span>
            <span className="text-[11px] text-zinc-500 font-medium">Syncs on keystroke</span>
          </div>

          <MemberCard member={previewMemberData} isPreview={true} showStatus={true} />

          <div className="p-4 rounded-xl bg-[#141419] border border-white/5 text-xs text-zinc-400 space-y-1.5">
            <p className="font-semibold text-zinc-300">Preview Tips:</p>
            <p>• Your avatar is converted to high-performance WebP before uploading.</p>
            <p>• Bio length must stay strictly between 150 and 200 characters.</p>
            <p>• Once approved by an admin, this card appears in &quot;Meet The Team&quot;.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
