"use client";

interface CanvasBlockProps {
  title: string;
  value: string | null | undefined;
  isEditing?: boolean;
  onChange?: (v: string) => void;
  colorClass: string;
  icon: string;
}

export function CanvasBlock({ 
  title, 
  value, 
  isEditing,
  onChange,
  colorClass, 
  icon 
}: CanvasBlockProps) {
  return (
    <div className={`flex-1 min-h-0 h-full rounded-xl border-2 p-4 flex flex-col ${colorClass} shadow-sm overflow-hidden print:h-auto print:overflow-visible`}>
      <h3 className="font-sans font-bold text-xs uppercase tracking-wider text-slate-800 flex items-center gap-1.5 mb-3 shrink-0">
        <span className="material-symbols-outlined text-[16px] opacity-80">{icon}</span>
        {title}
      </h3>
      {isEditing ? (
        <textarea
          value={value || ""}
          onChange={(e) => onChange?.(e.target.value)}
          className="flex-1 min-h-0 w-full bg-white/70 border border-slate-300 rounded-lg p-2 text-slate-900 font-body-md text-sm leading-relaxed resize-none focus:outline-none focus:ring-2 focus:ring-primary/50"
          placeholder={`Enter ${title}...`}
        />
      ) : (
        <div className="flex-1 min-h-0 overflow-y-auto text-slate-900 font-body-md text-sm leading-relaxed pr-2 whitespace-pre-wrap print:overflow-visible">
          {value ? value.replace(/\s+(?=(?:\d+\.|[•▪\-\*])\s)/g, '\n\n') : <span className="text-slate-500 italic">Not defined</span>}
        </div>
      )}
    </div>
  );
}
