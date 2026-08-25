import Link from "next/link";
import { useState, useMemo, useEffect } from "react";
import { fetchAPI } from "@/lib/api";

interface Idea {
  id: string;
  title: string;
  description: string;
  country: string;
  created_at: string;
  updated_at: string;
  has_canvas?: boolean;
}

const getFlagCode = (country: string) => {
  if (!country) return "un";
  // Demo version only supports Finland
  if (country.toLowerCase() === "finland") return "fi";
  return "un";
};

// Component to check if an idea has a canvas
function CanvasStatus({ ideaId }: { ideaId: string }) {
  const [hasCanvas, setHasCanvas] = useState<boolean | null>(null);

  useEffect(() => {
    fetchAPI(`/api/v1/canvas/${ideaId}/latest`)
      .then(() => setHasCanvas(true))
      .catch(() => setHasCanvas(false));
  }, [ideaId]);

  if (hasCanvas === null) {
    return (
      <div className="flex items-center gap-2">
        <div className="w-1.5 h-1.5 rounded-full bg-slate-300 animate-pulse"></div>
        <span className="text-[12px] text-slate-400">Loading...</span>
      </div>
    );
  }

  if (hasCanvas) {
    return (
      <div className="flex items-center gap-2">
        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.6)]"></div>
        <span className="text-[12px] text-slate-700 font-medium">Created</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <div className="w-1.5 h-1.5 rounded-full bg-red-500 shadow-[0_0_6px_rgba(239,68,68,0.4)]"></div>
      <span className="text-[12px] text-slate-500">Not created</span>
    </div>
  );
}

type SortColumn = 'title' | 'created_at' | 'updated_at' | null;
type SortDirection = 'asc' | 'desc';

