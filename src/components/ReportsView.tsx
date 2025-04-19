import React from "react";
import { Button } from "@/components/ui/button";
import { FileBarChart, Users } from "lucide-react";

const ReportsView = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold">Reports</h2>
        <Button className="flex items-center gap-2">
          <FileBarChart className="h-4 w-4" />
          <span>Generate Report</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-card rounded-lg p-6 shadow-sm border border-border/40 hover:border-primary/20 hover:shadow-md transition-all duration-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium">Sales Report</h3>
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
              <FileBarChart className="h-4 w-4 text-primary" />
            </div>
          </div>
          <p className="text-muted-foreground text-sm mb-4">
            Monthly sales performance and revenue analysis
          </p>
          <Button variant="outline" size="sm" className="w-full">
            View Report
          </Button>
        </div>

        <div className="bg-card rounded-lg p-6 shadow-sm border border-border/40 hover:border-primary/20 hover:shadow-md transition-all duration-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium">User Activity</h3>
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
              <Users className="h-4 w-4 text-primary" />
            </div>
          </div>
          <p className="text-muted-foreground text-sm mb-4">
            User engagement metrics and activity patterns
          </p>
          <Button variant="outline" size="sm" className="w-full">
            View Report
          </Button>
        </div>

        <div className="bg-card rounded-lg p-6 shadow-sm border border-border/40 hover:border-primary/20 hover:shadow-md transition-all duration-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium">Performance</h3>
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
              <FileBarChart className="h-4 w-4 text-primary" />
            </div>
          </div>
          <p className="text-muted-foreground text-sm mb-4">
            System performance and resource utilization
          </p>
          <Button variant="outline" size="sm" className="w-full">
            View Report
          </Button>
        </div>
      </div>

      <div className="bg-card rounded-lg p-6 shadow-sm border border-border/40">
        <h3 className="text-xl font-medium mb-4">Recent Reports</h3>
        <div className="space-y-4">
          {[
            {
              name: "Q2 Sales Report",
              date: "June 15, 2023",
              status: "Completed",
            },
            {
              name: "User Growth Analysis",
              date: "May 28, 2023",
              status: "Completed",
            },
            {
              name: "Resource Utilization",
              date: "May 10, 2023",
              status: "Completed",
            },
            {
              name: "Q1 Performance Review",
              date: "April 5, 2023",
              status: "Archived",
            },
          ].map((report, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 hover:bg-muted/50 rounded-md transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center">
                  <FileBarChart className="h-4 w-4" />
                </div>
                <div>
                  <p className="font-medium">{report.name}</p>
                  <p className="text-sm text-muted-foreground">{report.date}</p>
                </div>
              </div>
              <div>
                <span
                  className={`text-xs px-2 py-1 rounded-full ${report.status === "Completed" ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}
                >
                  {report.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ReportsView;
