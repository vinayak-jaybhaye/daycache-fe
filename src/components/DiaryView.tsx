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
          className="mb-8 p-6 rounded-sm border transition-shadow duration-200"
          style={{
            backgroundColor: 'var(--color-surface-primary)',
            borderColor: 'var(--color-border-primary)',
            boxShadow: 'var(--shadow-base)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow = 'var(--shadow-base)';
          }}
        >
          {/* Date stamp */}
          <div className="mb-4 flex items-center">
            <span
              className="text-sm font-semibold mr-2"
              style={{ color: 'var(--color-primary)' }}
            >
              {new Date(entry.created_at).toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
            <div
              className="h-px flex-1"
              style={{ backgroundColor: 'var(--color-border-secondary)' }}
            ></div>
          </div>

          {/* Diary content */}
          <p
            className="text-lg mb-4 whitespace-pre-line leading-relaxed tracking-wide"
            style={{ color: 'var(--color-text-primary)' }}
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
                      backgroundColor: 'var(--color-surface-secondary)',
                      boxShadow: 'var(--shadow-inner)'
                    }}
                  >
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