import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDiaryStore } from "@/store/diary.store";
import { isDateValid } from "@/utils/calendar.utils";
import DiaryView from "./DiaryView";
import RegularView from "./RegularView";
import { useState } from "react";

export default function Day() {
  const navigate = useNavigate();
  const { date } = useParams<{ date: string }>();
  const [view, setView] = useState<"diary" | "regular">("regular");

  const entries = useDiaryStore((state) =>
    date ? state.dayWithEntries[date]?.entries : undefined,
  );

  const fetchEntriesForDay = useDiaryStore((state) => state.fetchEntriesForDay);

  useEffect(() => {
    if (date && isDateValid(date)) {
      fetchEntriesForDay(date);
    } else {
      navigate(-1);
    }
  }, [date, fetchEntriesForDay]);

  if (!date) {
    return <div>Invalid date</div>;
  }

  return view === "diary" ? (
    <DiaryView entries={entries ?? []} date={date} setView={setView} />
  ) : (
    <RegularView entries={entries ?? []} date={date} setView={setView} />
  );
}
