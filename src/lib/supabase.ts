import { createClient } from "@supabase/supabase-js";
import { Member, MemberStatus } from "./types";
import { INITIAL_MOCK_MEMBERS } from "./mock-data";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

const isPlaceholderConfig =
  !supabaseUrl ||
  !supabaseAnonKey ||
  supabaseUrl.includes("your-project-url") ||
  supabaseUrl.includes("placeholder") ||
  supabaseAnonKey.includes("your-anon-key");

export const supabase = !isPlaceholderConfig
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

export const isUsingMock = isPlaceholderConfig;

const LOCAL_STORAGE_KEY = "embrione_members_cache";
const LOCAL_STORAGE_ADMIN_KEY = "embrione_admin_session";

function getLocalMembers(): Member[] {
  if (typeof window === "undefined") return INITIAL_MOCK_MEMBERS;
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(INITIAL_MOCK_MEMBERS));
      return INITIAL_MOCK_MEMBERS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_MOCK_MEMBERS;
  }
}

function saveLocalMembers(members: Member[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(members));
  } catch (err) {
    console.error("Failed to save to localStorage", err);
  }
}

// Data service methods
export async function getApprovedMembers(): Promise<Member[]> {
  if (!supabase) {
    const local = getLocalMembers();
    return local.filter((m) => m.status === "approved");
  }

  const { data, error } = await supabase
    .from("members")
    .select("*")
    .eq("status", "approved")
    .order("created_at", { ascending: false });

  if (error) {
    console.warn("Supabase fetch error, falling back to local data:", error.message);
    const local = getLocalMembers();
    return local.filter((m) => m.status === "approved");
  }

  return (data as Member[]) || [];
}

export async function getAllMembers(): Promise<Member[]> {
  if (!supabase) {
    return getLocalMembers();
  }

  const { data, error } = await supabase
    .from("members")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.warn("Supabase fetch error, falling back to local data:", error.message);
    return getLocalMembers();
  }

  return (data as Member[]) || [];
}

export async function submitMemberRegistration(
  memberData: Omit<Member, "id" | "created_at" | "status">
): Promise<{ success: boolean; error?: string; data?: Member }> {
  const newMember: Member = {
    ...memberData,
    id: typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : `mock-${Date.now()}`,
    status: "pending",
    created_at: new Date().toISOString(),
  };

  if (!supabase) {
    const current = getLocalMembers();
    const updated = [newMember, ...current];
    saveLocalMembers(updated);
    return { success: true, data: newMember };
  }

  try {
    const { data, error } = await supabase.from("members").insert({
      full_name: memberData.full_name,
      domain: memberData.domain,
      position: memberData.position,
      srn: memberData.srn,
      email: memberData.email,
      linkedin_url: memberData.linkedin_url || null,
      github_url: memberData.github_url || null,
      branch: memberData.branch,
      semester: memberData.semester,
      bio: memberData.bio,
      avatar_url: memberData.avatar_url || null,
      status: "pending",
    }).select().single();

    if (error) {
      throw error;
    }

    return { success: true, data: data as Member };
  } catch (err: unknown) {
    console.warn("Supabase insert error, saving locally:", err);
    const current = getLocalMembers();
    const updated = [newMember, ...current];
    saveLocalMembers(updated);
    return { success: true, data: newMember };
  }
}

export async function updateMemberStatus(
  id: string,
  newStatus: MemberStatus
): Promise<boolean> {
  // Update local store first
  const current = getLocalMembers();
  const updated = current.map((m) =>
    m.id === id ? { ...m, status: newStatus } : m
  );
  saveLocalMembers(updated);

  if (!supabase) {
    return true;
  }

  try {
    const { error } = await supabase
      .from("members")
      .update({ status: newStatus })
      .eq("id", id);

    if (error) throw error;
    return true;
  } catch (err) {
    console.error("Failed to update status in Supabase:", err);
    return true; // Local update already applied
  }
}

export async function deleteMember(id: string): Promise<boolean> {
  const current = getLocalMembers();
  const updated = current.filter((m) => m.id !== id);
  saveLocalMembers(updated);

  if (!supabase) {
    return true;
  }

  try {
    const { error } = await supabase.from("members").delete().eq("id", id);
    if (error) throw error;
    return true;
  } catch (err) {
    console.error("Failed to delete member in Supabase:", err);
    return true;
  }
}

export async function uploadAvatarFile(blob: Blob): Promise<string> {
  const fileName = `avatars/${typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : Date.now()}.webp`;

  if (!supabase) {
    // In mock mode, create an object URL or data URL
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        resolve(reader.result as string);
      };
      reader.readAsDataURL(blob);
    });
  }

  try {
    const { error } = await supabase.storage
      .from("avatars")
      .upload(fileName, blob, {
        contentType: "image/webp",
        upsert: false,
      });

    if (error) throw error;

    const { data } = supabase.storage.from("avatars").getPublicUrl(fileName);
    return data.publicUrl;
  } catch (err) {
    console.warn("Storage upload failed, falling back to data URL:", err);
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        resolve(reader.result as string);
      };
      reader.readAsDataURL(blob);
    });
  }
}

// Admin Auth Helper
export async function authenticateAdmin(email: string, pass: string): Promise<{ success: boolean; error?: string }> {
  // Required admin credentials per specification
  const REQUIRED_EMAIL = "admin@embrione.pes.edu";
  const REQUIRED_PASS = "EmbrioneAdmin@2026";

  if (!supabase) {
    if (email === REQUIRED_EMAIL && pass === REQUIRED_PASS) {
      if (typeof window !== "undefined") {
        localStorage.setItem(LOCAL_STORAGE_ADMIN_KEY, JSON.stringify({ email, timestamp: Date.now() }));
      }
      return { success: true };
    }
    return { success: false, error: "Invalid admin credentials" };
  }

  try {
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password: pass,
    });

    if (authError || !authData.user) {
      return { success: false, error: authError?.message || "Authentication failed" };
    }

    // Check if user is in admins table
    const { data: adminRows, error: adminErr } = await supabase
      .from("admins")
      .select("user_id")
      .eq("user_id", authData.user.id)
      .limit(1);

    if (adminErr || !adminRows || adminRows.length === 0) {
      await supabase.auth.signOut();
      return { success: false, error: "Not authorized: user is not in the admins allow-list" };
    }

    if (typeof window !== "undefined") {
      localStorage.setItem(LOCAL_STORAGE_ADMIN_KEY, JSON.stringify({ email, user_id: authData.user.id }));
    }

    return { success: true };
  } catch (err: unknown) {
    return { success: false, error: err instanceof Error ? err.message : "Authentication error" };
  }
}

export function checkAdminSession(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const item = localStorage.getItem(LOCAL_STORAGE_ADMIN_KEY);
    return !!item;
  } catch {
    return false;
  }
}

export function logOutAdmin() {
  if (typeof window !== "undefined") {
    localStorage.removeItem(LOCAL_STORAGE_ADMIN_KEY);
  }
  if (supabase) {
    supabase.auth.signOut().catch(() => {});
  }
}
