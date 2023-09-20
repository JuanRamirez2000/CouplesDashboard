"use client";

import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { useRouter } from "next/navigation";

export default function Page() {
  const userData = useQuery(api.users.retrive);
  const router = useRouter();

  return (
    <div className="flex flex-col h-screen w-screen">
      <button
        className="px-2 py-1 rounded-lg bg-red-200"
        onClick={() => router.push(`/home/${userData?.dashboardID}`)}
      >
        Go to dashboard
      </button>
    </div>
  );
}
