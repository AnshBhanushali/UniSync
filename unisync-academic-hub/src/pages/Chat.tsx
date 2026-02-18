import { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { ConversationSidebar } from "@/components/chat/ConversationSidebar";
import { MessageBubble } from "@/components/chat/MessageBubble";
import { ChatInput } from "@/components/chat/ChatInput";
import { SuggestedPrompts } from "@/components/chat/SuggestedPrompts";
import {
  useApiQuery,
  useApiMutation,
  apiFetch,
} from "@/lib/api";
import type { Message, Conversation } from "@/types/chat";

// Define the shape of responses from your backend endpoints
interface CreateConversationResponse extends Conversation {} // or just Conversation if id/title are already in type

interface SendMessageResponse {
  assistant: string; // what your /messages endpoint returns
}

export default function Chat() {
  const location = useLocation();
  const queryClient = useQueryClient();
  const initialMessage = location.state?.initialMessage;
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [activeConversationId, setActiveConversationId] = useState<string>();

  // Fetch all conversations
  const {
    data: conversations = [],
    isLoading: convLoading,
    error: convError,
  } = useApiQuery<Conversation[]>("conversations", "/chat/conversations");

  // Fetch messages for active conversation
  const {
    data: messages = [],
    isLoading: messagesLoading,
  } = useApiQuery<Message[]>(
    ["messages", activeConversationId],
    activeConversationId ? `/chat/conversations/${activeConversationId}/messages` : "",
    { enabled: !!activeConversationId }
  );

  // Mutation for sending a message
  const sendMessageMutation = useApiMutation<SendMessageResponse, { convoId: string; content: string }>(
    async ({ convoId, content }) => {
      return apiFetch<SendMessageResponse>(`/chat/conversations/${convoId}/messages`, {
        method: "POST",
        body: JSON.stringify({ content }),
      });
    },
    {
      onMutate: async ({ convoId, content }) => {
        // Optimistic update
        const userMessage: Message = {
          id: Date.now().toString(),
          role: "user",
          content,
          timestamp: new Date(),
        };

        queryClient.setQueryData<Message[]>(
          ["messages", convoId],
          (old = []) => [...old, userMessage]
        );

        return { convoId };
      },
      onSuccess: (assistantResponse, { convoId }) => {
        // Add assistant message from backend response
        const assistantMessage: Message = {
          id: Date.now().toString() + "-assistant",
          role: "assistant",
          content: assistantResponse.assistant,
          timestamp: new Date(),
        };

        queryClient.setQueryData<Message[]>(
          ["messages", convoId],
          (old = []) => [...old, assistantMessage]
        );

        // Invalidate conversations list to update last message/title
        queryClient.invalidateQueries({ queryKey: ["conversations"] });
      },
      onError: (err, { convoId }) => {
        // Rollback optimistic update on error
        queryClient.setQueryData<Message[]>(["messages", convoId], (old) =>
          old?.filter((m) => m.role !== "user" || !m.content.includes("...thinking...")) ?? []
        );
      },
    }
  );

  // Mutation for creating new conversation
  const createConversationMutation = useApiMutation<CreateConversationResponse, void>(
    () => apiFetch<CreateConversationResponse>("/chat/conversations", { method: "POST" }),
    {
      onSuccess: (newConvo) => {
        setActiveConversationId(newConvo.id);
        queryClient.setQueryData<Conversation[]>(
          ["conversations"],
          (old = []) => [newConvo, ...old]
        );
      },
    }
  );

  // Handle initial message from home page
  useEffect(() => {
    if (initialMessage) {
      createConversationMutation.mutate(undefined, {
        onSuccess: (newConvo) => {
          sendMessageMutation.mutate({
            convoId: newConvo.id,
            content: initialMessage,
          });
        },
      });
      window.history.replaceState({}, document.title);
    }
  }, [initialMessage]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleNewConversation = () => {
    createConversationMutation.mutate();
  };

  const handleSubmit = (content: string) => {
    if (!activeConversationId) {
      createConversationMutation.mutate(undefined, {
        onSuccess: (newConvo) => {
          sendMessageMutation.mutate({ convoId: newConvo.id, content });
        },
      });
    } else {
      sendMessageMutation.mutate({ convoId: activeConversationId, content });
    }
  };

  const handleDeleteConversation = async (id: string) => {
    // Optional: add DELETE endpoint later
    // await apiFetch(`/chat/conversations/${id}`, { method: "DELETE" });
    queryClient.setQueryData<Conversation[]>(
      ["conversations"],
      (old) => old?.filter((c) => c.id !== id) ?? []
    );
    if (activeConversationId === id) {
      setActiveConversationId(undefined);
    }
  };

  return (
    <div className="flex h-screen pt-16">
      {/* Sidebar */}
      <ConversationSidebar
        conversations={conversations}
        activeId={activeConversationId}
        onSelect={setActiveConversationId}
        onNew={handleNewConversation}
        onDelete={handleDeleteConversation}
        isLoading={convLoading}
      />

      {/* Main chat area */}
      <main className="flex flex-1 flex-col">
        {messagesLoading || convLoading ? (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-muted-foreground">Loading...</p>
          </div>
        ) : messages.length === 0 && !activeConversationId ? (
          <div className="flex-1 flex flex-col items-center justify-center">
            <p className="mb-6 text-lg text-muted-foreground">
              Start a new conversation or select one from the sidebar.
            </p>
            <SuggestedPrompts onSelect={handleSubmit} />
          </div>
        ) : (
          <>
            {/* Messages */}
            <div className="flex-1 overflow-y-auto">
              <div className="mx-auto max-w-3xl px-4 py-6">
                <div className="space-y-6">
                  {messages.map((message) => (
                    <MessageBubble key={message.id} message={message} />
                  ))}
                  {sendMessageMutation.isPending && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground animate-pulse">
                      <span className="inline-block h-2 w-2 rounded-full bg-primary" />
                      <span className="inline-block h-2 w-2 rounded-full bg-primary animation-delay-150" />
                      <span className="inline-block h-2 w-2 rounded-full bg-primary animation-delay-300" />
                      <span>UniSync is thinking...</span>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </div>
            </div>

            {/* Input */}
            <div className="border-t border-border bg-background p-4">
              <div className="mx-auto max-w-3xl">
                <ChatInput
                  onSubmit={handleSubmit}
                  disabled={sendMessageMutation.isPending}
                />
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}