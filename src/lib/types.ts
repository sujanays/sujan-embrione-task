export type MemberStatus = "pending" | "approved" | "rejected";

export type Domain =
  | "Web Development"
  | "Design"
  | "Logistics"
  | "Operations"
  | "Sponsorship"
  | "Hospitality"
  | "Social Media"
  | "Event Management";

export type Position = "Head" | "Vice-Head" | "Core Member" | "Member";

export type Branch =
  | "CSE"
  | "AIML"
  | "ECE"
  | "EEE"
  | "ME"
  | "Biotech"
  | "Other";

export interface Member {
  id: string;
  full_name: string;
  domain: Domain;
  position: Position;
  srn: string;
  email: string;
  linkedin_url?: string | null;
  github_url?: string | null;
  branch: Branch;
  semester: number;
  bio: string;
  avatar_url?: string | null;
  status: MemberStatus;
  created_at: string;
}

export const DOMAINS: Domain[] = [
  "Web Development",
  "Design",
  "Logistics",
  "Operations",
  "Sponsorship",
  "Hospitality",
  "Social Media",
  "Event Management",
];

export const POSITIONS: Position[] = [
  "Head",
  "Vice-Head",
  "Core Member",
  "Member",
];

export const BRANCHES: Branch[] = [
  "CSE",
  "AIML",
  "ECE",
  "EEE",
  "ME",
  "Biotech",
  "Other",
];
