import { BookOpen, Calendar, Clock, Video, GraduationCap, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import { SourceBadge } from "@/components/chat/SourceBadge";
import type { TimelineItem, SourceType } from "@/types/chat";
import { format, isToday, isTomorrow, addDays } from "date-fns";

// Mock timeline data
const mockTimeline: TimelineItem[] = [
  {
    id: "1",
    type: "class",
    title: "CS 301 - Algorithms",
    time: "9:00 AM - 10:30 AM",
    date: new Date(),
    source: "calendar",
    location: "Engineering Hall 204",
  },
  {
    id: "2",
    type: "meeting",
    title: "Study Group Session",
    time: "3:00 PM - 4:00 PM",
    date: new Date(),
    source: "calendar",
    location: "Library Room 3B",
  },
  {
    id: "3",
    type: "deadline",
    title: "Algorithm Analysis Problem Set",
    time: "11:59 PM",
    date: addDays(new Date(), 1),
    source: "canvas",
    course: "CS 301",
  },
  {
    id: "4",
    type: "class",
    title: "MATH 245 - Linear Algebra",
    time: "11:00 AM - 12:30 PM",
    date: addDays(new Date(), 1),
    source: "calendar",
    location: "Science Building 110",
  },
  {
    id: "5",
    type: "event",
    title: "Career Fair - Tech Companies",
    time: "1:00 PM - 5:00 PM",
    date: addDays(new Date(), 2),
    source: "events",
    location: "Student Center Ballroom",
  },
  {
    id: "6",
    type: "deadline",
    title: "Linear Algebra Exercises",
    time: "11:59 PM",
    date: addDays(new Date(), 3),
    source: "canvas",
    course: "MATH 245",
  },
];

const typeIcons: Record<TimelineItem["type"], typeof BookOpen> = {
  class: BookOpen,
  deadline: Clock,
  meeting: Video,
  event: GraduationCap,
};

const typeLabels: Record<TimelineItem["type"], string> = {
  class: "Class",
  deadline: "Due",
  meeting: "Meeting",
  event: "Event",
};

function TimelineItemCard({ item }: { item: TimelineItem }) {
  const Icon = typeIcons[item.type];

  return (
    <div className="group relative flex gap-4 pl-8">
      {/* Timeline dot */}
      <div className="absolute left-0 top-1.5 flex h-4 w-4 items-center justify-center">
        <span className={cn(
          "h-2.5 w-2.5 rounded-full transition-smooth",
          item.type === "deadline" ? "bg-source-email" :
          item.type === "class" ? "bg-source-canvas" :
          item.type === "meeting" ? "bg-source-calendar" :
          "bg-source-events"
        )} />
      </div>

      <div className="flex-1 rounded-xl border border-border bg-card p-4 transition-smooth hover:border-primary/30 hover:shadow-soft">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 space-y-1">
            <div className="flex items-center gap-2">
              <span className={cn(
                "inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-medium",
                item.type === "deadline" && "bg-source-email/10 text-source-email",
                item.type === "class" && "bg-source-canvas/10 text-source-canvas",
                item.type === "meeting" && "bg-source-calendar/10 text-source-calendar",
                item.type === "event" && "bg-source-events/10 text-source-events",
              )}>
                <Icon className="h-3 w-3" />
                {typeLabels[item.type]}
              </span>
              {item.course && (
                <span className="text-xs text-muted-foreground">{item.course}</span>
              )}
            </div>
            <h3 className="font-medium text-foreground">{item.title}</h3>
            <p className="text-sm font-medium text-primary">{item.time}</p>
            {item.location && (
              <p className="flex items-center gap-1 text-xs text-muted-foreground">
                <MapPin className="h-3 w-3" />
                {item.location}
              </p>
            )}
          </div>
          <SourceBadge type={item.source} />
        </div>
      </div>
    </div>
  );
}

function TimelineSection({ 
  title, 
  items 
}: { 
  title: string; 
  items: TimelineItem[];
}) {
  if (items.length === 0) return null;

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-foreground">{title}</h2>
      <div className="relative space-y-4">
        {/* Vertical line */}
        <div className="absolute bottom-0 left-[7px] top-0 w-px bg-border" />
        {items.map((item) => (
          <TimelineItemCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}

export default function Schedule() {
  // Group items by day
  const todayItems = mockTimeline.filter((item) => isToday(item.date));
  const tomorrowItems = mockTimeline.filter((item) => isTomorrow(item.date));
  const thisWeekItems = mockTimeline.filter(
    (item) => !isToday(item.date) && !isTomorrow(item.date)
  );

  return (
    <div className="min-h-screen px-4 pt-24 pb-12">
      <div className="mx-auto max-w-2xl space-y-8">
        {/* Header */}
        <div className="animate-fade-in">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            Your Schedule
          </h1>
          <p className="mt-1 text-muted-foreground">
            Upcoming classes, deadlines, and events
          </p>
        </div>

        {/* Timeline sections */}
        <div className="space-y-8 animate-fade-in-up">
          <TimelineSection title="Today" items={todayItems} />
          <TimelineSection title="Tomorrow" items={tomorrowItems} />
          <TimelineSection title="This Week" items={thisWeekItems} />
        </div>

        {mockTimeline.length === 0 && (
          <div className="rounded-xl border border-dashed border-border p-12 text-center">
            <Calendar className="mx-auto h-12 w-12 text-muted-foreground/50" />
            <h3 className="mt-4 font-medium text-foreground">No upcoming items</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Your schedule is clear for now.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
