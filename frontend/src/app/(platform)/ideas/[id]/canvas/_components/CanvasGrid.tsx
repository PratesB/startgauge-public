"use client";

import { Canvas } from "../page";
import { CanvasBlock } from "./CanvasBlock";

interface CanvasGridProps {
  canvas: Canvas;
  editedCanvas: Partial<Canvas>;
  isEditing: boolean;
  setEditedCanvas: (val: Partial<Canvas>) => void;
}

export function CanvasGrid({
  canvas,
  editedCanvas,
  isEditing,
  setEditedCanvas
}: CanvasGridProps) {
  return (
    <div className="flex-1 flex flex-col gap-4 min-h-[600px] min-w-[1000px] print:h-auto print:overflow-visible">
      
      {/* Top Row: 5 Columns */}
      <div className="grid grid-cols-5 gap-4 flex-[3] print:h-auto print:overflow-visible">
        <CanvasBlock 
          title="Key Partnerships" 
          value={isEditing ? editedCanvas.key_partnerships : canvas.key_partnerships}
          isEditing={isEditing}
          onChange={(v) => setEditedCanvas({...editedCanvas, key_partnerships: v})}
          colorClass="bg-blue-100/80 border-blue-300"
          icon="handshake"
        />
        <div className="flex flex-col gap-4 h-full min-h-0 print:h-auto print:overflow-visible">
          <CanvasBlock 
            title="Key Activities" 
            value={isEditing ? editedCanvas.key_activities : canvas.key_activities}
            isEditing={isEditing}
            onChange={(v) => setEditedCanvas({...editedCanvas, key_activities: v})}
            colorClass="bg-blue-100/80 border-blue-300"
            icon="manufacturing"
          />
          <CanvasBlock 
            title="Key Resources" 
            value={isEditing ? editedCanvas.key_resources : canvas.key_resources}
            isEditing={isEditing}
            onChange={(v) => setEditedCanvas({...editedCanvas, key_resources: v})}
            colorClass="bg-blue-100/80 border-blue-300"
            icon="diamond"
          />
        </div>
        <CanvasBlock 
          title="Value Propositions" 
          value={isEditing ? editedCanvas.value_propositions : canvas.value_propositions}
          isEditing={isEditing}
          onChange={(v) => setEditedCanvas({...editedCanvas, value_propositions: v})}
          colorClass="bg-rose-100/80 border-rose-300"
          icon="featured_play_list"
        />
        <div className="flex flex-col gap-4 h-full min-h-0 print:h-auto print:overflow-visible">
          <CanvasBlock 
            title="Customer Relationships" 
            value={isEditing ? editedCanvas.customer_relationships : canvas.customer_relationships}
            isEditing={isEditing}
            onChange={(v) => setEditedCanvas({...editedCanvas, customer_relationships: v})}
            colorClass="bg-emerald-100/80 border-emerald-300"
            icon="favorite"
          />
          <CanvasBlock 
            title="Channels" 
            value={isEditing ? editedCanvas.channels : canvas.channels}
            isEditing={isEditing}
            onChange={(v) => setEditedCanvas({...editedCanvas, channels: v})}
            colorClass="bg-emerald-100/80 border-emerald-300"
            icon="local_shipping"
          />
        </div>
        <CanvasBlock 
          title="Customer Segments" 
          value={isEditing ? editedCanvas.customer_segments : canvas.customer_segments}
          isEditing={isEditing}
          onChange={(v) => setEditedCanvas({...editedCanvas, customer_segments: v})}
          colorClass="bg-emerald-100/80 border-emerald-300"
          icon="groups"
        />
      </div>

      {/* Bottom Row: 2 Columns */}
      <div className="grid grid-cols-2 gap-4 flex-[1.5] print:h-auto print:overflow-visible">
        <CanvasBlock 
          title="Cost Structure" 
          value={isEditing ? editedCanvas.cost_structure : canvas.cost_structure}
          isEditing={isEditing}
          onChange={(v) => setEditedCanvas({...editedCanvas, cost_structure: v})}
          colorClass="bg-amber-100/80 border-amber-300"
          icon="payments"
        />
        <CanvasBlock 
          title="Revenue Streams" 
          value={isEditing ? editedCanvas.revenue_streams : canvas.revenue_streams}
          isEditing={isEditing}
          onChange={(v) => setEditedCanvas({...editedCanvas, revenue_streams: v})}
          colorClass="bg-amber-100/80 border-amber-300"
          icon="account_balance_wallet"
        />
      </div>
    </div>
  );
}
