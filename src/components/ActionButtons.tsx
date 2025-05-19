
import React from 'react';
import { Button } from './ui/button';
import { Loader2 } from 'lucide-react';

interface ActionButtonsProps {
  onGenerateCoverLetter: () => void;
  onEnhanceCv: () => void;
  loading: 'coverLetter' | 'cv' | null;
  className?: string;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({ 
  onGenerateCoverLetter, 
  onEnhanceCv, 
  loading,
  className = ''
}) => {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 ${className}`}>
      <Button 
        onClick={onGenerateCoverLetter}
        disabled={loading !== null}
        className="w-full"
      >
        {loading === 'coverLetter' ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Wait a sec...
          </>
        ) : 'Generate Cover Letter'}
      </Button>
      
      <Button
        onClick={onEnhanceCv}
        disabled={loading !== null}
        variant="outline"
        className="w-full"
      >
        {loading === 'cv' ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            I'm on it...
          </>
        ) : 'Update CV'}
      </Button>
    </div>
  );
};

export default ActionButtons;
