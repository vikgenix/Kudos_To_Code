"use client";
import React, { useState, useEffect } from "react";
import { Eye, EyeOff, CheckCircle2, XCircle, Shield } from "lucide-react";

export default function login() {
  const [view, setView] = useState("login");
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    lastName: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    { title: "Capturing Moments,", subtitle: "Creating Memories" },
    { title: "Secure Authentication,", subtitle: "Protected Experience" },
    { title: "Modern Design,", subtitle: "Seamless Interface" },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    if (!formData.email || !formData.password) {
      setError("Please fill in all fields");
      setLoading(false);
      return;
    }

    setTimeout(() => {
      setSuccess("Login simulated successfully!");
      setLoading(false);
    }, 1000);
  };

  const handleSignup = (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    if (
      !formData.email ||
      !formData.password ||
      !formData.name ||
      !formData.lastName
    ) {
      setError("Please fill in all fields");
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      setLoading(false);
      return;
    }

    if (!termsAccepted) {
      setError("Please accept the Terms & Conditions");
      setLoading(false);
      return;
    }

    setTimeout(() => {
      setSuccess("Account creation simulated successfully!");
      setLoading(false);
      setTimeout(() => {
        setView("login");
        setFormData({ email: "", password: "", name: "", lastName: "" });
        setTermsAccepted(false);
      }, 1200);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-100 to-white flex items-center justify-center p-4 md:p-8">
      <div className="w-full max-w-7xl bg-white rounded-3xl overflow-hidden shadow-lg flex flex-col md:flex-row">
        {/* Left Panel - Hero Section */}
        <div className="w-full md:w-1/2 bg-gradient-to-br from-indigo-400 via-purple-400 to-indigo-500 p-8 md:p-12 flex flex-col justify-between relative overflow-hidden min-h-[400px] md:min-h-[700px]">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-purple-400/30 rounded-full filter blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-indigo-400/30 rounded-full filter blur-3xl"></div>

          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-8">
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow">
                <Shield className="h-6 w-6 text-indigo-600" />
              </div>
              <span className="text-white text-2xl font-bold">
                Kudos To Code
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
              {slides[currentSlide].title}
              <br />
              {slides[currentSlide].subtitle}
            </h1>

            <div className="flex gap-2 mt-8">
              {slides.map((_, index) => (
                <div
                  key={index}
                  className={`h-1 rounded-full transition-all duration-300 ${
                    index === currentSlide ? "w-12 bg-white" : "w-8 bg-white/50"
                  }`}
                ></div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Panel - Auth Form */}
        <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center bg-gray-50">
          <div className="max-w-md mx-auto w-full">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              {view === "signup" ? "Create an account" : "Welcome back"}
            </h2>
            <p className="text-gray-600 mb-8">
              {view === "signup" ? (
                <>
                  Already have an account?{" "}
                  <button
                    onClick={() => setView("login")}
                    className="text-indigo-600 hover:text-indigo-500 underline"
                  >
                    Log in
                  </button>
                </>
              ) : (
                <>
                  Don't have an account?{" "}
                  <button
                    onClick={() => setView("signup")}
                    className="text-indigo-600 hover:text-indigo-500 underline"
                  >
                    Sign up
                  </button>
                </>
              )}
            </p>

            <div className="space-y-4">
              {view === "signup" && (
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="First name"
                    className="w-full px-4 py-3.5 bg-white border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-indigo-600 transition-all duration-300"
                  />
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) =>
                      setFormData({ ...formData, lastName: e.target.value })
                    }
                    placeholder="Last name"
                    className="w-full px-4 py-3.5 bg-white border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-indigo-600 transition-all duration-300"
                  />
                </div>
              )}

              <input
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                placeholder="Email"
                className="w-full px-4 py-3.5 bg-white border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-indigo-600 transition-all duration-300"
              />

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  placeholder="Enter your password"
                  className="w-full px-4 py-3.5 pr-12 bg-white border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-indigo-600 transition-all duration-300"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-500 hover:text-indigo-600 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>

              {view === "signup" && (
                <label className="flex items-start gap-3 cursor-pointer group">
                  <div className="relative flex items-center justify-center mt-0.5">
                    <input
                      type="checkbox"
                      checked={termsAccepted}
                      onChange={(e) => setTermsAccepted(e.target.checked)}
                      className="w-5 h-5 appearance-none bg-white border border-gray-300 rounded cursor-pointer checked:bg-indigo-600 checked:border-indigo-600 transition-all duration-200"
                    />
                    {termsAccepted && (
                      <CheckCircle2 className="absolute w-4 h-4 text-white pointer-events-none" />
                    )}
                  </div>
                  <span className="text-gray-600 text-sm group-hover:text-gray-900 transition-colors">
                    I agree to the{" "}
                    <span className="text-indigo-600 underline">
                      Terms & Conditions
                    </span>
                  </span>
                </label>
              )}

              {error && (
                <div className="flex items-center gap-2 text-red-600 font-medium">
                  <XCircle className="h-5 w-5" /> {error}
                </div>
              )}
              {success && (
                <div className="flex items-center gap-2 text-green-600 font-medium">
                  <CheckCircle2 className="h-5 w-5" /> {success}
                </div>
              )}

              <button
                onClick={view === "signup" ? handleSignup : handleLogin}
                className="w-full py-3.5 bg-indigo-600 rounded-xl text-white font-semibold hover:bg-indigo-500 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={loading}
              >
                {loading
                  ? "Processing..."
                  : view === "signup"
                  ? "Create Account"
                  : "Login"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
