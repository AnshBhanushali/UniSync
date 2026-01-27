import { cn } from "@/lib/utils";

interface SuggestedPromptsProps {
  onSelect: (prompt: string) => void;
  className?: string;
}

const suggestions = [
  { text: "What assignments are due this week?", icon: "📚" },
  { text: "Summarize my unread Canvas notifications", icon: "📘" },
  { text: "Do I have any meetings today?", icon: "📅" },
  { text: "What events are happening near me?", icon: "🎓" },
  { text: "Show my upcoming deadlines", icon: "⏰" },
  { text: "Any important emails I missed?", icon: "📧" },
];

export function SuggestedPrompts({ onSelect, className }: SuggestedPromptsProps) {
  return (
    <div className={cn("flex flex-wrap justify-center gap-2", className)}>
      {suggestions.map((suggestion, index) => (
        <button
          key={index}
          onClick={() => onSelect(suggestion.text)}
          className={cn(
            "inline-flex items-center gap-2 rounded-full border border-border bg-background px-4 py-2.5",
            "text-sm text-foreground transition-smooth",
            "hover:border-primary/30 hover:bg-accent hover:shadow-soft",
            "focus:outline-none focus:ring-2 focus:ring-primary/20",
            "animate-fade-in-up"
          )}
          style={{ animationDelay: `${index * 50}ms` }}
        >
          <span>{suggestion.icon}</span>
          <span>{suggestion.text}</span>
        </button>
      ))}
    </div>
  );
}
