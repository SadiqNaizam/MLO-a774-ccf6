import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';

// Custom Components
import FileExplorerTree, { FileSystemNode } from '@/components/FileExplorerTree';
import CodeEditorInstance from '@/components/CodeEditorInstance';
import LivePreviewWindow from '@/components/LivePreviewWindow';
import LogStreamViewer, { LogEntry, LogLevel } from '@/components/LogStreamViewer';
import ArtifactDisplayCard from '@/components/ArtifactDisplayCard';
import AIChatInterface, { AIChatMessage } from '@/components/AIChatInterface';

// Shadcn/ui Components
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/components/ui/use-toast';
import { PackageExport, LayoutDashboard, MessageSquare, FileText, Eye, Terminal, FolderTree } from 'lucide-react';

// Placeholder Data
const initialFileTree: FileSystemNode[] = [
  {
    id: 'src',
    name: 'src',
    type: 'folder',
    path: 'src',
    children: [
      {
        id: 'src/App.tsx',
        name: 'App.tsx',
        type: 'file',
        path: 'src/App.tsx',
      },
      {
        id: 'src/components',
        name: 'components',
        type: 'folder',
        path: 'src/components',
        children: [
          { id: 'src/components/Button.tsx', name: 'Button.tsx', type: 'file', path: 'src/components/Button.tsx' },
        ],
      },
      {
        id: 'src/pages',
        name: 'pages',
        type: 'folder',
        path: 'src/pages',
        children: [
          { id: 'src/pages/HomePage.tsx', name: 'HomePage.tsx', type: 'file', path: 'src/pages/HomePage.tsx' },
        ],
      },
    ],
  },
  {
    id: 'public',
    name: 'public',
    type: 'folder',
    path: 'public',
    children: [
      { id: 'public/index.html', name: 'index.html', type: 'file', path: 'public/index.html' },
    ],
  },
  { id: 'package.json', name: 'package.json', type: 'file', path: 'package.json' },
];

const sampleFileContents: Record<string, string> = {
  'src/App.tsx': `import React from 'react';\n\nfunction App() {\n  return <h1>Hello, World!</h1>;\n}\n\nexport default App;`,
  'src/components/Button.tsx': `import React from 'react';\n\nconst Button = () => <button>Click Me</button>;\nexport default Button;`,
  'src/pages/HomePage.tsx': `import React from 'react';\n\nconst HomePage = () => <div>Welcome Home</div>;\nexport default HomePage;`,
  'public/index.html': `<!DOCTYPE html>\n<html>\n<head><title>My App</title></head>\n<body><div id="root"></div></body>\n</html>`,
  'package.json': `{
  "name": "my-app",
  "version": "0.1.0",
  "private": true
}`,
};

