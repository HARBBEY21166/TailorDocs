
import React, { useRef } from 'react';
import { Button } from './ui/button';
import { Upload } from 'lucide-react';
import { extractTextFromDocx } from '../utils/docxUtils';

interface FileUploadProps {
  onFileContent: (content: string) => void;
  className?: string;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileContent, className }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      if (file.name.endsWith('.docx')) {
        const text = await extractTextFromDocx(file);
        onFileContent(text);
      } else {
        alert('Please upload a .docx file.');
      }
    } catch (error) {
      console.error('Error processing file:', error);
      alert('Failed to process the file. Please try again.');
    }

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className={className}>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".docx"
        className="hidden"
      />
      <Button 
        variant="outline" 
        onClick={handleClick}
        className="flex items-center gap-2"
      >
        <Upload className="h-4 w-4" />
        Upload CV (.docx)
      </Button>
    </div>
  );
};

export default FileUpload;
