import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Bar,
  BarChart,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  ArrowDownIcon,
  ArrowUpIcon,
  Users,
  DollarSign,
  ShoppingCart,
  Activity,
} from "lucide-react";

interface KpiCardProps {
  title: string;
  value: string;
  change: number;
  icon: React.ReactNode;
}

const KpiCard = ({
  title = "Total Users",
  value = "10,482",
  change = 12.5,
  icon = <Users className="h-4 w-4 text-muted-foreground" />,
}: KpiCardProps) => {
  const isPositive = change >= 0;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className="h-4 w-4 text-muted-foreground">{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <div className="flex items-center text-xs text-muted-foreground">
          {isPositive ? (
            <ArrowUpIcon className="mr-1 h-4 w-4 text-green-500 dark:text-green-400" />
          ) : (
            <ArrowDownIcon className="mr-1 h-4 w-4 text-red-500 dark:text-red-400" />
          )}
          <span
            className={
              isPositive
                ? "text-green-500 dark:text-green-400"
                : "text-red-500 dark:text-red-400"
            }
          >
            {Math.abs(change)}%
          </span>
          <span className="ml-1">from last month</span>
        </div>
      </CardContent>
    </Card>
  );
};

const salesData = [
  { name: "Jan", total: 1200 },
  { name: "Feb", total: 1900 },
  { name: "Mar", total: 1500 },
  { name: "Apr", total: 1700 },
  { name: "May", total: 2400 },
  { name: "Jun", total: 2100 },
  { name: "Jul", total: 2600 },
  { name: "Aug", total: 2900 },
  { name: "Sep", total: 3100 },
  { name: "Oct", total: 2800 },
  { name: "Nov", total: 3200 },
  { name: "Dec", total: 3500 },
];

const visitorData = [
  { name: "Mon", visitors: 500 },
  { name: "Tue", visitors: 620 },
  { name: "Wed", visitors: 800 },
  { name: "Thu", visitors: 720 },
  { name: "Fri", visitors: 650 },
  { name: "Sat", visitors: 400 },
  { name: "Sun", visitors: 350 },
];

const DashboardView = () => {
  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <h1 className="text-2xl font-bold mb-6 dark:text-white">
        Dashboard Overview
      </h1>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
        <KpiCard
          title="Total Users"
          value="10,482"
          change={12.5}
          icon={<Users className="h-4 w-4 text-muted-foreground" />}
        />
        <KpiCard
          title="Revenue"
          value="$45,231.89"
          change={8.2}
          icon={<DollarSign className="h-4 w-4 text-muted-foreground" />}
        />
        <KpiCard
          title="Orders"
          value="2,345"
          change={-3.1}
          icon={<ShoppingCart className="h-4 w-4 text-muted-foreground" />}
        />
        <KpiCard
          title="Active Sessions"
          value="1,893"
          change={18.2}
          icon={<Activity className="h-4 w-4 text-muted-foreground" />}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Revenue Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={salesData}>
                <XAxis
                  dataKey="name"
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `$${value}`}
                />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="total"
                  stroke="#0ea5e9"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Weekly Visitors</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={visitorData}>
                <XAxis
                  dataKey="name"
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip />
                <Bar dataKey="visitors" fill="#8884d8" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-1">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                <p className="text-sm">
                  New user registered{" "}
                  <span className="text-muted-foreground">2 minutes ago</span>
                </p>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                <p className="text-sm">
                  New order placed{" "}
                  <span className="text-muted-foreground">15 minutes ago</span>
                </p>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></div>
                <p className="text-sm">
                  Server alert{" "}
                  <span className="text-muted-foreground">30 minutes ago</span>
                </p>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
                <p className="text-sm">
                  Payment failed{" "}
                  <span className="text-muted-foreground">1 hour ago</span>
                </p>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
                <p className="text-sm">
                  System update completed{" "}
                  <span className="text-muted-foreground">2 hours ago</span>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardView;
