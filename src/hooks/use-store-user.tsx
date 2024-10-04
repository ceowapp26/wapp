import { useUser } from "@clerk/nextjs";
import { useEffect, useState, useCallback } from "react";
import { useConvexAuth } from "convex/react";
import { useRouter } from 'next/navigation';
import { useMutation, useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { Id } from "../convex/_generated/dataModel";
import { useEdgeStore } from "@/lib/edgestore";
import { defaultRole } from "@/constants/authorization";
import { checkUserRole } from "@/utils/checkRole";
import { useAuthContextHook } from '@/context/auth-context-provider';
import { _defaultPlan } from "@/constants/payments";

export function useStoreUser() {
  const router = useRouter();
  const { user } = useUser();
  const { isLoading, isAuthenticated } = useConvexAuth();
  const { userType } = useAuthContextHook();
  const [storedUserId, setStoredUserId] = useState<Id<"users"> | null>(null);
  const storeUser = useMutation(api.users.storeUser);
  const getUserByUserId = useMutation(api.users.getUserByUserId);
  const { reset } = useEdgeStore();
  const defaultUserRole = "user";
  const userRole = checkUserRole(user) || userType || defaultUserRole;

  const runAfterAuthChange = useCallback(async () => {
    await reset();
  }, [reset]);

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.push('/');
        setStoredUserId(null);
      }
    }
  }, [isLoading, isAuthenticated, router]);

  useEffect(() => {
    const createOrUpdateUser = async () => {
      if (user && isAuthenticated) {
        try {
          const existingUser = await getUserByUserId({ userId: user.id });
          const userData = {
            userId: user.id,
            email: user.emailAddresses[0]?.emailAddress ?? "",
            role: userRole,
            phone: user.phoneNumbers[0]?.phoneNumber ?? "",
            username: user.username ?? "",
            fullname: user.fullName ?? "",
            pictureUrl: user.imageUrl ?? "",
            planType: existingUser?.subscriptionInfo.planType ?? _defaultPlan,
            planId: existingUser?.subscriptionInfo.planId ?? process.env.FREE_PLAN_ID,
          };

          const hasChanged = existingUser && Object.entries(userData).some(([key, value]) => 
            value !== existingUser.userInfo[key] && !['planType', 'planId'].includes(key)
          );

          const hasPlanChanged = existingUser && (
            userData.planType !== existingUser.subscriptionInfo.planType ||
            userData.planId !== existingUser.subscriptionInfo.planId
          );

          let id;
          if (existingUser && (hasChanged || hasPlanChanged)) {
            id = await storeUser({ data: { ...userData, hasChanged, hasPlanChanged } });
          } else if (!existingUser) {
            id = await storeUser({ data: userData });
          } else {
            id = existingUser._id;
          }
          setStoredUserId(id);
          localStorage.removeItem("tempEmail");
        } catch (error) {
          console.error("Error creating/updating user:", error);
        }
      }
    };

    createOrUpdateUser();
  }, [user, isAuthenticated, storeUser, getUserByUserId, userRole]);

  return {
    isLoading: isLoading || (isAuthenticated && !storedUserId),
    isAuthenticated: isAuthenticated && !!storedUserId,
    role: userRole,
  };
}




