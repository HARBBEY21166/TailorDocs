
import React from 'react';
import { Button } from './ui/button';
import OutputDisplay from './OutputDisplay';

interface OutputSectionProps {
  coverLetter: string;
  enhancedCv: string;
  companyName: string;
  positionTitle: string;
  onBackToInput: () => void;
  className?: string;
}

const OutputSection: React.FC<OutputSectionProps> = ({
  coverLetter,
  enhancedCv,
  companyName,
  positionTitle,
  onBackToInput,
  className,
}) => {
  return (
    <div className={`space-y-6 ${className || ''}`}>
      {(coverLetter || enhancedCv) ? (
        <>
          {coverLetter && (
            <OutputDisplay 
              title={`Cover letter for ${companyName}: ${positionTitle}`}
              content={coverLetter}
              filename={`cover-letter-${companyName.toLowerCase().replace(/\s+/g, '-')}.txt`}
              type="coverLetter"
            />
          )}
          
          {enhancedCv && (
            <OutputDisplay 
              title="Enhanced CV"
              content={enhancedCv}
              filename={`enhanced-cv-${companyName.toLowerCase().replace(/\s+/g, '-')}.txt`}
              type="cv"
            />
          )}
          
          <div className="text-center">
            <Button variant="outline" onClick={onBackToInput}>
              Back to Input Form
            </Button>
          </div>
        </>
      ) : (
        <div className="text-center p-8">
          <p className="text-lg text-gray-600">Generate a cover letter or enhance your CV to see the results here.</p>
          <Button variant="outline" onClick={onBackToInput} className="mt-4">
            Back to Input Form
          </Button>
        </div>
      )}
    </div>
  );
};

export default OutputSection;
