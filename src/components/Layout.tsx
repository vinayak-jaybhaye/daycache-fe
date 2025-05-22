"use client";

import type React from "react";
import { useState } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import RightSidebar from "./RightSidebar";

const Layout: React.FC = () => {
  const [showRightSidebar, setShowRightSidebar] = useState(false);
  return (
    <div className="flex h-screen w-screen justify-between bg-background">
      {/* Main content area */}
      <div className="h-full w-full bg-background overflow-y-auto scrollbar-hide shadow-md">
        <Navbar setShowRightSidebar={setShowRightSidebar} />
        <div className="p-4 w-full bg-background min-h-[calc(100vh-4rem)]">
          <Outlet />
        </div>
      </div>

      {/* Right sidebar */}
      {showRightSidebar && (
        <div className="w-96 h-full bg-card border-l border-border shadow-lg">
          <RightSidebar />
        </div>
      )}
    </div>
  );
};

export default Layout;
