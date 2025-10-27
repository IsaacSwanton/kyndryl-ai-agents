import { useConversation } from "@11labs/react";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Mic, MicOff, Loader2 } from "lucide-react";
import { useToast } from "./ui/use-toast";

interface VoiceAgentProps {
  agentId: string;
  agentName: string;
}

const VoiceAgent = ({ agentId, agentName }: VoiceAgentProps) => {
  const { toast } = useToast();
  const [isPermissionGranted, setIsPermissionGranted] = useState(false);
  const [isInitializing, setIsInitializing] = useState(false);

  const conversation = useConversation({
    onConnect: () => {
      console.log("Connected to agent");
      toast({
        title: "Connected",
        description: `Now speaking with ${agentName}`,
      });
    },
    onDisconnect: () => {
      console.log("Disconnected from agent");
    },
    onError: (error) => {
      console.error("Conversation error:", error);
      toast({
        title: "Connection Error",
        description: "Failed to connect to the agent. Please try again.",
        variant: "destructive",
      });
    },
    onMessage: (message) => {
      console.log("Message received:", message);
    },
  });

  const requestMicrophoneAccess = async () => {
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
      setIsPermissionGranted(true);
      toast({
        title: "Microphone Access Granted",
        description: "You can now start a conversation",
      });
    } catch (error) {
      console.error("Microphone access denied:", error);
      toast({
        title: "Microphone Access Required",
        description: "Please allow microphone access to use voice features",
        variant: "destructive",
      });
    }
  };

  const startConversation = async () => {
    if (!isPermissionGranted) {
      await requestMicrophoneAccess();
      return;
    }

    setIsInitializing(true);
    try {
      await conversation.startSession({ 
        agentId,
        connectionType: 'webrtc'
      });
    } catch (error) {
      console.error("Failed to start conversation:", error);
      toast({
        title: "Failed to Start",
        description: "Could not connect to the agent",
        variant: "destructive",
      });
    } finally {
      setIsInitializing(false);
    }
  };

  const stopConversation = async () => {
    await conversation.endSession();
  };

  useEffect(() => {
    return () => {
      if (conversation.status === "connected") {
        conversation.endSession();
      }
    };
  }, []);

  const isConnected = conversation.status === "connected";
  const isSpeaking = conversation.isSpeaking;

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="relative w-48 h-48 flex items-center justify-center">
        {/* Outer ripple rings */}
        {isConnected && isSpeaking && (
          <>
            <div className="absolute inset-0 rounded-full bg-primary opacity-20 animate-ping" style={{ animationDuration: '1.5s' }} />
            <div className="absolute inset-4 rounded-full bg-accent opacity-20 animate-ping" style={{ animationDuration: '2s', animationDelay: '0.3s' }} />
            <div className="absolute inset-8 rounded-full bg-primary-glow opacity-30 animate-ping" style={{ animationDuration: '2.5s', animationDelay: '0.6s' }} />
          </>
        )}
        
        {/* Main circular visualization */}
        <div
          className={`
            relative w-36 h-36 rounded-full flex items-center justify-center
            transition-all duration-300 ease-out
            ${
              isConnected
                ? isSpeaking
                  ? "bg-gradient-primary shadow-glow scale-110"
                  : "bg-primary shadow-card scale-100"
                : "bg-muted scale-95"
            }
          `}
        >
          {/* Animated wave bars */}
          {isConnected && isSpeaking && (
            <div className="absolute inset-0 flex items-center justify-center gap-1">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="w-1 bg-primary-foreground rounded-full animate-pulse"
                  style={{
                    height: `${30 + Math.sin(Date.now() / 200 + i) * 20}%`,
                    animationDuration: `${0.6 + i * 0.1}s`,
                    animationDelay: `${i * 0.1}s`,
                  }}
                />
              ))}
            </div>
          )}
          
          {/* Center icon */}
          <div className="relative z-10">
            {isInitializing ? (
              <Loader2 className="w-12 h-12 text-primary-foreground animate-spin" />
            ) : isConnected ? (
              <Mic
                className={`w-12 h-12 text-primary-foreground transition-all duration-300 ${
                  isSpeaking ? "scale-0 opacity-0" : "scale-100 opacity-100"
                }`}
              />
            ) : (
              <MicOff className="w-12 h-12 text-muted-foreground" />
            )}
          </div>
        </div>

        {/* Rotating gradient ring */}
        {isConnected && (
          <div
            className={`absolute inset-0 rounded-full transition-opacity duration-500 ${
              isSpeaking ? 'opacity-100 animate-spin' : 'opacity-0'
            }`}
            style={{
              background: 'conic-gradient(from 0deg, hsl(var(--primary)) 0%, hsl(var(--accent)) 50%, hsl(var(--primary)) 100%)',
              padding: '3px',
              WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
              WebkitMaskComposite: 'xor',
              maskComposite: 'exclude',
              animationDuration: '3s',
            }}
          />
        )}
      </div>

      <div className="text-center space-y-2">
        <h3 className="text-2xl font-bold text-foreground">{agentName}</h3>
        <p className="text-muted-foreground">
          {isConnected
            ? isSpeaking
              ? "Agent is speaking..."
              : "Listening..."
            : "Ready to connect"}
        </p>
      </div>

      {!isConnected ? (
        <Button
          onClick={startConversation}
          disabled={isInitializing}
          size="lg"
          className="bg-gradient-primary hover:opacity-90 text-primary-foreground px-8 py-6 text-lg font-semibold rounded-lg transition-all shadow-card hover:shadow-glow"
        >
          {isInitializing ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Connecting...
            </>
          ) : (
            "Start Conversation"
          )}
        </Button>
      ) : (
        <Button
          onClick={stopConversation}
          size="lg"
          variant="secondary"
          className="px-8 py-6 text-lg font-semibold rounded-lg"
        >
          End Conversation
        </Button>
      )}
    </div>
  );
};

export default VoiceAgent;
