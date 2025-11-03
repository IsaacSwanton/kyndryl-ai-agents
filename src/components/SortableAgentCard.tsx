import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import VoiceAgent from "./VoiceAgent";

interface SortableAgentCardProps {
  id: string;
  agentId: string;
  agentName: string;
  agentBio?: string;
  agentLlm?: string;
  avatarImage?: string;
  index: number;
}

const SortableAgentCard = ({
  id,
  agentId,
  agentName,
  agentBio,
  agentLlm,
  avatarImage,
  index,
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
        animationDelay: `${index * 0.1}s`,
      }}
      className="animate-fade-in bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8 shadow-[0_8px_32px_rgba(0,0,0,0.3)] hover:shadow-[0_8px_48px_rgba(0,0,0,0.4)] hover:border-white/30 transition-all duration-300 cursor-grab active:cursor-grabbing"
      {...attributes}
      {...listeners}
    >
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
