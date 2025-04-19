import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import {
  Menu,
  X,
  User,
  LogOut,
  Settings,
  BarChart3,
  Users,
  Home,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Link, useLocation } from "react-router-dom";

interface SidebarLinkProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
}

const SidebarLink = ({ to, icon, label, isActive }: SidebarLinkProps) => {
  return (
    <Link
      to={to}
      className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${isActive ? "bg-primary text-primary-foreground" : "hover:bg-muted"}`}
    >
      {icon}
      <span>{label}</span>
    </Link>
  );
};

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();
  const currentPath = location.pathname;

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top Navbar */}
      <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-4 sm:px-6">
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={toggleSidebar}
        >
          {sidebarOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </Button>

        <div className="flex-1">
          <h1 className="text-xl font-semibold">Admin Dashboard</h1>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
              <Avatar>
                <AvatarImage
                  src="https://api.dicebear.com/7.x/avataaars/svg?seed=admin"
                  alt="User"
                />
                <AvatarFallback>AD</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside
          className={`${sidebarOpen ? "translate-x-0" : "-translate-x-full"} 
          fixed inset-y-0 z-20 flex w-64 flex-col border-r bg-background pt-16 transition-transform md:static md:translate-x-0`}
        >
          <nav className="flex-1 space-y-1 px-2 py-4">
            <div className="space-y-1">
              <SidebarLink
                to="/"
                icon={<Home className="h-5 w-5" />}
                label="Dashboard"
                isActive={currentPath === "/"}
              />
              <SidebarLink
                to="/users"
                icon={<Users className="h-5 w-5" />}
                label="Users"
                isActive={currentPath === "/users"}
              />
              <SidebarLink
                to="/reports"
                icon={<BarChart3 className="h-5 w-5" />}
                label="Reports"
                isActive={currentPath === "/reports"}
              />
              <SidebarLink
                to="/settings"
                icon={<Settings className="h-5 w-5" />}
                label="Settings"
                isActive={currentPath === "/settings"}
              />
            </div>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-auto p-4 md:p-6">
          <div className="mx-auto max-w-7xl">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Overlay for mobile when sidebar is open */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-10 bg-black/50 md:hidden"
          onClick={toggleSidebar}
        />
      )}
    </div>
  );
};

export default DashboardLayout;
