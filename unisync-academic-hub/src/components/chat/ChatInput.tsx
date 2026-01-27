import { useState, useRef, useEffect } from "react";
import { Send, Mic, MicOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ChatInputProps {
  onSubmit: (message: string) => void;
  placeholder?: string;
  className?: string;
  size?: 'default' | 'large';
  disabled?: boolean;
}

export function ChatInput({ 
  onSubmit, 
  placeholder = "Ask about assignments, emails, schedules, or campus events…",
  className,
  size = 'default',
  disabled = false,
}: ChatInputProps) {
  const [message, setMessage] = useState("");
  const [isListening, setIsListening] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [message]);

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (message.trim() && !disabled) {
      onSubmit(message.trim());
      setMessage("");
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const toggleVoice = () => {
    setIsListening(!isListening);
    // Voice input would be implemented here
  };

  return (
    <form 
      onSubmit={handleSubmit}
      className={cn(
        "relative flex items-end gap-2 rounded-2xl border border-border bg-background shadow-soft transition-smooth",
        size === 'large' && "shadow-elevated",
        "focus-within:border-primary/40 focus-within:ring-2 focus-within:ring-primary/10",
        className
      )}
    >
      <textarea
        ref={textareaRef}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        disabled={disabled}
        rows={1}
        className={cn(
          "flex-1 resize-none bg-transparent outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50",
          size === 'large' ? "min-h-[56px] px-5 py-4 text-base" : "min-h-[48px] px-4 py-3 text-sm",
          "max-h-32"
        )}
      />
      
      <div className={cn(
        "flex items-center gap-1",
        size === 'large' ? "pb-3 pr-3" : "pb-2 pr-2"
      )}>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={toggleVoice}
          className={cn(
            "h-9 w-9 rounded-xl transition-smooth",
            isListening && "bg-destructive/10 text-destructive hover:bg-destructive/20"
          )}
        >
          {isListening ? (
            <MicOff className="h-4 w-4" />
          ) : (
            <Mic className="h-4 w-4 text-muted-foreground" />
          )}
        </Button>
        
        <Button
          type="submit"
          size="icon"
          disabled={!message.trim() || disabled}
          className={cn(
            "h-9 w-9 rounded-xl transition-smooth",
            "disabled:opacity-40"
          )}
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </form>
  );
}
