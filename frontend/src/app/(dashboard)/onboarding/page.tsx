"use client";

import { useState, useEffect } from "react";
import { fetchAPI } from "@/lib/api";
import { useRouter } from "next/navigation";

export default function OnboardingPage() {
  const router = useRouter();
  const [background, setBackground] = useState("");
  const [loading, setLoading] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const checkUser = async () => {
      try {
        const user = await fetchAPI("/api/v1/users/me");
        if (user.professional_background) {
          router.push("/dashboard");
        } else {
          setIsChecking(false);
        }
      } catch (err) {
        router.push("/login");
      }
    };
    checkUser();
  }, [router]);

  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-purple-700"></div>
      </div>
    );
  }

  const handleSave = async () => {
    if (!background.trim()) return;
    
    setLoading(true);
    setError("");

    try {
      await fetchAPI("/api/v1/users/me", {
        method: "PATCH",
        body: JSON.stringify({ professional_background: background }),
      });
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "Failed to save profile. Please try again.");
      setLoading(false);
    }
  };

  const handleSkip = () => {
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 antialiased">
      <div className="sm:mx-auto sm:w-full sm:max-w-2xl">
        
        {/* Progress Indicator */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-2">
            <div className="w-10 h-2 rounded-full bg-purple-600 shadow-sm"></div>
          </div>
        </div>

        <div className="bg-white py-12 px-10 shadow-2xl sm:rounded-3xl border border-purple-100/50">
          <div className="max-w-xl mx-auto">
            
            <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight mb-4">
              Tell us about your background
            </h2>
            <p className="text-lg text-gray-500 mb-6 leading-relaxed">
              This information is saved to your profile and can be automatically applied as the team background whenever you create a new startup idea.
            </p>
            
            <div className="flex items-start gap-3 mb-8 text-sm text-gray-500">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 flex-shrink-0 mt-0.5 opacity-70">
                <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
              </svg>
              <p>You can always update this later in your Profile settings.</p>
            </div>

            {error && (
              <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 text-sm border border-red-100 font-medium">
                {error}
              </div>
            )}

            <div className="space-y-6">
              <div>
                <label htmlFor="background" className="block text-sm font-semibold text-gray-700 mb-2">
                  Your Professional Background
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <textarea
                    id="background"
                    name="background"
                    rows={5}
                    maxLength={500}
                    className="block w-full rounded-2xl border border-gray-200 bg-gray-50 text-gray-900 focus:border-purple-600 focus:ring-1 focus:ring-purple-600 sm:text-base p-5 transition-all resize-none"
                    placeholder="E.g., I'm a software engineer with 5 years of experience in fintech, specializing in backend development and scalable architectures..."
                    value={background}
                    onChange={(e) => setBackground(e.target.value)}
                  />
                  <div className="absolute bottom-4 right-5 text-xs font-medium text-gray-400">
                    {background.length}/500
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-8 border-t border-gray-100 mt-10">
                <button
                  type="button"
                  onClick={handleSkip}
                  className="text-sm font-semibold text-gray-500 hover:text-gray-900 transition-colors px-4 py-2 rounded-lg hover:bg-gray-100"
                >
                  Skip for now
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={loading || background.trim().length === 0}
                  className="inline-flex items-center px-8 py-3 border border-transparent text-base font-bold rounded-xl shadow-md text-white bg-purple-700 hover:bg-purple-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-60 disabled:cursor-not-allowed transition-all"
                >
                  {loading ? "Saving..." : "Save & Continue"}
                  {!loading && (
                    <svg xmlns="http://www.w3.org/2000/svg" className="ml-2 h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
