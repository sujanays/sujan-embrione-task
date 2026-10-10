import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/navbar";
import { Toaster } from "sonner";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Embrione | PES University Member Platform",
  description:
    "Official member management, registration hub, and community directory for Embrione at PES University.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${spaceGrotesk.variable} dark antialiased`}
    >
      <body className="min-h-screen bg-[#0a0a0b] text-[#f4f4f5] flex flex-col selection:bg-violet-600/30 selection:text-white">
        <Navbar />
        <main className="flex-1 flex flex-col">{children}</main>
        <footer className="border-t border-white/5 py-6 px-4 text-center text-xs text-zinc-400">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
            <p>© 2026 Embrione Club, PES University. All rights reserved.</p>
          </div>
        </footer>
        <Toaster
          position="bottom-right"
          theme="dark"
          toastOptions={{
            style: {
              background: "#17171c",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              color: "#f4f4f5",
            },
          }}
        />
      </body>
    </html>
  );
}
