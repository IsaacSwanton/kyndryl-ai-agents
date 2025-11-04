import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { DndContext, closestCenter, DragEndEvent, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { arrayMove, SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import Header from "@/components/Header";
import SortableAgentCard from "@/components/SortableAgentCard";
import AgentConfig, { Agent } from "@/components/AgentConfig";
import { Button } from "@/components/ui/button";

import endCustomerAvatar from "@/assets/end-customer-avatar.png";
import aiKyndrylConsultantAvatar from "@/assets/ai-kyndryl-consultant-avatar.png";
import customerRelationshipManagerAvatar from "@/assets/customer-relationship-manager-avatar.png";
import ctoAvatar from "@/assets/cto-avatar.png";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { User } from "@supabase/supabase-js";

const Index = () => {
  const [showConfig, setShowConfig] = useState(false);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  // Check authentication
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
      if (!session) {
        navigate("/auth");
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      if (!session) {
        navigate("/auth");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const loadAgents = async () => {
    const { data, error } = await supabase
      .from('agents')
      .select('*')
      .order('display_order', { ascending: true, nullsFirst: false })
      .order('created_at', { ascending: true });

    if (error) {
      toast({
        title: "Error loading agents",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    if (data) {
      setAgents(data.map(agent => ({
        id: agent.id,
        name: agent.name,
        agentId: agent.agent_id,
        bio: agent.bio || "",
        llm: agent.llm || "",
      })));
    }
  };

  // Load agents from database on mount and when user changes
  useEffect(() => {
    if (user) {
      loadAgents();
    }
  }, [user]);

  // Map agent names to avatar images (case-insensitive)
  const getAvatarImage = (agentName: string) => {
    const normalizedName = agentName.toLowerCase().trim();
    
    if (normalizedName.includes("end customer")) {
      return endCustomerAvatar;
    }
    if (normalizedName.includes("ai") && normalizedName.includes("kyndryl")) {
      return aiKyndrylConsultantAvatar;
    }
    if (normalizedName.includes("customer") && normalizedName.includes("relationship")) {
      return customerRelationshipManagerAvatar;
    }
    if (normalizedName.includes("cto")) {
      return ctoAvatar;
    }
    
    return undefined;
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) {
      return;
    }

    const oldIndex = agents.findIndex((agent) => agent.id === active.id);
    const newIndex = agents.findIndex((agent) => agent.id === over.id);

    const newAgents = arrayMove(agents, oldIndex, newIndex);
    setAgents(newAgents);

    // Update display_order in database
    try {
      const updates = newAgents.map((agent, index) => ({
        id: agent.id,
        display_order: index,
      }));

      for (const update of updates) {
        await supabase
          .from('agents')
          .update({ display_order: update.display_order })
          .eq('id', update.id);
      }

      toast({
        title: "Order updated",
        description: "Agent order has been saved",
      });
    } catch (error) {
      console.error('Error updating agent order:', error);
      toast({
        title: "Error",
        description: "Failed to save agent order",
        variant: "destructive",
      });
      // Reload agents on error
      loadAgents();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#3D3C3C]">
      <Header onConfigClick={() => setShowConfig(true)} userEmail={user?.email} />

      <main className="container mx-auto px-4 pt-24 pb-12">
        <div className="text-left mb-16 space-y-4">
          <h1 className="text-5xl md:text-6xl font-bold text-white leading-tight">
            Your AI-Powered Co-design Squad
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl">
            Utilising curated data sources, Kyndryl Institute thought leadership and our understanding of you to support your journey
          </p>
        </div>

        <div className="max-w-7xl mx-auto">
          {agents.length > 0 ? (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext items={agents.map(a => a.id)} strategy={verticalListSortingStrategy}>
                <div className={`grid gap-8 ${
                  agents.length === 1 ? 'max-w-2xl mx-auto' :
                  agents.length === 2 ? 'md:grid-cols-2 max-w-5xl mx-auto' :
                  agents.length === 3 ? 'md:grid-cols-3' :
                  'md:grid-cols-2 lg:grid-cols-4'
                }`}>
                  {agents.map((agent, index) => (
                    <SortableAgentCard
                      key={agent.id}
                      id={agent.id}
                      agentId={agent.agentId}
                      agentName={agent.name}
                      agentBio={agent.bio}
                      agentLlm={agent.llm}
                      avatarImage={getAvatarImage(agent.name)}
                      index={index}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          ) : (
            <div className="text-center py-16 space-y-4 max-w-2xl mx-auto">
              <p className="text-xl text-muted-foreground">No agents configured</p>
              <Button
                onClick={() => setShowConfig(true)}
                className="bg-gradient-primary hover:opacity-90 text-primary-foreground"
              >
                Configure Agents
              </Button>
            </div>
          )}
        </div>
      </main>

      {showConfig && (
        <AgentConfig
          agents={agents}
          onAgentsChange={setAgents}
          onClose={() => setShowConfig(false)}
          onRefresh={loadAgents}
        />
      )}
    </div>
  );
};

export default Index;
