import type { Entry } from '../types'

type DiaryViewProps = {
  entries: Entry[];
};

const DiaryView = ({ entries }: DiaryViewProps) => {
  return (
    <div
      className="w-full mx-auto min-h-[90vh] relative px-4 lg:px-18 lg:py-12 py-6 "
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
        borderRadius: '3px',
      }}
    >
      {/* Worn edges overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            linear-gradient(0deg, rgba(139, 115, 85, 0.1) 0%, transparent 10%),
            linear-gradient(90deg, rgba(139, 115, 85, 0.08) 0%, transparent 5%),
            linear-gradient(180deg, rgba(139, 115, 85, 0.1) 0%, transparent 10%),
            linear-gradient(270deg, rgba(139, 115, 85, 0.08) 0%, transparent 5%)
          `,
          borderRadius: '3px'
        }}
      />

      {/* Content with relative positioning to stay above the overlay */}
      <div className="relative z-10">
        {entries.map((entry) => (
          <div
            key={entry.id}
            className="rounded-sm duration-200"
            style={{
              color: '#2c1810',
              fontFamily: "'Caveat', cursive",
              fontSize: '18px',
              fontWeight: '400'
            }}
          >
            {/* Time stamp */}
            <div className='flex justify-between'>
              <span
                className="text-xs font-semibold mr-2"
                style={{ color: 'var(--color-primary)' }}
              >
                {new Date(entry.created_at).toLocaleTimeString("en-US", {
                  hour: "numeric",
                  minute: "2-digit",
                  hour12: true
                })}
              </span>
              {entry.location && (
                <span>
                  {entry.location}
                </span>
              )}
            </div>

            {/* Diary content */}
            <p
              className="mb-4 leading-relaxed tracking-wide text-[#2c1810]"
            >
              {entry.content}
            </p>

            {/* Media attachments */}
            {entry.media &&
              entry.media.map((media) => (
                <div key={media.id} className="flex items-center justify-center">
                  {media.type === "image" && (
                    <div
                      className="shadow-inner p-1 rounded-sm"
                      style={{
                        backgroundColor: 'rgba(244, 241, 232, 0.3)',
                        boxShadow: 'inset 0 2px 4px rgba(139, 115, 85, 0.2), 0 2px 4px rgba(0, 0, 0, 0.1)'
                      }}
                    >
                      <img
                        src={media.url}
                        alt="Diary entry"
                        className="rounded-sm filter sepia-[0.3] contrast-75 brightness-105"
                        style={{
                          filter: 'sepia(0.3) contrast(0.75) brightness(1.05) saturate(0.8)'
                        }}
                      />
                    </div>
                  )}
                  {media.type === "video" && (
                    <video
                      controls
                      src={media.url}
                      className="rounded-sm"
                      style={{
                        filter: 'sepia(0.1) contrast(0.9) brightness(1.02)'
                      }}
                    />
                  )}
                  {media.type === "audio" && (
                    <div
                      className="w-full p-2 rounded-sm"
                      style={{
                        backgroundColor: 'rgba(244, 241, 232, 0.3)',
                        boxShadow: 'inset 0 1px 2px rgba(139, 115, 85, 0.1)'
                      }}
                    >
                      <audio controls src={media.url} className="w-full" />
                    </div>
                  )}
                </div>
              ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default DiaryView;