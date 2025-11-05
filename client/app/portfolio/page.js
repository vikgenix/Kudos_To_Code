"use client";
import React, { useState, useEffect } from "react";
import { Mail, MapPin, GraduationCap, ExternalLink } from "lucide-react";

// Mock data structure - you can replace this with actual data

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

  // Generate activity map on client only
  useEffect(() => {
    setActivityMap(generateActivityMap());
  }, []);

  const getActivityColor = (intensity) => {
    const colors = ["#EBEDF0", "#C6E48B", "#7BC96F", "#239A3B", "#196127"];
    return colors[intensity] || colors[0];
  };
    

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto grid grid-cols-12 gap-6">
        {/* Left Sidebar - Profile */}
        <div className="col-span-3 space-y-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex flex-col items-center">
              <img
                src={data.profile.avatar}
                alt={data.profile.name}
                className="w-32 h-32 rounded-full mb-4"
              />
              <h2 className="text-2xl text-gray-800 font-bold text-center">
                {data.profile.name}
              </h2>
              <p className="text-blue-600 text-sm mb-4">
                {data.profile.username} ✓
              </p>
              <p className="text-gray-600 text-sm text-center">
                {data.profile.title}
              </p>
            </div>

            <div className="flex justify-center gap-4 mt-6 mb-6">
              <Mail className="w-5 h-5 text-gray-600 cursor-pointer" />
              <ExternalLink className="w-5 h-5 text-gray-600 cursor-pointer" />
            </div>

            <div className="space-y-3 border-t pt-4">
              <div className="flex items-center gap-2 text-gray-700">
                <MapPin className="w-4 h-4" />
                <span className="text-sm">{data.profile.location}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-700">
                <GraduationCap className="w-4 h-4" />
                <span className="text-sm">{data.profile.institution}</span>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Last Refresh:</span>
                <span className="font-medium text-gray-800">
                  {data.profile.lastRefresh}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Profile Views:</span>
                <span className="font-medium text-gray-800">
                  {data.profile.profileViews}
                </span>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t">
              <button className="w-full flex items-center justify-between p-3 hover:bg-gray-50 rounded">
                <span className="font-medium text-gray-800">
                  Problem Solving Stats
                </span>
                <span className="text-gray-400">▲</span>
              </button>

              <div className="mt-4 space-y-2">
                {data.platforms.map((platform, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-2 hover:bg-gray-50 rounded"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">💻</span>
                      <span className="text-sm text-gray-800">
                        {platform.name}
                      </span>
                    </div>
                    {platform.connected && (
                      <span className="text-green-500">✓</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="col-span-9 space-y-6">
          {/* Top Stats Cards */}
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-gray-600 text-sm mb-2">Total Questions</h3>
              <p className="text-5xl text-gray-800 font-bold">
                {data.stats.totalQuestions}
              </p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-gray-600 text-sm mb-2">Total Active Days</h3>
              <p className="text-5xl text-gray-800 font-bold">
                {data.stats.totalActiveDays}
              </p>
            </div>
          </div>

          {/* Activity Heatmap */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-4">
              <span className="text-gray-600 text-sm">
                <strong>{data.stats.submissions6Months}</strong> submissions in
                past 6 months
              </span>
              <div className="flex gap-4 text-sm">
                <span className="text-gray-600">
                  Max Streak <strong>{data.stats.maxStreak}</strong>
                </span>
                <span className="text-gray-600">
                  Current Streak <strong>{data.stats.currentStreak}</strong>
                </span>
              </div>
            </div>

            <div className="overflow-x-auto">
              <div className="flex gap-2">
                {activityMap.map((monthData, idx) => (
                  <div key={idx} className="flex flex-col items-center">
                    <div className="flex gap-1 mb-2">
                      {monthData.weeks.map((week, weekIdx) => (
                        <div key={weekIdx} className="flex flex-col gap-1">
                          {week.map((intensity, dayIdx) => (
                            <div
                              key={dayIdx}
                              className="w-3 h-3 rounded-sm"
                              style={{
                                backgroundColor: getActivityColor(intensity),
                              }}
                            />
                          ))}
                        </div>
                      ))}
                    </div>
                    <span className="text-xs text-gray-600">
                      {monthData.month}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Contests and Rating */}
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-gray-600 text-sm mb-4">Total Contests</h3>
              <p className="text-5xl text-gray-800 font-bold mb-6">
                {data.stats.totalContests}
              </p>

              <div className="space-y-3">
                {data.contests.map((contest, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{contest.logo}</span>
                      <span className="text-sm text-gray-800 font-medium">
                        {contest.name}
                      </span>
                    </div>
                    <span className="font-bold">{contest.count}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-gray-600 text-sm mb-2">Rating</h3>
              <p className="text-5xl text-gray-800 font-bold mb-2">
                {data.rating.current}
              </p>
              <p className="text-sm text-gray-600 mb-1">{data.rating.date}</p>
              <p className="text-sm text-gray-800 font-medium">
                {data.rating.achievement}
              </p>
              <p className="text-xs text-gray-600">{data.rating.rank}</p>

              <div className="mt-6 h-32 relative">
                <svg className="w-full h-full" viewBox="0 0 400 120">
                  <defs>
                    <linearGradient
                      id="gradient"
                      x1="0%"
                      y1="0%"
                      x2="0%"
                      y2="100%"
                    >
                      <stop offset="0%" stopColor="#FFA94D" stopOpacity="0.3" />
                      <stop
                        offset="100%"
                        stopColor="#FFA94D"
                        stopOpacity="0.1"
                      />
                    </linearGradient>
                  </defs>
                  <path
                    d="M 0 80 Q 50 60 100 50 T 200 45 T 300 55 T 400 60"
                    fill="url(#gradient)"
                    stroke="#FFA94D"
                    strokeWidth="2"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Problems Solved */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-xl text-gray-800 font-bold mb-6">
              Problems Solved
            </h3>

            <div className="grid grid-cols-2 gap-8">
              {/* Fundamentals */}
              <div>
                <h4 className="text-gray-700 font-medium mb-4">
                  Fundamentals ⓘ
                </h4>
                <div className="flex items-center gap-6">
                  <div className="relative w-40 h-40">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle
                        cx="80"
                        cy="80"
                        r="60"
                        fill="none"
                        stroke="#E5E7EB"
                        strokeWidth="12"
                      />
                      {data.problems.fundamentals.breakdown.map(
                        (item, idx, arr) => {
                          const total = data.problems.fundamentals.total;
                          const prevSum = arr
                            .slice(0, idx)
                            .reduce((sum, i) => sum + i.count, 0);
                          const offset = (prevSum / total) * 377;
                          const length = (item.count / total) * 377;

                          return (
                            <circle
                              key={idx}
                              cx="80"
                              cy="80"
                              r="60"
                              fill="none"
                              stroke={item.color}
                              strokeWidth="12"
                              strokeDasharray={`${length} 377`}
                              strokeDashoffset={-offset}
                            />
                          );
                        }
                      )}
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-3xl text-gray-800 font-bold">
                        {data.problems.fundamentals.total}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {data.problems.fundamentals.breakdown.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between gap-8"
                      >
                        <div className="flex items-center gap-2">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: item.color }}
                          />
                          <span
                            className="text-sm"
                            style={{ color: item.color }}
                          >
                            {item.name}
                          </span>
                        </div>
                        <span className="font-medium text-gray-800">
                          {item.count}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* DSA */}
              <div>
                <h4 className="text-gray-700 font-medium mb-4">DSA</h4>
                <div className="flex items-center gap-6">
                  <div className="relative w-40 h-40">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle
                        cx="80"
                        cy="80"
                        r="60"
                        fill="none"
                        stroke="#E5E7EB"
                        strokeWidth="12"
                      />
                      {data.problems.dsa.breakdown.map((item, idx, arr) => {
                        const total = data.problems.dsa.total;
                        const prevSum = arr
                          .slice(0, idx)
                          .reduce((sum, i) => sum + i.count, 0);
                        const offset = (prevSum / total) * 377;
                        const length = (item.count / total) * 377;

                        return (
                          <circle
                            key={idx}
                            cx="80"
                            cy="80"
                            r="60"
                            fill="none"
                            stroke={item.color}
                            strokeWidth="12"
                            strokeDasharray={`${length} 377`}
                            strokeDashoffset={-offset}
                          />
                        );
                      })}
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center text-gray-800">
                      <span className="text-3xl font-bold">
                        {data.problems.dsa.total}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {data.problems.dsa.breakdown.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between gap-8"
                      >
                        <div className="flex items-center gap-2">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: item.color }}
                          />
                          <span
                            className="text-sm "
                            style={{ color: item.color }}
                          >
                            {item.name}
                          </span>
                        </div>
                        <span className="font-medium text-gray-800">
                          {item.count}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Portfolio;
