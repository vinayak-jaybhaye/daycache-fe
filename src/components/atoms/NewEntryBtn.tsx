import { useDiaryStore } from "@/store/diary.store"
import { Plus } from 'lucide-react';

export default function NewEntryBtn({ date }: { date: string }) {
    const addEntry = useDiaryStore((state) => state.addEntry)

    // Invisible clickable area for new entry at the bottom
    return (
        <div
            className="h-12 -mx-4 cursor-text flex items-center justify-center hover:shadow-md"
            onClick={() => addEntry({ content: "", date })}
        >
            <div className="flex items-center gap-2 text-[#8b6642] italic font-handwriting">
                <Plus className="w-4 h-4" />
                <span>Write something...</span>
            </div>
        </div>
    )
}