import type React from "react";
import { Outlet } from "react-router-dom";
import MenuBar from "@/components/MenuBar";

const MainLayout: React.FC = () => {
  return (
    <div className="relative">
      <MenuBar />
      <Outlet />
    </div>
  );
};

export default MainLayout;