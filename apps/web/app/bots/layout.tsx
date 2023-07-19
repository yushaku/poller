import { TopPage } from "@/components/TopPage";
import { botPath, getBots } from "@/services";
import getQueryClient from "@/utils/getQueryClient";
import { dehydrate, Hydrate } from "@tanstack/react-query";
import React from "react";

const Layout = async ({ children }: { children: React.ReactNode }) => {
  const queryClient = getQueryClient();
  await queryClient.prefetchQuery([botPath], getBots);
  const dehydratedState = dehydrate(queryClient);

  return (
    <section className="h-[95dvh] bg-white dark:bg-dark w-full rounded-xl mx-16 my-6 overflow-scroll">
      <article>
        <div className="rounded-2xl px-6">
          <TopPage title="Your Bots" />
          <hr className="my-2" />
          <Hydrate state={dehydratedState}>{children}</Hydrate>
        </div>
      </article>
    </section>
  );
};

export default Layout;