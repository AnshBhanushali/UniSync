import { useState } from "react";
import { Plus, MessageSquare, ChevronLeft, ChevronRight, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import type { Conversation } from "@/types/chat";
import { formatDistanceToNow } from "date-fns";

interface ConversationSidebarProps {
  conversations: Conversation[];
  activeId?: string;
  onSelect: (id: string) => void;
  onNew: () => void;
  onDelete?: (id: string) => void;
  isLoading?: boolean;
}

export function ConversationSidebar({
  conversations,
  activeId,
  onSelect,
  onNew,
  onDelete,
  isLoading = false,
}: ConversationSidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  if (isLoading) {
    return (
      <aside
        className={cn(
          "relative flex h-full flex-col border-r border-border bg-sidebar transition-all duration-300",
          isCollapsed ? "w-14" : "w-72"
        )}
      >
        <div className="flex items-center border-b border-sidebar-border p-3 justify-center">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
        <div className="flex-1 p-3 space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-10 bg-muted/50 rounded animate-pulse" />
          ))}
        </div>
      </aside>
    );
  }

  return (
    <aside
      className={cn(
        "relative flex h-full flex-col border-r border-border bg-sidebar transition-all duration-300",
        isCollapsed ? "w-14" : "w-72"
      )}
    >
      {/* Header */}
      <div
        className={cn(
          "flex items-center border-b border-sidebar-border p-3",
          isCollapsed ? "justify-center" : "justify-between"
        )}
      >
        {!isCollapsed && (
          <h2 className="text-sm font-semibold text-sidebar-foreground">Conversations</h2>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="h-8 w-8 shrink-0"
        >
          {isCollapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* New conversation button */}
      <div className="p-3">
        <Button
          onClick={onNew}
          variant="outline"
          className={cn(
            "w-full justify-start gap-2 border-dashed",
            isCollapsed && "justify-center px-0"
          )}
        >
          <Plus className="h-4 w-4" />
          {!isCollapsed && <span>New Conversation</span>}
        </Button>
      </div>

      {/* Conversation list */}
      <div className="flex-1 overflow-y-auto px-3 pb-3">
        <div className="space-y-1">
          {conversations.map((conv) => {
            // Safe timestamp handling
            const timestamp = conv.timestamp ? new Date(conv.timestamp) : null;
            const timeDisplay = timestamp && !isNaN(timestamp.getTime())
              ? formatDistanceToNow(timestamp, { addSuffix: true })
              : "Just now";

            return (
              <button
                key={conv.id}
                onClick={() => onSelect(conv.id)}
                className={cn(
                  "group flex w-full items-start gap-3 rounded-lg p-2.5 text-left transition-smooth",
                  activeId === conv.id
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground hover:bg-sidebar-accent/50"
                )}
              >
                <MessageSquare className="mt-0.5 h-4 w-4 shrink-0" />

                {!isCollapsed && (
                  <div className="flex-1 overflow-hidden">
                    <p className="truncate text-sm font-medium">
                      {conv.title || "Untitled"}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">
                      {conv.lastMessage || "No messages yet"}
                    </p>
                    <p className="mt-1 text-2xs text-muted-foreground">
                      {timeDisplay}
                    </p>
                  </div>
                )}

                {!isCollapsed && onDelete && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(conv.id);
                    }}
                    className="h-6 w-6 shrink-0 opacity-0 transition-opacity group-hover:opacity-100"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </aside>
  );
}