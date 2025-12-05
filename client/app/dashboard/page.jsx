// import { AppSidebar } from "@/components/app-sidebar"
// import { ChartAreaInteractive } from "@/components/chart-area-interactive"
// import { DataTable } from "@/components/data-table"
// import { SectionCards } from "@/components/section-cards"
// import { SiteHeader } from "@/components/site-header"
// import {
//   SidebarInset,
//   SidebarProvider,
// } from "@/components/ui/sidebar"

// import data from "./data.json"

// export default function Page() {
//   return (
//     <SidebarProvider
//       style={
//         {
//           "--sidebar-width": "calc(var(--spacing) * 72)",
//           "--header-height": "calc(var(--spacing) * 12)"
//         }
//       }>
//       <AppSidebar variant="inset" />
//       <SidebarInset>
//         <SiteHeader headerTitle="Dashboard" />
//         <div className="flex flex-1 flex-col">
//           <div className="@container/main flex flex-1 flex-col gap-2">
//             <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
//               <SectionCards />
//               <div className="px-4 lg:px-6">
//                 <ChartAreaInteractive />
//               </div>
//               <DataTable data={data} />
//             </div>
//           </div>
//         </div>
//       </SidebarInset>
//     </SidebarProvider>
//   );
// }
"use client";
import { useState, useEffect } from "react";
import { SectionCards } from "@/components/section-cards";
import { ChartAreaInteractive } from "@/components/chart-area-interactive";
import { DataTable } from "@/components/data-table";
// import data from "./data.json"; // Removed usage
import { useAuth } from "@/app/context/AuthContext";
import { useRatingData } from "@/hooks/use-rating-data";
import { useLeetCodeStats } from "@/hooks/use-leetcode-stats";
import { fetchSheets } from "@/app/services/api";

export default function Page() {
  const { user } = useAuth();
  const { data: ratingData, loading, error } = useRatingData(
    user?.leetcodeUsername,
    user?.codeforcesUsername
  );
  const { stats: leetcodeStats } = useLeetCodeStats(user?.leetcodeUsername);

  const [sheets, setSheets] = useState([]);

  useEffect(() => {
    const loadSheets = async () => {
      try {
        const response = await fetchSheets({ limit: 100 }); // Fetch enough sheets
        if (Array.isArray(response.data)) {
          setSheets(response.data);
        } else if (response.data && Array.isArray(response.data.data)) {
          setSheets(response.data.data);
        }
      } catch (err) {
        console.error("Failed to fetch sheets in dashboard", err);
      }
    };
    loadSheets();
  }, []);

  return (
    <>
      <SectionCards
        totalCompleted={user?.completedProblems?.length || 0}
        leetcodeCompleted={leetcodeStats?.solvedProblem || 0}
        leetcodeTotal={leetcodeStats?.totalQuestions || 0}
        leetcodeUnsolved={(leetcodeStats?.totalQuestions || 0) - (leetcodeStats?.solvedProblem || 0)}
      />
      <div className="px-4 lg:px-6">
        <ChartAreaInteractive data={ratingData} />
      </div>
      <DataTable data={sheets} />
    </>
  );
}
