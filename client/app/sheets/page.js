"use client";
import React, { useState, useEffect } from "react";
import {
  BookOpen,
  Plus,
  ExternalLink,
  X,
  ChevronLeft,
  Check,
  Trash2,
  Edit,
} from "lucide-react";
import {
  fetchSheets,
  createSheet,
  fetchSheetById,
  addProblem,
  deleteSheet,
  deleteProblem,
  toggleProblemStatus,
  updateSheet,
} from "../services/api";

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

// --- Main Application ---

const CodingSheetsApp = () => {
  const [sheets, setSheets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSheetId, setSelectedSheetId] = useState(null);
  const [selectedSheetDetail, setSelectedSheetDetail] = useState(null);
  const [error, setError] = useState(null);
  
  // Search and Filter State
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all"); // 'all', 'public', 'private'

  // Problem Search/Filter/Sort State
  const [problemSearchQuery, setProblemSearchQuery] = useState("");
  const [problemFilterDifficulty, setProblemFilterDifficulty] = useState("All");
  const [problemFilterStatus, setProblemFilterStatus] = useState("All");
  const [problemSortBy, setProblemSortBy] = useState("Default");

  // ... (Modals and Forms state remains same)
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isAddProblemOpen, setIsAddProblemOpen] = useState(false);

  // ... (Forms state remains same)
  const [newSheet, setNewSheet] = useState({ title: "", description: "" });
  const [editSheetData, setEditSheetData] = useState({ title: "", description: "" });
  const [newProblem, setNewProblem] = useState({
    title: "",
    link: "",
    difficulty: "Easy",
    tags: "",
    section: "General",
  });

  // ... (useEffect and load functions remain same)
  useEffect(() => {
    loadSheets();
  }, []);

  // Fetch sheet details when selected
  useEffect(() => {
    if (selectedSheetId) {
      loadSheetDetails(selectedSheetId);
    } else {
      setSelectedSheetDetail(null);
    }
  }, [selectedSheetId]);

  const loadSheets = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log("Loading sheets...");
      const response = await fetchSheets();
      console.log("Sheets loaded:", response.data);
      setSheets(response.data);
    } catch (error) {
      console.error("Error fetching sheets:", error);
      setError(error.message || "Failed to load sheets");
    } finally {
      setLoading(false);
    }
  };

  const loadSheetDetails = async (id) => {
    try {
      const response = await fetchSheetById(id);
      setSelectedSheetDetail(response.data);
      setEditSheetData({
        title: response.data.title,
        description: response.data.description,
      });
    } catch (error) {
      console.error("Error fetching sheet details:", error);
    }
  };

  const handleAddSheet = async () => {
    if (!newSheet.title.trim()) return;

    try {
      await createSheet({
        title: newSheet.title,
        description: newSheet.description,
      });
      setNewSheet({ title: "", description: "" });
      setIsAddOpen(false);
      loadSheets();
    } catch (error) {
      console.error("Error creating sheet:", error);
    }
  };

  const handleUpdateSheet = async () => {
    if (!editSheetData.title.trim()) return;
    try {
      await updateSheet(selectedSheetId, editSheetData);
      setIsEditOpen(false);
      loadSheetDetails(selectedSheetId);
      loadSheets();
    } catch (error) {
      console.error("Error updating sheet:", error);
    }
  };

  const handleDeleteSheet = async () => {
    if (!confirm("Are you sure you want to delete this entire sheet? This action cannot be undone.")) return;
    try {
      await deleteSheet(selectedSheetId);
      setSelectedSheetId(null);
      loadSheets();
    } catch (error) {
      console.error("Error deleting sheet:", error);
    }
  };

  const handleAddProblem = async () => {
    if (!newProblem.title.trim()) return;
    try {
      await addProblem(selectedSheetId, {
        ...newProblem,
        tags: newProblem.tags.split(",").map((t) => t.trim()).filter(Boolean),
      });
      setNewProblem({ title: "", link: "", difficulty: "Easy", tags: "", section: "General" });
      setIsAddProblemOpen(false);
      loadSheetDetails(selectedSheetId);
    } catch (error) {
      console.error("Error adding problem:", error);
    }
  };

  const handleDeleteProblem = async (problemId) => {
    if (!confirm("Remove this problem?")) return;
    try {
      await deleteProblem(problemId);
      loadSheetDetails(selectedSheetId);
    } catch (error) {
      console.error("Error deleting problem:", error);
    }
  };

  const handleToggleProblem = async (problemId) => {
    try {
      await toggleProblemStatus(problemId);
      loadSheetDetails(selectedSheetId);
    } catch (error) {
      console.error("Error toggling problem:", error);
    }
  };

  // Filtered Sheets Logic
  const filteredSheets = sheets.filter(sheet => {
    const matchesSearch = sheet.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          sheet.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (!matchesSearch) return false;

    if (filterType === "all") return true;
    if (filterType === "public") return sheet.isPublic;
    if (filterType === "private") return !sheet.isPublic; // Assuming private means not public
    
    return true;
  });

  // Processed Sections Logic (Filter & Sort Problems)
  const processedSections = selectedSheetDetail?.sections.map(section => {
    let problems = [...section.problems];

    // Filter by Search
    if (problemSearchQuery) {
      problems = problems.filter(p => p.title.toLowerCase().includes(problemSearchQuery.toLowerCase()));
    }

    // Filter by Difficulty
    if (problemFilterDifficulty !== "All") {
      problems = problems.filter(p => p.difficulty === problemFilterDifficulty);
    }

    // Filter by Status
    if (problemFilterStatus !== "All") {
      problems = problems.filter(p => {
        if (problemFilterStatus === "Completed") return p.isCompleted;
        if (problemFilterStatus === "Pending") return !p.isCompleted;
        return true;
      });
    }

    // Sort
    if (problemSortBy === "Difficulty (Asc)") {
      const diffOrder = { Easy: 1, Medium: 2, Hard: 3 };
      problems.sort((a, b) => diffOrder[a.difficulty] - diffOrder[b.difficulty]);
    } else if (problemSortBy === "Difficulty (Desc)") {
      const diffOrder = { Easy: 1, Medium: 2, Hard: 3 };
      problems.sort((a, b) => diffOrder[b.difficulty] - diffOrder[a.difficulty]);
    } else if (problemSortBy === "Title (Asc)") {
      problems.sort((a, b) => a.title.localeCompare(b.title));
    }

    return { ...section, problems };
  });

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
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditOpen(true)}
                >
                  <Edit className="mr-2 h-3.5 w-3.5" />
                  Edit Sheet
                </Button>

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

              {/* Edit Sheet Modal */}
               <Dialog
                open={isEditOpen}
                onOpenChange={setIsEditOpen}
                title="Edit Sheet"
              >
                <div className="space-y-4 py-2">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Sheet Title</label>
                    <Input
                      value={editSheetData.title}
                      onChange={(e) =>
                        setEditSheetData({ ...editSheetData, title: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Description</label>
                    <Textarea
                      rows={3}
                      value={editSheetData.description}
                      onChange={(e) =>
                        setEditSheetData({
                          ...editSheetData,
                          description: e.target.value,
                        })
                      }
                    />
                  </div>
                  <Button className="w-full" onClick={handleUpdateSheet}>
                    Save Changes
                  </Button>
                </div>
              </Dialog>

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
                      <label className="text-sm font-medium">Section</label>
                      <Select
                         value={newProblem.section}
                         onChange={(e) =>
                           setNewProblem({ ...newProblem, section: e.target.value })
                         }
                      >
                        {selectedSheetDetail.sections && selectedSheetDetail.sections.map(s => (
                            <option key={s.name} value={s.name}>{s.name}</option>
                        ))}
                        {(!selectedSheetDetail.sections || selectedSheetDetail.sections.length === 0) && <option value="General">General</option>}
                         <option value="New Section">New Section (Auto)</option>
                      </Select>
                    </div>
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
                        Source: {selectedSheetDetail.source || "User"}
                      </span>
                      <Badge variant="secondary" className="capitalize">
                        {selectedSheetDetail.isPublic ? "Public" : "Private"}
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Circular Chart Area */}
                <div className="bg-slate-50/50 p-6 flex flex-col items-center justify-center border-l border-slate-100 min-w-[200px]">
                  <CircularProgress
                    completed={
                        selectedSheetDetail.sections.reduce((acc, section) => acc + section.completed, 0)
                    }
                    total={selectedSheetDetail.questions}
                  />
                  <span className="text-xs text-slate-400 mt-2 font-medium">
                    Progress
                  </span>
                </div>
              </div>
            </Card>

            {/* Problem Search/Filter Toolbar */}
            <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                    <Input 
                        placeholder="Search problems..." 
                        value={problemSearchQuery}
                        onChange={(e) => setProblemSearchQuery(e.target.value)}
                        className="pl-8"
                    />
                     <div className="absolute left-2.5 top-2.5 pointer-events-none opacity-50">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-search"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
                    </div>
                </div>
                <div className="flex gap-3">
                    <Select value={problemFilterDifficulty} onChange={(e) => setProblemFilterDifficulty(e.target.value)} className="w-32">
                        <option value="All">All Difficulty</option>
                        <option value="Easy">Easy</option>
                        <option value="Medium">Medium</option>
                        <option value="Hard">Hard</option>
                    </Select>
                    <Select value={problemFilterStatus} onChange={(e) => setProblemFilterStatus(e.target.value)} className="w-32">
                        <option value="All">All Status</option>
                        <option value="Completed">Completed</option>
                        <option value="Pending">Pending</option>
                    </Select>
                     <Select value={problemSortBy} onChange={(e) => setProblemSortBy(e.target.value)} className="w-40">
                        <option value="Default">Default Sort</option>
                        <option value="Difficulty (Asc)">Difficulty (Easy-Hard)</option>
                        <option value="Difficulty (Desc)">Difficulty (Hard-Easy)</option>
                        <option value="Title (Asc)">Title (A-Z)</option>
                    </Select>
                </div>
            </div>

            {/* Problem List */}
            <div className="space-y-4">
              {processedSections.map((section, sectionIdx) => (
                <Card key={sectionIdx} className="overflow-hidden">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 bg-slate-50/50 py-4">
                    <div className="flex items-center gap-3">
                      <CardTitle className="text-base font-semibold">
                        {section.name}
                      </CardTitle>
                      <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-slate-200 text-slate-700">
                        {section.completed}
                        {" / "}
                        {section.total}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent className="p-0">
                    {section.problems.length > 0 ? (
                      <div className="divide-y divide-slate-100">
                        {section.problems.map((problem) => {
                          const isChecked = problem.isCompleted;
                          return (
                            <div
                              key={problem._id}
                              className={`group flex flex-col sm:flex-row sm:items-center gap-3 p-4 transition-colors hover:bg-slate-50/80 ${
                                isChecked ? "bg-slate-50/40" : ""
                              }`}
                            >
                              <div className="flex items-center gap-3 flex-1 min-w-0">
                                <Checkbox
                                  checked={isChecked}
                                  onCheckedChange={() =>
                                    handleToggleProblem(problem._id)
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
                                    handleDeleteProblem(problem._id)
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
                        {problemSearchQuery || problemFilterDifficulty !== "All" || problemFilterStatus !== "All" ? "No matching problems found in this section." : "No problems added yet. Click \"Add Problem\" to get started."}
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
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-semibold tracking-tight text-slate-900">
                  All Sheets
                </h2>
                <Badge variant="secondary" className="ml-2">
                  {filteredSheets.length}
                </Badge>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                 {/* Search Bar */}
                <div className="relative w-full sm:w-64">
                    <Input 
                        placeholder="Search sheets..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-8"
                    />
                     <div className="absolute left-2.5 top-2.5 pointer-events-none opacity-50">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-search"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
                    </div>
                </div>

                {/* Filter Dropdown */}
                <div className="w-full sm:w-40">
                    <Select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
                        <option value="all">All Sheets</option>
                        <option value="public">Public Only</option>
                        <option value="private">Private Only</option>
                    </Select>
                </div>

                <Button size="sm" onClick={() => setIsAddOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    New Sheet
                </Button>
              </div>

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

            {filteredSheets.length > 0 ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filteredSheets.map((sheet) => {
                  return (
                    <Card
                      key={sheet._id}
                      className="cursor-pointer transition-all duration-200 hover:shadow-md hover:border-slate-300 group flex flex-col"
                      onClick={() => setSelectedSheetId(sheet._id)}
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
                          {sheet.progress > 0 && (
                            <Badge
                              variant="secondary"
                              className={`text-xs ${
                                sheet.progress === 100
                                  ? "bg-green-100 text-green-800"
                                  : ""
                              }`}
                            >
                              {sheet.progress}%
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
                          style={{ width: `${sheet.progress}%` }}
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
                  {searchQuery ? "Try adjusting your search or filters." : "Create a new custom sheet to get started."}
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
