import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getQueryClient, trpc } from "@/trpc/server";
import { AgentsListHeader } from "@/modules/agents/ui/components/agent-list-header";
import {
     AgentsView, 
     AgentsViewLoading, 
     AgentViewError } from "@/modules/agents/ui/views/agents-view";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

const Page = async() => {
  const session = await auth.api.getSession({
      headers: await headers(),
    });
  
    if(!session) {
      redirect("/sign-in");
    }

  const QueryClient = getQueryClient();
  void QueryClient.prefetchQuery(trpc.agents.getMany.queryOptions())

    return (
      <>
       <AgentsListHeader />
  <HydrationBoundary state={dehydrate(QueryClient)}>
    <Suspense fallback={<AgentsViewLoading />}>
      <ErrorBoundary fallback={<AgentViewError />}>
      <AgentsView />
      </ErrorBoundary>
      </Suspense>
     </HydrationBoundary>
     </>
   
   )
};

export default Page;