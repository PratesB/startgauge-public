import Link from "next/link";

interface Idea {
  id: string;
  title: string;
  description: string;
  country: string;
  created_at: string;
  updated_at: string;
}

const getFlagCode = (country: string) => {
  if (!country) return "un";
  const map: Record<string, string> = {
    "finland": "fi",
    "brazil": "br",
    "united states": "us",
    "usa": "us",
    "uk": "gb",
    "united kingdom": "gb",
    "portugal": "pt",
    "japan": "jp",
    "germany": "de",
    "france": "fr",
  };
  return map[country.toLowerCase()] || "un";
};

export default function IdeasTable({ ideas }: { ideas: Idea[] }) {
  return (
    <div className="w-full bg-card-surface border border-card-border rounded-2xl shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-surface-container-lowest border-b border-card-border/60">
              <th className="py-4 px-6 text-xs font-bold text-text-muted uppercase tracking-wider">Title</th>
              <th className="py-4 px-6 text-xs font-bold text-text-muted uppercase tracking-wider">Description</th>
              <th className="py-4 px-6 text-xs font-bold text-text-muted uppercase tracking-wider text-center">Market</th>
              <th className="py-4 px-6 text-xs font-bold text-text-muted uppercase tracking-wider">Created At</th>
              <th className="py-4 px-6 text-xs font-bold text-text-muted uppercase tracking-wider">Updated At</th>
              <th className="py-4 px-6 text-xs font-bold text-text-muted uppercase tracking-wider text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-card-border/60">
            {ideas.map((idea) => {
               const createdDate = idea.created_at ? new Date(idea.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "-";
               const updatedDate = idea.updated_at ? new Date(idea.updated_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "-";
               const flagCode = getFlagCode(idea.country);
               
               return (
                 <tr key={idea.id} className="hover:bg-surface-container-lowest/30 transition-colors group">
                   <td className="py-4 px-6 min-w-[200px] max-w-[250px]">
                     <p className="font-bold text-on-surface truncate">{idea.title}</p>
                   </td>
                   <td className="py-4 px-6 min-w-[250px] max-w-[350px]">
                     <p className="text-sm text-text-muted line-clamp-2 leading-relaxed" title={idea.description}>{idea.description}</p>
                   </td>
                   <td className="py-4 px-6">
                     <div className="flex items-center justify-center" title={idea.country}>
                       {flagCode !== "un" ? (
                         <img src={`https://flagcdn.com/${flagCode}.svg`} alt={idea.country} className="w-7 h-7 rounded-full object-cover shadow-sm border border-card-border/50" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                       ) : (
                         <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-surface-container border border-card-border/50">
                           <span className="material-symbols-outlined text-[14px] text-text-muted">public</span>
                         </span>
                       )}
                     </div>
                   </td>
                   <td className="py-4 px-6 text-sm text-on-surface/80 font-medium whitespace-nowrap">
                     {createdDate}
                   </td>
                   <td className="py-4 px-6 text-sm text-on-surface/80 font-medium whitespace-nowrap">
                     {updatedDate}
                   </td>
                   <td className="py-4 px-6">
                     <div className="flex items-center justify-center gap-2">
                       <Link href={`/ideas/${idea.id}`} className="w-8 h-8 flex items-center justify-center rounded-lg text-primary hover:bg-primary/10 transition-colors" title="View Idea">
                         <span className="material-symbols-outlined text-[20px]">visibility</span>
                       </Link>
                       <Link href={`/ideas/${idea.id}/edit`} className="w-8 h-8 flex items-center justify-center rounded-lg text-blue-500 hover:bg-blue-500/10 transition-colors" title="Edit Idea">
                         <span className="material-symbols-outlined text-[20px]">edit</span>
                       </Link>
                       <button className="w-8 h-8 flex items-center justify-center rounded-lg text-error-red hover:bg-error-red/10 transition-colors" title="Delete Idea">
                         <span className="material-symbols-outlined text-[20px]">delete</span>
                       </button>
                     </div>
                   </td>
                 </tr>
               )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
