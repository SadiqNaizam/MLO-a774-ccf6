import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

interface ArtifactDisplayCardProps {
  title?: string; // Main title for the artifact
  fileName?: string; // Optional filename, can be shown as subtitle or part of description
  artifactType: 'markdown' | 'image' | 'list' | 'text' | 'code';
  content: string | string[]; // Content: string for markdown, imageURL, text, code; string[] for list items
  language?: string; // For 'code' type, e.g., 'typescript', 'json', 'css'
  className?: string; // Allow additional classes for the Card component
}

const ArtifactDisplayCard: React.FC<ArtifactDisplayCardProps> = ({
  title,
  fileName,
  artifactType,
  content,
  language,
  className,
}) => {
  console.log(`ArtifactDisplayCard loaded. Type: ${artifactType}, Title: ${title || 'N/A'}, FileName: ${fileName || 'N/A'}`);

  const renderDisplayContent = () => {
    switch (artifactType) {
      case 'markdown':
      case 'text':
        if (typeof content !== 'string') {
          return <div className="flex items-center justify-center h-full text-destructive p-2 rounded-md text-xs bg-destructive/10 border border-destructive/30">Invalid content: Expected a string.</div>;
        }
        return (
          <ScrollArea className="h-full w-full">
            <pre className="text-sm whitespace-pre-wrap break-words p-3 bg-muted/20 rounded-md border">
              {content || (artifactType === 'markdown' ? "Empty markdown content." : "Empty text content.")}
            </pre>
          </ScrollArea>
        );
      case 'code':
        if (typeof content !== 'string') {
          return <div className="flex items-center justify-center h-full text-destructive p-2 rounded-md text-xs bg-destructive/10 border border-destructive/30">Invalid code content: Expected a string.</div>;
        }
        return (
          <ScrollArea className="h-full w-full">
            <pre className={`text-sm whitespace-pre-wrap break-words p-3 rounded-md border bg-muted/30 ${language ? `language-${language}` : ''}`}>
              <code>{content || "Empty code block."}</code>
            </pre>
          </ScrollArea>
        );
      case 'image':
        if (typeof content !== 'string' || !content.trim()) {
          return <div className="flex items-center justify-center h-full text-muted-foreground bg-muted/10 rounded-md border p-4">Invalid or empty image URL.</div>;
        }
        return (
          <div className="w-full h-full flex items-center justify-center bg-muted/10 rounded-md border overflow-hidden">
            <img
              src={content}
              alt={fileName || title || 'Artifact Image'}
              className="object-contain max-w-full max-h-full"
            />
          </div>
        );
      case 'list':
        if (!Array.isArray(content) || !content.every(item => typeof item === 'string')) {
          return <div className="flex items-center justify-center h-full text-destructive p-2 rounded-md text-xs bg-destructive/10 border border-destructive/30">Invalid list content: Expected an array of strings.</div>;
        }
        if (content.length === 0) {
          return <div className="flex items-center justify-center h-full text-muted-foreground bg-muted/10 rounded-md border p-4">Empty list.</div>;
        }
        return (
          <ScrollArea className="h-full w-full">
            <ul className="list-disc space-y-1.5 p-3 pl-7 bg-muted/20 rounded-md border"> {/* Adjusted pl for list items marker */}
              {content.map((item, index) => (
                <li key={index} className="text-sm break-words">{item}</li>
              ))}
            </ul>
          </ScrollArea>
        );
      default:
        // const _exhaustiveCheck: never = artifactType; // For compile-time exhaustive check
        return <div className="flex items-center justify-center h-full text-destructive p-2 rounded-md text-xs bg-destructive/10 border border-destructive/30">Unsupported artifact type: {String(artifactType)}</div>;
    }
  };

  return (
    <Card className={cn("w-full h-full flex flex-col overflow-hidden", className)}>
      {(title || fileName) && (
        <CardHeader className="py-2.5 px-4 border-b shrink-0">
          {title && <CardTitle className="text-base font-semibold line-clamp-1">{title}</CardTitle>}
          {fileName && <CardDescription className="text-xs text-muted-foreground line-clamp-1 pt-0.5">{fileName}</CardDescription>}
        </CardHeader>
      )}
      <CardContent className="flex-grow p-3 min-h-0"> {/* min-h-0 for flex child proper sizing */}
        {renderDisplayContent()}
      </CardContent>
    </Card>
  );
};

export default ArtifactDisplayCard;