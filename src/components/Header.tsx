import { Settings } from "lucide-react";
import { Button } from "./ui/button";
import kyndrylLogo from "@/assets/kyndryl-logo.png";

interface HeaderProps {
  onConfigClick: () => void;
}

const Header = ({ onConfigClick }: HeaderProps) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-white border-b border-gray-200">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img 
            src={kyndrylLogo} 
            alt="Kyndryl" 
            className="h-8 w-auto"
          />
        </div>
        <Button
          onClick={onConfigClick}
          variant="ghost"
          size="icon"
          className="hover:bg-gray-100 text-primary"
        >
          <Settings className="h-5 w-5" />
        </Button>
      </div>
    </header>
  );
};

export default Header;
