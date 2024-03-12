import { forwardRef, useEffect, useRef, useState } from "react";
import "./Chat.css";
import { useMessages } from "./useMessages";
import { useSendMessage } from "./useSendMessages";
import { useWaiting } from "./useWaiting";

interface ChatProps {
  onBlur: () => void;
}

export const Chat = ({ onBlur }: ChatProps) => {
  const [collapsed, setCollapsed] = useState(true);
  const messages = useMessages();
  const waiting = useWaiting();

  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const focus = (e: KeyboardEvent) => {
      // Focus
      if ((collapsed && e.key.match(/^[a-zA-Z]$/)) || e.key === "Tab") {
        if (collapsed) {
          setCollapsed(false);
        }
        inputRef.current?.focus();
      }

      // Unfocus
      if ((!collapsed && e.key === "Escape") || e.key === "Tab") {
        inputRef.current?.blur();
        setCollapsed(true);
      }
    };

    document.addEventListener("keydown", focus);

    return () => {
      document.removeEventListener("keydown", focus);
    };
  }, [inputRef, collapsed]);

  return (
    <div
      tabIndex={0}
      className="chat"
      onClick={() => collapsed && inputRef.current?.focus()}
      {...(collapsed && {
        className: "chat collapsed",
        onClick: () => {
          setCollapsed(false);
          inputRef.current?.focus();
        },
      })}
    >
      <div className="chat-content">
        <div className="messages">
          {[
            ...messages,
            ...(waiting
              ? [
                  {
                    author: "AI",
                    content: "Thinking...",
                  },
                ]
              : []),
          ]
            .reverse()
            .map((message, i) => (
              <Message
                key={i}
                author={message.author}
                content={message.content}
                you={message.you}
              />
            ))}
        </div>
        <ChatInput
          ref={inputRef}
          onFocus={() => setCollapsed(false)}
          onBlur={onBlur}
        />
      </div>
      <button
        className="collapse-button"
        onClick={() => {
          setCollapsed(!collapsed);
          if (!collapsed) {
            inputRef.current?.blur();
          }
        }}
        {...(collapsed && {
          style: {
            background: "rgba(255, 255, 255, 0.4)",
          },
        })}
      >
        {collapsed ? (
          <span className="material-symbols-outlined">open_run</span>
        ) : (
          <span className="material-symbols-outlined">collapse_content</span>
        )}
      </button>
    </div>
  );
};

interface MessageProps {
  author: string;
  content: string;
  you?: boolean;
}

const Message = ({ author, content, you }: MessageProps) => {
  return (
    <div className={you ? "message you" : "message"}>
      <div className="message-author">{author}</div>
      <div className="message-content">{content}</div>
    </div>
  );
};

interface ChatInputProps {
  onFocus: () => void;
  onBlur: () => void;
}

const ChatInput = forwardRef<HTMLTextAreaElement, ChatInputProps>(
  ({ onFocus, onBlur }, ref) => {
    const [text, setText] = useState("");
    const send = useSendMessage();

    return (
      <div className={"chat-input"}>
        <textarea
          ref={ref}
          onFocus={onFocus}
          onBlur={onBlur}
          placeholder="Type a message..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              send(text);
              setText("");
            }
          }}
          onInput={(e) => {
            e.currentTarget.style.height = "auto";
            e.currentTarget.style.height = e.currentTarget.scrollHeight + "px";
          }}
        />
      </div>
    );
  }
);
