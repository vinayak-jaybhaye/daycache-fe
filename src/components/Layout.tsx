import type React from "react";
import { useState } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import RightSidebar from "./RightSidebar";

const Layout: React.FC = () => {
  const [showRightSidebar, setShowRightSidebar] = useState(false);
  return (
    <div className="flex h-screen w-screen justify-between bg-amber-50">
      {/* Main content area */}
      <div className="h-full w-full bg-white overflow-y-auto scrollbar-hide shadow-md">
        <Navbar setShowRightSidebar={setShowRightSidebar} />
        <div className="p-4 w-full bg-gradient-to-br from-amber-50/50 to-amber-100/30 min-h-[calc(100vh-4rem)]">
          <Outlet />
        </div>
      </div>

      {/* Right sidebar */}
      {showRightSidebar && (
        <div
          className={`w-96 h-full bg-amber-50 border-l border-amber-200 shadow-lg "}`}
        >
          <RightSidebar />
        </div>
      )}
    </div>
  );
};

export default Layout;
