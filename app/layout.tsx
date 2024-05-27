import "./globals.css";
import type { Metadata } from "next";
import { Josefin_Sans } from "next/font/google";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import AuthProvider from "@/context/AuthProvider";
import { Navbar } from "@/components/navbar/Navbar";
import { Toaster } from "@/components/ui/toaster";

const josefinSans = Josefin_Sans({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Admin Dashboard",
  description:
    "This is an admin dashboard, used to manage different product of the company.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${josefinSans.className}`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <Toaster />
            <Navbar />
            <div className="mt-14 px-1 py-2">{children}</div>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
