"use client";

import React, { useState, useEffect } from "react";
import { Mail, MapPin, GraduationCap, ExternalLink } from "lucide-react";

import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

const mockData = {
  profile: {
    name: "Vikrant Yadav",
    username: "@vikgenix",
    avatar:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSlu5rvfyq864vn584SBw4r5X9YyeqcSxqnoQ&s",
    title:
      "Software Engineer @JaneStreet | NST'28 | ICPC Regionals Finalist | Open Source Enthusiast",
    location: "India",
    institution: "Newton School of Technology",
    lastRefresh: "07 Jan 2025",
    profileViews: 439,
  },
  stats: {
    totalQuestions: 1010,
    totalActiveDays: 348,
    totalContests: 16,
    submissions6Months: 152,
    maxStreak: 72,
    currentStreak: 13,
  },
  contests: [
    { name: "CodeChef", count: 6, logo: "🍳" },
    { name: "CodeForces", count: 10, logo: "📊" },
  ],
  rating: {
    current: 2000,
    date: "14 Sept 2020",
    achievement: "September Challenge 2020 Division 2",
    rank: "Rank:8653",
  },
  problems: {
    fundamentals: {
      total: 127,
      breakdown: [
        { name: "GFG", count: 11, color: "#2F9E44" },
        { name: "HackerRank", count: 116, color: "#FCC419" },
      ],
    },
    dsa: {
      total: 200,
      breakdown: [
        { name: "Easy", count: 10, color: "#2F9E44" },
        { name: "Medium", count: 90, color: "#FCC419" },
        { name: "Hard", count: 100, color: "#F03E3E" },
      ],
    },
  },
  activityMap: [],
  platforms: [
    { name: "LeetCode", connected: true },
    { name: "CodeStudio", connected: true },
  ],
};