export default function IdeasTable({ ideas }: { ideas: Idea[] }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortColumn, setSortColumn] = useState<SortColumn>('created_at');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  
  const itemsPerPage = 8;

  const handleSort = (column: SortColumn) => {
    if (sortColumn === column) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
    setCurrentPage(1); // Reset to first page on sort
  };

  const processedIdeas = useMemo(() => {
    let result = [...ideas];

    // Filter
    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase();
      result = result.filter(idea => idea.title.toLowerCase().includes(query));
    }

    // Sort
    if (sortColumn) {
      result.sort((a, b) => {
        let valA = a[sortColumn];
        let valB = b[sortColumn];
        
        if (!valA) valA = "";
        if (!valB) valB = "";

        if (sortColumn === 'created_at' || sortColumn === 'updated_at') {
          const dateA = new Date(valA).getTime() || 0;
          const dateB = new Date(valB).getTime() || 0;
          return sortDirection === 'asc' ? dateA - dateB : dateB - dateA;
        } else {
          const strA = valA.toLowerCase();
          const strB = valB.toLowerCase();
          if (strA < strB) return sortDirection === 'asc' ? -1 : 1;
          if (strA > strB) return sortDirection === 'asc' ? 1 : -1;
          return 0;
        }
      });
    }

    return result;
  }, [ideas, searchQuery, sortColumn, sortDirection]);

  const totalPages = Math.ceil(processedIdeas.length / itemsPerPage);

  const currentIdeas = processedIdeas.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const renderSortIcon = (column: SortColumn) => {
    if (sortColumn !== column) {
      return <span className="material-symbols-outlined text-[16px] text-slate-300 ml-1 transition-colors group-hover:text-slate-400">unfold_more</span>;
    }
    return <span className="material-symbols-outlined text-[18px] text-primary ml-0.5">{sortDirection === 'asc' ? 'arrow_drop_up' : 'arrow_drop_down'}</span>;
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Filters & Search */}
      <div className="flex justify-between items-center bg-white p-2 border border-slate-200 rounded-xl shadow-sm">
        <div className="relative w-full max-w-sm">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
            <span className="material-symbols-outlined text-[18px]">search</span>
          </span>
          <input 
            type="text" 
            placeholder="Search ideas by name..." 
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-10 pr-4 py-2 text-[13px] text-slate-900 bg-slate-50 border border-transparent rounded-lg focus:bg-white focus:border-primary/30 focus:ring-2 focus:ring-primary/10 transition-all outline-none"
          />
        </div>
        <div className="text-[12px] text-slate-500 font-medium px-4">
          {processedIdeas.length} {processedIdeas.length === 1 ? 'idea' : 'ideas'}
        </div>
      </div>

      {/* Table */}
      <div className="w-full bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 select-none">
                <th 
                  className="py-3 px-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider cursor-pointer hover:bg-slate-100 transition-colors group"
                  onClick={() => handleSort('title')}
                >
                  <div className="flex items-center">
                    Title {renderSortIcon('title')}
                  </div>
                </th>
                <th className="py-3 px-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Description</th>
                <th className="py-3 px-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider text-center">Market</th>
                <th className="py-3 px-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Canvas</th>
                <th 
                  className="py-3 px-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider cursor-pointer hover:bg-slate-100 transition-colors group"
                  onClick={() => handleSort('created_at')}
                >
                  <div className="flex items-center">
                    Created At {renderSortIcon('created_at')}
                  </div>
                </th>
                <th 
                  className="py-3 px-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider cursor-pointer hover:bg-slate-100 transition-colors group"
                  onClick={() => handleSort('updated_at')}
                >
                  <div className="flex items-center">
                    Updated At {renderSortIcon('updated_at')}
                  </div>
                </th>
                <th className="py-3 px-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {currentIdeas.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center">
                    <span className="material-symbols-outlined text-[32px] text-slate-300 mb-2">search_off</span>
                    <p className="text-[14px] text-slate-500 font-medium">No ideas found matching "{searchQuery}"</p>
                  </td>
                </tr>
              ) : (
                currentIdeas.map((idea, index) => {
                 const createdDate = idea.created_at ? new Date(idea.created_at).toLocaleString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" }) : "-";
                 const updatedDate = idea.updated_at ? new Date(idea.updated_at).toLocaleString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" }) : "-";
                 const flagCode = getFlagCode(idea.country);
                 
                 return (
                   <tr key={idea.id} className="hover:bg-slate-50/50 transition-colors group">
                     <td className="py-3 px-4 w-[20%] max-w-[150px]">
                       <Link href={`/ideas/${idea.id}`} className="font-semibold text-[14px] text-primary truncate hover:underline block transition-all">
                         {idea.title}
                       </Link>
                     </td>
                     <td className="py-3 px-4 w-[35%] max-w-[250px]">
                       <p className="text-[13px] text-slate-500 truncate" title={idea.description}>{idea.description}</p>
                     </td>
                     <td className="py-3 px-4">
                       <div className="flex items-center justify-center" title={idea.country}>
                         {flagCode !== "un" ? (
                           <img src={`https://flagcdn.com/${flagCode}.svg`} alt={idea.country} className="w-6 h-4 object-cover shadow-sm border border-slate-200 rounded-[2px]" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                         ) : (
                           <span className="inline-flex items-center justify-center w-6 h-4 rounded-[2px] bg-slate-100 border border-slate-200">
                             <span className="material-symbols-outlined text-[12px] text-slate-400">public</span>
                           </span>
                         )}
                       </div>
                     </td>
                     <td className="py-3 px-4">
                       <CanvasStatus ideaId={idea.id} />
                     </td>
                     <td className="py-3 px-4 text-[13px] text-slate-500 whitespace-nowrap">
                       {createdDate}
                     </td>
                     <td className="py-3 px-4 text-[13px] text-slate-500 whitespace-nowrap">
                       {updatedDate}
                     </td>
                     <td className="py-3 px-4 relative">
                       <div className="flex justify-center">
                         <button 
                           onClick={() => setOpenMenuId(openMenuId === idea.id ? null : idea.id)}
                           className="cursor-pointer w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-900 transition-colors"
                         >
                           <span className="material-symbols-outlined text-[20px]">more_vert</span>
                         </button>
                       </div>
                       
                       {openMenuId === idea.id && (
                         <>
                           <div className="fixed inset-0 z-40" onClick={() => setOpenMenuId(null)}></div>
                           <div className={`absolute right-10 z-50 w-36 bg-white border border-slate-200 rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] flex flex-col py-1 animate-fade-in ${index >= currentIdeas.length - 2 ? 'bottom-8' : 'top-10'}`}>
                             <Link href={`/ideas/${idea.id}`} className="relative z-50 flex items-center gap-2.5 px-4 py-2 text-[13px] font-medium text-slate-700 hover:bg-slate-50 hover:text-primary transition-colors">
                               <span className="material-symbols-outlined text-[16px] text-slate-400">visibility</span> View
                             </Link>
                             <Link href={`/ideas/${idea.id}/edit`} className="relative z-50 flex items-center gap-2.5 px-4 py-2 text-[13px] font-medium text-slate-700 hover:bg-slate-50 hover:text-blue-600 transition-colors">
                               <span className="material-symbols-outlined text-[16px] text-slate-400">edit</span> Edit
                             </Link>
                             <div className="h-px bg-slate-100 my-1"></div>
                             <button className="cursor-pointer relative z-50 w-full text-left flex items-center gap-2.5 px-4 py-2 text-[13px] font-medium text-red-600 hover:bg-red-50 transition-colors">
                               <span className="material-symbols-outlined text-[16px]">delete</span> Delete
                             </button>
                           </div>
                         </>
                       )}
                     </td>
                   </tr>
                 )
                })
              )}
            </tbody>
          </table>
        </div>
        
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200 bg-slate-50/50">
            <p className="text-[13px] text-slate-500 font-medium">
              Showing <span className="text-slate-900">{(currentPage - 1) * itemsPerPage + 1}</span> to <span className="text-slate-900">{Math.min(currentPage * itemsPerPage, processedIdeas.length)}</span> of <span className="text-slate-900">{processedIdeas.length}</span> ideas
            </p>
            <div className="flex gap-2">
              <button 
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="cursor-pointer disabled:cursor-not-allowed flex items-center justify-center w-8 h-8 rounded-lg border border-slate-200 text-slate-600 hover:bg-white hover:text-slate-900 disabled:opacity-50 disabled:hover:bg-transparent transition-colors"
              >
                <span className="material-symbols-outlined text-[18px]">chevron_left</span>
              </button>
              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`cursor-pointer w-8 h-8 rounded-lg text-[13px] font-medium transition-colors ${
                      currentPage === page 
                        ? 'bg-slate-900 text-white' 
                        : 'text-slate-600 hover:bg-white hover:text-slate-900 border border-transparent hover:border-slate-200'
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>
              <button 
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="cursor-pointer disabled:cursor-not-allowed flex items-center justify-center w-8 h-8 rounded-lg border border-slate-200 text-slate-600 hover:bg-white hover:text-slate-900 disabled:opacity-50 disabled:hover:bg-transparent transition-colors"
              >
                <span className="material-symbols-outlined text-[18px]">chevron_right</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
