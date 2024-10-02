"use client"
import React from "react";
import "./base.css"
import Header from "./_components/header";
import Footer from "@/components/footer";

const ResourceLayout = ({
  children
}: {
  children: React.ReactNode;
}) => {
  return ( 
    <div className="relative h-full">
      <main className="h-full">
        <Header />
        {children}
        <Footer />
      </main>
    </div>
   );
}
 
export default ResourceLayout;


