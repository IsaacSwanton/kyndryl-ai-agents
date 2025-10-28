import { useState, useEffect } from "react";
import Header from "@/components/Header";
import VoiceAgent from "@/components/VoiceAgent";
import AgentConfig, { Agent } from "@/components/AgentConfig";
import { Button } from "@/components/ui/button";
import backgroundImage from "@/assets/kyndryl-background.png";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [showConfig, setShowConfig] = useState(false);
  const [agents, setAgents] = useState<Agent[]>([]);
  const { toast } = useToast();

  // Load agents from database on mount
  useEffect(() => {
    loadAgents();
  }, []);

  const loadAgents = async () => {
    const { data, error } = await supabase
      .from('agents')
      .select('*')
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

  return (
    <div className="min-h-screen bg-cover bg-center bg-no-repeat" style={{ backgroundImage: `url(${backgroundImage})` }}>
      <Header onConfigClick={() => setShowConfig(true)} />

      <main className="container mx-auto px-4 pt-24 pb-12">
        <div className="text-center mb-16 space-y-4">
          <h1 className="text-5xl md:text-6xl font-bold text-white leading-tight">
            Your AI-Powered Co-design Squad
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Utilising curated data sources, Kyndryl Institute thought leadership and our understanding of you to support your journey
          </p>
        </div>

        <div className="max-w-7xl mx-auto">
          {agents.length > 0 ? (
            <div className={`grid gap-8 ${
              agents.length === 1 ? 'max-w-2xl mx-auto' :
              agents.length === 2 ? 'md:grid-cols-2 max-w-5xl mx-auto' :
              agents.length === 3 ? 'md:grid-cols-3' :
              'md:grid-cols-2 lg:grid-cols-4'
            }`}>
              {agents.map((agent) => (
                <div key={agent.id} className="bg-card/50 backdrop-blur-sm border border-border rounded-2xl p-8 shadow-card">
                  <VoiceAgent
                    agentId={agent.agentId}
                    agentName={agent.name}
                    agentBio={agent.bio}
                    agentLlm={agent.llm}
                  />
                </div>
              ))}
            </div>
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
