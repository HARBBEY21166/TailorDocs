
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import ApiKeyInput from '../components/ApiKeyInput';
import JobForm, { JobFormData } from '../components/JobForm';
import { generateCoverLetter, enhanceCv } from '../services/geminiService';
import { hasApiKey } from '../utils/localStorageUtils';
import { useToast } from '../hooks/use-toast';
import ActionButtons from '../components/ActionButtons';
import OutputSection from '../components/OutputSection';

const Index = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState<JobFormData>({
    cvContent: '',
    companyName: '',
    positionTitle: '',
    jobRequirements: '',
    jobDescription: ''
  });
  const [coverLetter, setCoverLetter] = useState('');
  const [enhancedCv, setEnhancedCv] = useState('');
  const [loading, setLoading] = useState<'coverLetter' | 'cv' | null>(null);
  const [activeTab, setActiveTab] = useState('input');

  const handleFormDataChange = (data: JobFormData) => {
    setFormData(data);
  };

  const validateForm = () => {
    if (!hasApiKey()) {
      toast({
        title: "API Key Required",
        description: "Please enter your Gemini API key first.",
        variant: "destructive",
      });
      return false;
    }

    if (!formData.cvContent.trim()) {
      toast({
        title: "CV Content Required",
        description: "Please enter your CV/resume content.",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const handleGenerateCoverLetter = async () => {
    if (!validateForm() || !formData.companyName || !formData.positionTitle) {
      if (formData.companyName.trim() === '') {
        toast({
          title: "Company Name Required",
          description: "Please enter the company name.",
          variant: "destructive",
        });
      } else if (formData.positionTitle.trim() === '') {
        toast({
          title: "Position Title Required",
          description: "Please enter the position title.",
          variant: "destructive",
        });
      }
      return;
    }

    try {
      setLoading('coverLetter');
      const result = await generateCoverLetter(
        formData.cvContent,
        formData.companyName,
        formData.positionTitle,
        formData.jobRequirements,
        formData.jobDescription
      );
      setCoverLetter(result);
      setActiveTab('output');
      toast({
        title: "Cover Letter Generated",
        description: "Your cover letter has been successfully created.",
      });
    } catch (error) {
      toast({
        title: "Generation Failed",
        description: error instanceof Error ? error.message : "An error occurred while generating your cover letter.",
        variant: "destructive",
      });
    } finally {
      setLoading(null);
    }
  };

  const handleEnhanceCv = async () => {
    if (!validateForm()) return;

    try {
      setLoading('cv');
      const result = await enhanceCv(
        formData.cvContent,
        formData.jobRequirements,
        formData.jobDescription
      );
      setEnhancedCv(result);
      setActiveTab('output');
      toast({
        title: "CV Enhanced",
        description: "Your CV has been successfully updated.",
      });
    } catch (error) {
      toast({
        title: "Enhancement Failed",
        description: error instanceof Error ? error.message : "An error occurred while enhancing your CV.",
        variant: "destructive",
      });
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container px-4 sm:px-6 lg:px-8 max-w-5xl">
        <header className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900">Job Match Letter Generator</h1>
          <p className="mt-2 text-lg text-gray-600">Create tailored cover letters and enhance your CV for job applications</p>
        </header>

        <div className="mb-6">
          <ApiKeyInput />
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="input">Input</TabsTrigger>
            <TabsTrigger value="output">Output</TabsTrigger>
          </TabsList>
          
          <TabsContent value="input" className="space-y-6">
            <JobForm onFormDataChange={handleFormDataChange} />
            
            <ActionButtons 
              onGenerateCoverLetter={handleGenerateCoverLetter}
              onEnhanceCv={handleEnhanceCv}
              loading={loading}
            />
          </TabsContent>
          
          <TabsContent value="output" className="space-y-6">
            <OutputSection 
              coverLetter={coverLetter}
              enhancedCv={enhancedCv}
              companyName={formData.companyName}
              positionTitle={formData.positionTitle}
              onBackToInput={() => setActiveTab('input')}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
