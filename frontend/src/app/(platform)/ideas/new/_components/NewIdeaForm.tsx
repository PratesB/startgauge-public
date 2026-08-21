"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { fetchAPI } from "@/lib/api";

export default function NewIdeaForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    team_background: "",
    use_my_saved_background: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetchAPI("/api/v1/ideas/", {
        method: "POST",
        body: JSON.stringify(formData),
      });

      if (response && response.id) {
        router.push(`/ideas/${response.id}`);
      } else {
        router.push("/ideas");
      }
    } catch (err: any) {
      console.error("Failed to create idea:", err);
      setError(err.message || "Failed to create idea. Please try again.");
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-card-surface border border-card-border rounded-[2.5rem] p-8 sm:p-12 shadow-[0_8px_40px_rgba(0,0,0,0.04)] relative">
      {error && (
        <div className="mb-8 p-5 bg-error-red/10 border border-error-red/20 rounded-2xl flex items-center gap-4 text-error-red">
          <span className="material-symbols-outlined text-[24px]">error</span>
          <p className="font-semibold">{error}</p>
        </div>
      )}

      <div className="space-y-10 relative z-10">
        
        {/* Title */}
        <div>
          <label htmlFor="title" className="block text-sm font-bold text-on-surface mb-2 ml-1">
            Idea Title <span className="text-error-red">*</span>
          </label>
          <div className="relative group">
            <span className="material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 text-primary/40 group-focus-within:text-primary transition-colors">
              lightbulb
            </span>
            <input 
              type="text" 
              id="title" 
              name="title"
              required
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. Acme AI"
              className="w-full bg-surface-container-lowest border border-card-border rounded-2xl pl-14 pr-5 py-4 text-lg text-on-surface placeholder:text-text-muted/40 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent transition-all font-semibold shadow-inner"
            />
          </div>
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-bold text-on-surface mb-1 ml-1">
            Description <span className="text-error-red">*</span>
          </label>
          <p className="text-sm text-text-muted mb-3 ml-1">Explain the problem you're solving and your proposed solution.</p>
          <div className="relative group">
            <span className="material-symbols-outlined absolute left-5 top-5 text-primary/40 group-focus-within:text-primary transition-colors">
              description
            </span>
            <textarea 
              id="description" 
              name="description"
              required
              rows={6}
              value={formData.description}
              onChange={handleChange}
              placeholder="We are building a platform that helps..."
              className="w-full bg-surface-container-lowest border border-card-border rounded-2xl pl-14 pr-5 py-4 text-on-surface placeholder:text-text-muted/40 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent transition-all font-medium resize-y shadow-inner leading-relaxed"
            ></textarea>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Target Market */}
          <div>
            <h3 className="block text-sm font-bold text-on-surface mb-1 ml-1">
              Target Market <span className="text-error-red">*</span>
            </h3>
            <p className="text-sm text-text-muted mb-3 ml-1">In this demo version, we are strictly focusing on the Finnish market.</p>
            <div className="w-full bg-surface-container border border-card-border rounded-2xl px-5 py-4 flex items-center justify-between opacity-80 shadow-inner cursor-not-allowed">
              <div className="flex items-center gap-3">
                <img 
                  src="https://flagcdn.com/fi.svg" 
                  alt="Finland" 
                  className="w-6 h-6 rounded-full object-cover shadow-sm grayscale-[10%]"
                />
                <span className="text-on-surface font-bold text-lg">Finland</span>
              </div>
              <span className="material-symbols-outlined text-text-muted/60" title="Locked to Finland in demo">lock</span>
            </div>
          </div>

          {/* Team Background */}
          <div>
            <label htmlFor="team_background" className="block text-sm font-bold text-on-surface mb-1 ml-1">
              Team Background <span className="text-text-muted font-normal">(Optional)</span>
            </label>
            <p className="text-sm text-text-muted mb-3 ml-1">Any specific unfair advantages or deep expertise?</p>
            
            <div className="relative group">
              <span className="material-symbols-outlined absolute left-5 top-5 text-primary/40 group-focus-within:text-primary transition-colors z-10">
                groups
              </span>
              <textarea 
                id="team_background" 
                name="team_background"
                rows={4}
                value={formData.team_background}
                onChange={handleChange}
                disabled={formData.use_my_saved_background}
                placeholder="Our CTO has a PhD..."
                className={`w-full bg-surface-container-lowest border border-card-border rounded-2xl pl-14 pr-5 py-4 text-on-surface placeholder:text-text-muted/40 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent transition-all font-medium resize-y shadow-inner relative ${formData.use_my_saved_background ? 'opacity-40 cursor-not-allowed bg-surface-container' : ''}`}
              ></textarea>
              
              {/* Overlay text when disabled */}
              {formData.use_my_saved_background && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <span className="bg-surface-container-lowest px-4 py-1.5 rounded-full text-sm font-bold text-primary shadow-sm border border-primary/20 flex items-center gap-2">
                    <span className="material-symbols-outlined text-[16px]">how_to_reg</span>
                    Using Global Profile
                  </span>
                </div>
              )}
            </div>

            <label className="mt-4 flex items-center gap-3 cursor-pointer group ml-1 w-max">
              <div className="relative flex items-center">
                <input 
                  type="checkbox" 
                  name="use_my_saved_background"
                  checked={formData.use_my_saved_background}
                  onChange={handleChange}
                  className="sr-only peer"
                />
                <div className="w-12 h-7 bg-surface-container border border-card-border rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-primary peer-checked:to-[#8247E5] group-hover:ring-4 group-hover:ring-primary/10 transition-all"></div>
              </div>
              <span className="text-sm font-bold text-on-surface select-none group-hover:text-primary transition-colors">
                Use my saved Global Profile
              </span>
            </label>
          </div>
        </div>

        {/* Submit Action */}
        <div className="pt-8 mt-4 flex justify-end">
          <button 
            type="submit" 
            disabled={loading}
            className={`w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-primary to-[#8247E5] text-white font-bold text-[15px] tracking-wide shadow-[0_4px_15px_rgba(109,59,215,0.3)] transition-all duration-300 ${loading ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer hover:shadow-[0_8px_25px_rgba(109,59,215,0.5)] hover:-translate-y-0.5'}`}
          >
            {loading ? (
              <>
                <span className="material-symbols-outlined animate-spin text-[24px]">progress_activity</span>
                Analyzing Market...
              </>
            ) : (
              <>
                Create Idea
              </>
            )}
          </button>
        </div>

      </div>
    </form>
  );
}
