"use client"
import BasicNavigation from "./basic-content";
import DocumentContent from "./document-content";
import VideoContent from "./video-content";
import ForumContent from "./forum-content";  
import CommunityContent from "./community-content";
import ContactContent from "./contact-content";

export default function Content({ activeItem }) {
  return (
    <div className="flex-1 max-h-screen overflow-y-auto p-2 sm:p-8">
      {activeItem === "basic-navigation" && <BasicNavigation />}
      {activeItem === "document" && <DocumentContent />}
      {activeItem === "video" && <VideoContent />}
      {activeItem === "profile-settings" && <BasicNavigation />}
      {activeItem === "ai-settings" && <BasicNavigation />}
      {activeItem === "chatbot-settings" && <BasicNavigation />}  
      {activeItem === "wapp-settings" && <BasicNavigation />}  
      {activeItem === "forum" && <ForumContent />}  
      {activeItem === "contact" && <ContactContent />}  
      {activeItem === "community" && <CommunityContent />}  
    </div>
  );
}


