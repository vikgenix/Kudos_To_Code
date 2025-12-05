import { useState, useEffect } from "react";

export const useRatingData = (leetcodeUsername, codeforcesUsername) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!leetcodeUsername && !codeforcesUsername) {
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const safeFetch = async (url) => {
          try {
            const res = await fetch(url);
            if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
            return await res.json();
          } catch (e) {
            console.error(`Failed to fetch ${url}:`, e);
            return null;
          }
        };

        const [lcContest, cfRating] = await Promise.all([
          leetcodeUsername
            ? safeFetch(
                `https://alfa-leetcode-api.onrender.com/${leetcodeUsername}/contest`
              )
            : null,
          codeforcesUsername
            ? safeFetch(
                `https://codeforces.com/api/user.rating?handle=${codeforcesUsername}`
              )
            : null,
        ]);

        // Process Codeforces Data
        const cfHistory =
          cfRating?.result?.map((contest) => ({
            date: new Date(contest.ratingUpdateTimeSeconds * 1000),
            rating: contest.newRating,
            source: "codeforces",
          })) || [];

        // Process LeetCode Data
        const lcHistory =
          lcContest?.contestParticipation?.map((contest) => ({
            date: new Date(contest.contest.startTime * 1000),
            rating: Math.round(contest.rating),
            source: "leetcode",
          })) || [];

        // Merge and Sort
        const allEvents = [...cfHistory, ...lcHistory].sort(
          (a, b) => a.date - b.date
        );

        // Normalize data for the chart (daily/weekly points or just raw events)
        // For AreaChart, we ideally want a continuous timeline or at least shared dates.
        // However, since events happen on different days, we can just list them in order.
        // But to have both lines show up on the same chart properly, we might need to interpolate or just plot points.
        // A simple approach for now is to map each event to a data point where one value is present and the other might be null (or hold previous value).
        
        // Better approach for AreaChart:
        // Create a timeline of all unique dates.
        // For each date, have { date, leetcode: val, codeforces: val }.
        // Fill missing values with the last known value (forward fill).

        const timeline = [];
        let lastLc = 0; // Or some initial base rating
        let lastCf = 0;

        // Create a map of date string -> { lc, cf } updates
        const dateMap = new Map();

        allEvents.forEach((event) => {
          const dateStr = event.date.toISOString().split("T")[0];
          if (!dateMap.has(dateStr)) {
            dateMap.set(dateStr, {});
          }
          const entry = dateMap.get(dateStr);
          if (event.source === "leetcode") entry.leetcode = event.rating;
          if (event.source === "codeforces") entry.codeforces = event.rating;
        });

        // Sort unique dates
        const sortedDates = Array.from(dateMap.keys()).sort();

        // Build timeline with forward fill
        sortedDates.forEach((dateStr) => {
          const updates = dateMap.get(dateStr);
          
          if (updates.leetcode !== undefined) lastLc = updates.leetcode;
          if (updates.codeforces !== undefined) lastCf = updates.codeforces;

          timeline.push({
            date: dateStr,
            leetcode: lastLc > 0 ? lastLc : null, // Avoid plotting 0 if not started
            codeforces: lastCf > 0 ? lastCf : null,
          });
        });

        setData(timeline);
      } catch (err) {
        console.error("Error in useRatingData:", err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [leetcodeUsername, codeforcesUsername]);

  return { data, loading, error };
};
