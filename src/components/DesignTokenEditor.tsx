import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from '@/components/ui/separator';

// Define the structure of design tokens
export interface DesignTokens {
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    foreground: string;
    card: string;
    cardForeground: string;
    popover: string;
    popoverForeground: string;
    border: string;
    input: string;
    ring: string;
  };
  typography: {
    fontFamilyBody: string;
    fontFamilyHeading: string;
    fontSizeBase: string;
    lineHeightBase: string;
    fontWeightLight: string;
    fontWeightNormal: string;
    fontWeightMedium: string;
    fontWeightBold: string;
    h1Size: string;
    h2Size: string;
    h3Size: string;
  };
  spacing: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
  borderRadius: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
  shadows: {
    sm: string;
    md: string;
    lg: string;
  }
}

interface DesignTokenEditorProps {
  initialTokens: DesignTokens;
  onTokensChange: (tokens: DesignTokens) => void;
  onResetToDefaults?: () => void; // Optional: For resetting to app-wide defaults
}

// Helper to format camelCase keys to Title Case for labels
const formatKeyToLabel = (key: string): string => {
  const result = key.replace(/([A-Z])/g, ' $1');
  return result.charAt(0).toUpperCase() + result.slice(1);
};

const DesignTokenEditor: React.FC<DesignTokenEditorProps> = ({
  initialTokens,
  onTokensChange,
  onResetToDefaults,
}) => {
  const [currentTokens, setCurrentTokens] = useState<DesignTokens>(initialTokens);

  useEffect(() => {
    console.log('DesignTokenEditor loaded');
  }, []);

  useEffect(() => {
    setCurrentTokens(initialTokens);
  }, [initialTokens]);

  const handleTokenChange = <C extends keyof DesignTokens, K extends keyof DesignTokens[C]>(
    category: C,
    key: K,
    value: DesignTokens[C][K]
  ) => {
    setCurrentTokens(prev => {
      const oldCategory = prev[category] as DesignTokens[C];
      const newCategoryState = {
        ...oldCategory,
        [key]: value,
      };
      return {
        ...prev,
        [category]: newCategoryState,
      };
    });
  };

  const handleSaveChanges = () => {
    onTokensChange(currentTokens);
    // Optionally, add a toast notification for success
  };

  const handleResetToInitial = () => {
    setCurrentTokens(initialTokens);
    // Optionally, add a toast notification
  };
  
  const commonFontWeights = [
    { label: "100 (Thin)", value: "100" },
    { label: "200 (Extra Light)", value: "200" },
    { label: "300 (Light)", value: "300" },
    { label: "400 (Normal)", value: "400" },
    { label: "500 (Medium)", value: "500" },
    { label: "600 (Semi Bold)", value: "600" },
    { label: "700 (Bold)", value: "700" },
    { label: "800 (Extra Bold)", value: "800" },
    { label: "900 (Black)", value: "900" },
  ];

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Design Token Editor</CardTitle>
        <CardDescription>
          Modify the global styles for your application. Changes here will affect the overall look and feel.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="colors" className="w-full">
          <TabsList className="grid w-full grid-cols-3 md:grid-cols-5 mb-4">
            <TabsTrigger value="colors">Colors</TabsTrigger>
            <TabsTrigger value="typography">Typography</TabsTrigger>
            <TabsTrigger value="spacing">Sizing</TabsTrigger>
            <TabsTrigger value="borderRadius">Radius</TabsTrigger>
            <TabsTrigger value="shadows">Shadows</TabsTrigger>
          </TabsList>

          <ScrollArea className="h-[400px] md:h-[500px] p-1"> {/* Added padding to ScrollArea for content visibility */}
            <TabsContent value="colors" className="p-0.5"> {/* Added padding to TabsContent for content visibility */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-4">
                {Object.entries(currentTokens.colors).map(([key, value]) => (
                  <div key={`color-${key}`} className="space-y-1.5">
                    <Label htmlFor={`color-text-${key}`}>{formatKeyToLabel(key)}</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        id={`color-picker-${key}`}
                        type="color"
                        // Ensure value is a valid hex for type="color" input
                        value={String(value).match(/^#[0-9a-fA-F]{6}$/) ? String(value) : '#000000'}
                        onChange={(e) => handleTokenChange('colors', key as keyof DesignTokens['colors'], e.target.value)}
                        className="p-1 h-10 w-10 flex-shrink-0"
                        aria-label={`${formatKeyToLabel(key)} color picker`}
                      />
                      <Input
                        id={`color-text-${key}`}
                        type="text"
                        value={String(value)}
                        onChange={(e) => handleTokenChange('colors', key as keyof DesignTokens['colors'], e.target.value)}
                        placeholder="#RRGGBB or var(--custom)"
                        className="flex-grow"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="typography" className="p-0.5">
              <div className="space-y-6">
                {(Object.keys(currentTokens.typography) as Array<keyof DesignTokens['typography']>).map((key) => (
                  <div key={`typography-${key}`} className="space-y-1.5">
                    <Label htmlFor={`typography-${key}`}>{formatKeyToLabel(key)}</Label>
                    {key.toLowerCase().includes('fontweight') ? (
                      <Select
                        value={String(currentTokens.typography[key])}
                        onValueChange={(newValue) => handleTokenChange('typography', key, newValue)}
                      >
                        <SelectTrigger id={`typography-${key}`}>
                          <SelectValue placeholder={`Select ${formatKeyToLabel(key)}`} />
                        </SelectTrigger>
                        <SelectContent>
                          {commonFontWeights.map(fw => (
                            <SelectItem key={fw.value} value={fw.value}>{fw.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      <Input
                        id={`typography-${key}`}
                        type="text"
                        value={String(currentTokens.typography[key])}
                        onChange={(e) => handleTokenChange('typography', key, e.target.value)}
                        placeholder={key.toLowerCase().includes('family') ? 'e.g., Inter, sans-serif' : 'e.g., 16px or 1.5'}
                      />
                    )}
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="spacing" className="p-0.5">
               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-4">
                {(Object.keys(currentTokens.spacing) as Array<keyof DesignTokens['spacing']>).map((key) => (
                  <div key={`spacing-${key}`} className="space-y-1.5">
                    <Label htmlFor={`spacing-${key}`}>{formatKeyToLabel(key)} ({key.toUpperCase()})</Label>
                    <Input
                      id={`spacing-${key}`}
                      type="text"
                      value={String(currentTokens.spacing[key])}
                      onChange={(e) => handleTokenChange('spacing', key, e.target.value)}
                      placeholder="e.g., 8px or 0.5rem"
                    />
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="borderRadius" className="p-0.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-4">
                {(Object.keys(currentTokens.borderRadius) as Array<keyof DesignTokens['borderRadius']>).map((key) => (
                  <div key={`borderRadius-${key}`} className="space-y-1.5">
                    <Label htmlFor={`borderRadius-${key}`}>{formatKeyToLabel(key)}</Label>
                    <Input
                      id={`borderRadius-${key}`}
                      type="text"
                      value={String(currentTokens.borderRadius[key])}
                      onChange={(e) => handleTokenChange('borderRadius', key, e.target.value)}
                      placeholder="e.g., 0.25rem or 4px"
                    />
                  </div>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="shadows" className="p-0.5">
              <div className="space-y-6">
                {(Object.keys(currentTokens.shadows) as Array<keyof DesignTokens['shadows']>).map((key) => (
                  <div key={`shadow-${key}`} className="space-y-1.5">
                    <Label htmlFor={`shadow-${key}`}>{formatKeyToLabel(key)}</Label>
                    <Input
                      id={`shadow-${key}`}
                      type="text"
                      value={String(currentTokens.shadows[key])}
                      onChange={(e) => handleTokenChange('shadows', key, e.target.value)}
                      placeholder="e.g., 0 1px 3px rgba(0,0,0,0.1)"
                      className="font-mono text-sm"
                    />
                  </div>
                ))}
              </div>
            </TabsContent>
          </ScrollArea>
        </Tabs>
      </CardContent>
      <CardFooter className="flex flex-col sm:flex-row justify-end gap-2 pt-6">
        {onResetToDefaults && (
          <Button variant="ghost" onClick={onResetToDefaults} className="w-full sm:w-auto">
            Reset to App Defaults
          </Button>
        )}
        <Button variant="outline" onClick={handleResetToInitial} className="w-full sm:w-auto">
          Reset Changes
        </Button>
        <Button onClick={handleSaveChanges} className="w-full sm:w-auto">
          Save Changes
        </Button>
      </CardFooter>
    </Card>
  );
};

export default DesignTokenEditor;