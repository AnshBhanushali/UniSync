import { Link, useLocation } from "react-router-dom";
import { User, Settings, LogOut, ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

export function TopNav() {
  const location = useLocation();
  const isHome = location.pathname === "/";

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-16 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="flex h-full items-center justify-between px-6">
        {/* Logo */}
        <Link 
          to="/" 
          className="flex items-center gap-2.5 transition-smooth hover:opacity-80"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <span className="text-sm font-semibold text-primary-foreground">U</span>
          </div>
          <span className="text-lg font-semibold tracking-tight text-foreground">
            UniSync
          </span>
        </Link>

        {/* Navigation links - only show when not on home */}
        {!isHome && (
          <nav className="hidden items-center gap-1 md:flex">
            <Link to="/chat">
              <Button 
                variant={location.pathname === "/chat" ? "secondary" : "ghost"} 
                size="sm"
                className="text-sm"
              >
                Chat
              </Button>
            </Link>
            <Link to="/schedule">
              <Button 
                variant={location.pathname === "/schedule" ? "secondary" : "ghost"} 
                size="sm"
                className="text-sm"
              >
                Schedule
              </Button>
            </Link>
            <Link to="/integrations">
              <Button 
                variant={location.pathname === "/integrations" ? "secondary" : "ghost"} 
                size="sm"
                className="text-sm"
              >
                Integrations
              </Button>
            </Link>
          </nav>
        )}

        {/* User menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost" 
              className="flex items-center gap-2 px-2 hover:bg-secondary"
            >
              <Avatar className="h-8 w-8">
                <AvatarImage src="" alt="User" />
                <AvatarFallback className="bg-primary/10 text-sm font-medium text-primary">
                  JD
                </AvatarFallback>
              </Avatar>
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem className="cursor-pointer">
              <User className="mr-2 h-4 w-4" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem asChild className="cursor-pointer">
              <Link to="/settings">
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer text-destructive focus:text-destructive">
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
