import { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { ConversationSidebar } from "@/components/chat/ConversationSidebar";
import { MessageBubble } from "@/components/chat/MessageBubble";
import { ChatInput } from "@/components/chat/ChatInput";
import { SuggestedPrompts } from "@/components/chat/SuggestedPrompts";
import type { Message, Conversation } from "@/types/chat";

// Mock data for demonstration
const mockConversations: Conversation[] = [
  {
    id: "1",
    title: "Assignment deadlines",
    lastMessage: "You have 3 assignments due this week",
    timestamp: new Date(Date.now() - 1000 * 60 * 30),
    messages: [],
  },
  {
    id: "2",
    title: "Today's schedule",
    lastMessage: "Your first class is at 9:00 AM",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
    messages: [],
  },
];

export default function Chat() {
  const location = useLocation();
  const initialMessage = location.state?.initialMessage;
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [conversations, setConversations] = useState(mockConversations);
  const [activeConversationId, setActiveConversationId] = useState<string>();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);

  // Handle initial message from home page
  useEffect(() => {
    if (initialMessage) {
      handleNewConversation();
      handleSubmit(initialMessage);
      // Clear the state to prevent re-triggering
      window.history.replaceState({}, document.title);
    }
  }, [initialMessage]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleNewConversation = () => {
    const newConv: Conversation = {
      id: Date.now().toString(),
      title: "New conversation",
      lastMessage: "",
      timestamp: new Date(),
      messages: [],
    };
    setConversations([newConv, ...conversations]);
    setActiveConversationId(newConv.id);
    setMessages([]);
  };

  const handleSubmit = async (content: string) => {
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);

    // Simulate AI typing
    setIsTyping(true);

    // Simulate AI response after a delay
    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "Based on your connected accounts, here's what I found:",
        timestamp: new Date(),
        sources: [
          {
            type: "canvas",
            title: "Canvas Assignments",
            items: [
              {
                id: "1",
                title: "CS 301 - Algorithm Analysis",
                description: "Problem set on dynamic programming",
                date: "Friday, Jan 31",
                time: "11:59 PM",
              },
              {
                id: "2",
                title: "MATH 245 - Linear Algebra",
                description: "Chapter 5 exercises",
                date: "Saturday, Feb 1",
                time: "11:59 PM",
              },
            ],
          },
          {
            type: "calendar",
            title: "Upcoming Meetings",
            items: [
              {
                id: "3",
                title: "Study Group - CS 301",
                date: "Tomorrow",
                time: "3:00 PM",
              },
            ],
          },
        ],
        confidence: "high",
        sourcesChecked: ["Canvas", "Outlook"],
        lastSynced: new Date(Date.now() - 1000 * 60 * 2),
      };
      setMessages((prev) => [...prev, assistantMessage]);
      setIsTyping(false);

      // Update conversation title and last message
      if (activeConversationId) {
        setConversations((prev) =>
          prev.map((conv) =>
            conv.id === activeConversationId
              ? {
                  ...conv,
                  title: content.slice(0, 30) + (content.length > 30 ? "..." : ""),
                  lastMessage: assistantMessage.content.slice(0, 50),
                  timestamp: new Date(),
                }
              : conv
          )
        );
      }
    }, 1500);
  };

  const handleDeleteConversation = (id: string) => {
    setConversations((prev) => prev.filter((conv) => conv.id !== id));
    if (activeConversationId === id) {
      setActiveConversationId(undefined);
      setMessages([]);
    }
  };

  return (
    <div className="flex h-screen pt-16">
      {/* Sidebar */}
      <ConversationSidebar
        conversations={conversations}
        activeId={activeConversationId}
        onSelect={(id) => {
          setActiveConversationId(id);
          // Load conversation messages here
          setMessages([]);
        }}
        onNew={handleNewConversation}
        onDelete={handleDeleteConversation}
      />

      {/* Main chat area */}
      <main className="flex flex-1 flex-col">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto">
          <div className="mx-auto max-w-3xl px-4 py-6">
            {messages.length === 0 ? (
              <div className="flex min-h-[60vh] flex-col items-center justify-center">
                <p className="mb-6 text-lg text-muted-foreground">
                  Start a new conversation or select one from the sidebar.
                </p>
                <SuggestedPrompts onSelect={handleSubmit} />
              </div>
            ) : (
              <div className="space-y-6">
                {messages.map((message) => (
                  <MessageBubble key={message.id} message={message} />
                ))}
                {isTyping && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground animate-pulse-subtle">
                    <span className="inline-block h-2 w-2 rounded-full bg-primary" />
                    <span className="inline-block h-2 w-2 rounded-full bg-primary animation-delay-150" />
                    <span className="inline-block h-2 w-2 rounded-full bg-primary animation-delay-300" />
                    <span className="ml-2">UniSync is thinking...</span>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>
        </div>

        {/* Fixed input at bottom */}
        <div className="border-t border-border bg-background p-4">
          <div className="mx-auto max-w-3xl">
            <ChatInput onSubmit={handleSubmit} disabled={isTyping} />
          </div>
        </div>
      </main>
    </div>
  );
}
