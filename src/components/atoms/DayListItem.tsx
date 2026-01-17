import type { DayWithMetadata } from "@/types/diary.types"
import { useNavigate } from "react-router-dom"

export default function DayListItem({ day, active }: { day: DayWithMetadata, active: boolean }) {
    const navigate = useNavigate()

    return (
        <div
            onClick={() => {
                if (active) {
                    navigate('/')
                    return;
                } else {
                    navigate(`/day/${day.date}`)
                }

            }}
            title="Click to view entries"
            className={`group flex flex-col gap-2 border rounded-lg p-4 hover:border-accent-primary hover:shadow-sm cursor-pointer transition-all duration-200 ${active ? "border-2 border-accent-primary bg-surface-raised" : "border-border-subtle"}`}
        >
            <div className="flex items-center justify-between gap-4">
                <h2 className="font-heading text-lg font-medium text-text-primary group-hover:text-accent-primary transition-colors">
                    {day.date}
                </h2>
                <div className="flex flex-wrap gap-1.5 shrink-0">
                    {day.tags?.slice(0, 3).map((tag) => (
                        <span
                            key={tag}
                            className="bg-surface-raised text-[10px] font-medium text-text-muted border border-border-subtle rounded px-2 py-0.5"
                        >
                            {tag}
                        </span>
                    ))}
                    {day.tags && day.tags.length > 3 && (
                        <span className="text-[10px] text-text-muted self-center">+{day.tags.length - 3}</span>
                    )}
                </div>
            </div>
            <p className="font-body text-sm text-text-secondary leading-normal line-clamp-2">
                {day.summary}
            </p>
        </div>
    )
}