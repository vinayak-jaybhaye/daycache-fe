import ActivityCalendar from "./ActivityCalendar";
import { useState } from "react";
import { getPrevious6Months } from "@/utils/calendar.utils";
import { useRef } from "react";
import { useInfiniteScroll } from "@/utils/actions.utils";
import { useMatch } from "react-router-dom";
import { Loader } from "lucide-react";

export default function ActivityHistory() {
    const [months, setMonths] = useState<string[]>([]); // YYYY-MM
    const [isMore, setIsMore] = useState<boolean>(true);
    const containerRef = useRef<HTMLDivElement>(null);

    const isDetails = useMatch("/activity/day/:date")

    const handleLoadMore = () => {
        const previousMonths = getPrevious6Months(months[months.length - 1]);
        if (previousMonths.length === 0) {
            setIsMore(false);
            return;
        }

        setMonths((m) => [...m, ...previousMonths]);
    };
    const loadMoreRef = useInfiniteScroll(handleLoadMore, containerRef.current);

    return (
        <div className="h-full flex flex-col bg-bg-app">
            {/* header */}
            <div className="shrink-0 p-6 border-b border-border-subtle bg-surface-default/80 backdrop-blur-sm sticky top-0 z-10">
                <h1 className="font-heading text-xl font-bold text-text-primary">
                    Activity History
                </h1>
            </div>
            <div
                className="flex-1 overflow-y-auto p-2 scroll-smooth"
                ref={containerRef}>
                <div className={`${!isDetails && ("grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 pb-8")} `}>
                    {months.map((month) => (
                        <ActivityCalendar key={month} yearMonth={month} />
                    ))}
                </div>
                {isMore && <div ref={loadMoreRef} className="flex items-center justify-center p-4 text-sm text-text-muted">
                    <Loader className="animate-spin" />
                </div>}
            </div>
        </div>
    )
}