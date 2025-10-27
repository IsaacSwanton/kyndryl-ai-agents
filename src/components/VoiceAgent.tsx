import { useConversation } from "@11labs/react";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Mic, MicOff, Loader2 } from "lucide-react";
import { useToast } from "./ui/use-toast";

interface VoiceAgentProps {
  agentId: string;
  agentName: string;
  agentBio?: string;
}

const VoiceAgent = ({ agentId, agentName, agentBio }: VoiceAgentProps) => {
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
      <div className="relative w-64 h-64 flex items-center justify-center">
        {/* Outer pulsing orbs */}
        {isConnected && isSpeaking && (
          <>
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="absolute rounded-full bg-white opacity-10 animate-ping"
                style={{
                  inset: `${i * 20}px`,
                  animationDuration: `${2 + i * 0.5}s`,
                  animationDelay: `${i * 0.2}s`,
                }}
              />
            ))}
          </>
        )}
        
        {/* Hexagonal particles */}
        {isConnected && isSpeaking && (
          <div className="absolute inset-0">
            {[...Array(12)].map((_, i) => {
              const angle = (i * 30) * Math.PI / 180;
              const radius = 100;
              const x = Math.cos(angle) * radius;
              const y = Math.sin(angle) * radius;
              return (
                <div
                  key={i}
                  className="absolute w-2 h-2 bg-white rounded-full animate-pulse"
                  style={{
                    left: '50%',
                    top: '50%',
                    transform: `translate(${x}px, ${y}px)`,
                    animationDuration: `${1 + (i % 3) * 0.3}s`,
                    animationDelay: `${i * 0.1}s`,
                    opacity: 0.6,
                  }}
                />
              );
            })}
          </div>
        )}
        
        {/* Main circular visualization with layered rings */}
        <div className="relative w-44 h-44 rounded-full flex items-center justify-center">
          {/* Outer glowing ring */}
          <div
            className={`absolute inset-0 rounded-full border-4 transition-all duration-500 ${
              isConnected
                ? isSpeaking
                  ? "border-white scale-110 animate-pulse shadow-[0_0_50px_rgba(255,255,255,0.8)]"
                  : "border-white/50 scale-100"
                : "border-white/20 scale-95"
            }`}
          />
          
          {/* Middle rotating ring */}
          {isConnected && (
            <div
              className={`absolute inset-4 rounded-full border-2 border-dashed border-white transition-opacity ${
                isSpeaking ? 'opacity-100 animate-spin' : 'opacity-30'
              }`}
              style={{ animationDuration: '4s' }}
            />
          )}
          
          {/* Inner core with radial bars */}
          <div
            className={`relative w-32 h-32 rounded-full flex items-center justify-center transition-all duration-300 ${
              isConnected
                ? isSpeaking
                  ? "bg-white shadow-[0_0_40px_rgba(255,255,255,0.9)] scale-105"
                  : "bg-white/90 scale-100"
                : "bg-white/30 scale-90"
            }`}
          >
            {/* Radial animated bars */}
            {isConnected && isSpeaking && (
              <div className="absolute inset-0 flex items-center justify-center">
                {[...Array(8)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute w-1 bg-primary rounded-full"
                    style={{
                      height: `${40 + Math.sin(Date.now() / 150 + i * 0.8) * 25}%`,
                      transform: `rotate(${i * 45}deg) translateY(-50%)`,
                      transformOrigin: 'center',
                      top: '50%',
                      left: '50%',
                      animation: `pulse ${0.8 + i * 0.1}s ease-in-out infinite`,
                      animationDelay: `${i * 0.1}s`,
                    }}
                  />
                ))}
              </div>
            )}
            
            {/* Center icon */}
            <div className="relative z-10">
              {isInitializing ? (
                <Loader2 className="w-12 h-12 text-primary animate-spin" />
              ) : isConnected ? (
                <Mic
                  className={`w-12 h-12 text-primary transition-all duration-300 ${
                    isSpeaking ? "scale-75 opacity-40" : "scale-100 opacity-100"
                  }`}
                />
              ) : (
                <MicOff className="w-12 h-12 text-white/60" />
              )}
            </div>
          </div>
        </div>

        {/* Orbital rings */}
        {isConnected && isSpeaking && (
          <>
            <div
              className="absolute inset-0 rounded-full border border-white/30 animate-spin"
              style={{ animationDuration: '8s' }}
            />
            <div
              className="absolute inset-6 rounded-full border border-white/20 animate-spin"
              style={{ animationDuration: '6s', animationDirection: 'reverse' }}
            />
          </>
        )}
      </div>

      <div className="text-center space-y-2">
        <h3 className="text-2xl font-bold text-white">{agentName}</h3>
        {agentBio && (
          <p className="text-white/90 text-base max-w-md mx-auto">
            {agentBio}
          </p>
        )}
        <p className="text-white/80 text-lg">
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
          className="bg-primary hover:bg-primary/90 text-white px-10 py-7 text-xl font-bold rounded-xl transition-all shadow-[0_10px_40px_rgba(0,0,0,0.3)] hover:shadow-[0_15px_50px_rgba(0,0,0,0.4)] hover:scale-105"
        >
          {isInitializing ? (
            <>
              <Loader2 className="mr-2 h-6 w-6 animate-spin" />
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
          className="bg-white hover:bg-white/90 text-primary px-10 py-7 text-xl font-bold rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.3)]"
        >
          End Conversation
        </Button>
      )}
    </div>
  );
};

export default VoiceAgent;
