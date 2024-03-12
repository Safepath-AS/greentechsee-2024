import { useState } from "react";
import "./Chat.css";
import { useMessages } from "./useMessages";
import { useSendMessage } from "./useSendMessages";

export const Chat = () => {
  const [collapsed, setCollapsed] = useState(true);
  const messages = useMessages();

  return (
    <div
      className="chat"
      {...(collapsed && {
        className: "chat collapsed",
        onClick: () => setCollapsed(false),
      })}
    >
      <div className="chat-content">
        <div className="messages">
          {[...messages].reverse().map((message, i) => (
            <Message
              key={i}
              author={message.author}
              content={message.content}
              you={message.you}
            />
          ))}
        </div>
        <ChatInput />
      </div>
      <button
        className="collapse-button"
        onClick={() => setCollapsed(!collapsed)}
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

const ChatInput = () => {
  const [text, setText] = useState("");
  const send = useSendMessage();

  return (
    <div className={"chat-input"}>
      <textarea
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
};
