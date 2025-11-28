"use client";
import React, { useState, useEffect, useMemo } from "react";
import {
  BookOpen,
  Plus,
  ExternalLink,
  X,
  ChevronLeft,
  Check,
  RotateCcw,
  Trash2,
  PieChart,
} from "lucide-react";

// --- UI Components ---

const Card = ({ className = "", children, ...props }) => (
  <div
    className={`rounded-xl border border-slate-200 bg-white text-slate-950 shadow-sm ${className}`}
    {...props}
  >
    {children}
  </div>
);

const CardHeader = ({ className = "", children }) => (
  <div className={`flex flex-col space-y-1.5 p-6 ${className}`}>{children}</div>
);

const CardTitle = ({ className = "", children }) => (
  <h3 className={`font-semibold leading-none tracking-tight ${className}`}>
    {children}
  </h3>
);

const CardDescription = ({ className = "", children }) => (
  <p className={`text-sm text-slate-500 ${className}`}>{children}</p>
);

const CardContent = ({ className = "", children }) => (
  <div className={`p-6 pt-0 ${className}`}>{children}</div>
);

const CardFooter = ({ className = "", children }) => (
  <div className={`flex items-center p-6 pt-0 ${className}`}>{children}</div>
);

const Button = ({
  className = "",
  variant = "default",
  size = "default",
  children,
  ...props
}) => {
  const variants = {
    default: "bg-slate-900 text-slate-50 hover:bg-slate-900/90",
    outline:
      "border border-slate-200 bg-white hover:bg-slate-100 text-slate-900",
    ghost: "hover:bg-slate-100 hover:text-slate-900",
    secondary: "bg-slate-100 text-slate-900 hover:bg-slate-100/80",
    destructive:
      "bg-red-50 text-red-600 hover:bg-red-100 border border-red-200",
  };
  const sizes = {
    default: "h-10 px-4 py-2",
    sm: "h-9 rounded-md px-3",
    xs: "h-7 rounded px-2 text-xs",
    icon: "h-10 w-10",
  };
  return (
    <button
      className={`inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

const Badge = ({ className = "", variant = "default", children }) => {
  const variants = {
    default:
      "border-transparent bg-slate-900 text-slate-50 hover:bg-slate-900/80",
    secondary:
      "border-transparent bg-slate-100 text-slate-900 hover:bg-slate-100/80",
    outline: "text-slate-950 border-slate-200",
  };
  return (
    <div
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-slate-950 focus:ring-offset-2 ${variants[variant]} ${className}`}
    >
      {children}
    </div>
  );
};

