import { HomeView } from "@/modules/auth/ui/views/home/ui/views/home-view";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

async function retryGetSession(retries = 7, delay = 400) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const session = await auth.api.getSession({
        headers: await headers(),
      });

      if (session) return session; // success
    } catch (err) {
      console.error(`Session fetch failed (attempt ${attempt})`, err);
    }

    // wait between retries
    await new Promise((res) => setTimeout(res, delay));
  }

  return null; // all attempts failed
}

const Page = async () => {
  const session = await retryGetSession();

  if (!session) {
    // after 7 failed attempts
    redirect("/sign-in");
  }

  return <HomeView />;
};

export default Page;
