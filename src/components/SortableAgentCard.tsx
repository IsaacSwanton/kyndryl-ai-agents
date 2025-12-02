import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { EyeOff } from "lucide-react";
import { Button } from "./ui/button";
import VoiceAgent from "./VoiceAgent";

interface SortableAgentCardProps {
  id: string;
  agentId: string;
  agentName: string;
  agentBio?: string;
  agentLlm?: string;
  avatarImage?: string;
  index: number;
  onHide?: () => void;
}

const SortableAgentCard = ({
  id,
  agentId,
  agentName,
  agentBio,
  agentLlm,
  avatarImage,
  index,
  onHide,
}: SortableAgentCardProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={{
        ...style,
        animationDelay: `${index * 0.2}s`,
      }}
      className="relative animate-fade-in bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8 shadow-lg hover:shadow-xl hover:bg-white/15 hover:border-white/30 transition-all duration-300 cursor-grab active:cursor-grabbing"
      {...attributes}
      {...listeners}
    >
      {onHide && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 text-white/60 hover:text-white hover:bg-white/20 z-10"
          onClick={(e) => {
            e.stopPropagation();
            onHide();
          }}
          onPointerDown={(e) => e.stopPropagation()}
        >
          <EyeOff className="h-4 w-4" />
        </Button>
      )}
      <VoiceAgent
        agentId={agentId}
        agentName={agentName}
        agentBio={agentBio}
        agentLlm={agentLlm}
        avatarImage={avatarImage}
      />
    </div>
  );
};

export default SortableAgentCard;
