import React, { lazy, useState } from "react";
import { Routes, Route, Link, useLocation, Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import {
  Menu,
  X,
  User,
  Bell,
  ChevronDown,
  LayoutDashboard,
  Users,
  FileBarChart,
  Settings,
  LogOut,
  Moon,
  Sun,
  Building,
  Award,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import DiaryView from "./DiaryView";

// ✅ Lazy imports
const DashboardView = lazy(() => import("./dashboard/DashboardView"));
const UsersTable = lazy(() => import("./users/UsersTable"));
const ReportsView = lazy(() => import("./ReportsView"));
const SettingsView = lazy(() => import("./SettingsView"));
const OfficeTypesView = lazy(() => import("./OfficeTypesView"));
const RanksView = lazy(() => import("./RankView"));

const Home = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { logout } = useAuth();

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle("dark");
  };

  return (
    <div className={`min-h-screen bg-background ${isDarkMode ? "dark" : ""}`}>
      <div className="flex h-screen overflow-hidden">
        {/* Mobile Menu Trigger */}
        <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
          <SheetTrigger asChild className="lg:hidden">
            <Button variant="ghost" size="icon" className="absolute top-4 left-4 z-50">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-64">
            <MobileSidebar closeMobileMenu={() => setIsMobileMenuOpen(false)} />
          </SheetContent>
        </Sheet>

        {/* Desktop Sidebar */}
        <aside className="hidden lg:flex w-64 flex-col bg-card border-r h-screen">
          <DesktopSidebar />
        </aside>

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Top Navbar */}
          <header className="h-16 border-b bg-card flex items-center justify-between px-4 lg:px-6">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold ml-12 lg:ml-0">Admin Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="icon" onClick={toggleDarkMode}>
                {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </Button>
              <Button variant="ghost" size="icon">
                <Bell className="h-5 w-5" />
              </Button>
              <UserDropdown />
            </div>
          </header>

          {/* Content Area */}
          <main className="flex-1 overflow-auto p-4 lg:p-6 bg-background">
            <Routes>
              <Route path="/" element={<UsersTable />} />
              {/* <Route path="/dashboard" element={<DashboardView />} /> */}
              <Route path="/users" element={<UsersTable />} />
              <Route path="/reports" element={<ReportsView />} />
              <Route path="/settings" element={<SettingsView />} />
              <Route path="/office-types" element={<OfficeTypesView />} />
              <Route path="/ranks" element={<RanksView />} />
              <Route path="/diary" element={<DiaryView />} />
            </Routes>
          </main>
        </div>
      </div>
    </div>
  );
};

const DesktopSidebar = () => {
  const location = useLocation();
  const { logout } = useAuth();

  return (
    <div className="flex flex-col h-full bg-card">
      <div className="p-6 border-b flex items-center space-x-3">
        <div className="h-8 w-8 rounded-md bg-primary flex items-center justify-center">
          <LayoutDashboard className="h-5 w-5 text-primary-foreground" />
        </div>
        <h2 className="text-xl font-bold">Admin Panel</h2>
      </div>
      <nav className="flex-1 p-4 space-y-1.5 mt-2">
        {/* <NavLink
          to="/dashboard"
          active={location.pathname === "/" || location.pathname === "/dashboard"}
          icon={<LayoutDashboard className="h-5 w-5" />}
          label="Dashboard"
        /> */}
        <NavLink
          to="/users"
          active={location.pathname === "/users" || location.pathname === "/"}
          icon={<Users className="h-5 w-5" />}
          label="Users"
        />
        <NavLink
          to="/office-types"
          active={location.pathname === "/office-types"}
          icon={<Building className="h-5 w-5" />}
          label="Office Types"
        />
        <NavLink to="/ranks" active={location.pathname === "/ranks"} icon={<Award className="h-5 w-5" />} label="Ranks" />

        <NavLink to="/diary" active={location.pathname === "/diary"} icon={<FileBarChart className="h-5 w-5" />} label="Diary" />
      </nav>
      <div className="p-4 border-t mt-auto">
        <Button
          variant="outline"
          className="w-full justify-start hover:bg-destructive/10 hover:text-destructive hover:border-destructive/20 transition-all duration-200"
          onClick={logout}
        >
          <LogOut className="h-5 w-5 mr-2" />
          <span>Logout</span>
        </Button>
      </div>
    </div>
  );
};

