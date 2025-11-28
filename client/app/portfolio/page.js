"use client";

import React, { useState, useEffect } from "react";
import {
  Mail,
  MapPin,
  GraduationCap,
  ExternalLink,
  Trophy,
  Flame,
  Target,
  Calendar,
  ChevronRight,
  Code2,
  Terminal,
} from "lucide-react";
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Legend as RechartsLegend,
} from "recharts";

// --- Mock Data & Helpers ---

const mockData = {
  profile: {
    name: "Vikrant Yadav",
    username: "@vikgenix",
    avatar:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSlu5rvfyq864vn584SBw4r5X9YyeqcSxqnoQ&s",
    title: "Software Engineer @JaneStreet | NST'28 | ICPC Finalist",
    bio: "Passionate about distributed systems and competitive programming. Building open source tools for developer productivity.",
    location: "India",
    institution: "Newton School of Technology",
    lastRefresh: "Just now",
    profileViews: 1205,
  },
  stats: {
    totalQuestions: 1010,
    totalActiveDays: 348,
    totalContests: 16,
    submissions6Months: 152,
    maxStreak: 72,
    currentStreak: 13,
  },
  ratingHistory: [
    { date: "Jan", rating: 1200 },
    { date: "Feb", rating: 1350 },
    { date: "Mar", rating: 1300 },
    { date: "Apr", rating: 1480 },
    { date: "May", rating: 1600 },
    { date: "Jun", rating: 1580 },
    { date: "Jul", rating: 1750 },
    { date: "Aug", rating: 1900 },
    { date: "Sep", rating: 2000 },
  ],
  problems: {
    fundamentals: [
      { name: "Leetcode", value: 45, color: "#16a34a" }, // green-600
      { name: "Codeforces", value: 82, color: "#ca8a04" }, // yellow-600
    ],
    dsa: [
      { name: "Easy", value: 40, color: "#22c55e" }, // green-500
      { name: "Medium", value: 110, color: "#eab308" }, // yellow-500
      { name: "Hard", value: 50, color: "#ef4444" }, // red-500
    ],
  },
  platforms: [
    { name: "LeetCode", handle: "vikgenix", rating: 1950, connected: true },
    { name: "CodeForces", handle: "vikgenix", rating: 1400, connected: true },
    { name: "GitHub", handle: "@vikgenix", stars: 450, connected: true },
  ],
};

// --- Internal UI Components (ShadCN Style) ---

const Card = ({ className = "", children, ...props }) => (
  <div
    className={`rounded-xl border bg-card text-card-foreground shadow-sm bg-white ${className}`}
    {...props}
  >
    {children}
  </div>
);

const CardHeader = ({ className = "", children, ...props }) => (
  <div className={`flex flex-col space-y-1.5 p-6 ${className}`} {...props}>
    {children}
  </div>
);

const CardTitle = ({ className = "", children, ...props }) => (
  <h3
    className={`text-lg font-semibold leading-none tracking-tight ${className}`}
    {...props}
  >
    {children}
  </h3>
);

const CardContent = ({ className = "", children, ...props }) => (
  <div className={`p-6 pt-0 ${className}`} {...props}>
    {children}
  </div>
);

const Badge = ({ variant = "default", className = "", children }) => {
  const variants = {
    default:
      "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
    secondary:
      "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
    outline: "text-foreground",
  };
  const base =
    "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2";
  return (
    <div
      className={`${base} ${
        variants[variant] || variants.default
      } ${className}`}
    >
      {children}
    </div>
  );
};

