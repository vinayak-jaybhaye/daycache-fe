import { useDiaryStore } from "@/store/diary.store";
import type { DiaryStore } from "@/store/diary.store";
import { useEffect, useRef } from "react";
import DayListItem from "@/components/atoms/DayListItem";
import { useInfiniteScroll } from "@/utils/actions.utils";
import { Loader } from "lucide-react";
import { useParams } from "react-router-dom";
import { getTodayYYYYMMDD } from "@/utils/calendar.utils";

export default function DayList({ title = "Activity" }: { title?: string }) {
  const order = useDiaryStore((s: DiaryStore) => s.dayList.order);
  const items = useDiaryStore((s: DiaryStore) => s.dayList.items);
  const hasMore = useDiaryStore(
    (s: DiaryStore) => s.dayList.pagination.hasMore,
  );
  const containerRef = useRef<HTMLDivElement | null>(null);
  const { date: selectedDate } = useParams<{ date: string }>();

  useEffect(() => {
    if (order.length === 0) {
      useDiaryStore.getState().fetchNextDayListPage();
    }
  }, [order.length]);

  const fetchMore = () => {
    useDiaryStore.getState().fetchNextDayListPage();
  };

  const loadMoreRef = useInfiniteScroll(fetchMore, containerRef.current);
  const today = getTodayYYYYMMDD();
  const shouldShowToday = !order.includes(today);
  const displayOrder = shouldShowToday ? [today, ...order] : order;

  return (
    <div className="max-w-4xl mx-auto py-6 sm:px-4  space-y-4">
      {displayOrder.length > 0 && (
        <h1 className="font-heading text-2xl py-2 px-4 font-bold text-text-primary">
          {title}
        </h1>
      )}

      <div
        className="flex flex-col gap-2 max-h-[calc(100vh-100px)] overflow-y-auto"
        ref={containerRef}
      >
        {displayOrder.map((date) => {
          const day = items[date] ?? {
            date,
            summary:
              date === today
                ? "Start writing about today"
                : undefined,
            tags: [],
          };

          return (
            <DayListItem key={date} day={day} active={date === selectedDate} />
          );
        })}
        {hasMore && (
          <div
            ref={loadMoreRef}
            className="flex items-center justify-center p-4 text-sm text-text-muted"
          >
            <Loader className="animate-spin" />
          </div>
        )}
      </div>
    </div>
  );
}
