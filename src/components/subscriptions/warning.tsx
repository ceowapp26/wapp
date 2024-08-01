"use client";

import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { ShieldPlus } from 'lucide-react';

type PLAN = 'STANDARD' | 'PRO' | 'ULTIMATE';

interface WarningProps {
  types: PLAN[];
}

function Warning({ types }: WarningProps) {
  const router = useRouter();
  const [open, setOpen] = useState(true);

  const redirect = () => {
    router.push("/settings/billing");
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            <h1 className="flex flex-row items-center gap-1 py-2">
              <ShieldPlus className="h-6 w-6 text-yellow-400" />
              UPGRADE
            </h1>
          </AlertDialogTitle>
          <AlertDialogDescription className="font-semibold text-black">
            This is a <span className="text-cyan-800 text-md">{types[0]} </span> feature. Please upgrade to the <span className="text-cyan-800 text-md">{types[0]}</span> plan to use this feature.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex flex-row items-center !justify-center gap-4 py-4">
          <AlertDialogAction onClick={redirect}>
            Upgrade Now
          </AlertDialogAction>
          <AlertDialogCancel onClick={handleClose}>
            Upgrade Later
          </AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default Warning;
