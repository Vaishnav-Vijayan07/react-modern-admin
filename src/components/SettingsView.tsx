import React from "react";
import { Button } from "@/components/ui/button";
import { Settings, User, Bell } from "lucide-react";

const SettingsView = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold">Settings</h2>
        <Button variant="outline" className="flex items-center gap-2">
          <Settings className="h-4 w-4" />
          <span>Save Changes</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="col-span-1 space-y-6">
          <div className="bg-card rounded-lg p-5 shadow-sm border border-border/40">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="h-5 w-5 text-primary" />
              </div>
              <h3 className="text-lg font-medium">Account Settings</h3>
            </div>
            <div className="space-y-1">
              <button className="w-full text-left px-3 py-2 rounded-md hover:bg-muted transition-colors text-primary font-medium">
                Profile Information
              </button>
              <button className="w-full text-left px-3 py-2 rounded-md hover:bg-muted transition-colors">
                Password & Security
              </button>
              <button className="w-full text-left px-3 py-2 rounded-md hover:bg-muted transition-colors">
                Connected Accounts
              </button>
              <button className="w-full text-left px-3 py-2 rounded-md hover:bg-muted transition-colors">
                Email Preferences
              </button>
            </div>
          </div>

          <div className="bg-card rounded-lg p-5 shadow-sm border border-border/40">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center">
                <Bell className="h-5 w-5 text-primary" />
              </div>
              <h3 className="text-lg font-medium">Notifications</h3>
            </div>
            <div className="space-y-1">
              <button className="w-full text-left px-3 py-2 rounded-md hover:bg-muted transition-colors">
                Notification Settings
              </button>
              <button className="w-full text-left px-3 py-2 rounded-md hover:bg-muted transition-colors">
                Alert Preferences
              </button>
            </div>
          </div>
        </div>

        <div className="col-span-2 bg-card rounded-lg p-6 shadow-sm border border-border/40">
          <h3 className="text-xl font-medium mb-6">Profile Information</h3>

          <div className="space-y-4">
            <div className="flex flex-col space-y-1.5">
              <label htmlFor="name" className="text-sm font-medium">
                Name
              </label>
              <input
                id="name"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                defaultValue="Admin User"
              />
            </div>

            <div className="flex flex-col space-y-1.5">
              <label htmlFor="email" className="text-sm font-medium">
                Email
              </label>
              <input
                id="email"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                defaultValue="admin@example.com"
              />
            </div>

            <div className="flex flex-col space-y-1.5">
              <label htmlFor="role" className="text-sm font-medium">
                Role
              </label>
              <select
                id="role"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                defaultValue="Administrator"
              >
                <option>Administrator</option>
                <option>Manager</option>
                <option>Editor</option>
                <option>Viewer</option>
              </select>
            </div>

            <div className="flex flex-col space-y-1.5">
              <label htmlFor="bio" className="text-sm font-medium">
                Bio
              </label>
              <textarea
                id="bio"
                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                placeholder="Write a short bio..."
              ></textarea>
            </div>

            <div className="flex items-center justify-end space-x-2 pt-4">
              <Button variant="outline">Cancel</Button>
              <Button>Save Changes</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsView;
