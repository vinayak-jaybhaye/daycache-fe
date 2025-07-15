import type { Entry } from '../types'

type DiaryViewProps = {
  entries: Entry[];
};

const DiaryView = ({ entries }: DiaryViewProps) => {
  return (
    <div className="max-w-2xl mx-auto relative">
      {entries.map((entry) => (
        <div
          key={entry.id}
          className="mb-8 p-6 bg-white/95 rounded-sm border-amber-700 hover:shadow-lg transition-shadow duration-200"
        >
          {/* Date stamp */}
          <div className="mb-4 flex items-center">
            <span className="text-sm text-amber-700 font-semibold mr-2">
              {new Date(entry.created_at).toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
            <div className="h-px bg-amber-200 flex-1"></div>
          </div>

          {/* Diary content */}
          <p className="text-lg text-gray-800 mb-4 whitespace-pre-line leading-relaxed tracking-wide">
            {entry.content}
          </p>

          {/* Media attachments */}
          {entry.media &&
            entry.media.map((media) => (
              <div key={media.id} className="flex items-center justify-center">
                {media.type === "image" && (
                  <div className="shadow-inner p-1 bg-amber-50">
                    <img
                      src={media.url}
                      alt="Diary entry"
                      className="rounded-sm filter sepia contrast-75 brightness-105"
                    />
                  </div>
                )}
                {media.type === "video" && (
                  <video
                    controls
                    src={media.url}
                  />
                )}
                {media.type === "video" && (
                  <div>
                    <audio controls src={media.url} className="w-full" />
                  </div>
                )}
              </div>
            ))}
        </div>
      ))}
    </div>
  );
};

export default DiaryView;