const Input = ({ className = "", ...props }) => (
  <input
    className={`flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
    {...props}
  />
);

const Textarea = ({ className = "", ...props }) => (
  <textarea
    className={`flex min-h-[80px] w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
    {...props}
  />
);

const Select = ({ className = "", children, ...props }) => (
  <div className="relative">
    <select
      className={`flex h-10 w-full items-center justify-between rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-950 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 appearance-none ${className}`}
      {...props}
    >
      {children}
    </select>
    <div className="absolute right-3 top-3 pointer-events-none opacity-50">
      <ChevronLeft className="h-4 w-4 -rotate-90" />
    </div>
  </div>
);

const Checkbox = ({ checked, onCheckedChange }) => (
  <button
    type="button"
    role="checkbox"
    aria-checked={checked}
    onClick={() => onCheckedChange(!checked)}
    className={`peer h-5 w-5 shrink-0 rounded border border-slate-300 ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all ${
      checked
        ? "bg-green-600 border-green-600 text-white"
        : "bg-white hover:border-slate-400"
    }`}
  >
    {checked && <Check className="h-3.5 w-3.5 mx-auto" strokeWidth={3} />}
  </button>
);

const Dialog = ({ open, onOpenChange, children, title }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in-0">
      <div className="relative w-full max-w-lg bg-white rounded-lg shadow-xl border border-slate-200 p-6 animate-in zoom-in-95 slide-in-from-bottom-2">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold leading-none tracking-tight">
            {title}
          </h3>
          <button
            onClick={() => onOpenChange(false)}
            className="rounded-sm opacity-70 ring-offset-white transition-opacity hover:opacity-100 focus:outline-none"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};

// --- New Component: Circular Progress ---

const CircularProgress = ({
  completed,
  total,
  size = 120,
  strokeWidth = 8,
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const percentage = total > 0 ? (completed / total) * 100 : 0;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div
      className="relative flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      <svg
        className="transform -rotate-90 w-full h-full"
        viewBox={`0 0 ${size} ${size}`}
      >
        {/* Background Circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          className="text-slate-100"
        />
        {/* Progress Circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="text-green-600 transition-all duration-500 ease-out"
        />
      </svg>
      <div className="absolute flex flex-col items-center justify-center text-center">
        <span className="text-2xl font-bold text-slate-900">
          {Math.round(percentage)}%
        </span>
        <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">
          {completed}/{total}
        </span>
      </div>
    </div>
  );
};

// --- Initial Data ---

const initialSheets = [
  {
    id: 101,
    title: "Striver's A2Z DSA Sheet",
    description: "Learn DSA from A to Z for free with a structured roadmap.",
    questions: 455,
    followers: 19961,
  },
  {
    id: 102,
    title: "Striver SDE Sheet",
    description: "Hand-picked top coding interview questions for SDE roles.",
    questions: 191,
    followers: 9595,
  },
  {
    id: 103,
    title: "Love Babbar Sheet",
    description: "Cover almost every core DSA concept.",
    questions: 430,
    followers: 5126,
  },
];

const initialSheetDetailsData = {
  102: {
    title: "Striver SDE Sheet",
    description:
      "Striver SDE Sheet contains hand-picked top coding interview questions.",
    source: "TakeUForward",
    questions: 6,
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
            tags: ["Arrays", "HashMap"],
            link: "https://leetcode.com/problems/set-matrix-zeroes/",
          },
          {
            id: 2,
            title: "Pascal's Triangle",
            difficulty: "Easy",
            tags: ["Arrays", "DP"],
            link: "https://leetcode.com/problems/pascals-triangle/",
          },
          {
            id: 3,
            title: "Next Permutation",
            difficulty: "Medium",
            tags: ["Arrays", "Two Pointers"],
            link: "https://leetcode.com/problems/next-permutation/",
          },
          {
            id: 4,
            title: "Kadane's Algorithm",
            difficulty: "Medium",
            tags: ["Arrays", "DP"],
            link: "https://leetcode.com/problems/maximum-subarray/",
          },
          {
            id: 5,
            title: "Sort Colors (0, 1, 2)",
            difficulty: "Medium",
            tags: ["Arrays", "Two Pointers"],
            link: "https://leetcode.com/problems/sort-colors/",
          },
          {
            id: 6,
            title: "Best Time to Buy and Sell Stock",
            difficulty: "Easy",
            tags: ["Arrays", "DP"],
            link: "https://leetcode.com/problems/best-time-to-buy-and-sell-stock/",
          },
        ],
      },
    ],
  },
};

// --- Helper for Unique IDs ---
const generateUniqueId = () => {
  return Date.now() + Math.floor(Math.random() * 1000000);
};

// --- Main Application ---

const CodingSheetsApp = () => {
  const [sheets, setSheets] = useState(initialSheets);
  const [allSheetDetails, setAllSheetDetails] = useState(
    initialSheetDetailsData
  );
  const [completedProblems, setCompletedProblems] = useState({});
  const [isMounted, setIsMounted] = useState(false);

  // Load LocalStorage
  useEffect(() => {
    try {
      const savedSheets = localStorage.getItem("dsa-tracker-sheets-v2");
      const savedDetails = localStorage.getItem("dsa-tracker-details-v2");
      const savedCompleted = localStorage.getItem("dsa-tracker-completed-v2");

      if (savedSheets) setSheets(JSON.parse(savedSheets));
      if (savedDetails) setAllSheetDetails(JSON.parse(savedDetails));
      if (savedCompleted) setCompletedProblems(JSON.parse(savedCompleted));
    } catch (e) {
      console.error("Failed to load local storage", e);
    } finally {
      setIsMounted(true);
    }
  }, []);

  // Persist State
  useEffect(() => {
    if (isMounted) {
      localStorage.setItem("dsa-tracker-sheets-v2", JSON.stringify(sheets));
      localStorage.setItem(
        "dsa-tracker-details-v2",
        JSON.stringify(allSheetDetails)
      );
      localStorage.setItem(
        "dsa-tracker-completed-v2",
        JSON.stringify(completedProblems)
      );
    }
  }, [sheets, allSheetDetails, completedProblems, isMounted]);

  const [selectedSheetId, setSelectedSheetId] = useState(null);

  // Modals
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newSheet, setNewSheet] = useState({ title: "", description: "" });

  const [isAddProblemOpen, setIsAddProblemOpen] = useState(false);
  const [newProblem, setNewProblem] = useState({
    title: "",
    link: "",
    difficulty: "Easy",
    tags: "",
  });

  const getSheetDetail = (id) => {
    if (allSheetDetails[id]) return allSheetDetails[id];
    const basicInfo = sheets.find((s) => s.id === id);
    return {
      title: basicInfo?.title || "Unknown Sheet",
      description: basicInfo?.description || "",
      source: "Community",
      questions: basicInfo?.questions || 0,
      tag: "custom",
      sections: [
        {
          name: "Getting Started (Demo)",
          total: 3,
          completed: 0,
          problems: [
            {
              id: 901,
              title: "Two Sum",
              difficulty: "Easy",
              tags: ["Array"],
              link: "https://leetcode.com/problems/two-sum/",
            },
            {
              id: 902,
              title: "Valid Anagram",
              difficulty: "Easy",
              tags: ["String"],
              link: "https://leetcode.com/problems/valid-anagram/",
            },
            {
              id: 903,
              title: "Contains Duplicate",
              difficulty: "Easy",
              tags: ["Array"],
              link: "https://leetcode.com/problems/contains-duplicate/",
            },
          ],
        },
      ],
    };
  };

  const selectedSheetDetail = selectedSheetId
    ? getSheetDetail(selectedSheetId)
    : null;

  // --- Actions ---

  const handleAddSheet = () => {
    if (!newSheet.title.trim() || !newSheet.description.trim()) return;

    const newId = generateUniqueId();
    const sheet = {
      id: newId,
      title: newSheet.title.trim(),
      description: newSheet.description.trim(),
      questions: 0,
      followers: 0,
    };

    const sheetDetail = {
      title: sheet.title,
      description: sheet.description,
      source: "User",
      questions: 0,
      tag: "custom",
      sections: [{ name: "Problems", total: 0, completed: 0, problems: [] }],
    };

    setSheets((prev) => [...prev, sheet]);
    setAllSheetDetails((prev) => ({ ...prev, [newId]: sheetDetail }));
    setNewSheet({ title: "", description: "" });
    setIsAddOpen(false);
  };

  const handleDeleteSheet = () => {
    if (
      confirm(
        "Are you sure you want to delete this entire sheet? This action cannot be undone."
      )
    ) {
      setSheets((prev) => prev.filter((s) => s.id !== selectedSheetId));

      const newDetails = { ...allSheetDetails };
      delete newDetails[selectedSheetId];
      setAllSheetDetails(newDetails);

      setSelectedSheetId(null);
    }
  };

  const handleAddProblem = () => {
    if (!newProblem.title.trim()) return;

    setAllSheetDetails((prev) => {
      const currentSheet = prev[selectedSheetId];
      // Clone structure
      const sections = currentSheet.sections.map((s) => ({
        ...s,
        problems: [...s.problems],
      }));

      const problem = {
        id: generateUniqueId(),
        title: newProblem.title,
        link: newProblem.link,
        difficulty: newProblem.difficulty,
        tags: newProblem.tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
      };

      if (sections.length === 0)
        sections.push({ name: "Problems", total: 0, problems: [] });

      sections[0].problems.push(problem);
      sections[0].total = sections[0].problems.length;

      return {
        ...prev,
        [selectedSheetId]: {
          ...currentSheet,
          sections: sections,
          questions: currentSheet.questions + 1,
        },
      };
    });

    setSheets((prev) =>
      prev.map((s) =>
        s.id === selectedSheetId ? { ...s, questions: s.questions + 1 } : s
      )
    );

    setNewProblem({ title: "", link: "", difficulty: "Easy", tags: "" });
    setIsAddProblemOpen(false);
  };

  const handleDeleteProblem = (sectionIndex, problemId) => {
    if (!confirm("Remove this problem?")) return;

    setAllSheetDetails((prev) => {
      const currentSheet = prev[selectedSheetId];
      const sections = currentSheet.sections.map((s, idx) => {
        if (idx !== sectionIndex) return s;
        return {
          ...s,
          problems: s.problems.filter((p) => p.id !== problemId),
          total: s.problems.length - 1,
        };
      });

      return {
        ...prev,
        [selectedSheetId]: {
          ...currentSheet,
          sections: sections,
          questions: currentSheet.questions - 1,
        },
      };
    });

    setSheets((prev) =>
      prev.map((s) =>
        s.id === selectedSheetId ? { ...s, questions: s.questions - 1 } : s
      )
    );

    // Optional: cleanup completed state
    const key = `${selectedSheetId}-${problemId}`;
    setCompletedProblems((prev) => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
  };

  const toggleProblem = (sheetId, problemId) => {
    const key = `${sheetId}-${problemId}`;
    setCompletedProblems((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const clearStorage = () => {
    if (confirm("Reset all data? This cannot be undone.")) {
      localStorage.removeItem("dsa-tracker-sheets-v2");
      localStorage.removeItem("dsa-tracker-details-v2");
      localStorage.removeItem("dsa-tracker-completed-v2");
      window.location.reload();
    }
  };

  // Helper to get stats for any sheet
  const getSheetStats = (sheetId, totalQuestions) => {
    if (totalQuestions === 0) return { completed: 0, percent: 0 };
    // We count keys in completedProblems that start with sheetId- and are true
    const completedCount = Object.keys(completedProblems).filter(
      (k) => k.startsWith(`${sheetId}-`) && completedProblems[k]
    ).length;
    return {
      completed: completedCount,
      percent: Math.round((completedCount / totalQuestions) * 100),
    };
  };

  if (!isMounted) return null;

  return (
    <div className="min-h-screen bg-slate-50/50 font-sans text-slate-900 flex flex-col">
      <main className="mx-auto w-full max-w-6xl flex-col gap-4 px-4 py-8 md:py-12 flex-1">
        {/* Header */}
        <header className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">
              Track Coding Sheets
            </h1>
            <p className="text-slate-500 mt-1">
              Choose from structured coding paths and monitor your progress.
            </p>
          </div>
        </header>

        {selectedSheetDetail ? (
          // --- DETAIL VIEW ---
          <section className="space-y-6 animate-in slide-in-from-right-4 duration-300">
            {/* Top Navigation Bar */}
            <div className="flex items-center justify-between">
              <Button
                variant="ghost"
                size="sm"
                className="px-0 text-sm hover:bg-transparent hover:text-blue-600 -ml-2"
                onClick={() => setSelectedSheetId(null)}
              >
                <ChevronLeft className="h-4 w-4 mr-1" /> Back to all sheets
              </Button>

              <div className="flex items-center gap-2">
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleDeleteSheet}
                  className="bg-white text-red-600 border-red-100 hover:bg-red-50"
                >
                  <Trash2 className="mr-2 h-3.5 w-3.5" />
                  Delete Sheet
                </Button>

                <Button size="sm" onClick={() => setIsAddProblemOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Problem
                </Button>
              </div>

              {/* Add Problem Modal */}
              <Dialog
                open={isAddProblemOpen}
                onOpenChange={setIsAddProblemOpen}
                title="Add New Problem"
              >
                <div className="space-y-4 py-2">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Problem Title</label>
                    <Input
                      placeholder="e.g. Reverse Linked List"
                      value={newProblem.title}
                      onChange={(e) =>
                        setNewProblem({ ...newProblem, title: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Link (Optional)
                    </label>
                    <Input
                      placeholder="https://leetcode.com/..."
                      value={newProblem.link}
                      onChange={(e) =>
                        setNewProblem({ ...newProblem, link: e.target.value })
                      }
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Difficulty</label>
                      <Select
                        value={newProblem.difficulty}
                        onChange={(e) =>
                          setNewProblem({
                            ...newProblem,
                            difficulty: e.target.value,
                          })
                        }
                      >
                        <option>Easy</option>
                        <option>Medium</option>
                        <option>Hard</option>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">
                        Tags (comma separated)
                      </label>
                      <Input
                        placeholder="Array, DP..."
                        value={newProblem.tags}
                        onChange={(e) =>
                          setNewProblem({ ...newProblem, tags: e.target.value })
                        }
                      />
                    </div>
                  </div>
                  <Button className="w-full" onClick={handleAddProblem}>
                    Add to Sheet
                  </Button>
                </div>
              </Dialog>
            </div>

            {/* Header Card with Chart */}
            <Card className="border-slate-200 shadow-sm overflow-hidden">
              <div className="flex flex-col md:flex-row">
                <div className="flex-1 p-6 md:pr-0 flex flex-col justify-center">
                  <div className="space-y-3">
                    <CardTitle className="text-2xl">
                      {selectedSheetDetail.title}
                    </CardTitle>
                    <p className="text-sm text-slate-500 leading-relaxed max-w-2xl">
                      {selectedSheetDetail.description}
                    </p>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                      <span className="font-medium bg-slate-100 px-2 py-1 rounded">
                        Source: {selectedSheetDetail.source}
                      </span>
                      <Badge variant="secondary" className="capitalize">
                        {selectedSheetDetail.tag}
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Circular Chart Area */}
                <div className="bg-slate-50/50 p-6 flex flex-col items-center justify-center border-l border-slate-100 min-w-[200px]">
                  <CircularProgress
                    completed={
                      getSheetStats(
                        selectedSheetId,
                        selectedSheetDetail.questions
                      ).completed
                    }
                    total={selectedSheetDetail.questions}
                  />
                  <span className="text-xs text-slate-400 mt-2 font-medium">
                    Progress
                  </span>
                </div>
              </div>
            </Card>

            {/* Problem List */}
            <div className="space-y-4">
              {selectedSheetDetail.sections.map((section, sectionIdx) => (
                <Card key={sectionIdx} className="overflow-hidden">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 bg-slate-50/50 py-4">
                    <div className="flex items-center gap-3">
                      <CardTitle className="text-base font-semibold">
                        {section.name}
                      </CardTitle>
                      <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-slate-200 text-slate-700">
                        {
                          section.problems.filter(
                            (p) =>
                              completedProblems[`${selectedSheetId}-${p.id}`]
                          ).length
                        }
                        {" / "}
                        {section.problems.length}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent className="p-0">
                    {section.problems.length > 0 ? (
                      <div className="divide-y divide-slate-100">
                        {section.problems.map((problem) => {
                          const isChecked =
                            !!completedProblems[
                              `${selectedSheetId}-${problem.id}`
                            ];
                          return (
                            <div
                              key={problem.id}
                              className={`group flex flex-col sm:flex-row sm:items-center gap-3 p-4 transition-colors hover:bg-slate-50/80 ${
                                isChecked ? "bg-slate-50/40" : ""
                              }`}
                            >
                              <div className="flex items-center gap-3 flex-1 min-w-0">
                                <Checkbox
                                  checked={isChecked}
                                  onCheckedChange={() =>
                                    toggleProblem(selectedSheetId, problem.id)
                                  }
                                />
                                <div className="flex-1 min-w-0">
                                  <a
                                    href={problem.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={`inline-flex items-center gap-1.5 font-medium hover:text-blue-600 hover:underline decoration-blue-600/30 truncate max-w-full ${
                                      isChecked
                                        ? "text-slate-500 line-through decoration-slate-400"
                                        : "text-slate-900"
                                    }`}
                                  >
                                    {problem.title}
                                    <ExternalLink className="h-3 w-3 opacity-50" />
                                  </a>
                                </div>
                              </div>

                              <div className="flex items-center gap-3 pl-8 sm:pl-0 justify-between sm:justify-end w-full sm:w-auto">
                                <div className="flex items-center gap-2">
                                  <Badge
                                    className={`text-[10px] h-5 px-2 ${
                                      problem.difficulty === "Easy"
                                        ? "bg-green-50 text-green-700 hover:bg-green-100 border-green-200 border"
                                        : problem.difficulty === "Medium"
                                        ? "bg-yellow-50 text-yellow-700 hover:bg-yellow-100 border-yellow-200 border"
                                        : "bg-red-50 text-red-700 hover:bg-red-100 border-red-200 border"
                                    }`}
                                  >
                                    {problem.difficulty}
                                  </Badge>
                                  <div className="hidden sm:flex flex-wrap gap-1">
                                    {problem.tags.map((tag) => (
                                      <span
                                        key={tag}
                                        className="text-[10px] text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200"
                                      >
                                        {tag}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                                <button
                                  onClick={() =>
                                    handleDeleteProblem(sectionIdx, problem.id)
                                  }
                                  className="text-slate-300 hover:text-red-500 hover:bg-red-50 p-1.5 rounded transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
                                  title="Remove Question"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="p-8 text-center text-slate-400 text-sm italic">
                        No problems added yet. Click "Add Problem" to get
                        started.
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        ) : (
          // --- ALL SHEETS LIST ---
          <section className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold tracking-tight text-slate-900">
                All Sheets
              </h2>
              <Button size="sm" onClick={() => setIsAddOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Add Custom Sheet
              </Button>

              <Dialog
                open={isAddOpen}
                onOpenChange={setIsAddOpen}
                title="Add Custom Sheet"
              >
                <div className="space-y-4 py-2">
                  <div className="space-y-2">
                    <label className="text-sm font-medium leading-none">
                      Sheet Title
                    </label>
                    <Input
                      placeholder="e.g. My Custom DSA Sheet"
                      value={newSheet.title}
                      onChange={(e) =>
                        setNewSheet((prev) => ({
                          ...prev,
                          title: e.target.value,
                        }))
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium leading-none">
                      Description
                    </label>
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
                  <Button className="w-full" onClick={handleAddSheet}>
                    Create Sheet
                  </Button>
                </div>
              </Dialog>
            </div>

            {sheets.length > 0 ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {sheets.map((sheet) => {
                  const stats = getSheetStats(sheet.id, sheet.questions);
                  return (
                    <Card
                      key={sheet.id}
                      className="cursor-pointer transition-all duration-200 hover:shadow-md hover:border-slate-300 group flex flex-col"
                      onClick={() => setSelectedSheetId(sheet.id)}
                    >
                      <CardHeader className="pb-3 flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <CardTitle className="text-base group-hover:text-blue-600 transition-colors">
                              {sheet.title}
                            </CardTitle>
                            <p className="mt-1 text-xs text-slate-500">
                              {sheet.followers.toLocaleString()} followers
                            </p>
                          </div>
                          {stats.percent > 0 && (
                            <Badge
                              variant="secondary"
                              className={`text-xs ${
                                stats.percent === 100
                                  ? "bg-green-100 text-green-800"
                                  : ""
                              }`}
                            >
                              {stats.percent}%
                            </Badge>
                          )}
                        </div>
                        <CardDescription className="line-clamp-2 text-xs leading-relaxed mt-2">
                          {sheet.description}
                        </CardDescription>
                      </CardHeader>
                      <CardFooter className="flex items-center justify-between pt-2 border-t border-slate-50 bg-slate-50/50 rounded-b-xl py-3">
                        <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                          <BookOpen className="h-3.5 w-3.5" />
                          <span>{sheet.questions} questions</span>
                        </div>
                        <div className="text-xs font-medium text-slate-900 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                          View <ChevronLeft className="h-3 w-3 rotate-180" />
                        </div>
                      </CardFooter>
                      {/* Progress Bar Line at Bottom */}
                      <div className="h-1 w-full bg-slate-100">
                        <div
                          className="h-full bg-green-500 transition-all duration-500"
                          style={{ width: `${stats.percent}%` }}
                        />
                      </div>
                    </Card>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50">
                <h3 className="text-lg font-medium text-slate-900">
                  No Sheets Found
                </h3>
                <p className="text-slate-500 text-sm mt-1">
                  Create a new custom sheet to get started.
                </p>
              </div>
            )}
          </section>
        )}
      </main>

    
    </div>
  );
};

export default CodingSheetsApp;
