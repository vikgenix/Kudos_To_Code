"use client";

import React, { useState } from "react";
import {
  ExternalLink,
  ChevronDown,
  ChevronRight,
  Share2,
  BookmarkPlus,
  Star,
  Play,
} from "lucide-react";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";

// --- Data ---

const sheetData = {
  title: "Striver SDE Sheet",
  description:
    "Striver SDE Sheet contains very handily crafted and picked top coding interview questions from different topics of Data Structures & Algorithms. These questions are one of the most asked coding interview questions in interviews of companies like Google, Amazon, Microsoft, Facebook, Swiggy, Flipkart, etc, and cover almost all of the concepts related to Data Structure & Algorithms.",
  note: "Note : Due to legal and compliance requirements of TakeUForward (TUF), Codolio has updated the links to mirror the latest official TUF sheets. We made sure that your progress and notes remain fully intact , only the external links are updated",
  source: "TakeUForward",
  tag: "popular",
  totalQuestions: 191,
  sections: [
    {
      id: 1,
      name: "Arrays",
      total: 6,
      expanded: true,
      problems: [
        {
          id: 1,
          title: "Set Matrix Zeros",
          difficulty: "Medium",
          tags: ["Arrays", "HashMap and Set"],
          link: "https://leetcode.com/problems/set-matrix-zeroes/",
          videoAvailable: true,
          completed: false,
        },
        {
          id: 2,
          title: "Pascal's Triangle",
          difficulty: "Easy",
          tags: ["Arrays", "Dynamic Programming"],
          link: "https://leetcode.com/problems/pascals-triangle/",
          videoAvailable: true,
          completed: false,
        },
        {
          id: 3,
          title: "Next Permutation",
          difficulty: "Medium",
          tags: ["Arrays", "Two Pointers"],
          link: "https://leetcode.com/problems/next-permutation/",
          videoAvailable: true,
          completed: false,
        },
        {
          id: 4,
          title: "Kadane's Algorithm",
          difficulty: "Medium",
          tags: ["Arrays", "Dynamic Programming"],
          link: "https://leetcode.com/problems/maximum-subarray/",
          videoAvailable: true,
          completed: false,
        },
        {
          id: 5,
          title: "Sort an array of 0's, 1's and 2's",
          difficulty: "Medium",
          tags: ["Arrays", "Two Pointers", "+1"],
          link: "https://leetcode.com/problems/sort-colors/",
          videoAvailable: true,
          completed: false,
        },
        {
          id: 6,
          title: "Stock Buy and Sell",
          difficulty: "Easy",
          tags: ["Arrays", "Dynamic Programming"],
          link: "https://leetcode.com/problems/best-time-to-buy-and-sell-stock/",
          videoAvailable: true,
          completed: false,
        },
      ],
    },
    {
      id: 2,
      name: "Arrays Part-II",
      total: 6,
      expanded: false,
      problems: [],
    },
    {
      id: 3,
      name: "Arrays Part-III",
      total: 6,
      expanded: false,
      problems: [],
    },
    {
      id: 4,
      name: "Linked List",
      total: 8,
      expanded: false,
      problems: [],
    },
    {
      id: 5,
      name: "Greedy Algorithm",
      total: 7,
      expanded: false,
      problems: [],
    },
  ],
};

