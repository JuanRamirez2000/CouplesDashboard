"use client";

import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import UserCard from "./UserCard";
import UserMessagesCard from "./UserMessagesCard";
import CoupleNotes from "./DateIdeas";
import ComingSoon from "./ComingSoon";

export default function Page({ params }: { params: { dashboardID: string } }) {
  const dashboardInfo = useQuery(api.dashboard.get, {
    dashboardID: params.dashboardID,
  });
  const userData = useQuery(api.users.retrive);
  const partnerData = useQuery(
    api.users.retriveWithID,
    userData !== null ? { userID: userData?.partnerID! } : "skip"
  );

  return (
    <div className="flex flex-row h-screen w-screen gap-4 p-3">
      {/* Main User */}
      <div
        className="flex h-full w-2/12 flex-row 
     rounded-lg  gap-4"
      >
        <UserCard userData={userData!} userType="user" />
      </div>
      <div className="flex flex-col h-full w-8/12 gap-4 rounded-lg">
        <div className="h-1/2 w-full">
          <UserMessagesCard
            userId={userData?._id!}
            dashboardId={dashboardInfo?._id!}
          />
        </div>
        <div className="h-1/2 w-full flex flex-row gap-4">
          <div className="h-full w-1/3">
            <CoupleNotes dashboardId={dashboardInfo?._id!} />
          </div>
          <div className="h-full w-2/3">
            <ComingSoon />
          </div>
        </div>
      </div>
      {/* User's partner */}
      <div
        className="flex h-full w-2/12 flex-row
      rounded-lg gap-4"
      >
        <UserCard userData={partnerData!} userType="partner" />
      </div>
    </div>
  );
}
