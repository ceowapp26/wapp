import React, { Suspense } from "react";
const ChatContent = React.lazy(() => import("@/components/apps/document/chatbot/chat-content"));
import { GradientLoadingCircle } from "@/components/gradient-loading-circle";

export const RightAISidebar = () => {
  return (
    <React.Fragment>
      <Suspense fallback={<GradientLoadingCircle />}>
        <ChatContent />
      </Suspense>
    </React.Fragment>
  );
};