const MainDevelopmentEnvironmentPage = () => {
  const [selectedFilePath, setSelectedFilePath] = useState<string | null>('src/App.tsx');
  const [selectedFileContent, setSelectedFileContent] = useState<string>(sampleFileContents['src/App.tsx'] || '// Select a file to see its content');
  const [logs, setLogs] = useState<LogEntry[]>([
    { id: '1', level: 'info', message: 'CodeWindow IDE initialized.', timestamp: new Date() },
    { id: '2', level: 'system', message: 'Connected to development server.', timestamp: new Date() },
  ]);
  const [chatMessages, setChatMessages] = useState<AIChatMessage[]>([
    { id: 'chat1', sender: 'ai', text: 'Hello! How can I help you design or code today?', timestamp: new Date() },
  ]);
  const [isPreviewActive, setIsPreviewActive] = useState<boolean>(false);
  const [livePreviewSrc, setLivePreviewSrc] = useState<string | null>(null);

  const { toast } = useToast();

  useEffect(() => {
    console.log('MainDevelopmentEnvironmentPage loaded');
    // Initial log
    addLog('MainDevelopmentEnvironmentPage successfully loaded and rendered.', 'info');
  }, []);

  const addLog = (message: string, level: LogLevel) => {
    setLogs(prevLogs => [...prevLogs, { id: String(Date.now()), message, level, timestamp: new Date() }]);
  };

  const handleSelectFile = (path: string, node: FileSystemNode) => {
    if (node.type === 'file') {
      setSelectedFilePath(path);
      setSelectedFileContent(sampleFileContents[path] || `// Content for ${path} not found.`);
      addLog(`File selected: ${path}`, 'info');
      // For demo, if an html file is selected, try to "preview" it.
      if (path.endsWith('.html')) {
        setLivePreviewSrc(`/api/preview-file?path=${encodeURIComponent(path)}`); // Placeholder actual preview logic
        addLog(`Attempting to preview ${path}. In a real app, this would load the file content into the iframe.`, 'system');
        setIsPreviewActive(true); // Switch to preview tab or enable preview
      } else {
        setLivePreviewSrc(null); // Clear preview for non-html files for this simple demo
        setIsPreviewActive(false);
      }
    }
  };

  const handleCodeChange = (newCode: string) => {
    setSelectedFileContent(newCode);
    if (selectedFilePath) {
      // Here you might add logic to save the file or mark it as dirty
      // For now, just update the in-memory store for this demo
      sampleFileContents[selectedFilePath] = newCode;
      addLog(`Code updated for: ${selectedFilePath}`, 'debug');
    }
  };

  const handleSendMessage = useCallback(async (text: string, imageFile?: File) => {
    const userMessage: AIChatMessage = {
      id: `msg-${Date.now()}`,
      text,
      sender: 'user',
      timestamp: new Date(),
      imageUrl: imageFile ? URL.createObjectURL(imageFile) : undefined,
    };
    setChatMessages(prev => [...prev, userMessage]);
    addLog(`User sent to AI: "${text}" ${imageFile ? `with image ${imageFile.name}` : ''}`, 'info');

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: AIChatMessage = {
        id: `msg-${Date.now() + 1}`,
        text: `AI received: "${text}". Processing your request... (Simulated)`,
        sender: 'ai',
        timestamp: new Date(),
      };
      setChatMessages(prev => [...prev, aiResponse]);
      addLog(`AI responded to: "${text}"`, 'info');
      if (imageFile && userMessage.imageUrl) { // Revoke object URL if it was created
         URL.revokeObjectURL(userMessage.imageUrl);
      }
    }, 1500);
  }, []);
  
  const handleExportProject = () => {
    toast({
      title: "Project Export",
      description: "Navigating to project export options...",
    });
    addLog('User initiated project export.', 'system');
    // Navigation will be handled by the Link component
  };

  const handleGoToUIDesignStudio = () => {
    toast({
      title: "UI Design Studio",
      description: "Opening the UI Design Studio...",
    });
    addLog('User navigating to UI Design Studio.', 'system');
    // Navigation will be handled by the Link component
  };

  return (
    <div className="flex flex-col h-screen bg-background text-foreground overflow-hidden">
      {/* AppHeader Placeholder */}
      <header className="h-14 bg-card border-b flex items-center px-4 shrink-0">
        <img src="https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg" alt="CodeWindow Logo" className="h-8 w-8 mr-2" />
        <h1 className="text-xl font-semibold">CodeWindow IDE</h1>
      </header>

      {/* CodeWindowSpecificHeader Placeholder */}
      <nav className="h-12 bg-muted/50 border-b flex items-center px-4 space-x-2 shrink-0">
        <Link to="/u-i-design-studio">
          <Button variant="outline" size="sm" onClick={handleGoToUIDesignStudio}>
            <LayoutDashboard className="mr-2 h-4 w-4" /> UI Design Studio
          </Button>
        </Link>
        <Link to="/export-project-modal">
          <Button variant="outline" size="sm" onClick={handleExportProject}>
            <PackageExport className="mr-2 h-4 w-4" /> Export Project
          </Button>
        </Link>
        <Button variant="outline" size="sm" onClick={() => {
            addLog('Simulating build...', 'system');
            toast({ title: "Build Started", description: "Your project build is in progress." });
            setTimeout(() => {
                 addLog('Build successful. Preview might be available if applicable.', 'info');
                 toast({ title: "Build Successful", description: "Project built successfully." });
                 // Example: set livePreviewSrc to the build output
                 // setLivePreviewSrc('/built-project/index.html'); 
                 // setIsPreviewActive(true);
            }, 3000);
        }}>
            Build Project
        </Button>
      </nav>

      {/* Main Content Area (SplitScreenView) */}
      <main className="flex-grow min-h-0"> {/* min-h-0 is crucial for flex children in column layout */}
        <ResizablePanelGroup direction="horizontal" className="h-full">
          {/* CodeWindowLeftSidebar */}
          <ResizablePanel defaultSize={20} minSize={15} maxSize={30} className="flex flex-col">
             <div className="p-2 border-b bg-muted/30">
                <h2 className="text-sm font-semibold flex items-center"><FolderTree className="w-4 h-4 mr-2" />Project Files</h2>
            </div>
            <ScrollArea className="flex-grow p-2">
              <FileExplorerTree
                nodes={initialFileTree}
                onSelectFile={handleSelectFile}
                selectedFilePath={selectedFilePath}
                initiallyExpandedPaths={['src']}
              />
            </ScrollArea>
          </ResizablePanel>
          <ResizableHandle withHandle />
          {/* Center Panel */}
          <ResizablePanel defaultSize={50} minSize={30} className="flex flex-col">
            <Tabs defaultValue="editor" className="flex flex-col h-full">
              <TabsList className="shrink-0 border-b rounded-none bg-muted/30 px-2 py-1.5 h-auto">
                <TabsTrigger value="editor" className="text-xs px-3 py-1.5 h-auto"><FileText className="w-4 h-4 mr-1.5" />Editor</TabsTrigger>
                <TabsTrigger value="preview" className="text-xs px-3 py-1.5 h-auto" disabled={!isPreviewActive && !livePreviewSrc}><Eye className="w-4 h-4 mr-1.5" />Preview</TabsTrigger>
                <TabsTrigger value="artifacts" className="text-xs px-3 py-1.5 h-auto"><Terminal className="w-4 h-4 mr-1.5" />Artifacts</TabsTrigger>
              </TabsList>
              <TabsContent value="editor" className="flex-grow p-0 m-0 overflow-hidden">
                <CodeEditorInstance
                  filePath={selectedFilePath || "No file selected"}
                  initialCode={selectedFileContent}
                  onCodeChange={handleCodeChange}
                  language={selectedFilePath?.split('.').pop() || 'plaintext'}
                  className="h-full border-0 rounded-none"
                />
              </TabsContent>
              <TabsContent value="preview" className="flex-grow p-0 m-0 overflow-hidden">
                <LivePreviewWindow
                  src={livePreviewSrc} // Example: "http://localhost:5173" if previewing self, or generated URL
                  title="Live Application Preview"
                  onError={(errMsg) => addLog(`Preview Error: ${errMsg}`, 'error')}
                  onLoad={() => addLog('Preview loaded successfully.', 'info')}
                />
              </TabsContent>
              <TabsContent value="artifacts" className="flex-grow p-2 overflow-hidden">
                <ScrollArea className="h-full">
                    <ArtifactDisplayCard
                    title="Build Output"
                    fileName="console.log"
                    artifactType="text"
                    content={logs.filter(l => l.level === 'system' || l.message.toLowerCase().includes('build')).map(l => `[${l.timestamp.toLocaleTimeString()}] ${l.message}`).join('\\n') || "No build artifacts yet."}
                    className="h-full"
                    />
                </ScrollArea>
              </TabsContent>
            </Tabs>
          </ResizablePanel>
          <ResizableHandle withHandle />
          {/* CodeWindowRightSidebar */}
          <ResizablePanel defaultSize={30} minSize={20} maxSize={40} className="flex flex-col">
            <ResizablePanelGroup direction="vertical" className="h-full">
                <ResizablePanel defaultSize={60} minSize={30} className="flex flex-col">
                    <div className="p-2 border-b bg-muted/30">
                        <h2 className="text-sm font-semibold flex items-center"><MessageSquare className="w-4 h-4 mr-2" />AI Assistant</h2>
                    </div>
                    <AIChatInterface
                        messages={chatMessages}
                        onSendMessage={handleSendMessage}
                        className="flex-grow border-0 rounded-none"
                        aiAvatarSrc="https://cdn-icons-png.flaticon.com/512/8943/8943377.png" // Placeholder AI avatar
                    />
                </ResizablePanel>
                <ResizableHandle withHandle />
                <ResizablePanel defaultSize={40} minSize={20} className="flex flex-col">
                    <LogStreamViewer
                        logs={logs}
                        title="Console Logs"
                        className="flex-grow p-2"
                        maxHeight="100%" // Fill available space
                    />
                </ResizablePanel>
            </ResizablePanelGroup>
          </ResizablePanel>
        </ResizablePanelGroup>
      </main>

      {/* AppFooter Placeholder */}
      <footer className="h-8 bg-card border-t flex items-center justify-center px-4 text-xs text-muted-foreground shrink-0">
        <p>&copy; {new Date().getFullYear()} CodeWindow AI IDE. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default MainDevelopmentEnvironmentPage;