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
import { motion, AnimatePresence } from "framer-motion";
import { ShieldPlus, ArrowRight, X } from 'lucide-react';
import { useTheme } from "next-themes";


type PLAN = 'STANDARD' | 'PRO' | 'ULTIMATE';

interface WarningProps {
  types: PLAN[];
}

function Warning({ types }: WarningProps) {
  const router = useRouter();
  const [open, setOpen] = useState(true);
  const { theme } = useTheme();

  const redirect = () => {
    router.push("/settings/billing");
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
        >
          <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  <button
                    onClick={handleClose}
                    className={`absolute top-4 right-4 p-1 rounded-full transition-colors duration-200 ${
                      theme === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-200"
                    }`}
                  >
                    <X className="w-5 h-5" />
                  </button>
                  <div className="flex items-center mb-4">
                    <ShieldPlus className="w-8 h-8 mr-3 text-yellow-400" />
                    <h2 className="text-2xl font-bold">Upgrade Required</h2>
                  </div>
                </AlertDialogTitle>
                <AlertDialogDescription>
                 <p className={`mt-4 ml-4 text-md ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>
                  This is a <span className="font-semibold text-md text-cyan-500">{types[0]}</span> feature. 
                  Upgrade to the <span className="font-semibold text-md text-cyan-500">{types[0]}</span> plan to unlock this and more advanced capabilities.
                </p>
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter className="flex flex-row items-center !justify-center gap-4 py-4">
                <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={redirect}
                    className={`w-full sm:w-auto px-6 py-3 rounded-full font-semibold text-white bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 transition-all duration-300 flex items-center justify-center`}
                  >
                    Upgrade Now
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleClose}
                    className={`w-full sm:w-auto px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                      theme === "dark"
                        ? "bg-gray-700 text-white hover:bg-gray-600"
                        : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                    }`}
                  >
                    Maybe Later
                  </motion.button>
                </div>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default Warning;


