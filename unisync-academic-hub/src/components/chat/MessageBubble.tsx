import { useState } from "react";
import { Info, ChevronDown, ChevronUp, CheckCircle2, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { SourceBadge } from "./SourceBadge";
import type { Message, SourceSection } from "@/types/chat";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { formatDistanceToNow } from "date-fns";

interface MessageBubbleProps {
  message: Message;
  onShowSources?: () => void;
}

function SourceSectionCard({ section }: { section: SourceSection }) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="rounded-lg border border-border bg-background">
      <CollapsibleTrigger asChild>
        <button className="flex w-full items-center justify-between p-3 text-left transition-smooth hover:bg-muted/50">
          <div className="flex items-center gap-2">
            <SourceBadge type={section.type} />
            <span className="text-sm font-medium">{section.title}</span>
          </div>
          {isOpen ? (
            <ChevronUp className="h-4 w-4 text-muted-foreground" />
          ) : (
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          )}
        </button>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="border-t border-border px-3 pb-3 pt-2">
          <ul className="space-y-2">
            {section.items.map((item) => (
              <li key={item.id} className="flex items-start gap-2 text-sm">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-muted-foreground/40" />
                <div className="flex-1">
                  <span className="font-medium">{item.title}</span>
                  {item.description && (
                    <p className="text-muted-foreground">{item.description}</p>
                  )}
                  {(item.date || item.time) && (
                    <p className="mt-0.5 text-xs text-primary font-medium">
                      {item.date}{item.time && ` · ${item.time}`}
                    </p>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}

export function MessageBubble({ message, onShowSources }: MessageBubbleProps) {
  const isUser = message.role === "user";

  return (
    <div
      className={cn(
        "flex w-full animate-fade-in-up",
        isUser ? "justify-end" : "justify-start"
      )}
    >
      <div
        className={cn(
          "max-w-[85%] space-y-3 md:max-w-[75%]",
          isUser && "text-right"
        )}
      >
        {/* Main bubble */}
        <div
          className={cn(
            "rounded-2xl px-4 py-3",
            isUser
              ? "chat-bubble-user rounded-br-md"
              : "chat-bubble-assistant rounded-bl-md"
          )}
        >
          <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
        </div>

        {/* Source sections for assistant messages */}
        {!isUser && message.sources && message.sources.length > 0 && (
          <div className="space-y-2 pl-1">
            {message.sources.map((section, index) => (
              <SourceSectionCard key={index} section={section} />
            ))}
          </div>
        )}

        {/* Trust indicators for assistant messages */}
        {!isUser && (message.sourcesChecked || message.lastSynced) && (
          <div className="flex items-center gap-3 pl-1 text-xs text-muted-foreground">
            {message.sourcesChecked && (
              <span className="flex items-center gap-1">
                <CheckCircle2 className="h-3 w-3" />
                Checked {message.sourcesChecked.join(" + ")}
              </span>
            )}
            {message.lastSynced && (
              <span>
                Last synced {formatDistanceToNow(message.lastSynced, { addSuffix: true })}
              </span>
            )}
            {message.confidence && (
              <span className="flex items-center gap-1">
                {message.confidence === "high" ? (
                  <CheckCircle2 className="h-3 w-3 text-source-events" />
                ) : (
                  <AlertCircle className="h-3 w-3 text-source-calendar" />
                )}
                {message.confidence === "high" ? "High confidence" : "Partial data"}
              </span>
            )}
            {onShowSources && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onShowSources}
                className="h-auto p-0 text-xs text-muted-foreground hover:text-foreground"
              >
                <Info className="mr-1 h-3 w-3" />
                Details
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
