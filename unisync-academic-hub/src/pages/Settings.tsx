import { Moon, Sun, Volume2, Eye, Bell, Shield, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

interface SettingsSectionProps {
  title: string;
  icon: typeof Moon;
  children: React.ReactNode;
}

function SettingsSection({ title, icon: Icon, children }: SettingsSectionProps) {
  return (
    <div className="rounded-xl border border-border bg-card">
      <div className="flex items-center gap-3 border-b border-border px-5 py-4">
        <Icon className="h-5 w-5 text-muted-foreground" />
        <h2 className="font-medium text-foreground">{title}</h2>
      </div>
      <div className="p-5 space-y-4">{children}</div>
    </div>
  );
}

interface SettingsRowProps {
  label: string;
  description?: string;
  children: React.ReactNode;
}

function SettingsRow({ label, description, children }: SettingsRowProps) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="space-y-0.5">
        <Label className="text-sm font-medium">{label}</Label>
        {description && (
          <p className="text-xs text-muted-foreground">{description}</p>
        )}
      </div>
      {children}
    </div>
  );
}

export default function Settings() {
  return (
    <div className="min-h-screen px-4 pt-24 pb-12">
      <div className="mx-auto max-w-2xl space-y-6">
        {/* Header */}
        <div className="animate-fade-in">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            Settings
          </h1>
          <p className="mt-1 text-muted-foreground">
            Customize your UniSync experience
          </p>
        </div>

        <div className="space-y-4 animate-fade-in-up">
          {/* Appearance */}
          <SettingsSection title="Appearance" icon={Sun}>
            <SettingsRow 
              label="Dark mode" 
              description="Switch between light and dark themes"
            >
              <Switch />
            </SettingsRow>
          </SettingsSection>

          {/* Voice */}
          <SettingsSection title="Voice" icon={Volume2}>
            <SettingsRow 
              label="Voice input" 
              description="Enable microphone for voice queries"
            >
              <Switch defaultChecked />
            </SettingsRow>
            <Separator />
            <SettingsRow label="Speech speed">
              <div className="w-32">
                <Slider defaultValue={[50]} max={100} step={10} />
              </div>
            </SettingsRow>
          </SettingsSection>

          {/* Accessibility */}
          <SettingsSection title="Accessibility" icon={Eye}>
            <SettingsRow 
              label="Captions" 
              description="Show text captions for voice responses"
            >
              <Switch />
            </SettingsRow>
            <Separator />
            <SettingsRow label="Text size">
              <div className="w-32">
                <Slider defaultValue={[50]} max={100} step={25} />
              </div>
            </SettingsRow>
            <Separator />
            <SettingsRow 
              label="High contrast" 
              description="Increase color contrast for better visibility"
            >
              <Switch />
            </SettingsRow>
          </SettingsSection>

          {/* Privacy */}
          <SettingsSection title="Privacy & Data" icon={Shield}>
            <div className="space-y-3 text-sm">
              <p className="text-muted-foreground">
                UniSync accesses your academic data only when you ask a question. 
                We don't store your emails, assignments, or calendar events.
              </p>
              <button className="flex w-full items-center justify-between rounded-lg bg-muted/50 px-4 py-3 text-left transition-smooth hover:bg-muted">
                <span className="font-medium">View data usage details</span>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </button>
              <button className="flex w-full items-center justify-between rounded-lg bg-muted/50 px-4 py-3 text-left transition-smooth hover:bg-muted">
                <span className="font-medium">Download my data</span>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </button>
              <button className="flex w-full items-center justify-between rounded-lg px-4 py-3 text-left text-destructive transition-smooth hover:bg-destructive/10">
                <span className="font-medium">Delete all my data</span>
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </SettingsSection>

          {/* Notifications */}
          <SettingsSection title="Notifications" icon={Bell}>
            <SettingsRow 
              label="Assignment reminders" 
              description="Get notified about upcoming deadlines"
            >
              <Switch defaultChecked />
            </SettingsRow>
            <Separator />
            <SettingsRow 
              label="Calendar alerts" 
              description="Reminders for classes and meetings"
            >
              <Switch defaultChecked />
            </SettingsRow>
            <Separator />
            <SettingsRow 
              label="Weekly digest" 
              description="Summary of your upcoming week"
            >
              <Switch />
            </SettingsRow>
          </SettingsSection>
        </div>
      </div>
    </div>
  );
}
