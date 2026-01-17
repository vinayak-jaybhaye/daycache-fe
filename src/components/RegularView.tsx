import { useNavigate, useMatch } from "react-router-dom"
import type { Entry as EntryType } from "@/types/diary.types"
import Entry from '@/components/Entry';
import NewEntryBtn from '@/components/atoms/NewEntryBtn';
import { getDateString } from "@/utils/calendar.utils";
import { Loader2, Repeat2, ArrowLeft } from "lucide-react"

type RegularViewProps = {
    entries: EntryType[];
    date: string;
    setView: (view: 'regular' | 'diary') => void;
};


export default function RegularView({ entries, date, setView }: RegularViewProps) {
    const navigate = useNavigate();
    const isDetails = useMatch("/open/:date")

    return (
        <div className="max-w-4xl mx-auto py-8 px-4 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className='px-4 py-2 flex cursor-pointer'>
                    <button
                        onClick={() => setView('diary')}
                        className='cursor-pointer p-1 rounded-lg'
                    >
                        <Repeat2 className="w-7 h-8" />
                    </button>
                    <h1 className="font-heading text-2xl py-2 px-4 font-bold"
                        onClick={() => {
                            if (isDetails) {
                                navigate(-1)
                            } else {
                                navigate('/open/' + date)
                            }
                        }}
                    >{getDateString(date)}</h1>
                </div>
                <button onClick={() => navigate(-1)}
                    className="cursor-pointer p-1 rounded-lg">
                    <ArrowLeft className="w-6 h-6" />
                </button>
            </div>


            <NewEntryBtn date={date} />
            <div className="space-y-4 h-[calc(100vh-200px)] overflow-y-auto">
                {entries?.map((entry: EntryType) => (
                    <Entry key={entry.id} entry={entry} />
                ))}
            </div>


            {!entries && (
                <div className="py-12 text-center">
                    <Loader2 className="h-8 w-8 text-accent-primary animate-spin" />
                </div>
            )}

        </div>
    )
}