function generateActivityMap() {
  const months = ["Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "Jan"];
  const activity = [];

  months.forEach((month, monthIndex) => {
    const weeks = [];
    for (let week = 0; week < 5; week++) {
      const days = [];
      for (let day = 0; day < 7; day++) {
        const intensity =
          monthIndex >= 3
            ? Math.floor(Math.random() * 5)
            : Math.floor(Math.random() * 2);
        days.push(intensity);
      }
      weeks.push(days);
    }
    activity.push({ month, weeks });
  });

  return activity;
}

const Portfolio = () => {
  const [data] = useState(mockData);
  const [activityMap, setActivityMap] = useState([]);

  useEffect(() => {
    setActivityMap(generateActivityMap());
  }, []);

  const getActivityColor = (intensity) => {
    const colors = ["#EBEDF0", "#C6E48B", "#7BC96F", "#239A3B", "#196127"];
    return colors[intensity] || colors[0];
  };

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
        <div className="min-h-screen bg-background">
          <main className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-6 md:px-6 lg:py-8">
            {/* Layout grid */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
              {/* Left: Profile column */}
              <div className="space-y-6 lg:col-span-4">
                <Card className="overflow-hidden">
                  <CardContent className="pt-6">
                    {/* Avatar + name */}
                    <div className="flex flex-col items-center text-center">
                      <img
                        src={data.profile.avatar}
                        alt={data.profile.name}
                        className="mb-4 h-28 w-28 rounded-full border border-border object-cover"
                      />
                      <h2 className="text-xl font-semibold tracking-tight">
                        {data.profile.name}
                      </h2>
                      <p className="mt-1 text-xs font-medium text-primary">
                        {data.profile.username} ✓
                      </p>
                      <p className="mt-3 text-xs text-muted-foreground leading-relaxed">
                        {data.profile.title}
                      </p>
                    </div>

                    {/* Icons */}
                    <div className="mt-5 flex justify-center gap-4">
                      <Button variant="outline" size="icon">
                        <Mail className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="icon">
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </div>

                    <Separator className="my-5" />

                    {/* Info */}
                    <div className="space-y-3 text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        <span>{data.profile.location}</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <GraduationCap className="h-4 w-4" />
                        <span>{data.profile.institution}</span>
                      </div>
                    </div>

                    <Separator className="my-5" />

                    {/* Meta */}
                    <div className="space-y-2 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">
                          Last refresh
                        </span>
                        <span className="font-medium">
                          {data.profile.lastRefresh}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">
                          Profile views
                        </span>
                        <span className="font-medium">
                          {data.profile.profileViews}
                        </span>
                      </div>
                    </div>

                    <Separator className="my-5" />

                    {/* Platforms */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium">
                          Problem Solving Stats
                        </span>
                        <span className="text-xs text-muted-foreground">
                          Platforms
                        </span>
                      </div>
                      <div className="space-y-2">
                        {data.platforms.map((platform, idx) => (
                          <div
                            key={idx}
                            className="flex items-center justify-between rounded-md border bg-muted/40 px-3 py-2"
                          >
                            <div className="flex items-center gap-2">
                              <span className="text-lg">💻</span>
                              <span className="text-xs font-medium">
                                {platform.name}
                              </span>
                            </div>
                            {platform.connected && (
                              <Badge
                                variant="outline"
                                className="border-green-500/40 text-[10px] text-green-600"
                              >
                                Connected
                              </Badge>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Right: main content */}
              <div className="space-y-6 lg:col-span-8">
                {/* Top stats */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Card>
                    <CardContent className="py-4">
                      <p className="text-xs font-medium text-muted-foreground">
                        Total Questions
                      </p>
                      <p className="mt-2 text-3xl font-bold md:text-4xl">
                        {data.stats.totalQuestions}
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="py-4">
                      <p className="text-xs font-medium text-muted-foreground">
                        Total Active Days
                      </p>
                      <p className="mt-2 text-3xl font-bold md:text-4xl">
                        {data.stats.totalActiveDays}
                      </p>
                    </CardContent>
                  </Card>
                </div>

                {/* Activity heatmap */}
                <Card>
                  <CardHeader className="pb-3">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                      <p className="text-xs text-muted-foreground">
                        <span className="font-semibold">
                          {data.stats.submissions6Months}
                        </span>{" "}
                        submissions in the last 6 months
                      </p>
                      <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
                        <span>
                          Max streak{" "}
                          <span className="font-semibold">
                            {data.stats.maxStreak}
                          </span>
                        </span>
                        <span>
                          Current streak{" "}
                          <span className="font-semibold">
                            {data.stats.currentStreak}
                          </span>
                        </span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <div className="flex gap-3 pb-1">
                        {activityMap.map((monthData, idx) => (
                          <div
                            key={idx}
                            className="flex flex-col items-center gap-2"
                          >
                            <div className="flex gap-1">
                              {monthData.weeks.map((week, weekIdx) => (
                                <div
                                  key={weekIdx}
                                  className="flex flex-col gap-1"
                                >
                                  {week.map((intensity, dayIdx) => (
                                    <div
                                      key={dayIdx}
                                      className="h-3 w-3 rounded-sm"
                                      style={{
                                        backgroundColor:
                                          getActivityColor(intensity),
                                      }}
                                    />
                                  ))}
                                </div>
                              ))}
                            </div>
                            <span className="text-[10px] text-muted-foreground">
                              {monthData.month}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Contests + rating */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  {/* Contests */}
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-semibold">
                        Total Contests
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="mb-4 text-3xl font-bold md:text-4xl">
                        {data.stats.totalContests}
                      </p>
                      <div className="space-y-2">
                        {data.contests.map((contest, idx) => (
                          <div
                            key={idx}
                            className="flex items-center justify-between rounded-md bg-muted/40 px-3 py-2 text-sm"
                          >
                            <div className="flex items-center gap-2">
                              <span className="text-lg">{contest.logo}</span>
                              <span className="font-medium">
                                {contest.name}
                              </span>
                            </div>
                            <span className="text-base font-semibold">
                              {contest.count}
                            </span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Rating */}
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-semibold">
                        Rating
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-3xl font-bold md:text-4xl">
                        {data.rating.current}
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {data.rating.date}
                      </p>
                      <p className="mt-1 text-xs font-medium">
                        {data.rating.achievement}
                      </p>
                      <p className="text-[11px] text-muted-foreground">
                        {data.rating.rank}
                      </p>

                      <div className="mt-4 h-24 w-full">
                        <svg
                          className="h-full w-full"
                          viewBox="0 0 400 120"
                          preserveAspectRatio="none"
                        >
                          <defs>
                            <linearGradient
                              id="ratingGradient"
                              x1="0%"
                              y1="0%"
                              x2="0%"
                              y2="100%"
                            >
                              <stop
                                offset="0%"
                                stopColor="hsl(var(--primary))"
                                stopOpacity="0.35"
                              />
                              <stop
                                offset="100%"
                                stopColor="hsl(var(--primary))"
                                stopOpacity="0.05"
                              />
                            </linearGradient>
                          </defs>
                          <path
                            d="M 0 80 Q 50 60 100 50 T 200 45 T 300 55 T 400 60 L 400 120 L 0 120 Z"
                            fill="url(#ratingGradient)"
                            stroke="hsl(var(--primary))"
                            strokeWidth="2"
                          />
                        </svg>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Problems solved */}
                <Card>
                  <CardHeader className="pb-4">
                    <CardTitle className="text-sm font-semibold">
                      Problems Solved
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                      {/* Fundamentals */}
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">
                            Fundamentals
                          </span>
                          <span className="text-[11px] text-muted-foreground">
                            Platforms
                          </span>
                        </div>
                        <div className="flex flex-col items-center gap-4 sm:flex-row">
                          <DonutChart
                            total={data.problems.fundamentals.total}
                            breakdown={data.problems.fundamentals.breakdown}
                          />
                          <Legend
                            breakdown={data.problems.fundamentals.breakdown}
                          />
                        </div>
                      </div>

                      {/* DSA */}
                      <div className="space-y-3">
                        <span className="text-sm font-medium">DSA</span>
                        <div className="flex flex-col items-center gap-4 sm:flex-row">
                          <DonutChart
                            total={data.problems.dsa.total}
                            breakdown={data.problems.dsa.breakdown}
                          />
                          <Legend breakdown={data.problems.dsa.breakdown} />
                        </div>
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
};

/**
 * Small helper components for the donut chart & legend
 */

const DonutChart = ({ total, breakdown }) => {
  const radius = 60;
  const circumference = 2 * Math.PI * radius;

  return (
    <div className="relative h-32 w-32 sm:h-40 sm:w-40">
      <svg className="h-full w-full -rotate-90">
        <circle
          cx="50%"
          cy="50%"
          r={radius}
          fill="none"
          stroke="#E5E7EB"
          strokeWidth="12"
        />
        {breakdown.map((item, idx, arr) => {
          const prevSum = arr.slice(0, idx).reduce((s, i) => s + i.count, 0);
          const offset = (prevSum / total) * circumference;
          const length = (item.count / total) * circumference;

          return (
            <circle
              key={idx}
              cx="50%"
              cy="50%"
              r={radius}
              fill="none"
              stroke={item.color}
              strokeWidth="12"
              strokeDasharray={`${length} ${circumference}`}
              strokeDashoffset={-offset}
              strokeLinecap="round"
            />
          );
        })}
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-xl font-bold sm:text-2xl">{total}</span>
      </div>
    </div>
  );
};

const Legend = ({ breakdown }) => {
  return (
    <div className="space-y-2 text-xs">
      {breakdown.map((item, idx) => (
        <div
          key={idx}
          className="flex items-center justify-between gap-6 whitespace-nowrap"
        >
          <div className="flex items-center gap-2">
            <span
              className="h-2 w-2 rounded-full"
              style={{ backgroundColor: item.color }}
            />
            <span className="font-medium" style={{ color: item.color }}>
              {item.name}
            </span>
          </div>
          <span className="font-semibold">{item.count}</span>
        </div>
      ))}
    </div>
  );
};

export default Portfolio;
