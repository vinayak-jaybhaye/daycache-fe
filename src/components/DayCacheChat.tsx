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
    <div className="flex flex-col w-full h-full bg-card border rounded-xl shadow-xl overflow-hidden">
      {/* Header */}
      <div className="bg-primary p-3 text-center text-primary-foreground font-semibold">
        <span className="text-xl mr-2">💬</span> DayCache Chat
      </div>

      {/* Chat messages */}
      <div
        ref={chatRef}
        className="flex-1 overflow-y-auto p-4 space-y-3 max-h-[40vh] scrollbar-hide bg-background/50"
      >
        {messages.length === 0 && (
          <div className="text-center py-8 text-muted-foreground italic">
            Ask Cache about your journal entries or for writing prompts!
          </div>
        )}

        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex items-start gap-2 ${
              msg.sender === "user" ? "flex-row-reverse" : ""
            }`}
          >
            <div
              className={`w-8 h-8 flex items-center justify-center rounded-full text-white text-sm ${
                msg.sender === "user"
                  ? "bg-gradient-to-br from-primary to-primary/80"
                  : "bg-gradient-to-br from-secondary to-secondary/80"
              }`}
            >
              {msg.sender === "user" ? "👤" : "🤖"}
            </div>

            <div
              className={`max-w-[70%] p-3 rounded-lg text-sm ${
                msg.sender === "user"
                  ? "bg-gradient-to-br from-primary to-primary/90 text-primary-foreground shadow-lg"
                  : "bg-card text-foreground shadow-md border border-border"
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-center pt-2">
            <div className="bg-card px-4 py-2 rounded-full shadow-md border border-border text-sm text-muted-foreground flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              Thinking...
            </div>
          </div>
        )}
      </div>

      {/* Input area */}
      <div className="p-4 border-t border-border bg-card/90 backdrop-blur-sm">
        <div className="flex gap-2">
          <input
            value={input}
            onChange={handleInputChange}
            placeholder="Type your message..."
            className="flex-1 p-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring bg-background"
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSend();
            }}
          />
          <button
            onClick={handleSend}
            disabled={loading || !input.trim()}
            className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${
              loading || !input.trim()
                ? "bg-primary/50 text-primary-foreground cursor-not-allowed"
                : "bg-primary text-primary-foreground hover:bg-primary/90"
            }`}
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

export default DayCacheChat;
