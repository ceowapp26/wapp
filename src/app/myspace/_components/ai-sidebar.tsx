import React, { Suspense } from "react";
import dynamic from "next/dynamic";
import { GradientLoadingCircle } from "@/components/gradient-loading-circle";

const ChatContent = dynamic(() => import("@/components/apps/document/chatbot/chat-content"), {
  suspense: true,
  loading: () => <GradientLoadingCircle size={70} thickness={5} />,
});

export const RightAISidebar = () => {
  return (
    <React.Fragment>
      <ChatContent />
    </React.Fragment>
  );
};