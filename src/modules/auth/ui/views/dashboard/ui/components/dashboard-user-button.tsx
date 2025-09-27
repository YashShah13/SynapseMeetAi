"use client";

import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { GeneratedAvatar } from "@/components/ui/generated-avatar";
import {
  ChevronDownIcon,
  CreditCardIcon,
  LogOutIcon,
} from "lucide-react";

export const DashboardUserButton = () => {
  const router = useRouter();
  const { data, isPending } = authClient.useSession();

  const onLogout = () => {
    authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/sign-in");
        },
      },
    });
  };

  if (isPending || !data?.user) {
    return null;
  }

  return (
    <DropdownMenu>
      {/* Trigger */}
      <DropdownMenuTrigger
        className="group rounded-xl border border-white/10 p-3 w-full flex items-center justify-between 
                   bg-white/5 hover:bg-gradient-to-r hover:from-cyan-500/20 hover:to-purple-500/20 
                   shadow-md hover:shadow-lg transition-all duration-300 backdrop-blur-lg"
      >
        {data.user.image ? (
          <Avatar className="ring-2 ring-cyan-400/50 group-hover:ring-purple-400/50 transition">
            <AvatarImage src={data.user.image} />
          </Avatar>
        ) : (
          <GeneratedAvatar
            seed={data.user.name}
            variant="initials"
            className="size-9 mr-3 rounded-full ring-2 ring-cyan-400/50 group-hover:ring-purple-400/50 transition"
          />
        )}

        <div className="flex flex-col gap-0.5 text-left overflow-hidden flex-1 min-w-0">
          <p className="text-sm truncate w-full font-medium bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
            {data.user.name}
          </p>
          <p className="text-xs truncate w-full text-gray-400">
            {data.user.email}
          </p>
        </div>

        <ChevronDownIcon className="size-4 shrink-0 text-gray-400 group-hover:text-cyan-400 transition" />
      </DropdownMenuTrigger>

      {/* Dropdown Menu */}
      <DropdownMenuContent
        align="end"
        side="right"
        className="w-72 rounded-xl border border-white/10 bg-gradient-to-b from-[#1e293b]/95 to-[#111827]/95 
                   backdrop-blur-xl shadow-2xl animate-in fade-in-0 zoom-in-95 duration-200"
      >
        <DropdownMenuLabel>
          <div className="flex flex-col gap-1">
            <span className="font-semibold truncate text-white">
              {data.user.name}
            </span>
            <span className="text-sm font-normal text-gray-400 truncate">
              {data.user.email}
            </span>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator className="bg-white/10" />

        {/* Billing Item */}
        <DropdownMenuItem
          onClick={() => router.push("/billing")}
          className="cursor-pointer flex items-center justify-between rounded-md px-3 py-2 
                     hover:bg-gradient-to-r hover:from-cyan-500/20 hover:to-purple-500/20 
                     text-cyan-300 hover:text-white transition"
        >
          Billing
          <CreditCardIcon className="size-4 text-cyan-400 group-hover:text-purple-400 transition" />
        </DropdownMenuItem>

        {/* Logout Item */}
        <DropdownMenuItem
          onClick={onLogout}
          className="cursor-pointer flex items-center justify-between rounded-md px-3 py-2 
                     hover:bg-gradient-to-r hover:from-red-500/20 hover:to-red-600/20 
                     text-red-400 hover:text-red-300 transition"
        >
          Logout
          <LogOutIcon className="size-4 text-red-400 group-hover:text-red-300 transition" />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
