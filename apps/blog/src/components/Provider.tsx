"use client";

import { topItems } from "@/utils/constants";
import { ThemeProvider } from "next-themes";
import dynamic from "next/dynamic";
import React, { useState } from "react";
import { Toaster } from "react-hot-toast";
import { Header, Footer, Sidebar } from "ui";

const StarrySky = dynamic(() => import("./StarrySky"));

export const Provider = ({ children }: { children: React.ReactNode }) => {
  const [showSidebar, setShowSidebar] = useState(false);

  return (
    <ThemeProvider attribute="class" defaultTheme="dark">
      <section className="dark:bg-dark-200">
        <StarrySky />

        <Header
          topItems={topItems}
          ontoggleSideBar={() => setShowSidebar(!showSidebar)}
        />

        <Sidebar
          topItems={topItems}
          showSidebar={showSidebar}
          ontoggleSideBar={() => setShowSidebar(!showSidebar)}
        />

        <div className="mx-auto relative min-h-[83dvh] container px-6 pt-[15vh] z-10">
          <Toaster position="bottom-center" />
          {children}
        </div>
        <Footer />
      </section>
    </ThemeProvider>
  );
};
