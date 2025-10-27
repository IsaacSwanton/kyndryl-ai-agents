import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { ScrollArea } from "./ui/scroll-area";
import { Plus, Trash2, Pencil } from "lucide-react";
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
  const [editingAgentId, setEditingAgentId] = useState<string | null>(null);

  const addOrUpdateAgent = () => {
    if (!newAgentName.trim() || !newAgentId.trim()) {
      toast({
        title: "Missing Information",
        description: "Please provide agent name and ID",
        variant: "destructive",
      });
      return;
    }

    if (editingAgentId) {
      // Update existing agent
      const updatedAgents = agents.map((agent) =>
        agent.id === editingAgentId
          ? {
              ...agent,
              name: newAgentName.trim(),
              agentId: newAgentId.trim(),
              bio: newAgentBio.trim(),
            }
          : agent
      );
      onAgentsChange(updatedAgents);
      toast({
        title: "Agent Updated",
        description: `${newAgentName} has been updated successfully`,
      });
    } else {
      // Add new agent
      const newAgent: Agent = {
        id: Date.now().toString(),
        name: newAgentName.trim(),
        agentId: newAgentId.trim(),
        bio: newAgentBio.trim(),
      };
      onAgentsChange([...agents, newAgent]);
      toast({
        title: "Agent Added",
        description: `${newAgentName} has been added successfully`,
      });
    }

    setNewAgentName("");
    setNewAgentId("");
    setNewAgentBio("");
    setEditingAgentId(null);
  };

  const editAgent = (agent: Agent) => {
    setNewAgentName(agent.name);
    setNewAgentId(agent.agentId);
    setNewAgentBio(agent.bio);
    setEditingAgentId(agent.id);
  };

  const cancelEdit = () => {
    setNewAgentName("");
    setNewAgentId("");
    setNewAgentBio("");
    setEditingAgentId(null);
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
      <Card className="w-full max-w-2xl max-h-[90vh] flex flex-col shadow-glow border-border">
        <CardHeader className="flex-shrink-0">
          <CardTitle className="text-2xl">Agent Configuration</CardTitle>
          <CardDescription>
            Add and manage your ElevenLabs agents
          </CardDescription>
        </CardHeader>
        <ScrollArea className="flex-1 px-6">
          <div className="space-y-6 pb-6">
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
            <div className="flex gap-2">
              <Button
                onClick={addOrUpdateAgent}
                className="flex-1 bg-gradient-primary hover:opacity-90 text-primary-foreground"
              >
                <Plus className="mr-2 h-4 w-4" />
                {editingAgentId ? "Update Agent" : "Add Agent"}
              </Button>
              {editingAgentId && (
                <Button
                  onClick={cancelEdit}
                  variant="outline"
                  className="px-4"
                >
                  Cancel
                </Button>
              )}
            </div>
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
                    <div className="flex gap-1">
                      <Button
                        onClick={() => editAgent(agent)}
                        variant="ghost"
                        size="icon"
                        className="text-primary hover:text-primary hover:bg-primary/10"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        onClick={() => removeAgent(agent.id)}
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          </div>
        </ScrollArea>
        <CardContent className="flex-shrink-0 pt-4">
          <Button
            onClick={onClose}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            Done
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default AgentConfig;
