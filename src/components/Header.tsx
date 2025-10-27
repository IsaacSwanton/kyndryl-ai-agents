import { Settings } from "lucide-react";
import { Button } from "./ui/button";

interface HeaderProps {
  onConfigClick: () => void;
}

const Header = ({ onConfigClick }: HeaderProps) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
            <span className="text-xl font-bold text-primary-foreground">K</span>
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">Kyndryl</h1>
            <p className="text-xs text-muted-foreground">AI Voice Assistant</p>
          </div>
        </div>
        <Button
          onClick={onConfigClick}
          variant="ghost"
          size="icon"
          className="hover:bg-accent/10"
        >
          <Settings className="h-5 w-5" />
        </Button>
      </div>
    </header>
  );
};

export default Header;
