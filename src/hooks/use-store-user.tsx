import { useUser } from "@clerk/nextjs";
import { useEffect, useState, useCallback } from "react";
import { useConvexAuth } from "convex/react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { Id } from "../convex/_generated/dataModel";
import { useEdgeStore } from "@/lib/edgestore";
import { defaultRole } from "@/constants/authorization";
import { checkUserRole } from "@/utils/checkRole";
import { useAuthContextHook } from '@/context/auth-context-provider';

const getCookie = function(name) {
  var match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  if (match) return match[2];
}

export function useStoreUser() {
  const { user } = useUser();
  const { isLoading, isAuthenticated } = useConvexAuth();
  const { userType } = useAuthContextHook();
  const cookieStoredId = getCookie("ajs_user_id");
  const [storedUserId, setStoredUserId] = useState<string | null>(localStorage.getItem("userId") || cookieStoredId);
  const storeUser = useMutation(api.users.storeUser);
  const { reset } = useEdgeStore();
  const defaultUserRole = "user";
  const userRole = checkUserRole(user) || userType || defaultUserRole;
  const userData = {
    clerkId: user?.id || "",
    email: user?.emailAddresses[0]?.emailAddress || "",
    role: userRole,
    phone: user?.phoneNumbers[0]?.phoneNumber || "",
    username: user?.username || "",
    fullname: user?.fullname || "",
    password: user?.password || "",
    pictureUrl: user?.imageUrl || "",
  };

  const runAfterAuthChange = useCallback(async () => {
    await reset();
  }, [reset]);

  useEffect(() => {
    if (localStorage.getItem("userId")) localStorage.removeItem("userId");
    if (localStorage.getItem("tempEmail") && isAuthenticated && storedUserId) localStorage.removeItem("tempEmail");
    const createUser = async () => {
      try {
        const id = await storeUser({ data: userData });
        if (id) {
          localStorage.setItem("userId", id);
          setStoredUserId(id);
        }
      } catch (error) {
        console.error("Error creating user:", error);
      }
    };
    if (user && !storedUserId && isAuthenticated) {
      createUser();
    }
  }, [user, storedUserId, storeUser, userData]);

  return {
    isLoading: isLoading || (isAuthenticated && !storedUserId),
    isAuthenticated: isAuthenticated && !!storedUserId,
    role: userRole || null,
  };
}