const Button = ({
  variant = "default",
  size = "default",
  className = "",
  children,
  ...props
}) => {
  const variants = {
    default: "bg-slate-900 text-white hover:bg-slate-900/90",
    outline:
      "border border-slate-200 bg-white hover:bg-slate-100 text-slate-900",
    ghost: "hover:bg-slate-100 hover:text-slate-900",
  };
  const sizes = {
    default: "h-10 px-4 py-2",
    sm: "h-9 rounded-md px-3",
    lg: "h-11 rounded-md px-8",
    icon: "h-10 w-10",
  };

  const base =
    "inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";

  return (
    <button
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

const Separator = ({ className = "" }) => (
  <div className={`shrink-0 bg-slate-200 h-[1px] w-full ${className}`} />
);

// --- Custom Charts & Maps ---

const ActivityHeatmap = () => {
  const generateData = () => {
    const weeks = [];
    for (let i = 0; i < 52; i++) {
      const days = [];
      for (let j = 0; j < 7; j++) {
        const bias = i > 30 ? 0.6 : 0.3;
        const level =
          Math.random() > 1 - bias ? Math.floor(Math.random() * 4) + 1 : 0;
        days.push(level);
      }
      weeks.push(days);
    }
    return weeks;
  };

  const [data] = useState(generateData());

  const getColor = (level) => {
    switch (level) {
      case 1:
        return "bg-green-200";
      case 2:
        return "bg-green-400";
      case 3:
        return "bg-green-600";
      case 4:
        return "bg-green-800";
      default:
        return "bg-slate-100";
    }
  };

  return (
    <div className="w-full overflow-hidden">
      {/* Added touch scrolling and max-width handling */}
      <div className="flex gap-[3px] overflow-x-auto pb-2 no-scrollbar touch-pan-x">
        {data.map((week, wIdx) => (
          <div key={wIdx} className="flex flex-col gap-[3px] shrink-0">
            {week.map((day, dIdx) => (
              <div
                key={`${wIdx}-${dIdx}`}
                className={`h-2.5 w-2.5 rounded-[2px] ${getColor(
                  day
                )} transition-all hover:ring-2 hover:ring-slate-400 cursor-pointer`}
                title={`${day > 0 ? day * 3 : "No"} submissions`}
              />
            ))}
          </div>
        ))}
      </div>
      <div className="mt-2 flex items-center justify-end gap-2 text-[10px] text-slate-500">
        <span>Less</span>
        <div className="flex gap-[2px]">
          <div className="h-2.5 w-2.5 rounded-[2px] bg-slate-100" />
          <div className="h-2.5 w-2.5 rounded-[2px] bg-green-200" />
          <div className="h-2.5 w-2.5 rounded-[2px] bg-green-400" />
          <div className="h-2.5 w-2.5 rounded-[2px] bg-green-600" />
          <div className="h-2.5 w-2.5 rounded-[2px] bg-green-800" />
        </div>
        <span>More</span>
      </div>
    </div>
  );
};

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border bg-white p-2 shadow-sm">
        <div className="flex flex-col">
          <span className="text-[0.70rem] uppercase text-muted-foreground">
            {label}
          </span>
          <span className="font-bold text-muted-foreground">
            {payload[0].value} Rating
          </span>
        </div>
      </div>
    );
  }
  return null;
};

// --- Main App Component ---

