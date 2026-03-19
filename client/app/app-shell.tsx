"use client";

import { AnimatePresence, LayoutGroup } from "framer-motion";
import { Toaster } from "react-hot-toast";
import { IntroProvider, useIntro } from "@/src/shared/lib/intro-context";
import { IntroLoader } from "@/src/shared/ui/intro-loader";
import Header from "@/src/widgets/header/header";
import Footer from "@/src/widgets/footer/footer";

function ContentWithFade({ children }: { children: React.ReactNode }) {
  const { introDone, titleInNavbar } = useIntro();
  const visible = titleInNavbar || introDone;
  return (
    <div
      className="min-h-screen transition-opacity duration-500 ease-out"
      style={{
        opacity: visible ? 1 : 0,
        pointerEvents: introDone ? "auto" : "none",
      }}
    >
      <Header />
      {children}
      <Footer />
    </div>
  );
}

function IntroAndContent({ children }: { children: React.ReactNode }) {
  const { introDone } = useIntro();
  return (
    <AnimatePresence mode="wait">
      {!introDone && <IntroLoader key="intro" />}
      <ContentWithFade>{children}</ContentWithFade>
    </AnimatePresence>
  );
}

export default function AppShell({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <IntroProvider>
      <LayoutGroup>
        <IntroAndContent>{children}</IntroAndContent>
      </LayoutGroup>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          className: 'font-host-grotesk text-sm',
          style: {
            fontFamily: 'var(--font-host-grotesk), sans-serif',
            fontSize: '0.875rem',
            borderRadius: '0.75rem',
            border: '1px solid oklch(0.922 0 0)',
            boxShadow: '0 4px 24px -4px rgba(0,0,0,0.10)',
            padding: '12px 16px',
          },
          success: {
            iconTheme: { primary: '#171717', secondary: '#fff' },
          },
          error: {
            iconTheme: { primary: '#ef4444', secondary: '#fff' },
          },
        }}
      />
    </IntroProvider>
  );
}
