import { useState, useEffect } from "react";

export const useLeetCodeStats = (username) => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!username) {
      setLoading(false);
      return;
    }

    const fetchStats = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `https://alfa-leetcode-api.onrender.com/userProfile/${username}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch LeetCode stats");
        }
        const data = await response.json();
        
        // Extract relevant data
        const processedStats = {
          totalQuestions: data.totalQuestions || 0,
          solvedProblem: data.totalSolved || 0,
          totalSubmissions: data.totalSubmissions?.[0]?.submissions || 0,
          attemptedCount: data.totalSubmissions?.[0]?.count || 0, // Distinct problems attempted
        };
        
        setStats(processedStats);
      } catch (err) {
        console.error("Error fetching LeetCode stats:", err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [username]);

  return { stats, loading, error };
};
