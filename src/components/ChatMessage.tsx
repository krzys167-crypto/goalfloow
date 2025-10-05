import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Bot, User } from "lucide-react";

export type Message = {
  id: string;
  type: "user" | "ai";
  content: string;
  timestamp: Date;
};

interface ChatMessageProps {
  message: Message;
}

export const ChatMessage = ({ message }: ChatMessageProps) => {
  const isUser = message.type === "user";

  return (
    <div className={`flex gap-3 ${isUser ? "flex-row-reverse" : "flex-row"} animate-fade-in`}>
      <Avatar className={`h-8 w-8 sm:h-10 sm:w-10 flex-shrink-0 ${isUser ? "bg-primary" : "bg-secondary"}`}>
        <AvatarFallback>
          {isUser ? (
            <User className="h-4 w-4 sm:h-5 sm:w-5 text-primary-foreground" />
          ) : (
            <Bot className="h-4 w-4 sm:h-5 sm:w-5 text-secondary-foreground" />
          )}
        </AvatarFallback>
      </Avatar>
      
      <div
        className={`max-w-[75%] sm:max-w-[80%] rounded-2xl px-4 py-2 sm:px-5 sm:py-3 ${
          isUser
            ? "bg-primary text-primary-foreground"
            : "bg-card border border-border"
        }`}
      >
        <p className="text-sm sm:text-base whitespace-pre-wrap break-words">{message.content}</p>
      </div>
    </div>
  );
};
