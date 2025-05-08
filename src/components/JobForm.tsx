
import React, { useState, useEffect } from 'react';
import { Textarea } from '../components/ui/textarea';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { saveFormData, getFormData } from '../utils/localStorageUtils';

export interface JobFormData {
  cvContent: string;
  companyName: string;
  positionTitle: string;
  jobRequirements: string;
  jobDescription: string;
}

interface JobFormProps {
  onFormDataChange: (data: JobFormData) => void;
}

const FORM_STORAGE_KEY = 'jobmatch-form-data';

const JobForm: React.FC<JobFormProps> = ({ onFormDataChange }) => {
  const [formData, setFormData] = useState<JobFormData>({
    cvContent: '',
    companyName: '',
    positionTitle: '',
    jobRequirements: '',
    jobDescription: ''
  });

  // Load saved form data on component mount
  useEffect(() => {
    const savedData = getFormData<JobFormData>(FORM_STORAGE_KEY, {
      cvContent: '',
      companyName: '',
      positionTitle: '',
      jobRequirements: '',
      jobDescription: ''
    });
    
    setFormData(savedData);
    onFormDataChange(savedData);
  }, [onFormDataChange]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const updatedFormData = { ...formData, [name]: value };
    
    setFormData(updatedFormData);
    onFormDataChange(updatedFormData);
    
    // Save to localStorage
    saveFormData(FORM_STORAGE_KEY, updatedFormData);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Your Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label htmlFor="cvContent" className="text-sm font-medium">Your CV/Resume Content</Label>
              <Textarea
                id="cvContent"
                name="cvContent"
                value={formData.cvContent}
                onChange={handleChange}
                placeholder="Paste your full CV/resume content here..."
                className="h-36 mt-1"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Job Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="companyName" className="text-sm font-medium">Company Name</Label>
                <Input
                  id="companyName"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                  placeholder="e.g., Acme Corporation"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="positionTitle" className="text-sm font-medium">Position Title</Label>
                <Input
                  id="positionTitle"
                  name="positionTitle"
                  value={formData.positionTitle}
                  onChange={handleChange}
                  placeholder="e.g., Senior Developer"
                  className="mt-1"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="jobRequirements" className="text-sm font-medium">Job Requirements</Label>
              <Textarea
                id="jobRequirements"
                name="jobRequirements"
                value={formData.jobRequirements}
                onChange={handleChange}
                placeholder="Paste the job requirements here..."
                className="h-24 mt-1"
              />
            </div>

            <div>
              <Label htmlFor="jobDescription" className="text-sm font-medium">Job Description</Label>
              <Textarea
                id="jobDescription"
                name="jobDescription"
                onChange={handleChange}
                value={formData.jobDescription}
                placeholder="Paste the job description here..."
                className="h-24 mt-1"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default JobForm;
