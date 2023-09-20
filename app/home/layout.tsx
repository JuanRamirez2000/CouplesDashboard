"use client";

import { SignIn } from "@clerk/clerk-react";
import { Authenticated, Unauthenticated, AuthLoading } from "convex/react";

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Authenticated>{children}</Authenticated>
      <Unauthenticated>
        <div className="flex flex-col h-screen w-screen items-center justify-center">
          <SignIn afterSignInUrl={"/home"} afterSignUpUrl={"/connectUser"} />
        </div>
      </Unauthenticated>
      <AuthLoading>Loading...</AuthLoading>
    </>
  );
}
