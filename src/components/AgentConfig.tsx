import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Plus, Trash2 } from "lucide-react";
import { useToast } from "./ui/use-toast";

export interface Agent {
  id: string;
  name: string;
  agentId: string;
  bio: string;
}

interface AgentConfigProps {
  agents: Agent[];
  onAgentsChange: (agents: Agent[]) => void;
  onClose: () => void;
}

const AgentConfig = ({ agents, onAgentsChange, onClose }: AgentConfigProps) => {
  const { toast } = useToast();
  const [newAgentName, setNewAgentName] = useState("");
  const [newAgentId, setNewAgentId] = useState("");
  const [newAgentBio, setNewAgentBio] = useState("");

  const addAgent = () => {
    if (!newAgentName.trim() || !newAgentId.trim()) {
      toast({
        title: "Missing Information",
        description: "Please provide agent name, ID, and bio",
        variant: "destructive",
      });
      return;
    }

    const newAgent: Agent = {
      id: Date.now().toString(),
      name: newAgentName.trim(),
      agentId: newAgentId.trim(),
      bio: newAgentBio.trim(),
    };

    onAgentsChange([...agents, newAgent]);
    setNewAgentName("");
    setNewAgentId("");
    setNewAgentBio("");
    
    toast({
      title: "Agent Added",
      description: `${newAgentName} has been added successfully`,
    });
  };

  const removeAgent = (id: string) => {
    onAgentsChange(agents.filter((agent) => agent.id !== id));
    toast({
      title: "Agent Removed",
      description: "Agent has been removed from the list",
    });
  };

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl shadow-glow border-border">
        <CardHeader>
          <CardTitle className="text-2xl">Agent Configuration</CardTitle>
          <CardDescription>
            Add and manage your ElevenLabs agents
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="grid gap-4">
              <div className="space-y-2">
                <Label htmlFor="agentName" className="text-card-foreground">Agent Name</Label>
                <Input
                  id="agentName"
                  placeholder="e.g., Customer Support Agent"
                  value={newAgentName}
                  onChange={(e) => setNewAgentName(e.target.value)}
                  className="border-input bg-white text-gray-900 placeholder:text-gray-500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="agentId" className="text-card-foreground">ElevenLabs Agent ID</Label>
                <Input
                  id="agentId"
                  placeholder="e.g., agent_3701k83..."
                  value={newAgentId}
                  onChange={(e) => setNewAgentId(e.target.value)}
                  className="border-input bg-white text-gray-900 placeholder:text-gray-500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="agentBio" className="text-card-foreground">Agent Bio</Label>
                <Textarea
                  id="agentBio"
                  placeholder="Brief description of the agent..."
                  value={newAgentBio}
                  onChange={(e) => setNewAgentBio(e.target.value)}
                  className="border-input bg-white text-gray-900 placeholder:text-gray-500 min-h-[100px]"
                />
              </div>
            </div>
            <Button
              onClick={addAgent}
              className="w-full bg-gradient-primary hover:opacity-90 text-primary-foreground"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Agent
            </Button>
          </div>

          <div className="space-y-3">
            <h3 className="text-lg font-semibold">Configured Agents</h3>
            {agents.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                No agents configured yet
              </p>
            ) : (
              <div className="space-y-2">
                {agents.map((agent) => (
                  <div
                    key={agent.id}
                    className="flex items-center justify-between p-3 border border-border rounded-lg bg-card"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-card-foreground">{agent.name}</p>
                      <p className="text-sm text-muted-foreground font-mono">
                        {agent.agentId}
                      </p>
                      {agent.bio && (
                        <p className="text-sm text-muted-foreground mt-1">
                          {agent.bio}
                        </p>
                      )}
                    </div>
                    <Button
                      onClick={() => removeAgent(agent.id)}
                      variant="ghost"
                      size="icon"
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              onClick={onClose}
              className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              Done
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AgentConfig;