const MobileSidebar = ({ closeMobileMenu }: { closeMobileMenu: () => void }) => {
  const location = useLocation();
  const { logout } = useAuth();

  return (
    <div className="flex flex-col h-full bg-card">
      <div className="p-4 border-b flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="h-8 w-8 rounded-md bg-primary flex items-center justify-center">
            <LayoutDashboard className="h-5 w-5 text-primary-foreground" />
          </div>
          <h2 className="text-xl font-bold">Admin Panel</h2>
        </div>
        <Button variant="ghost" size="icon" onClick={closeMobileMenu} className="hover:bg-muted">
          <X className="h-5 w-5" />
        </Button>
      </div>
      <nav className="flex-1 p-4 space-y-1.5 mt-2">
        {/* <NavLink
          to="/dashboard"
          active={location.pathname === "/" || location.pathname === "/dashboard"}
          icon={<LayoutDashboard className="h-5 w-5" />}
          label="Dashboard"
          onClick={closeMobileMenu}
        /> */}
        <NavLink
          to="/users"
          active={location.pathname === "/users" || location.pathname === "/"}
          icon={<Users className="h-5 w-5" />}
          label="Users"
          onClick={closeMobileMenu}
        />
        <NavLink
          to="/office-types"
          active={location.pathname === "/office-types"}
          icon={<Building className="h-5 w-5" />}
          label="Office Types"
          onClick={closeMobileMenu}
        />
        <NavLink to="/ranks" active={location.pathname === "/ranks"} icon={<Award className="h-5 w-5" />} label="Ranks" />

        <NavLink
          to="/diary"
          active={location.pathname === "/diary"}
          icon={<FileBarChart className="h-5 w-5" />}
          label="Diary"
          onClick={closeMobileMenu}
        />
        {/* <NavLink
          to="/settings"
          active={location.pathname === "/settings"}
          icon={<Settings className="h-5 w-5" />}
          label="Settings"
          onClick={closeMobileMenu}
        /> */}
      </nav>
      <div className="p-4 border-t mt-auto">
        <Button
          variant="outline"
          className="w-full justify-start hover:bg-destructive/10 hover:text-destructive hover:border-destructive/20 transition-all duration-200"
          onClick={logout}
        >
          <LogOut className="h-5 w-5 mr-2" />
          <span>Logout</span>
        </Button>
      </div>
    </div>
  );
};

interface NavLinkProps {
  to: string;
  active: boolean;
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
}

const NavLink = ({ to, active, icon, label, onClick }: NavLinkProps) => {
  return (
    <Link
      to={to}
      className={`flex items-center space-x-3 px-4 py-2.5 rounded-md transition-all duration-200 ${
        active ? "bg-primary/10 text-primary font-medium border-l-2 border-primary" : "hover:bg-muted hover:translate-x-1"
      }`}
      onClick={onClick}
    >
      <div className={`${active ? "text-primary" : "text-muted-foreground"}`}>{icon}</div>
      <span className={`${active ? "font-medium" : ""}`}>{label}</span>
    </Link>
  );
};

const UserDropdown = () => {
  const { user, logout } = useAuth();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="relative h-10 flex items-center space-x-2 rounded-full hover:bg-muted/80 transition-all duration-200 pr-4"
        >
          <Avatar className="h-8 w-8 border-2 border-primary/10">
            <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=admin" alt="User" />
            <AvatarFallback className="bg-primary/5 text-primary font-medium">AD</AvatarFallback>
          </Avatar>
          <div className="hidden md:flex flex-col items-start leading-none">
            <span className="font-medium text-sm">Super Admin</span>
            <span className="text-xs text-muted-foreground">{user?.role || "Admin"}</span>
          </div>
          <ChevronDown className="h-4 w-4 opacity-50 ml-1" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64 p-2">
        <div className="flex items-center justify-start gap-3 p-3 bg-muted/50 rounded-md mb-1">
          <Avatar className="h-10 w-10 border-2 border-primary/10">
            <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=admin" alt="User" />
            <AvatarFallback className="bg-primary/5 text-primary font-medium">AD</AvatarFallback>
          </Avatar>
          <div className="flex flex-col space-y-1 leading-none">
            <p className="font-medium">Super Admin</p>
            <p className="text-sm text-muted-foreground">{user?.email || "guest@example.com"}</p>
          </div>
        </div>
        <DropdownMenuSeparator className="my-1" />
        <DropdownMenuItem className="p-2 cursor-pointer hover:bg-muted rounded-md">
          <User className="mr-2 h-4 w-4" />
          <span>View Profile</span>
        </DropdownMenuItem>
        <DropdownMenuItem className="p-2 cursor-pointer hover:bg-muted rounded-md">
          <Settings className="mr-2 h-4 w-4" />
          <span>Account Settings</span>
        </DropdownMenuItem>
        <DropdownMenuItem className="p-2 cursor-pointer hover:bg-muted rounded-md">
          <Bell className="mr-2 h-4 w-4" />
          <span>Notifications</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator className="my-1" />
        <DropdownMenuItem
          className="p-2 cursor-pointer hover:bg-destructive/10 hover:text-destructive rounded-md"
          onClick={logout}
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default Home;
