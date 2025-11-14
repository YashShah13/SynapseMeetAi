import {auth} from "@/lib/auth";
import {headers} from "next/headers";
import { redirect } from "next/navigation";
import { HomeView } from "@/modules/auth/ui/views/home/ui/views/home-view";

// Inline retry function
async function retry(fn: () => Promise<any>, retries = 7, delay = 400) {
  try {
    return await fn();
  } catch (err) {
    if (retries <= 0) throw err;
    await new Promise((res) => setTimeout(res, delay));
    return retry(fn, retries - 1, delay);
  }
}

const Page = async () => {

  const session = await retry(async () =>
    auth.api.getSession({
      headers: await headers(),   
    })
  );

  if (!session) {
    redirect("/sign-in");
  }

  return <HomeView />;
};

export default Page;
