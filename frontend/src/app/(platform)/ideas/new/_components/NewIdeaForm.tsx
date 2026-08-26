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
    <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm relative">
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-lg flex items-center gap-3 text-red-600 text-[13px]">
          <span className="material-symbols-outlined text-[20px]">error</span>
          <p className="font-medium">{error}</p>
        </div>
      )}

      <div className="space-y-8 relative z-10">
        
        {/* Title */}
        <div>
          <div className="flex justify-between items-end mb-2">
            <label htmlFor="title" className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Idea Title <span className="text-red-500">*</span>
            </label>
            <span className={`text-[11px] font-medium ${formData.title.length >= 200 ? 'text-red-500' : 'text-slate-400'}`}>
              {formData.title.length} / 200
            </span>
          </div>
          <input 
            type="text" 
            id="title" 
            name="title"
            required
            maxLength={200}
            value={formData.title}
            onChange={handleChange}
            placeholder="e.g. Acme AI"
            className="w-full bg-white border border-slate-200 rounded-lg px-4 py-3 text-[14px] text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all"
          />
        </div>

        {/* Description */}
        <div>
          <div className="flex justify-between items-end mb-1">
            <label htmlFor="description" className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Description <span className="text-red-500">*</span>
            </label>
            <span className={`text-[11px] font-medium ${formData.description.length >= 3000 ? 'text-red-500' : 'text-slate-400'}`}>
              {formData.description.length} / 3000
            </span>
          </div>
          <p className="text-[13px] text-slate-500 mb-2">Explain the problem you're solving and your proposed solution.</p>
          <textarea 
            id="description" 
            name="description"
            required
            rows={5}
            maxLength={3000}
            value={formData.description}
            onChange={handleChange}
            placeholder="We are building a platform that helps..."
            className="w-full bg-white border border-slate-200 rounded-lg px-4 py-3 text-[14px] text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all resize-y"
          ></textarea>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Target Market */}
          <div>
            <h3 className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Target Market <span className="text-red-500">*</span>
            </h3>
            <p className="text-[13px] text-slate-500 mb-3">In this demo version, we are strictly focusing on the Finnish market.</p>
            <div className="inline-flex items-center gap-2 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg opacity-80 cursor-not-allowed">
              <img 
                src="https://flagcdn.com/fi.svg" 
                alt="Finland" 
                className="w-6 h-4 rounded-[2px] shadow-sm"
              />
              <span className="text-slate-700 font-medium text-[13px]">Finland</span>
              <span className="material-symbols-outlined text-[14px] text-slate-400 ml-1" title="Locked to Finland in demo">lock</span>
            </div>
          </div>

          {/* Team Background */}
          <div>
            <div className="flex justify-between items-end mb-1">
              <label htmlFor="team_background" className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Team Background {!formData.use_my_saved_background && <span className="text-red-500">*</span>}
              </label>
              <span className={`text-[11px] font-medium ${formData.team_background.length >= 1500 ? 'text-red-500' : 'text-slate-400'}`}>
                {formData.team_background.length} / 1500
              </span>
            </div>
            <p className="text-[13px] text-slate-500 mb-3">Detail your team's expertise below, or turn on the switch to automatically use your saved Global Profile instead.</p>
            
            <div className="relative">
              <textarea 
                id="team_background" 
                name="team_background"
                rows={4}
                required={!formData.use_my_saved_background}
                maxLength={1500}
                value={formData.team_background}
                onChange={handleChange}
                disabled={formData.use_my_saved_background}
                placeholder="Our CTO has a PhD..."
                className={`w-full bg-white border border-slate-200 rounded-lg px-4 py-3 text-[14px] text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all resize-y ${formData.use_my_saved_background ? 'bg-slate-50 text-slate-400 cursor-not-allowed' : ''}`}
              ></textarea>
              
              {/* Overlay text when disabled */}
              {formData.use_my_saved_background && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <span className="bg-primary/5 px-3 py-1.5 rounded-md text-[12px] font-bold text-primary shadow-sm border border-primary/20 flex items-center gap-1.5 backdrop-blur-[2px]">
                    <span className="material-symbols-outlined text-[14px]">how_to_reg</span>
                    Using Global Profile
                  </span>
                </div>
              )}
            </div>

            <label className="mt-4 flex items-center gap-3 cursor-pointer w-max group">
              <div className="relative flex items-center">
                <input 
                  type="checkbox" 
                  name="use_my_saved_background"
                  checked={formData.use_my_saved_background}
                  onChange={handleChange}
                  className="sr-only peer"
                />
                <div className="w-10 h-[22px] bg-slate-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-[18px] after:w-[18px] after:transition-all peer-checked:bg-primary transition-colors"></div>
              </div>
              <span className="text-[13px] font-medium text-slate-600 group-hover:text-primary transition-colors">
                Skip typing and use my saved Global Profile
              </span>
            </label>
          </div>
        </div>

        {/* Submit Action */}
        <div className="pt-6 mt-2 flex justify-end border-t border-slate-100">
          <button 
            type="submit" 
            disabled={loading}
            className={`w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg bg-slate-900 text-white font-medium text-[13px] transition-all ${loading ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer hover:bg-slate-800 hover:shadow-md'}`}
          >
            {loading ? (
              <>
                <span className="material-symbols-outlined animate-spin text-[18px]">progress_activity</span>
                Creating your idea...
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
