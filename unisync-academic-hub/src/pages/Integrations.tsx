import { CheckCircle2, Clock, XCircle, RefreshCw, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import type { Integration } from "@/types/chat";
import { formatDistanceToNow } from "date-fns";

const mockIntegrations: Integration[] = [
  {
    id: "canvas",
    name: "Canvas LMS",
    icon: "📘",
    status: "connected",
    lastSync: new Date(Date.now() - 1000 * 60 * 5),
    permissions: ["View assignments and deadlines", "Read course announcements", "Access grades"],
  },
  {
    id: "outlook",
    name: "Outlook Calendar",
    icon: "📅",
    status: "connected",
    lastSync: new Date(Date.now() - 1000 * 60 * 2),
    permissions: ["View calendar events", "Read meeting invitations"],
  },
  {
    id: "email",
    name: "University Email",
    icon: "📧",
    status: "connected",
    lastSync: new Date(Date.now() - 1000 * 60 * 10),
    permissions: ["Read email subjects and summaries", "Detect important notifications"],
  },
  {
    id: "corq",
    name: "Corq Events",
    icon: "🎓",
    status: "pending",
    permissions: ["View campus events", "Access event details and locations"],
  },
  {
    id: "library",
    name: "Library System",
    icon: "📚",
    status: "not_connected",
    permissions: ["View due dates", "Check book availability"],
  },
];

const statusConfig = {
  connected: {
    icon: CheckCircle2,
    label: "Connected",
    className: "text-source-events",
  },
  pending: {
    icon: Clock,
    label: "Pending",
    className: "text-source-calendar",
  },
  not_connected: {
    icon: XCircle,
    label: "Not connected",
    className: "text-muted-foreground",
  },
};

function IntegrationCard({ integration }: { integration: Integration }) {
  const status = statusConfig[integration.status];
  const StatusIcon = status.icon;

  return (
    <div className={cn(
      "rounded-xl border border-border bg-card p-5 transition-smooth",
      integration.status === "connected" && "hover:border-primary/30 hover:shadow-soft"
    )}>
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <span className="text-3xl">{integration.icon}</span>
          <div>
            <h3 className="font-medium text-foreground">{integration.name}</h3>
            <div className="mt-1 flex items-center gap-1.5">
              <StatusIcon className={cn("h-4 w-4", status.className)} />
              <span className={cn("text-sm", status.className)}>{status.label}</span>
            </div>
          </div>
        </div>
        
        {integration.status === "connected" && integration.lastSync && (
          <Button variant="ghost" size="sm" className="h-8 gap-1.5 text-xs text-muted-foreground">
            <RefreshCw className="h-3 w-3" />
            Sync
          </Button>
        )}
        
        {integration.status === "not_connected" && (
          <Button size="sm" className="h-8">
            Connect
          </Button>
        )}
        
        {integration.status === "pending" && (
          <Button variant="outline" size="sm" className="h-8">
            Complete Setup
          </Button>
        )}
      </div>

      {/* Last sync time */}
      {integration.lastSync && (
        <p className="mt-3 text-xs text-muted-foreground">
          Last synced {formatDistanceToNow(integration.lastSync, { addSuffix: true })}
        </p>
      )}

      {/* Permissions */}
      <div className="mt-4 space-y-1.5">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
          Permissions
        </p>
        <ul className="space-y-1">
          {integration.permissions.map((perm, index) => (
            <li key={index} className="flex items-center gap-2 text-sm text-foreground">
              <span className="h-1 w-1 rounded-full bg-muted-foreground/40" />
              {perm}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default function Integrations() {
  const connectedCount = mockIntegrations.filter((i) => i.status === "connected").length;

  return (
    <div className="min-h-screen px-4 pt-24 pb-12">
      <div className="mx-auto max-w-3xl space-y-8">
        {/* Header */}
        <div className="animate-fade-in">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            Integrations
          </h1>
          <p className="mt-1 text-muted-foreground">
            {connectedCount} of {mockIntegrations.length} services connected
          </p>
        </div>

        {/* Integration cards */}
        <div className="grid gap-4 sm:grid-cols-2 animate-fade-in-up">
          {mockIntegrations.map((integration) => (
            <IntegrationCard key={integration.id} integration={integration} />
          ))}
        </div>

        {/* Info footer */}
        <div className="rounded-lg border border-border bg-muted/30 p-4 text-sm text-muted-foreground">
          <p className="flex items-center gap-2">
            <ExternalLink className="h-4 w-4" />
            UniSync only accesses data you explicitly allow. Your credentials are never stored.
          </p>
        </div>
      </div>
    </div>
  );
}
