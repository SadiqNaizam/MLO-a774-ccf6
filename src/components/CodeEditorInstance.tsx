import React, { useState, useEffect, ChangeEvent } from 'react';
import { Card, CardContent, CardHeader, CardDescription } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";

interface CodeEditorInstanceProps {
  initialCode?: string;
  language?: string; // e.g., 'typescript', 'javascript', 'json'
  onCodeChange?: (newCode: string) => void;
  readOnly?: boolean;
  filePath?: string; // To display the current file path, e.g., "src/components/MyComponent.tsx"
  className?: string; // Allow parent to pass custom classes for sizing/spacing
}

const CodeEditorInstance: React.FC<CodeEditorInstanceProps> = ({
  initialCode = '',
  language = 'plaintext',
  onCodeChange,
  readOnly = false,
  filePath,
  className,
}) => {
  const [code, setCode] = useState<string>(initialCode);

  useEffect(() => {
    console.log('CodeEditorInstance loaded.');
    // In a real implementation, this is where a code editor library like Monaco Editor
    // would be initialized and configured.
    // Example pseudo-code for Monaco Editor integration:
    // if (editorRef.current) {
    //   const editor = monaco.editor.create(editorRef.current, {
    //     value: code,
    //     language: language,
    //     theme: 'vs-dark', // Or dynamically set based on app theme
    //     readOnly: readOnly,
    //     automaticLayout: true, // Adjusts editor layout on container resize
    //     // ... other Monaco options for syntax highlighting, autocompletion, etc.
    //   });
    //   editor.onDidChangeModelContent(() => {
    //     const currentCode = editor.getValue();
    //     setCode(currentCode); // Update local state if needed
    //     if (onCodeChange) {
    //       onCodeChange(currentCode);
    //     }
    //   });
    //   return () => editor.dispose(); // Cleanup on unmount
    // }
  }, []); // Note: Real Monaco integration would need a ref and careful effect management.

  useEffect(() => {
    // Sync internal state if initialCode prop changes externally
    // This is important if the file content is updated from an external source (e.g., file switch)
    if (initialCode !== code) {
      setCode(initialCode);
    }
  }, [initialCode]);

  const handleTextareaChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    const newCode = event.target.value;
    setCode(newCode);
    if (onCodeChange) {
      onCodeChange(newCode);
    }
  };

  return (
    <Card className={`flex flex-col h-full shadow-sm border ${className || ''}`}>
      {filePath && (
        <CardHeader className="p-2 border-b bg-muted/30">
          <CardDescription className="text-xs text-muted-foreground truncate px-2 py-1">
            {filePath} <span className="opacity-80">({language})</span>
          </CardDescription>
        </CardHeader>
      )}
      <CardContent className="p-0 flex-grow relative">
        {/* This ScrollArea and Textarea serve as a placeholder for a real code editor. */}
        {/* A real editor (like Monaco) would provide its own scrolling, syntax highlighting, etc. */}
        <ScrollArea className="h-full w-full">
          <Textarea
            value={code}
            onChange={handleTextareaChange}
            readOnly={readOnly}
            placeholder={
              `// Language: ${language} ${readOnly ? "(read-only)" : ""}\n` +
              `// Advanced features like syntax highlighting and code completion\n` +
              `// would be provided by an integrated editor (e.g., Monaco Editor).\n\n` +
              `// Start typing your code here...`
            }
            className="w-full h-full p-4 font-mono text-sm border-0 rounded-none resize-none focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent"
            aria-label={filePath ? `Code editor for ${filePath}` : "Code editor"}
          />
        </ScrollArea>
      </CardContent>
      {/* 
        A real IDE-like editor might have a CardFooter for:
        - Line and column numbers
        - Language mode selector
        - Indentation settings (spaces/tabs)
        - Other status indicators or quick actions
      */}
    </Card>
  );
};

export default CodeEditorInstance;