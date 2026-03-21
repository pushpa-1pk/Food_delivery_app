import type { Metadata } from "next";
import "./globals.css";
import { QueryProvider } from "@/providers/query-provider";
import { SocketProvider } from "@/providers/socket-provider";
import { SiteHeader } from "@/components/layout/site-header";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "Jay Malhar Food Marketplace",
  description: "Production-ready single-brand food ordering platform."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <QueryProvider>
          <SocketProvider>
            <SiteHeader />
            {children}
          </SocketProvider>
        </QueryProvider>
        <Toaster position="top-right" />
      </body>
    </html>
  );
}
