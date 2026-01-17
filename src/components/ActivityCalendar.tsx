import { useDiaryStore } from "@/store/diary.store"
import { useEffect } from "react"
import MonthCalendar from "@/components/atoms/MonthCalendar"
import { useNavigate, useParams } from "react-router-dom"

export default function ActivityCalendar({ yearMonth }: { yearMonth: string }) {
    const navigate = useNavigate()
    const { date: selectedDate } = useParams<{ date: string }>()
    const activeDays = useDiaryStore((state) => state.activeDays[yearMonth])
    const fetchActiveDaysForMonth = useDiaryStore((state) => state.fetchActiveDaysForMonth)

    useEffect(() => {
        fetchActiveDaysForMonth(yearMonth)
    }, [yearMonth, fetchActiveDaysForMonth])

    return (
        <MonthCalendar
            yearMonth={yearMonth}
            activeDays={activeDays}
            selectedDay={selectedDate}
            onDayClick={(date) => {
                if (date === selectedDate) {
                    navigate('/activity');
                } else {
                    navigate(`/activity/day/${date}`)
                }
            }}
        />
    )
}