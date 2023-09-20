import { useUser } from "@clerk/clerk-react";
import { useEffect, useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

export default function useStoreUserEffect() {
  const { user: clerkUser } = useUser(); //Clerk user
  const [userId, setUserId] = useState<Id<"users"> | null>(null); //Convex User._id
  const storeUser = useMutation(api.users.store);
  useEffect(() => {
    async function createUser() {
      const id = await storeUser();
      setUserId(id);
    }
    createUser();
    return () => setUserId(null);
  }, [storeUser, clerkUser?.id]);
  return userId;
}
