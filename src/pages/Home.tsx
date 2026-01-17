import { Outlet, useMatch } from "react-router-dom"
import DayList from "@/components/DayList"

export default function Home() {
  const isDetails = useMatch("/day/:date")

  return (
    <div className="flex h-screen overflow-hidden bg-bg-surface">
      <div
        className={`
          relative z-10
          h-full overflow-y-auto
          border-r border-border-default
          transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]
          ${isDetails
            ? "basis-full lg:basis-1/3 hidden lg:block"
            : "basis-full"
          }
        `}
      >
        <DayList />
      </div>

      {/* Right Panel: Details */}
      <div
        className={`
          h-full overflow-y-auto bg-bg-base
          transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]
          ${isDetails
            ? "basis-full lg:basis-2/3 opacity-100"
            : "basis-0 opacity-0"
          }
        `}
      >
        <Outlet />
      </div>
    </div>
  )
}
