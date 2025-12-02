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
} from "recharts";
import { useAuth } from "@/app/context/AuthContext";
import { UsernameModal } from "@/components/UsernameModal";
import { authService } from "@/app/services/authService";

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

const ActivityHeatmap = ({ data }) => {
  // Generate last 365 days
  const today = new Date();
  const days = [];
  for (let i = 364; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    days.push(d.toISOString().split("T")[0]);
  }

  const getLevel = (count) => {
    if (count === 0) return 0;
    if (count <= 2) return 1;
    if (count <= 5) return 2;
    if (count <= 9) return 3;
    return 4;
  };

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

  // Group days into weeks for vertical column layout
  const weeks = [];
  let currentWeek = [];

  days.forEach((dateStr) => {
    const dayData = data?.[dateStr] || { count: 0, lc: 0, cf: 0 };
    currentWeek.push({ date: dateStr, ...dayData });

    if (currentWeek.length === 7) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  });
  if (currentWeek.length > 0) weeks.push(currentWeek);

  return (
    <div className="w-full overflow-hidden">
      <div className="flex gap-[3px] overflow-x-auto pb-2 no-scrollbar touch-pan-x">
        {weeks.map((week, wIdx) => (
          <div key={wIdx} className="flex flex-col gap-[3px] shrink-0">
            {week.map((day, dIdx) => (
              <div
                key={`${wIdx}-${dIdx}`}
                className={`h-2.5 w-2.5 rounded-[2px] ${getColor(
                  getLevel(day.count)
                )} transition-all hover:ring-2 hover:ring-slate-400 cursor-pointer`}
                title={`${day.date}: ${day.count} submissions (${day.lc} LC, ${day.cf} CF)`}
              />
            ))}
          </div>
        ))}
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
  const { user, setUser } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const [stats, setStats] = useState({
    totalQuestions: 0,
    totalActiveDays: 0,
    totalContests: 0,
    currentStreak: 0,
    leetcodeSolved: 0,
    codeforcesSolved: 0,
    leetcodeRating: 0,
    codeforcesRating: 0,
    leetcodeEasy: 0,
    leetcodeMedium: 0,
    leetcodeHard: 0,
    cfMaxRating: 0,
  });

  const [ratingHistory, setRatingHistory] = useState([]);

  const [heatmapData, setHeatmapData] = useState({});
  const [fetchStatus, setFetchStatus] = useState("idle"); // idle, loading, success, error, partial

  useEffect(() => {
    if (user) {
      console.log("User loaded:", user);
      if (!user.leetcodeUsername || !user.codeforcesUsername) {
        setIsModalOpen(true);
      } else {
        fetchData(user.leetcodeUsername, user.codeforcesUsername);
      }
    }
  }, [user]);

  const fetchData = async (leetcodeUsername, codeforcesUsername) => {
    setLoading(true);
    setFetchStatus("loading");
    console.log("Fetching data for:", leetcodeUsername, codeforcesUsername);

    try {
      // Helper to safely fetch JSON
      const safeFetch = async (url) => {
        try {
          const res = await fetch(url);
          if (!res.ok) {
            if (res.status === 429) {
              console.warn(`Rate limit hit for ${url}`);
              return "RATE_LIMIT";
            }
            throw new Error(`HTTP error! status: ${res.status}`);
          }
          return await res.json();
        } catch (e) {
          console.error(`Failed to fetch ${url}:`, e);
          return null;
        }
      };

      // Fetch LeetCode Data
      const lcProfile = await safeFetch(
        `https://alfa-leetcode-api.onrender.com/${leetcodeUsername}/solved`
      );
      const lcContest = await safeFetch(
        `https://alfa-leetcode-api.onrender.com/${leetcodeUsername}/contest`
      );
      const lcCalendar = await safeFetch(
        `https://alfa-leetcode-api.onrender.com/${leetcodeUsername}/calendar`
      );

      // Fetch Codeforces Data
      const cfUser = await safeFetch(
        `https://codeforces.com/api/user.info?handles=${codeforcesUsername}`
      );
      const cfRating = await safeFetch(
        `https://codeforces.com/api/user.rating?handle=${codeforcesUsername}`
      );
      const cfStatus = await safeFetch(
        `https://codeforces.com/api/user.status?handle=${codeforcesUsername}`
      );

      console.log("Fetched Data:", {
        lcProfile,
        lcContest,
        lcCalendar,
        cfUser,
        cfRating,
        cfStatus,
      });

      const isRateLimited = [
        lcProfile,
        lcContest,
        lcCalendar,
        cfUser,
        cfRating,
        cfStatus,
      ].includes("RATE_LIMIT");

      // Process Data (handle nulls and RATE_LIMIT)
      const getVal = (obj, path, defaultVal = 0) => {
        if (obj === "RATE_LIMIT" || obj === null) return defaultVal;
        return path.split(".").reduce((o, i) => o?.[i], obj) || defaultVal;
      };

      const leetcodeSolved = getVal(lcProfile, "solvedProblem");
      const easy = getVal(lcProfile, "easySolved");
      const medium = getVal(lcProfile, "mediumSolved");
      const hard = getVal(lcProfile, "hardSolved");
      const leetcodeRating = Math.round(getVal(lcContest, "contestRating"));

      // Calculate LeetCode Stats
      let totalActiveDays = getVal(lcCalendar, "totalActiveDays");
      let maxStreak = 0;

      if (
        lcCalendar &&
        lcCalendar !== "RATE_LIMIT" &&
        lcCalendar.submissionCalendar
      ) {
        try {
          const calendar = JSON.parse(lcCalendar.submissionCalendar);
          const timestamps = Object.keys(calendar)
            .map(Number)
            .sort((a, b) => a - b);

          if (timestamps.length > 0) {
            let currentStreak = 1;
            maxStreak = 1;

            // Convert to days to handle potential time differences
            const toDay = (ts) => Math.floor(ts / 86400);

            for (let i = 1; i < timestamps.length; i++) {
              const prevDay = toDay(timestamps[i - 1]);
              const currDay = toDay(timestamps[i]);

              if (currDay === prevDay + 1) {
                currentStreak++;
              } else if (currDay > prevDay + 1) {
                currentStreak = 1;
              }
              maxStreak = Math.max(maxStreak, currentStreak);
            }
          }
        } catch (e) {
          console.error("Failed to parse submission calendar", e);
        }
      }

      const cfRatingValue = cfUser?.result?.[0]?.rating || 0;
      const cfMaxRating = cfUser?.result?.[0]?.maxRating || 0;

      // Calculate Codeforces Solved (Unique)
      const cfSolvedSet = new Set();
      if (cfStatus?.status === "OK") {
        cfStatus.result.forEach((submission) => {
          if (submission.verdict === "OK") {
            const key = `${submission.problem.contestId}${submission.problem.index}`;
            cfSolvedSet.add(key);
          }
        });
      }
      const codeforcesSolved = cfSolvedSet.size;

      // Construct Rating History
      const cfHistory =
        cfRating?.result?.slice(-10).map((contest) => ({
          date: new Date(
            contest.ratingUpdateTimeSeconds * 1000
          ).toLocaleDateString("en-US", { month: "short" }),
          rating: contest.newRating,
        })) || [];

      const lcHistory =
        lcContest?.contestParticipation?.slice(-10).map((contest) => ({
          date: new Date(contest.contest.startTime * 1000).toLocaleDateString(
            "en-US",
            { month: "short" }
          ),
          rating: Math.round(contest.rating),
        })) || [];

      setStats({
        totalQuestions: leetcodeSolved + codeforcesSolved,
        totalActiveDays,
        totalContests:
          (lcContest?.contestParticipation?.length || 0) +
          (cfRating?.result?.length || 0),
        currentStreak: maxStreak,
        leetcodeSolved,
        codeforcesSolved,
        leetcodeRating,
        codeforcesRating: cfRatingValue,
        leetcodeEasy: easy,
        leetcodeMedium: medium,
        leetcodeHard: hard,
        cfMaxRating,
      });

      // Process Heatmap Data
      const activityMap = {};

      // LeetCode Activity
      if (
        lcCalendar &&
        lcCalendar !== "RATE_LIMIT" &&
        lcCalendar.submissionCalendar
      ) {
        try {
          const calendar = JSON.parse(lcCalendar.submissionCalendar);
          Object.entries(calendar).forEach(([ts, count]) => {
            const date = new Date(parseInt(ts) * 1000)
              .toISOString()
              .split("T")[0];
            if (!activityMap[date])
              activityMap[date] = { count: 0, lc: 0, cf: 0 };
            activityMap[date].count += count;
            activityMap[date].lc += count;
          });
        } catch (e) {
          console.error("Error parsing LC calendar", e);
        }
      }

      // Codeforces Activity
      if (cfStatus?.status === "OK") {
        cfStatus.result.forEach((sub) => {
          const date = new Date(sub.creationTimeSeconds * 1000)
            .toISOString()
            .split("T")[0];
          if (!activityMap[date])
            activityMap[date] = { count: 0, lc: 0, cf: 0 };
          activityMap[date].count += 1;
          activityMap[date].cf += 1;
        });
      }

      setHeatmapData(activityMap);
      setRatingHistory({ cf: cfHistory, lc: lcHistory });
      setFetchStatus(isRateLimited ? "partial" : "success");
    } catch (error) {
      console.error("Error fetching data:", error);
      setFetchStatus("error");
    } finally {
      setLoading(false);
    }
  };

  const handleUsernameSubmit = async (usernames) => {
    try {
      const res = await authService.updateProfile(usernames);
      setUser(res.data.user);
      fetchData(usernames.leetcodeUsername, usernames.codeforcesUsername);
    } catch (error) {
      console.error("Update failed", error);
    }
  };

  if (!user) return null;

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
          <main className="container mx-auto grid grid-cols-1 gap-6 px-4 py-8 lg:grid-cols-12 md:px-6 lg:py-10">
            {/* Status Banner */}
            {fetchStatus === "partial" && (
              <div className="lg:col-span-12 bg-yellow-100 text-yellow-800 px-4 py-2 rounded-md text-sm flex items-center justify-between">
                <span>
                  Some data could not be fetched due to API rate limits. Showing
                  partial data.
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    fetchData(user.leetcodeUsername, user.codeforcesUsername)
                  }
                >
                  Retry
                </Button>
              </div>
            )}
            {fetchStatus === "error" && (
              <div className="lg:col-span-12 bg-red-100 text-red-800 px-4 py-2 rounded-md text-sm flex items-center justify-between">
                <span>Failed to fetch data. Please check your connection.</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    fetchData(user.leetcodeUsername, user.codeforcesUsername)
                  }
                >
                  Retry
                </Button>
              </div>
            )}

            {/* Left Column: Profile */}
            <div className="lg:col-span-3 space-y-6">
              <Card className="overflow-hidden border-none shadow-md">
                <div className="h-24 bg-gradient-to-r from-slate-900 to-slate-700"></div>
                <CardContent className="-mt-12 pt-0">
                  <div className="flex flex-col items-center">
                    <div className="relative">
                      <img
                        src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSlu5rvfyq864vn584SBw4r5X9YyeqcSxqnoQ&s"
                        alt="Profile"
                        className="h-24 w-24 rounded-full border-4 border-white object-cover shadow-sm"
                      />
                      <div className="absolute bottom-1 right-1 h-5 w-5 rounded-full border-2 border-white bg-green-500"></div>
                    </div>

                    <div className="mt-4 text-center">
                      <h1 className="text-xl font-bold">{user.name}</h1>
                      <p className="text-sm font-medium text-slate-500">
                        {user.email}
                      </p>
                    </div>

                    <div className="mt-4 flex w-full gap-2">
                      <Button className="w-full h-8 text-xs">Follow</Button>
                      <Button variant="outline" className="w-full h-8 text-xs">
                        Message
                      </Button>
                    </div>

                    <Separator className="my-6" />

                    <div className="w-full space-y-4">
                      <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                        Connected Accounts
                      </h4>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-2">
                            <Terminal className="h-3.5 w-3.5" />
                            <span>LeetCode</span>
                          </div>
                          <span className="text-xs text-slate-500">
                            {user.leetcodeUsername}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-2">
                            <Terminal className="h-3.5 w-3.5" />
                            <span>Codeforces</span>
                          </div>
                          <span className="text-xs text-slate-500">
                            {user.codeforcesUsername}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-slate-900 to-slate-800 text-white border-none shadow-lg">
                <CardContent className="pt-6">
                  <div className="space-y-6">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-slate-400 text-xs font-medium uppercase tracking-wider">
                          Codeforces Rating
                        </p>
                        <h3 className="text-3xl font-bold mt-1 text-white">
                          {stats.codeforcesRating}
                        </h3>
                        <p className="text-slate-400 text-xs mt-1">
                          Max:{" "}
                          <span className="text-white font-medium">
                            {stats.cfMaxRating}
                          </span>
                        </p>
                      </div>
                      <Trophy className="h-8 w-8 text-yellow-500" />
                    </div>

                    <div className="pt-4 border-t border-slate-700/50 flex items-start justify-between">
                      <div>
                        <p className="text-slate-400 text-xs font-medium uppercase tracking-wider">
                          LeetCode Rating
                        </p>
                        <h3 className="text-3xl font-bold mt-1 text-white">
                          {stats.leetcodeRating}
                        </h3>
                      </div>
                      <Code2 className="h-8 w-8 text-green-500" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column: Content */}
            <div className="lg:col-span-9 space-y-6">
              {/* Top Key Stats */}
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                <Card className="hover:shadow-md transition-shadow">
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-2 text-slate-500 mb-2">
                      <Target className="h-4 w-4" />
                      <span className="text-xs font-medium uppercase">
                        Total Solved
                      </span>
                    </div>
                    <div className="text-2xl font-bold">
                      {stats.totalQuestions}
                    </div>
                  </CardContent>
                </Card>
                <Card className="hover:shadow-md transition-shadow">
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-2 text-slate-500 mb-2">
                      <Flame className="h-4 w-4 text-orange-500" />
                      <span className="text-xs font-medium uppercase">
                        Max Streak
                      </span>
                    </div>
                    <div className="text-2xl font-bold">
                      {stats.currentStreak}{" "}
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
                      {stats.totalContests}
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
                      {stats.totalActiveDays}
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
                  <ActivityHeatmap data={heatmapData} />
                </CardContent>
              </Card>

              {/* Rating Graphs */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="border shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-base font-semibold text-yellow-600">
                      Codeforces Rating
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pl-0">
                    <div className="h-[200px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart
                          data={ratingHistory.cf}
                          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                        >
                          <defs>
                            <linearGradient
                              id="colorRatingCF"
                              x1="0"
                              y1="0"
                              x2="0"
                              y2="1"
                            >
                              <stop
                                offset="5%"
                                stopColor="#ca8a04"
                                stopOpacity={0.2}
                              />
                              <stop
                                offset="95%"
                                stopColor="#ca8a04"
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
                            domain={["dataMin - 50", "dataMax + 50"]}
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
                            stroke="#ca8a04"
                            strokeWidth={2}
                            fillOpacity={1}
                            fill="url(#colorRatingCF)"
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-base font-semibold text-green-600">
                      LeetCode Rating
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pl-0">
                    <div className="h-[200px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart
                          data={ratingHistory.lc}
                          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                        >
                          <defs>
                            <linearGradient
                              id="colorRatingLC"
                              x1="0"
                              y1="0"
                              x2="0"
                              y2="1"
                            >
                              <stop
                                offset="5%"
                                stopColor="#16a34a"
                                stopOpacity={0.2}
                              />
                              <stop
                                offset="95%"
                                stopColor="#16a34a"
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
                            domain={["dataMin - 50", "dataMax + 50"]}
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
                            stroke="#16a34a"
                            strokeWidth={2}
                            fillOpacity={1}
                            fill="url(#colorRatingLC)"
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Bottom Grid: Language & Breakdown */}
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                {/* Fundamental Stats */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm font-semibold flex items-center gap-2">
                      Platform Breakdown
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-6 sm:gap-0">
                      <div className="h-[160px] w-[160px] relative shrink-0">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={[
                                {
                                  name: "Leetcode",
                                  value: stats.leetcodeSolved,
                                  color: "#16a34a",
                                },
                                {
                                  name: "Codeforces",
                                  value: stats.codeforcesSolved,
                                  color: "#ca8a04",
                                },
                              ]}
                              cx="50%"
                              cy="50%"
                              innerRadius={50}
                              outerRadius={70}
                              paddingAngle={5}
                              dataKey="value"
                              stroke="none"
                            >
                              {[
                                {
                                  name: "Leetcode",
                                  value: stats.leetcodeSolved,
                                  color: "#16a34a",
                                },
                                {
                                  name: "Codeforces",
                                  value: stats.codeforcesSolved,
                                  color: "#ca8a04",
                                },
                              ].map((entry, index) => (
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
                          <span className="text-2xl font-bold">
                            {stats.leetcodeSolved + stats.codeforcesSolved}
                          </span>
                          <span className="text-[10px] text-slate-400 uppercase">
                            Solved
                          </span>
                        </div>
                      </div>
                      <div className="flex-1 w-full sm:pl-8 space-y-3">
                        {[
                          {
                            name: "Leetcode",
                            value: stats.leetcodeSolved,
                            color: "#16a34a",
                          },
                          {
                            name: "Codeforces",
                            value: stats.codeforcesSolved,
                            color: "#ca8a04",
                          },
                        ].map((item) => (
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
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-6 sm:gap-0">
                      <div className="h-[160px] w-[160px] relative shrink-0">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={[
                                {
                                  name: "Easy",
                                  value: stats.leetcodeEasy,
                                  color: "#22c55e",
                                },
                                {
                                  name: "Medium",
                                  value: stats.leetcodeMedium,
                                  color: "#eab308",
                                },
                                {
                                  name: "Hard",
                                  value: stats.leetcodeHard,
                                  color: "#ef4444",
                                },
                              ]}
                              cx="50%"
                              cy="50%"
                              innerRadius={50}
                              outerRadius={70}
                              paddingAngle={2}
                              dataKey="value"
                              stroke="none"
                            >
                              {[
                                {
                                  name: "Easy",
                                  value: stats.leetcodeEasy,
                                  color: "#22c55e",
                                },
                                {
                                  name: "Medium",
                                  value: stats.leetcodeMedium,
                                  color: "#eab308",
                                },
                                {
                                  name: "Hard",
                                  value: stats.leetcodeHard,
                                  color: "#ef4444",
                                },
                              ].map((entry, index) => (
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
                          <span className="text-2xl font-bold">
                            {stats.leetcodeSolved}
                          </span>
                          <span className="text-[10px] text-slate-400 uppercase">
                            Total
                          </span>
                        </div>
                      </div>
                      <div className="flex-1 w-full sm:pl-8 space-y-3">
                        {[
                          {
                            name: "Easy",
                            value: stats.leetcodeEasy,
                            color: "#22c55e",
                          },
                          {
                            name: "Medium",
                            value: stats.leetcodeMedium,
                            color: "#eab308",
                          },
                          {
                            name: "Hard",
                            value: stats.leetcodeHard,
                            color: "#ef4444",
                          },
                        ].map((item) => (
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
      <UsernameModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleUsernameSubmit}
      />
    </SidebarProvider>
  );
}
