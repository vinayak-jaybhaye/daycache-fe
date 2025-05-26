type Media = {
  id: string | number;
  type: "image" | "video" | "audio";
  url: string;
};

type Entry = {
  id: string | number;
  created_at: string;
  content: string;
  media?: Media[];
};

type DiaryViewProps = {
  entries: Entry[];
};

const DiaryView = ({ entries }: DiaryViewProps) => {
  return (
    <div className="bg-[#fef9e7] min-h-screen py-10 px-4 sm:px-10 font-serif relative">
      {/* Diary page texture and lines */}
      <div className="absolute inset-0 bg-repeat-y bg-left-top bg-[linear-gradient(to_bottom,#8b8b8b_1px,transparent_1px)] bg-[length:100%_32px] opacity-20 pointer-events-none"></div>

      {/* Diary binding effect */}
      <div className="absolute left-0 top-0 w-4 h-full bg-gradient-to-r from-amber-800 to-amber-900 opacity-50"></div>

      <div className="max-w-2xl mx-auto relative">
        {entries.map((entry) => (
          <div
            key={entry.id}
            className="mb-8 p-6 bg-white/95 rounded-sm shadow-[0_1px_4px_rgba(0,0,0,0.15)] border-l-8 border-amber-700 hover:shadow-lg transition-shadow duration-200"
          >
            {/* Date stamp */}
            <div className="mb-4 flex items-center">
              <span className="text-sm text-amber-700 font-semibold italic mr-2">
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
            <p className="text-lg text-gray-800 mb-4 whitespace-pre-line leading-relaxed tracking-wide font-cursive">
              {entry.content}
            </p>

            {/* Media attachments */}
            {entry.media &&
              entry.media.map((media) => (
                <div key={media.id} className="my-6">
                  {media.type === "image" && (
                    <div className="border-4 border-amber-50 shadow-inner p-1 bg-amber-50">
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
                      className="rounded-sm border-2 border-amber-100 filter sepia"
                    />
                  )}
                  {media.type === "audio" && (
                    <div className="bg-amber-50 p-3 rounded-sm border border-amber-200">
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
