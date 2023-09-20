"use client";

import { useQuery, useMutation } from "convex/react";
import useStoreUserEffect from "../hooks/useStoreUserEffect";
import Image from "next/image";
import { api } from "@/convex/_generated/api";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function Page() {
  const userID = useStoreUserEffect();
  const userData = useQuery(api.users.retrive, userID !== null ? {} : "skip");
  const connectUsersMutaiton = useMutation(api.users.connectTwoUsers);
  const [partnerID, setPartnerID] = useState<string>("");
  const router = useRouter();
  if (userID === null)
    return (
      <div>
        <h1>Creating your account...</h1>
      </div>
    );

  if (userData?.dashboardID) {
    router.push(`/home/${userData.dashboardID}`);
  }

  const handleFormSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await connectUsersMutaiton({ partnerID: partnerID });
  };

  return (
    <div className="flex flex-row items-center justify-center h-screen w-screen ">
      {userData && (
        <div className="h-96 max-w-md w-fit">
          <div className="relative h-64 w-64 rounded-full">
            <Image src={userData?.picture} alt={userData?.name} fill />
          </div>
          <h2>{userData?.name}</h2>
        </div>
      )}
      <div>
        <h1>Lets collect you and your partner!</h1>
        <p>Either copy and paste their ID below or give them yours!</p>
        <div>
          <p>
            Your ID:
            {userID}
          </p>
        </div>
        <form className="flex flex-row" onSubmit={handleFormSubmit}>
          <div className="relative">
            <input
              type="text"
              id="partner"
              className="peer h-16 w-full rounded-md border-2 p-3 pt-4 placeholder-transparent caret-transparent focus:shadow-sm focus:outline-none"
              placeholder="InputID"
              onChange={(e) => setPartnerID(e.target.value)}
            />
            <label
              htmlFor="partner"
              className="pointer-events-none absolute left-0 top-0 origin-left -translate-y-4 translate-x-0 scale-75 px-3 py-5 text-sm tracking-tight opacity-100 transition-all duration-100 ease-in-out 
              
              peer-placeholder-shown:-translate-y-0 peer-placeholder-shown:translate-x-1 peer-placeholder-shown:scale-125
              
              peer-focus:-translate-y-4 peer-focus:translate-x-0 "
            >
              Input ID
            </label>
          </div>
          <button className="px-2 py-1 bg-green-400 rounded-r-lg" type="submit">
            Connect
          </button>
        </form>
      </div>
    </div>
  );
}
