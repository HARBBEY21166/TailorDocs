
import React from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { copyToClipboard, downloadAsTextFile } from '../utils/fileUtils';
import { convertToDocx, convertCoverLetterToDocx } from '../utils/docxUtils';
import { Clipboard, Download, FileText } from 'lucide-react';
import { useToast } from '../hooks/use-toast';

interface OutputDisplayProps {
  title: string;
  content: string;
  filename: string;
  type?: 'cv' | 'coverLetter';
  className?: string;
}

const OutputDisplay: React.FC<OutputDisplayProps> = ({ 
  title, 
  content, 
  filename,
  type = 'cv',
  className
}) => {
  const { toast } = useToast();

  const handleCopy = async () => {
    const success = await copyToClipboard(content);
    if (success) {
      toast({
        title: "Copied to clipboard",
        description: "Content has been copied to your clipboard.",
      });
    } else {
      toast({
        title: "Copy failed",
        description: "Failed to copy content to clipboard.",
        variant: "destructive",
      });
    }
  };

  const handleDownload = () => {
    downloadAsTextFile(content, filename);
    toast({
      title: "Downloaded",
      description: `Content has been downloaded as ${filename}`,
    });
  };

  const handleDownloadDocx = () => {
    try {
      if (type === 'coverLetter') {
        convertCoverLetterToDocx(content, filename.replace('.txt', ''));
      } else {
        convertToDocx(content, filename.replace('.txt', ''));
      }
      
      toast({
        title: "Downloaded as DOCX",
        description: `Content has been downloaded as a Word document`,
      });
    } catch (error) {
      toast({
        title: "Download failed",
        description: "Failed to create DOCX file.",
        variant: "destructive",
      });
    }
  };

  // If there's no content, don't render this component
  if (!content) return null;

  return (
    <Card className={`mb-6 hover-lift border border-gray-200 ${className}`}>
      <CardHeader className="pb-3 border-b border-gray-100">
        <CardTitle className="text-xl font-bold">{title}</CardTitle>
      </CardHeader>
      <CardContent className="pt-5">
        <div className="whitespace-pre-wrap bg-gray-50 p-5 rounded-md border border-gray-100 max-h-[60vh] overflow-y-auto shadow-inner">
          {content}
        </div>
      </CardContent>
      <CardFooter className="flex flex-wrap justify-end gap-3 pt-4">
        <Button variant="outline" onClick={handleCopy} className="border-black text-black hover:bg-gray-50">
          <Clipboard className="h-4 w-4 mr-2" />
          Copy
        </Button>
        <Button variant="outline" onClick={handleDownload} className="border-black text-black hover:bg-gray-50">
          <Download className="h-4 w-4 mr-2" />
          Download Text
        </Button>
        <Button onClick={handleDownloadDocx} className="bg-black text-white hover:bg-gray-800">
          <FileText className="h-4 w-4 mr-2" />
          Download DOCX
        </Button>
      </CardFooter>
    </Card>
  );
};

export default OutputDisplay;
