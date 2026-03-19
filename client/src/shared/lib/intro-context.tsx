"use client";

import {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";

type IntroState = {
  /** True when the full intro sequence (including move to navbar) is finished. */
  introDone: boolean;
  /** When true, the "SAINT ASLAN" title is rendered in the Navbar (shared layoutId). */
  titleInNavbar: boolean;
};

type IntroContextValue = IntroState & {
  setIntroDone: (done: boolean) => void;
  setTitleInNavbar: (inNavbar: boolean) => void;
};

export const defaultState: IntroState = {
  introDone: false,
  titleInNavbar: false,
};

const IntroContext = createContext<IntroContextValue | null>(null);

export function IntroProvider({ children }: { children: ReactNode }) {
  const [introDone, setIntroDone] = useState(false);
  const [titleInNavbar, setTitleInNavbar] = useState(false);

  const value: IntroContextValue = {
    introDone,
    titleInNavbar,
    setIntroDone,
    setTitleInNavbar,
  };

  return (
    <IntroContext.Provider value={value}>{children}</IntroContext.Provider>
  );
}

export function useIntro() {
  const ctx = useContext(IntroContext);
  if (!ctx) {
    throw new Error("useIntro must be used within IntroProvider");
  }
  return ctx;
}

/** Safe hook that returns null if outside provider (e.g. for optional usage). */
export function useIntroOptional(): IntroContextValue | null {
  return useContext(IntroContext);
}
