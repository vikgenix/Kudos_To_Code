"use client";

import React, { useState } from "react";
import { BookOpen, Plus, ExternalLink } from "lucide-react";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";

// --- Mock Data ---

const initialSheets = [
  {
    id: 101,
    title: "Strivers A2Z DSA Sheet",
    description:
      "Learn DSA from A to Z for free with a structured roadmap and curated problems.",
    questions: 455,
    followers: 19961,
    progress: 0,
    locked: false,
  },
  {
    id: 102,
    title: "Striver SDE Sheet",
    description:
      "Hand-picked top coding interview questions for SDE roles across big tech companies.",
    questions: 191,
    followers: 9595,
    progress: 0,
    locked: false,
  },
  {
    id: 103,
    title: "Love Babbar Sheet",
    description:
      "Cover almost every core DSA concept with this comprehensive problem list.",
    questions: 430,
    followers: 5126,
    progress: 0,
    locked: false,
  },
  {
    id: 104,
    title: "Neetcode 150",
    description:
      "Beginner-friendly and popular DSA sheet focusing on essential LeetCode problems.",
    questions: 150,
    followers: 3335,
    progress: 0,
    locked: false,
  },
  {
    id: 105,
    title: "Top Interview 150: LeetCode",
    description:
      "Most frequently asked interview problems curated by LeetCode.",
    questions: 150,
    followers: 3294,
    progress: 0,
    locked: false,
  },
  {
    id: 106,
    title: "Blind 75",
    description:
      "Classic list of 75 must-do LeetCode questions for interview prep.",
    questions: 75,
    followers: 2661,
    progress: 0,
    locked: false,
  },
];

const sheetDetails = {
  102: {
    title: "Striver SDE Sheet",
    description:
      "Striver SDE Sheet contains hand-picked top coding interview questions from different topics of Data Structures & Algorithms. These questions are frequently asked in companies like Google, Amazon, Microsoft, Meta, Swiggy, Flipkart, etc., and cover most major DSA concepts.",
    source: "TakeUForward",
    questions: 191,
    tag: "popular",
    sections: [
      {
        name: "Arrays",
        total: 6,
        completed: 0,
        problems: [
          {
            id: 1,
            title: "Set Matrix Zeros",
            difficulty: "Medium",
            tags: ["Arrays", "HashMap", "Set"],
            link: "https://leetcode.com/problems/set-matrix-zeroes/",
            videoAvailable: true,
          },
          {
            id: 2,
            title: "Pascal's Triangle",
            difficulty: "Easy",
            tags: ["Arrays", "Dynamic Programming"],
            link: "https://leetcode.com/problems/pascals-triangle/",
            videoAvailable: true,
          },
          {
            id: 3,
            title: "Next Permutation",
            difficulty: "Medium",
            tags: ["Arrays", "Two Pointers"],
            link: "https://leetcode.com/problems/next-permutation/",
            videoAvailable: true,
          },
          {
            id: 4,
            title: "Kadane's Algorithm",
            difficulty: "Medium",
            tags: ["Arrays", "Dynamic Programming"],
            link: "https://leetcode.com/problems/maximum-subarray/",
            videoAvailable: true,
          },
          {
            id: 5,
            title: "Sort Colors (0, 1, 2)",
            difficulty: "Medium",
            tags: ["Arrays", "Two Pointers"],
            link: "https://leetcode.com/problems/sort-colors/",
            videoAvailable: true,
          },
          {
            id: 6,
            title: "Best Time to Buy and Sell Stock",
            difficulty: "Easy",
            tags: ["Arrays", "Dynamic Programming"],
            link: "https://leetcode.com/problems/best-time-to-buy-and-sell-stock/",
            videoAvailable: true,
          },
        ],
      },
      {
        name: "Arrays Part-II",
        total: 6,
        completed: 0,
        problems: [],
      },
      {
        name: "Arrays Part-III",
        total: 6,
        completed: 0,
        problems: [],
      },
    ],
  },
};

// --- Component ---

