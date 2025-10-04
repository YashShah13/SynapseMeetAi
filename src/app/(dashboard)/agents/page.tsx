import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getQueryClient, trpc } from "@/trpc/server";
import {
     AgentsView, 
     AgentsViewLoading, 
     AgentViewError } from "@/modules/agents/ui/views/agents-view";

const Page = async() => {
  const QueryClient = getQueryClient();
  void QueryClient.prefetchQuery(trpc.agents.getMany.queryOptions())

    return (
  <HydrationBoundary state={dehydrate(QueryClient)}>
    <Suspense fallback={<AgentsViewLoading />}>
      <ErrorBoundary fallback={<AgentViewError />}>
      <AgentsView />
      </ErrorBoundary>
      </Suspense>
     </HydrationBoundary>
   
   )
};

export default Page;