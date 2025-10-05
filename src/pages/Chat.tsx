import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Mic } from "lucide-react";
import { ChatMessage, Message } from "@/components/ChatMessage";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import logo from "@/assets/logo.png";

const Chat = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      navigate("/signin");
      return;
    }
    
    await loadMessages();
  };

  const loadMessages = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: true });

      if (error) throw error;

      if (data && data.length > 0) {
        const loadedMessages: Message[] = data.map(msg => ({
          id: msg.id,
          type: msg.type as "user" | "ai",
          content: msg.content,
          timestamp: new Date(msg.created_at),
        }));
        setMessages(loadedMessages);
      } else {
        const welcomeMsg: Message = {
          id: "welcome",
          type: "ai",
          content: "Hey! 👋 I'm your AI money buddy. Just tell me what you spent - like 'netflix charged me $17.99' or 'spent $45 on groceries'",
          timestamp: new Date(),
        };
        setMessages([welcomeMsg]);

        const { error: welcomeError } = await supabase.from('chat_messages')
          .insert({
            user_id: user.id,
            type: 'ai',
            content: welcomeMsg.content
          });
        if (welcomeError) {
          console.error('Failed to save welcome message:', welcomeError);
        }
      }
    } catch (error) {
      console.error('Error loading messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async () => {
    if (!input.trim() || sending) return;

    const userInput = input;
    setInput("");
    setSending(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const userMessage: Message = {
        id: Date.now().toString(),
        type: "user",
        content: userInput,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, userMessage]);

      const { error: insertUserError } = await supabase
        .from('chat_messages')
        .insert({
          user_id: user.id,
          type: 'user',
          content: userInput
        });
      if (insertUserError) {
        console.error('Failed to save user message:', insertUserError);
      }

      const conversationHistory = [...messages, userMessage].map(msg => ({
        role: msg.type === "user" ? "user" : "assistant",
        content: msg.content
      }));

      const { data, error } = await supabase.functions.invoke('parse-expense', {
        body: { message: userInput, conversationHistory }
      });

      if (error) throw error;

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "ai",
        content: data.response,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMessage]);

      const { error: insertAiError } = await supabase
        .from('chat_messages')
        .insert({
          user_id: user.id,
          type: 'ai',
          content: data.response
        });
      if (insertAiError) {
        console.error('Failed to save AI message:', insertAiError);
      }

      if (data.expenseDetected) {
        toast({
          title: "Expense logged! ✅",
          description: "I've saved that to your expenses.",
        });
      }
    } catch (error: any) {
      console.error('Error calling AI:', error);

      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "ai",
        content: "Sorry, I had trouble processing that. Please try again! 😊",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);

      toast({
        title: "Error",
        description: "Failed to process your message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 pb-16">
      {/* Header */}
      <div className="p-3 sm:p-4 border-b border-border/50 backdrop-blur-sm bg-card/30">
        <div className="flex items-center gap-2 sm:gap-3">
          <img src={logo} alt="GoalFlow" className="h-8 w-8 sm:h-10 sm:w-10" />
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-primary">GoalFlow Chat</h1>
            <p className="text-xs sm:text-sm text-muted-foreground">Your AI money buddy</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 sm:space-y-4">
        {messages.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="fixed bottom-16 left-0 right-0 p-3 sm:p-4 border-t border-border/50 backdrop-blur-sm bg-card/95">
        <div className="flex gap-2 max-w-screen-xl mx-auto">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Type your expense..."
            className="flex-1 bg-muted/50 border-border/50 text-sm sm:text-base"
            disabled={sending}
          />
          <Button
            size="icon"
            variant="ghost"
            className="hover:bg-muted/50 flex-shrink-0"
            disabled={sending}
          >
            <Mic className="h-4 w-4 sm:h-5 sm:w-5" />
          </Button>
          <Button
            size="icon"
            onClick={handleSend}
            disabled={sending}
            className="bg-gradient-to-br from-primary to-primary-glow shadow-glow flex-shrink-0"
          >
            <Send className="h-4 w-4 sm:h-5 sm:w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