export default function Portfolio() {
  return (
    <SidebarProvider
      style={{
        "--sidebar-width": "calc(var(--spacing) * 72)",
        "--header-height": "calc(var(--spacing) * 12)",
      }}
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader headerTitle="Portfolio" />
        <div className="min-h-screen bg-slate-50/50 pb-10 text-slate-900 font-sans">
          {/* Changed md:grid-cols-12 to lg:grid-cols-12 to force stacking on tablet size */}
          <main className="container mx-auto grid grid-cols-1 gap-6 px-4 py-8 lg:grid-cols-12 md:px-6 lg:py-10">
            {/* Left Column: Profile */}
            {/* Changed md:col-span-4 to lg:col-span-3 */}
            <div className="lg:col-span-3 space-y-6">
              <Card className="overflow-hidden border-none shadow-md">
                <div className="h-24 bg-gradient-to-r from-slate-900 to-slate-700"></div>
                <CardContent className="-mt-12 pt-0">
                  <div className="flex flex-col items-center">
                    <div className="relative">
                      <img
                        src={mockData.profile.avatar}
                        alt="Profile"
                        className="h-24 w-24 rounded-full border-4 border-white object-cover shadow-sm"
                      />
                      <div className="absolute bottom-1 right-1 h-5 w-5 rounded-full border-2 border-white bg-green-500"></div>
                    </div>

                    <div className="mt-4 text-center">
                      <h1 className="text-xl font-bold">
                        {mockData.profile.name}
                      </h1>
                      <p className="text-sm font-medium text-slate-500">
                        {mockData.profile.username}
                      </p>
                    </div>

                    <div className="mt-4 flex w-full gap-2">
                      <Button className="w-full h-8 text-xs">Follow</Button>
                      <Button variant="outline" className="w-full h-8 text-xs">
                        Message
                      </Button>
                    </div>

                    <p className="mt-5 text-center text-sm text-slate-600 leading-relaxed">
                      {mockData.profile.bio}
                    </p>

                    <div className="mt-6 w-full space-y-3 text-sm text-slate-500">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-slate-400" />
                        <span>{mockData.profile.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <GraduationCap className="h-4 w-4 text-slate-400" />
                        <span className="truncate">
                          {mockData.profile.institution}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <ExternalLink className="h-4 w-4 text-slate-400" />
                        <a
                          href="#"
                          className="hover:underline hover:text-blue-600"
                        >
                          vikgenix.dev
                        </a>
                      </div>
                    </div>

                    <Separator className="my-6" />

                    <div className="w-full space-y-4">
                      <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                        Connected Accounts
                      </h4>
                      <div className="space-y-3">
                        {mockData.platforms.map((platform) => (
                          <div
                            key={platform.name}
                            className="flex items-center justify-between text-sm"
                          >
                            <div className="flex items-center gap-2">
                              <Terminal className="h-3.5 w-3.5" />
                              <span>{platform.name}</span>
                            </div>
                            <ExternalLink className="h-3 w-3 text-slate-400 cursor-pointer hover:text-slate-900" />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-slate-900 to-slate-800 text-white border-none shadow-lg">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-slate-400 text-xs font-medium uppercase tracking-wider">
                        Current Rank
                      </p>
                      <h3 className="text-3xl font-bold mt-1 text-white">
                        2000
                      </h3>
                      <p className="text-emerald-400 text-xs mt-1 font-medium flex items-center gap-1">
                        <Target className="h-3 w-3" /> Top 2.5% Global
                      </p>
                    </div>
                    <Trophy className="h-8 w-8 text-yellow-500" />
                  </div>
                  <div className="mt-6 pt-4 border-t border-slate-700/50">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">Highest Rating</span>
                      <span className="font-semibold">2145</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column: Content */}
            {/* Changed md:col-span-8 to lg:col-span-9 */}
            <div className="lg:col-span-9 space-y-6">
              {/* Top Key Stats */}
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                <Card className="hover:shadow-md transition-shadow">
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-2 text-slate-500 mb-2">
                      <Target className="h-4 w-4" />
                      <span className="text-xs font-medium uppercase">
                        Solved
                      </span>
                    </div>
                    <div className="text-2xl font-bold">
                      {mockData.stats.totalQuestions}
                    </div>
                  </CardContent>
                </Card>
                <Card className="hover:shadow-md transition-shadow">
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-2 text-slate-500 mb-2">
                      <Flame className="h-4 w-4 text-orange-500" />
                      <span className="text-xs font-medium uppercase">
                        Streak
                      </span>
                    </div>
                    <div className="text-2xl font-bold">
                      {mockData.stats.currentStreak}{" "}
                      <span className="text-sm font-normal text-slate-400">
                        days
                      </span>
                    </div>
                  </CardContent>
                </Card>
                <Card className="hover:shadow-md transition-shadow">
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-2 text-slate-500 mb-2">
                      <Trophy className="h-4 w-4 text-yellow-500" />
                      <span className="text-xs font-medium uppercase">
                        Contests
                      </span>
                    </div>
                    <div className="text-2xl font-bold">
                      {mockData.stats.totalContests}
                    </div>
                  </CardContent>
                </Card>
                <Card className="hover:shadow-md transition-shadow">
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-2 text-slate-500 mb-2">
                      <Calendar className="h-4 w-4" />
                      <span className="text-xs font-medium uppercase">
                        Active Days
                      </span>
                    </div>
                    <div className="text-2xl font-bold">
                      {mockData.stats.totalActiveDays}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Activity Heatmap */}
              <Card className="border shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-base font-semibold">
                    Submission Activity
                  </CardTitle>
                  <div className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded-md">
                    Last 12 Months
                  </div>
                </CardHeader>
                <CardContent>
                  <ActivityHeatmap />
                </CardContent>
              </Card>

              {/* Rating Graph */}
              <Card className="border shadow-sm">
                <CardHeader>
                  <CardTitle className="text-base font-semibold">
                    Rating History
                  </CardTitle>
                  <p className="text-sm text-slate-500">
                    Performance analysis across all contest platforms.
                  </p>
                </CardHeader>
                <CardContent className="pl-0">
                  <div className="h-[250px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart
                        data={mockData.ratingHistory}
                        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                      >
                        <defs>
                          <linearGradient
                            id="colorRating"
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                          >
                            <stop
                              offset="5%"
                              stopColor="#2563eb"
                              stopOpacity={0.2}
                            />
                            <stop
                              offset="95%"
                              stopColor="#2563eb"
                              stopOpacity={0}
                            />
                          </linearGradient>
                        </defs>
                        <XAxis
                          dataKey="date"
                          tickLine={false}
                          axisLine={false}
                          tick={{ fontSize: 12, fill: "#94a3b8" }}
                          dy={10}
                        />
                        <YAxis
                          hide
                          domain={["dataMin - 100", "dataMax + 100"]}
                        />
                        <CartesianGrid
                          vertical={false}
                          strokeDasharray="3 3"
                          stroke="#e2e8f0"
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Area
                          type="monotone"
                          dataKey="rating"
                          stroke="#2563eb"
                          strokeWidth={2}
                          fillOpacity={1}
                          fill="url(#colorRating)"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Bottom Grid: Language & Breakdown */}
              {/* Changed md:grid-cols-2 to lg:grid-cols-2 for better tablet stacking */}
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                {/* Fundamental Stats */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm font-semibold flex items-center gap-2">
                      Platform Breakdown
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {/* Updated to stack on small screens, row on larger */}
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-6 sm:gap-0">
                      <div className="h-[160px] w-[160px] relative shrink-0">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={mockData.problems.fundamentals}
                              cx="50%"
                              cy="50%"
                              innerRadius={50}
                              outerRadius={70}
                              paddingAngle={5}
                              dataKey="value"
                              stroke="none"
                            >
                              {mockData.problems.fundamentals.map(
                                (entry, index) => (
                                  <Cell
                                    key={`cell-${index}`}
                                    fill={entry.color}
                                  />
                                )
                              )}
                            </Pie>
                            <Tooltip />
                          </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                          <span className="text-2xl font-bold">127</span>
                          <span className="text-[10px] text-slate-400 uppercase">
                            Solved
                          </span>
                        </div>
                      </div>
                      {/* Changed padding to be responsive */}
                      <div className="flex-1 w-full sm:pl-8 space-y-3">
                        {mockData.problems.fundamentals.map((item) => (
                          <div
                            key={item.name}
                            className="flex items-center justify-between text-sm"
                          >
                            <div className="flex items-center gap-2">
                              <div
                                className="h-2.5 w-2.5 rounded-full"
                                style={{ backgroundColor: item.color }}
                              />
                              <span className="font-medium text-slate-700">
                                {item.name}
                              </span>
                            </div>
                            <span className="font-bold text-slate-900">
                              {item.value}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* DSA Stats */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm font-semibold flex items-center gap-2">
                      DSA Difficulty
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {/* Updated to stack on small screens, row on larger */}
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-6 sm:gap-0">
                      <div className="h-[160px] w-[160px] relative shrink-0">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={mockData.problems.dsa}
                              cx="50%"
                              cy="50%"
                              innerRadius={50}
                              outerRadius={70}
                              paddingAngle={2}
                              dataKey="value"
                              stroke="none"
                            >
                              {mockData.problems.dsa.map((entry, index) => (
                                <Cell
                                  key={`cell-${index}`}
                                  fill={entry.color}
                                />
                              ))}
                            </Pie>
                            <Tooltip />
                          </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                          <span className="text-2xl font-bold">200</span>
                          <span className="text-[10px] text-slate-400 uppercase">
                            Total
                          </span>
                        </div>
                      </div>
                      {/* Changed padding to be responsive */}
                      <div className="flex-1 w-full sm:pl-8 space-y-3">
                        {mockData.problems.dsa.map((item) => (
                          <div
                            key={item.name}
                            className="flex items-center justify-between text-sm"
                          >
                            <div className="flex items-center gap-2">
                              <div
                                className="h-2.5 w-2.5 rounded-full"
                                style={{ backgroundColor: item.color }}
                              />
                              <span className="font-medium text-slate-700">
                                {item.name}
                              </span>
                            </div>
                            <span className="font-bold text-slate-900">
                              {item.value}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </main>
        </div>
       
      </SidebarInset>
      
    </SidebarProvider>
  );
}