const StriverSDESheet = () => {
  const [sections, setSections] = useState(sheetData.sections);

  // Derived progress
  const completedCount = sections.reduce((sum, section) => {
    return sum + section.problems.filter((problem) => problem.completed).length;
  }, 0);

  const progress =
    sheetData.totalQuestions > 0
      ? (completedCount / sheetData.totalQuestions) * 100
      : 0;

  const toggleSection = (sectionId) => {
    setSections((prev) =>
      prev.map((section) =>
        section.id === sectionId
          ? { ...section, expanded: !section.expanded }
          : section
      )
    );
  };

  const toggleProblem = (sectionId, problemId) => {
    setSections((prev) =>
      prev.map((section) => {
        if (section.id !== sectionId) return section;
        return {
          ...section,
          problems: section.problems.map((problem) =>
            problem.id === problemId
              ? { ...problem, completed: !problem.completed }
              : problem
          ),
        };
      })
    );
  };

  // Circle progress math
  const radius = 56;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset =
    circumference - (progress / 100) * circumference || circumference;

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-8 md:flex-row md:items-start md:justify-between">
          {/* Left: Info */}
          <div className="flex-1 space-y-4">
            <div className="flex items-start justify-between gap-4">
              <h1 className="text-3xl font-bold tracking-tight">
                {sheetData.title}
              </h1>
              <Button variant="ghost" size="sm" className="gap-2">
                <Share2 className="h-4 w-4" />
                Share
              </Button>
            </div>

            <p className="text-sm leading-relaxed text-muted-foreground">
              {sheetData.description}
            </p>

            <Card className="border bg-muted/40">
              <CardContent className="px-4 py-3">
                <p className="text-xs text-muted-foreground">
                  {sheetData.note}
                </p>
              </CardContent>
            </Card>

            <div className="flex flex-wrap items-center gap-3 text-sm">
              <div>
                <span className="font-semibold">Source: </span>
                <span className="text-muted-foreground">
                  {sheetData.source}
                </span>
              </div>
              <Badge variant="secondary" className="capitalize">
                {sheetData.tag}
              </Badge>
            </div>

            <Button size="sm" className="gap-2">
              <BookmarkPlus className="h-4 w-4" />
              Follow
            </Button>
          </div>

          {/* Right: Progress Circle */}
          <div className="flex items-center justify-center">
            <div className="relative h-32 w-32 text-primary">
              <svg className="h-32 w-32 -rotate-90">
                <circle
                  cx="64"
                  cy="64"
                  r={radius}
                  stroke="hsl(var(--muted-foreground))"
                  strokeWidth="8"
                  fill="none"
                />
                <circle
                  cx="64"
                  cy="64"
                  r={radius}
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="none"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  className="transition-all duration-300"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="text-3xl font-bold">{completedCount}</div>
                <div className="text-xs text-muted-foreground">
                  / {sheetData.totalQuestions}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="h-2 bg-muted">
        <div
          className="h-full bg-primary transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Sections */}
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="space-y-4">
          {sections.map((section) => {
            const sectionCompleted = section.problems.filter(
              (p) => p.completed
            ).length;

            return (
              <Card key={section.id} className="overflow-hidden border">
                {/* Section header */}
                <button
                  type="button"
                  onClick={() => toggleSection(section.id)}
                  className="flex w-full items-center justify-between bg-muted/40 px-4 py-3 text-left hover:bg-muted"
                >
                  <div className="flex items-center gap-3">
                    <CardTitle className="text-base font-semibold">
                      {section.name}
                    </CardTitle>
                    <span className="text-xs font-medium text-muted-foreground">
                      {sectionCompleted} / {section.total}
                    </span>
                  </div>
                  {section.expanded ? (
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  )}
                </button>

                {/* Problems */}
                {section.expanded && section.problems.length > 0 && (
                  <CardContent className="divide-y px-0 py-0">
                    {section.problems.map((problem) => (
                      <div
                        key={problem.id}
                        className={`flex flex-wrap items-center gap-3 px-4 py-3 text-sm ${
                          problem.completed ? "bg-muted" : "bg-card"
                        } hover:bg-muted/60 transition-colors`}
                      >
                        {/* Checkbox */}
                        <Checkbox
                          checked={problem.completed}
                          onCheckedChange={() =>
                            toggleProblem(section.id, problem.id)
                          }
                        />

                        {/* Title + link */}
                        <div className="min-w-[160px] flex-1">
                          <a
                            href={problem.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`inline-flex items-center gap-1 font-medium hover:text-primary ${
                              problem.completed
                                ? "text-muted-foreground line-through"
                                : "text-foreground"
                            }`}
                          >
                            {problem.title}
                            <ExternalLink className="h-3 w-3 text-muted-foreground" />
                          </a>
                        </div>

                        {/* Difficulty */}
                        <Badge
                          className="whitespace-nowrap"
                          variant={
                            problem.difficulty === "Easy"
                              ? "outline"
                              : problem.difficulty === "Medium"
                              ? "secondary"
                              : "default"
                          }
                        >
                          {problem.difficulty}
                        </Badge>

                        {/* Video */}
                        {problem.videoAvailable && (
                          <Button
                            size="icon"
                            className="h-8 w-8 rounded-full bg-destructive hover:bg-destructive/90"
                          >
                            <Play className="h-4 w-4" />
                          </Button>
                        )}

                        {/* Tags */}
                        <div className="flex flex-wrap gap-1">
                          {problem.tags.map((tag, i) => (
                            <Badge
                              key={i}
                              variant="outline"
                              className="text-[10px]"
                            >
                              {tag}
                            </Badge>
                          ))}
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-muted-foreground hover:text-yellow-500"
                          >
                            <Star className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-muted-foreground hover:text-primary"
                          >
                            <BookmarkPlus className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                )}
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default StriverSDESheet;