const CodingSheetsApp = () => {
  const [sheets, setSheets] = useState(initialSheets);
  const [selectedSheetId, setSelectedSheetId] = useState(null);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newSheet, setNewSheet] = useState({
    title: "",
    description: "",
    questions: 0,
  });

  const selectedSheetDetail = selectedSheetId
    ? sheetDetails[selectedSheetId]
    : null;

  const handleAddSheet = () => {
    if (!newSheet.title.trim() || !newSheet.description.trim()) return;

    const sheet = {
      id: Date.now(),
      title: newSheet.title.trim(),
      description: newSheet.description.trim(),
      questions: newSheet.questions || 0,
      followers: 0,
      progress: 0,
      locked: false,
    };

    setSheets((prev) => [...prev, sheet]);
    setNewSheet({ title: "", description: "", questions: 0 });
    setIsAddOpen(false);
  };

  const renderHeader = () => (
    <header className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Track Coding Sheets in One Place
        </h1>
        <p className="text-muted-foreground">
          Choose from structured coding paths and monitor your progress.
        </p>
      </div>
    </header>
  );

  const renderAllSheets = () => (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold tracking-tight">All Sheets</h2>

        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus className="mr-2 h-4 w-4" />
              Add Custom Sheet
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Custom Sheet</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <label className="text-sm font-medium">Sheet Title</label>
                <Input
                  placeholder="e.g. My Custom DSA Sheet"
                  value={newSheet.title}
                  onChange={(e) =>
                    setNewSheet((prev) => ({ ...prev, title: e.target.value }))
                  }
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Description</label>
                <Textarea
                  rows={3}
                  placeholder="Describe your coding sheet..."
                  value={newSheet.description}
                  onChange={(e) =>
                    setNewSheet((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Number of Questions
                </label>
                <Input
                  type="number"
                  min={0}
                  value={newSheet.questions || ""}
                  onChange={(e) =>
                    setNewSheet((prev) => ({
                      ...prev,
                      questions: parseInt(e.target.value || "0", 10),
                    }))
                  }
                />
              </div>
              <Button className="w-full" onClick={handleAddSheet}>
                Save Sheet
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {sheets.map((sheet) => (
          <Card
            key={sheet.id}
            className="cursor-pointer transition hover:shadow-sm"
            onClick={() => setSelectedSheetId(sheet.id)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <CardTitle className="text-base">{sheet.title}</CardTitle>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {sheet.followers.toLocaleString()} followers
                  </p>
                </div>
                <div className="text-right text-xs text-muted-foreground">
                  <div className="text-2xl font-semibold">
                    {sheet.progress}%
                  </div>
                  <p>completed</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pb-3">
              <CardDescription className="line-clamp-3 text-xs">
                {sheet.description}
              </CardDescription>
            </CardContent>
            <CardFooter className="flex items-center justify-between pt-0">
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <BookOpen className="h-3 w-3" />
                <span>{sheet.questions} questions</span>
              </div>
              <Button variant="outline" size="sm">
                View Sheet
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </section>
  );

  const renderDetail = () => {
    if (!selectedSheetDetail) return null;

    const sheet = selectedSheetDetail;

    return (
      <section className="space-y-6">
        <Button
          variant="ghost"
          size="sm"
          className="px-0 text-sm"
          onClick={() => setSelectedSheetId(null)}
        >
          ← Back to all sheets
        </Button>

        <Card>
          <CardHeader>
            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
              <div className="space-y-2">
                <CardTitle className="text-2xl">{sheet.title}</CardTitle>
                <p className="text-sm text-muted-foreground">
                  {sheet.description}
                </p>
                <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                  <span>Source: {sheet.source}</span>
                  <Badge variant="secondary" className="capitalize">
                    {sheet.tag}
                  </Badge>
                </div>
              </div>
              <div className="flex h-20 w-20 flex-col items-center justify-center rounded-full bg-muted text-xs">
                <div className="text-2xl font-semibold">0</div>
                <div className="text-muted-foreground">/ {sheet.questions}</div>
              </div>
            </div>
          </CardHeader>
          <CardFooter>
            <Button>Follow</Button>
          </CardFooter>
        </Card>

        <div className="space-y-4">
          {sheet.sections.map((section, idx) => (
            <Card key={idx}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0">
                <div className="flex items-center gap-3">
                  <CardTitle className="text-base">{section.name}</CardTitle>
                  <span className="text-xs text-muted-foreground">
                    {section.completed} / {section.total}
                  </span>
                </div>
              </CardHeader>
              {section.problems.length > 0 && (
                <CardContent className="space-y-2">
                  {section.problems.map((problem) => (
                    <div
                      key={problem.id}
                      className="flex flex-wrap items-center gap-3 rounded-md border px-3 py-2 text-sm"
                    >
                      <Checkbox />
                      <div className="flex-1 min-w-[180px]">
                        <a
                          href={problem.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 font-medium hover:underline"
                        >
                          {problem.title}
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </div>
                      <Badge
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
                      <div className="flex flex-wrap gap-1">
                        {problem.tags.map((tag) => (
                          <Badge
                            key={tag}
                            variant="outline"
                            className="text-[10px]"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  ))}
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      </section>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <main className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-8">
        {renderHeader()}
        {selectedSheetDetail ? renderDetail() : renderAllSheets()}
      </main>
    </div>
  );
};

export default CodingSheetsApp;
