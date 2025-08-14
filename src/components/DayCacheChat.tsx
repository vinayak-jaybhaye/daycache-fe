import { useState, useEffect, useRef } from "react";
import type { ChangeEvent } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../store/store";
import { Send, Loader2 } from "lucide-react";

interface Message {
  text: string;
  sender: "user" | "ai";
}

function DayCacheChat() {
  const user = useSelector((state: RootState) => state.user.user);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatRef = useRef<HTMLDivElement | null>(null);

  // Scroll to bottom on new messages
  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const newMessage: Message = { text: input, sender: "user" };
    setMessages((prev) => [...prev, newMessage]);
    setInput("");

    try {
      setLoading(true);
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/users/${user?.id}/cachechat`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ content: input }),
          credentials: "include",
        }
      );

      if (!response.ok) throw new Error("Failed to get response");

      const data = await response.json();
      setMessages((prev) => [...prev, { text: data, sender: "ai" }]);
    } catch (error) {
      console.error("Error sending message:", error);
      setMessages((prev) => [
        ...prev,
        { text: "Failed to get response. Try again.", sender: "ai" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  return (
    <div
      className="flex flex-col w-full h-[90vh] border"
      style={{
        backgroundColor: 'var(--color-surface-primary)',
        borderColor: 'var(--color-border-primary)',
        boxShadow: 'var(--shadow-lg)'
      }}
    >
      <div
        ref={chatRef}
        className="flex-1 p-4 max-h-[90vh] overflow-scroll scrollbar-hide"
        style={{
          backgroundColor: 'var(--color-bg-secondary)'
        }}
      >
        {messages.length === 0 && (
          <div
            className="text-center py-12 px-4"
          >
            <div
              className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4"
              style={{ backgroundColor: 'var(--color-surface-tertiary)' }}
            >
              <span className="text-2xl"><img src="/open-book.png" /></span>
            </div>
            <p
              className="text-lg font-medium mb-2"
              style={{ color: 'var(--color-text-primary)' }}
            >
              Welcome to DayCache Chat!
            </p>
            <p
              className="text-sm max-w-md mx-auto"
              style={{ color: 'var(--color-text-tertiary)' }}
            >
              Ask me about your journal entries, get writing prompts, or discuss your thoughts. I'm here to help you explore your memories and ideas.
            </p>
          </div>
        )}

        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex gap-3 ${msg.sender === "user" ? "flex-row-reverse" : ""}`}
          >
            {/* Avatar */}
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center text-white font-medium shadow-sm flex-shrink-0"
              style={{
                backgroundColor: msg.sender === "user"
                  ? 'var(--color-primary)'
                  : 'var(--color-secondary)',
                boxShadow: 'var(--shadow-sm)'
              }}
            >
              {msg.sender === "user" ? (
                <span className="text-sm">👤</span>
              ) : (
                <span className="text-sm"><img src="/open-book.png" /></span>
              )}
            </div>

            {/* Message bubble */}
            <div className={`flex-1 max-w-[75%] md:max-w-[55%] ${msg.sender === "user" && "text-end"}`} >
              <div
                className={`inline-block p-4 rounded-2xl text-sm leading-relaxed ${msg.sender === "user" ? "ml-auto" : ""}`}
                style={{
                  backgroundColor: msg.sender === "user"
                    ? 'var(--color-primary)'
                    : 'var(--color-surface-primary)',
                  color: msg.sender === "user"
                    ? 'var(--color-text-inverse)'
                    : 'var(--color-text-primary)',
                  boxShadow: msg.sender === "user"
                    ? 'var(--shadow-md)'
                    : 'var(--shadow-sm)',
                  border: msg.sender === "user"
                    ? 'none'
                    : `1px solid var(--color-border-primary)`,
                  borderRadius: msg.sender === "user"
                    ? '18px 18px 4px 18px'
                    : '4px 18px 18px 18px'
                }}
              >
                {msg.text}
              </div>

              {/* Timestamp placeholder */}
              <div className={`text-xs mt-1 ${msg.sender === "user" ? "text-right" : ""}`}>
                <span style={{ color: 'var(--color-text-quaternary)' }}>
                  Just now
                </span>
              </div>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="flex gap-3">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-white font-medium shadow-sm flex-shrink-0"
                style={{
                  backgroundColor: 'var(--color-secondary)',
                  boxShadow: 'var(--shadow-sm)'
                }}
              >
                <span className="text-sm"><img src="/open-book.png" /></span>
              </div>

              <div
                className="px-4 py-3 rounded-2xl text-sm flex items-center gap-2 border"
                style={{
                  backgroundColor: 'var(--color-surface-primary)',
                  boxShadow: 'var(--shadow-sm)',
                  borderColor: 'var(--color-border-primary)',
                  color: 'var(--color-text-secondary)',
                  borderRadius: '4px 18px 18px 18px'
                }}
              >
                <Loader2 className="h-4 w-4 animate-spin" style={{ color: 'var(--color-primary)' }} />
                <span>Cache is thinking...</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input area */}
      <div
        className="p-4 border-t"
        style={{
          backgroundColor: 'var(--color-surface-primary)',
          borderColor: 'var(--color-border-primary)'
        }}
      >
        <div className="flex gap-3 items-end">
          <div className="flex-1">
            <input
              value={input}
              onChange={handleInputChange}
              placeholder="Ask Cache about your entries"
              className="w-full px-4 py-3 border rounded-xl transition-all duration-200 text-sm"
              style={{
                backgroundColor: 'var(--color-surface-secondary)',
                borderColor: 'var(--color-border-secondary)',
                color: 'var(--color-text-primary)'
              }}
              onFocus={(e) => {
                e.currentTarget.style.outline = 'none';
                e.currentTarget.style.borderColor = 'var(--color-border-focus)';
                e.currentTarget.style.boxShadow = `0 0 0 3px var(--color-primary-100)`;
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = 'var(--color-border-secondary)';
                e.currentTarget.style.boxShadow = 'none';
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSend();
              }}
            />
          </div>
          <button
            onClick={handleSend}
            disabled={loading || !input.trim()}
            className="px-2 py-3 rounded-xl transition-all duration-200 flex items-center gap-2 font-medium text-sm"
            style={{
              backgroundColor: loading || !input.trim()
                ? 'var(--color-surface-tertiary)'
                : 'var(--color-primary)',
              color: loading || !input.trim()
                ? 'var(--color-text-secondary)'
                : 'var(--color-text-inverse)',
              cursor: loading || !input.trim() ? 'not-allowed' : 'pointer',
              opacity: loading || !input.trim() ? 0.6 : 1,
              boxShadow: loading || !input.trim() ? 'none' : 'var(--shadow-sm)'
            }}
            onMouseEnter={(e) => {
              if (!loading && input.trim()) {
                e.currentTarget.style.transform = 'translateY(-1px)';
                e.currentTarget.style.boxShadow = 'var(--shadow-md)';
              }
            }}
            onMouseLeave={(e) => {
              if (!loading && input.trim()) {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
              }
            }}
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default DayCacheChat;