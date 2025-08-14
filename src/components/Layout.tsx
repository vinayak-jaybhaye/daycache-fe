import type React from "react";
import { useState } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import RightSidebar from "./RightSidebar";

const Layout: React.FC = () => {
  const [showRightSidebar, setShowRightSidebar] = useState(false);

  return (
    <div
      className="flex h-screen w-screen justify-between"
      style={{ backgroundColor: 'var(--color-bg-primary)' }}
    >
      {/* Main content area */}
      <div
        className="h-full w-full overflow-y-auto scrollbar-hide"
        style={{
          backgroundColor: 'var(--color-bg-primary)',
          boxShadow: 'var(--shadow-base)'
        }}
      >
        <Navbar setShowRightSidebar={setShowRightSidebar} />
        <div
          className="p-1 w-full min-h-[calc(100vh-4rem)]"
          style={{ backgroundColor: 'var(--color-bg-primary)' }}
        >
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