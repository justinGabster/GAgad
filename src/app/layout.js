import "./globals.css";

export const metadata = {
  title: "GAgad - GCash Micro-Float",
  description: "Adaptive Informal Micro-Float & Resilience Engine",
  manifest: "/manifest.json",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#005CEE",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <div id="app-container">
          {children}
        </div>
      </body>
    </html>
  );
}
