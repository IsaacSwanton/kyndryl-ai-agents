import { useState } from "react";
import Header from "@/components/Header";
import VoiceAgent from "@/components/VoiceAgent";
import AgentConfig, { Agent } from "@/components/AgentConfig";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

const Index = () => {
  const [showConfig, setShowConfig] = useState(false);
  const [agents, setAgents] = useState<Agent[]>([
    {
      id: "1",
      name: "Kyndryl Assistant",
      agentId: "agent_3701k83weyd2f8dvw1f62nw81v86",
    },
  ]);
  const [currentAgentIndex, setCurrentAgentIndex] = useState(0);

  const currentAgent = agents[currentAgentIndex];

  const nextAgent = () => {
    setCurrentAgentIndex((prev) => (prev + 1) % agents.length);
  };

  const prevAgent = () => {
    setCurrentAgentIndex((prev) => (prev - 1 + agents.length) % agents.length);
  };

  return (
    <div className="min-h-screen bg-gradient-hero">
      <Header onConfigClick={() => setShowConfig(true)} />

      <main className="container mx-auto px-4 pt-24 pb-12">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-5xl md:text-6xl font-bold text-foreground leading-tight">
            Intelligent Voice
            <br />
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              Assistance
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Experience next-generation AI-powered voice interactions built for enterprise
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          {agents.length > 0 ? (
            <div className="space-y-8">
              <div className="bg-card/50 backdrop-blur-sm border border-border rounded-2xl p-8 md:p-12 shadow-card">
                <VoiceAgent
                  key={currentAgent.id}
                  agentId={currentAgent.agentId}
                  agentName={currentAgent.name}
                />
              </div>

              {agents.length > 1 && (
                <div className="flex items-center justify-center gap-4">
                  <Button
                    onClick={prevAgent}
                    variant="ghost"
                    size="icon"
                    className="hover:bg-accent/10"
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </Button>
                  <span className="text-muted-foreground">
                    {currentAgentIndex + 1} / {agents.length}
                  </span>
                  <Button
                    onClick={nextAgent}
                    variant="ghost"
                    size="icon"
                    className="hover:bg-accent/10"
                  >
                    <ChevronRight className="h-6 w-6" />
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-16 space-y-4">
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

        <div className="mt-24 grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <div className="bg-card/30 backdrop-blur-sm border border-border rounded-xl p-6 space-y-3">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
              <span className="text-2xl">🎯</span>
            </div>
            <h3 className="text-lg font-semibold text-foreground">Enterprise Ready</h3>
            <p className="text-muted-foreground">
              Built for scale with Kyndryl's infrastructure expertise
            </p>
          </div>

          <div className="bg-card/30 backdrop-blur-sm border border-border rounded-xl p-6 space-y-3">
            <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
              <span className="text-2xl">⚡</span>
            </div>
            <h3 className="text-lg font-semibold text-foreground">Real-time AI</h3>
            <p className="text-muted-foreground">
              Powered by ElevenLabs conversational AI technology
            </p>
          </div>

          <div className="bg-card/30 backdrop-blur-sm border border-border rounded-xl p-6 space-y-3">
            <div className="w-12 h-12 bg-primary-glow/10 rounded-lg flex items-center justify-center">
              <span className="text-2xl">🔒</span>
            </div>
            <h3 className="text-lg font-semibold text-foreground">Secure</h3>
            <p className="text-muted-foreground">
              Enterprise-grade security and data protection
            </p>
          </div>
        </div>
      </main>

      {showConfig && (
        <AgentConfig
          agents={agents}
          onAgentsChange={setAgents}
          onClose={() => setShowConfig(false)}
        />
      )}
    </div>
  );
};

export default Index;
