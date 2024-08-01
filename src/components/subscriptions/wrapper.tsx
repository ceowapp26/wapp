"use client";

import React, { useState, useEffect, ReactNode } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import Warning from "./warning";
import { useUser } from "@clerk/nextjs";

type PLAN = 'STANDARD' | 'PRO' | 'ULTIMATE';

interface ComponentWrapperProps {
  types: PLAN[];
  children: ReactNode;
}

export default function ComponentWrapper({ types, children }: ComponentWrapperProps) {
  const { user } = useUser();
  const [isType, setIsType] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const currentUser = useQuery(api.users.getCurrentUser);

  useEffect(() => {
    if (currentUser) {
      const plan = currentUser.subscriptionInfo?.plan;
      setIsType(types.includes(plan));
    }
  }, [currentUser, types]);

  if (!user) return <div>User not authenticated</div>;

  const handleClick = (e) => {
    if (!isType) {
      e.stopPropagation();
      e.preventDefault();
      setShowWarning(true);
    }
  };

  return (
    <React.Fragment>
      {isType ? (
        <>{children}</>
      ) : (
        <div onClick={handleClick}>
          <div style={{ pointerEvents: 'none' }}>
            {children}
          </div>
          {showWarning && <Warning types={types} />}
        </div>
      )}
    </React.Fragment>
  );
}
