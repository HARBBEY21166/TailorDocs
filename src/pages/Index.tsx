
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
    <div className="min-h-screen bg-white flex flex-col">
    <div className="flex-grow py-12">
      <div className="container px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <header className="mb-10 text-center">
          <h1 className="text-4xl font-extrabold text-black tracking-tight">TailorDocs</h1>
          <p className="mt-3 text-lg text-gray-600 max-w-2xl mx-auto">Create tailored cover letters and enhance your CV for job applications</p>
        </header>
        
        <div className="mb-8 bg-gray-50 p-6 rounded-lg shadow-sm border border-gray-200">
          <ApiKeyInput />
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-8 flex bg-gray-100 p-1 rounded-md border border-gray-200 justify-center">
            <TabsTrigger value="input" className="px-6 py-2 text-sm font-medium rounded-md data-[state=active]:bg-white data-[state=active]:text-black data-[state=active]:shadow-sm">Input</TabsTrigger>
            <TabsTrigger value="output" className="px-6 py-2 text-sm font-medium rounded-md data-[state=active]:bg-white data-[state=active]:text-black data-[state=active]:shadow-sm">Output</TabsTrigger>
          </TabsList>
          
          <TabsContent value="input" className="space-y-8">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <JobForm onFormDataChange={handleFormDataChange} />
            </div>
            
            <ActionButtons 
              onGenerateCoverLetter={handleGenerateCoverLetter}
              onEnhanceCv={handleEnhanceCv}
              loading={loading}
              className="flex justify-center gap-4"
            />
          </TabsContent>
          
          <TabsContent value="output" className="space-y-8">
            <OutputSection 
              coverLetter={coverLetter}
              enhancedCv={enhancedCv}
              companyName={formData.companyName}
              positionTitle={formData.positionTitle}
              onBackToInput={() => setActiveTab('input')}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
    
    <footer className="bg-black text-white py-6 mt-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="font-medium">© {new Date().getFullYear()} TailorDocs</p>
            <p className="text-sm text-gray-400">All rights reserved</p>
          </div>
          <div className="flex gap-6">
            <span className="text-sm text-gray-400 hover:text-white cursor-pointer">Privacy</span>
            <span className="text-sm text-gray-400 hover:text-white cursor-pointer">Terms</span>
            <span className="text-sm text-gray-400 hover:text-white cursor-pointer">Contact</span>
          </div>
        </div>
      </div>
    </footer>
  </div>
  );
};

export default Index;
