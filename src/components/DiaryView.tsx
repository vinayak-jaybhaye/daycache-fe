import type { Entry } from '@/types/diary.types'
import DiaryViewEntry from './DiaryViewEntry';
import { ArrowLeft, Repeat2 } from "lucide-react"
import { NewEntryBtn } from './atoms';
import { useMatch, useNavigate } from 'react-router-dom';
import { getDateString } from '@/utils/calendar.utils';

type DiaryViewProps = {
  entries: Entry[];
  date: string;
  setView: (view: 'regular' | 'diary') => void;
};

const DiaryView = ({ entries, date, setView }: DiaryViewProps) => {
  const navigate = useNavigate();
  const isDetails = useMatch("/open/:date")


  return (
    <div
      className="w-full mx-auto min-h-[100vh] relative px-4 lg:px-18 lg:py-12 py-6 rounded-[3px] shadow-sm group/page"
      style={{
        background: `
          radial-gradient(ellipse 40px 35px at 15% 25%, rgba(139, 102, 66, 0.15) 0%, transparent 70%),
          radial-gradient(ellipse 60px 50px at 85% 15%, rgba(101, 67, 33, 0.1) 0%, transparent 70%),
          radial-gradient(ellipse 25px 30px at 70% 80%, rgba(139, 115, 85, 0.12) 0%, transparent 70%),
          radial-gradient(ellipse 35px 25px at 25% 75%, rgba(160, 130, 98, 0.08) 0%, transparent 70%),
          radial-gradient(circle 3px at 45% 60%, rgba(80, 80, 120, 0.2) 0%, transparent 70%),
          radial-gradient(circle 2px at 55% 35%, rgba(100, 60, 60, 0.15) 0%, transparent 70%),
          repeating-linear-gradient(
            transparent,
            transparent 28px,
            rgba(135, 150, 165, 0.3) 28px,
            rgba(135, 150, 165, 0.3) 29px
          ),
          linear-gradient(
            135deg,
            #f4f1e8 0%,
            #ede6d3 25%,
            #e8dcc0 50%,
            #e0d0a8 75%,
            #d4c5a0 100%
          )
        `,
        boxShadow: `
          inset 0 0 50px rgba(139, 115, 85, 0.1),
          inset 0 0 100px rgba(101, 67, 33, 0.05),
          0 4px 8px rgba(0, 0, 0, 0.1)
        `,
      }}
    >
      {/* Worn edges overlay */}
      <div
        className="absolute inset-0 pointer-events-none rounded-[3px]"
        style={{
          background: `
            linear-gradient(0deg, rgba(139, 115, 85, 0.1) 0%, transparent 10%),
            linear-gradient(90deg, rgba(139, 115, 85, 0.08) 0%, transparent 5%),
            linear-gradient(180deg, rgba(139, 115, 85, 0.1) 0%, transparent 10%),
            linear-gradient(270deg, rgba(139, 115, 85, 0.08) 0%, transparent 5%)
          `,
        }}
      />

      {/* Header */}
      <div className="flex items-center text-[#6E5034] justify-between">
        <div className='px-4 py-2 flex cursor-pointer'>
          <button
            onClick={() => setView('regular')}
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

      {/* Invisible clickable area for new entry at the bottom */}
      <NewEntryBtn date={date} />

      {/* Content with relative positioning to stay above the overlay */}
      <div className="relative z-10 space-y-6">
        {entries.map((entry) => (
          <DiaryViewEntry key={entry.id} entry={entry} />
        ))}

      </div>
    </div>
  );
};

export default DiaryView;