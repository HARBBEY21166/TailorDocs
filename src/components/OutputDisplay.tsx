
import React from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { copyToClipboard, downloadAsTextFile } from '../utils/fileUtils';
import { Clipboard, Download } from 'lucide-react';
import { useToast } from '../hooks/use-toast';

interface OutputDisplayProps {
  title: string;
  content: string;
  filename: string;
}

const OutputDisplay: React.FC<OutputDisplayProps> = ({ title, content, filename }) => {
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

  // If there's no content, don't render this component
  if (!content) return null;

  return (
    <Card className="mb-6">
      <CardHeader className="pb-3">
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="whitespace-pre-wrap bg-gray-50 p-4 rounded-md border border-gray-200 max-h-[60vh] overflow-y-auto">
          {content}
        </div>
      </CardContent>
      <CardFooter className="flex justify-end space-x-2">
        <Button variant="outline" onClick={handleCopy}>
          <Clipboard className="h-4 w-4 mr-2" />
          Copy
        </Button>
        <Button variant="outline" onClick={handleDownload}>
          <Download className="h-4 w-4 mr-2" />
          Download
        </Button>
      </CardFooter>
    </Card>
  );
};

export default OutputDisplay;
