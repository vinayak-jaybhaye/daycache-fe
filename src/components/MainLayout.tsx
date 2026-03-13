import type React from "react";
import { Outlet } from "react-router-dom";
import AppNav from "@/components/AppNav";

const MainLayout: React.FC = () => {
  return (
    <div className="relative min-h-screen lg:pl-24">
      <AppNav />
      <Outlet />
    </div>
  );
};

export default MainLayout;
