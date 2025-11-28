// client/components/AuthGuard.js
"use client";

import { useEffect, useState } from "react";
import { useAuth } from "../app/context/AuthContext";
import { useRouter, usePathname } from "next/navigation";

export default function AuthGuard({ children }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  // We use a local loading state to delay rendering until we are sure of the redirect
  const [isRedirecting, setIsRedirecting] = useState(false);

  // Define routes that are accessible without login
  // We include '/login' and '/signup' so users can actually log in!
  const publicRoutes = ["/", "/login", "/signup"];

  useEffect(() => {
    // Only check auth once the initial profile fetch is done
    if (!loading) {
      const isPublicRoute = publicRoutes.includes(pathname);

      // If user is NOT logged in and tries to access a restricted route
      if (!user && !isPublicRoute) {
        setIsRedirecting(true);
        router.push("/login");
      }
      // Optional: Redirect logged-in users away from login/signup pages
      else if (user && (pathname === "/login" || pathname === "/signup")) {
        router.push("/dashboard"); // or wherever you want them to go
      } else {
        setIsRedirecting(false);
      }
    }
  }, [user, loading, pathname, router]);

  // Show a loader while checking auth state or redirecting
  if (loading || isRedirecting) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        {/* You can replace this with your actual Loader component */}
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  // If user is not logged in, but the route is protected, we return null
  // (the useEffect will trigger the redirect)
  if (!user && !publicRoutes.includes(pathname)) {
    return null;
  }

  return <>{children}</>;
}
