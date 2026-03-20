import "./globals.css";
import Sidebar from "@/components/Sidebar";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "FinAI Trader — AI-Powered FinTech Platform",
  description: "Real-time algorithmic trading, sentiment analysis, and DeFi fraud detection powered by AI",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-background text-white antialiased" style={{margin:0,padding:0}}>
        <div style={{display:'flex',flexDirection:'row',minHeight:'100vh',width:'100%',overflow:'hidden'}}>
          <div style={{width:'224px',flexShrink:0,position:'sticky',top:0,height:'100vh',overflowY:'auto'}}>
            <Sidebar />
          </div>
          <main style={{flex:1,overflowY:'auto',minHeight:'100vh',minWidth:0}}>
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
