import "./site.css";
import Script from "next/script";

export const metadata = {
  title: "球途 Chronicle",
  description: "从青训起步，体验属于你的足球职业生涯。",
  manifest: "/manifest.webmanifest",
  icons: {
    icon: "/assets/app-icon.svg",
    apple: "/assets/app-icon.svg"
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "球途"
  }
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#071015"
};

export default function RootLayout({ children }) {
  return (
    <html lang="zh-CN">
      <body>
        {children}
        <Script src="/data/countries.js" strategy="beforeInteractive" />
        <Script src="/data/trophies.js" strategy="beforeInteractive" />
        <Script src="/data/clubs.js" strategy="beforeInteractive" />
        <Script src="/data/derbies.js" strategy="beforeInteractive" />
        <Script src="/data/events.js" strategy="beforeInteractive" />
        <Script src="/game.js?v=20260726-96" strategy="afterInteractive" />
      </body>
    </html>
  );
}
