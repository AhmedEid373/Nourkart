import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Nourkart - Wall Decor Store",
  description: "Unique wall decor that transforms your space",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
