import type React from "react";
import { useState } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import RightSidebar from "./RightSidebar";

const Layout: React.FC = () => {
  const [showRightSidebar, setShowRightSidebar] = useState(false);
  return (
    <div className="flex h-screen w-screen justify-between theme-bg">
      {/* Main content area */}
      <div className="h-full w-full theme-bg overflow-y-auto scrollbar-hide theme-shadow">
        <Navbar setShowRightSidebar={setShowRightSidebar} />
        <div className="p-4 w-full theme-bg min-h-[calc(100vh-4rem)]">
          <Outlet />
        </div>
      </div>

      {/* Right sidebar */}
      {showRightSidebar && (
        <RightSidebar setShowRightSidebar={setShowRightSidebar} />
      )}
    </div>
  );
};

export default Layout;
