"use client";

import IntroHeader from "@/src/shared/ui/intro-loader/intro-header";
import NavbarMenu from "../navbar/navbar-menu";

export default function Header() {

  return (
    <header className="w-full flex items-center justify-center bg-white">
      <IntroHeader />
      <NavbarMenu />
    </header>
  );
}
