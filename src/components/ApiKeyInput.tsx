
import React, { useState, useEffect } from 'react';
import { getApiKey, saveApiKey, clearApiKey, hasApiKey } from '../utils/localStorageUtils';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { Eye, EyeOff } from 'lucide-react';

const ApiKeyInput: React.FC = () => {
  const [apiKey, setApiKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [hasKey, setHasKey] = useState(false);

  useEffect(() => {
    const storedKey = getApiKey();
    setApiKey(storedKey);
    setHasKey(hasApiKey());
  }, []);

  const handleSaveApiKey = () => {
    saveApiKey(apiKey);
    setHasKey(true);
  };

  const handleClearApiKey = () => {
    clearApiKey();
    setApiKey('');
    setHasKey(false);
    setShowKey(false);
  };

  const toggleShowKey = () => {
    setShowKey(!showKey);
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold">Google Gemini-2.0-flash API Key</CardTitle>
        <CardDescription>
          Enter your Gemini-2.0-flash for the App to work...
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-2">
          <div className="relative flex-grow">
            <Input
              type={showKey ? 'text' : 'password'}
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="I'm waiting for the key"
              className="pr-10"
            />
            <button
              type="button"
              onClick={toggleShowKey}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              aria-label={showKey ? "Hide API key" : "Show API key"}
            >
              {showKey ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>
        <p className="mt-2 text-xs text-muted-foreground">
          Your API key is stored locally in your browser and never sent to our servers.
        </p>
      </CardContent>
      <CardFooter className="flex justify-end space-x-2 pt-0">
        {hasKey && (
          <Button variant="outline" onClick={handleClearApiKey}>
            Clear Key
          </Button>
        )}
        <Button onClick={handleSaveApiKey} disabled={!apiKey}>
          Save Key
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ApiKeyInput;
