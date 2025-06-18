import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

// Custom Components
import AIChatInterface, { AIChatMessage } from '@/components/AIChatInterface';
import CanvasToolbar from '@/components/CanvasToolbar';
import UIDesignInteractiveCanvas, { NodeData } from '@/components/UIDesignInteractiveCanvas';
// UIDesignNodeElement is used internally by UIDesignInteractiveCanvas but can be imported if needed directly.
// MobileDeviceFrame is listed but primarily for modals; imported in case of future direct use.
import MobileDeviceFrame from '@/components/MobileDeviceFrame'; 

// Shadcn UI Components
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

// Placeholder local components for page structure
const PageAppHeader: React.FC = () => (
  <header className="bg-slate-800 dark:bg-gray-900 text-white p-3 text-sm shadow-md shrink-0">
    Code Window - Global Header Placeholder
  </header>
);

interface PageCodeWindowSpecificHeaderProps {
  onExportClick: () => void;
}
const PageCodeWindowSpecificHeader: React.FC<PageCodeWindowSpecificHeaderProps> = ({ onExportClick }) => (
  <header className="bg-slate-700 dark:bg-gray-800 text-white p-3 flex justify-between items-center shadow shrink-0">
    <h1 className="text-lg font-semibold">UI Design Studio</h1>
    <Button onClick={onExportClick} variant="secondary" size="sm">Export Project</Button>
  </header>
);

interface PageSplitScreenViewProps {
  leftPanel: React.ReactNode;
  mainContent: React.ReactNode;
  rightPanel: React.ReactNode;
}
const PageSplitScreenView: React.FC<PageSplitScreenViewProps> = ({ leftPanel, mainContent, rightPanel }) => (
  <div className="flex flex-1 overflow-hidden"> {/* Ensures this container fills height and handles overflow */}
    <aside className="w-60 md:w-72 bg-slate-100 dark:bg-gray-800/30 p-0 border-r dark:border-gray-700 shrink-0">
      <ScrollArea className="h-full">
        <div className="p-4">{leftPanel}</div>
      </ScrollArea>
    </aside>
    <main className="flex-1 flex flex-col overflow-hidden bg-slate-50 dark:bg-gray-900/50">
      {mainContent}
    </main>
    <aside className="w-80 md:w-96 bg-slate-100 dark:bg-gray-800/30 p-0 border-l dark:border-gray-700 shrink-0">
      <ScrollArea className="h-full">
         {/* AIChatInterface typically manages its own scroll, so direct children or minimal padding */}
        {rightPanel}
      </ScrollArea>
    </aside>
  </div>
);

const PageCodeWindowLeftSidebar: React.FC<{ children?: React.ReactNode }> = ({ children }) => (
  <div className="space-y-4">
    <h2 className="text-md font-semibold text-slate-700 dark:text-slate-300">Layers Panel</h2>
    <p className="text-xs text-slate-500 dark:text-slate-400">Placeholder for UI layers or component tree.</p>
    {children}
  </div>
);

const PageCodeWindowRightSidebar: React.FC<{ children?: React.ReactNode }> = ({ children }) => (
  // The AIChatInterface will fill this. No extra padding needed here if chat handles its own.
  <div className="h-full flex flex-col"> 
    {children}
  </div>
);

const PageAppFooter: React.FC = () => (
  <footer className="bg-slate-800 dark:bg-gray-900 text-white p-2 text-xs text-center shadow-md shrink-0">
    Code Window Footer © {new Date().getFullYear()}
  </footer>
);

// Main Page Component
const UIDesignStudioPage: React.FC = () => {
  const navigate = useNavigate();

  // Canvas States
  const [canvasNodes, setCanvasNodes] = useState<NodeData[]>([
    { id: 'node1', name: 'Landing Page Wireframe', x: 50, y: 50, width: 320, height: 480, previewImageUrl: 'https://via.placeholder.com/320x480/EEE/AAA?text=Landing+Page' },
    { id: 'node2', name: 'Dashboard Mockup', x: 420, y: 80, width: 400, height: 300, previewImageUrl: 'https://via.placeholder.com/400x300/DDD/999?text=Dashboard' },
    { id: 'node3', name: 'Settings Screen', x: 80, y: 580, width: 320, height: 200, previewImageUrl: 'https://via.placeholder.com/320x200/CCC/888?text=Settings' },
  ]);
  const [selectedNodeIds, setSelectedNodeIds] = useState<string[]>([]);
  
  // Toolbar and Canvas Interaction States
  const [canvasControls, setCanvasControls] = useState<{
    zoom: ((zoomFn: (currentZoom: number) => number) => void) | null;
    pan: ((panFn: (currentPan: { x: number; y: number }) => { x: number; y: number }) => void) | null;
  }>({ zoom: null, pan: null });
  const [currentZoomForToolbar, setCurrentZoomForToolbar] = useState(1);
  const [currentViewMode, setCurrentViewMode] = useState<'desktop' | 'mobile'>('desktop');

  // AIChatInterface States
  const [chatMessages, setChatMessages] = useState<AIChatMessage[]>([
    { id: 'ai-intro', text: 'Hello! How can I help you design today? Describe the UI you want to create.', sender: 'ai', timestamp: new Date() }
  ]);
  const [isChatSending, setIsChatSending] = useState(false);

  useEffect(() => {
    console.log('UIDesignStudioPage loaded');
    toast.success('UI Design Studio Ready!');
  }, []);

  // Canvas Interaction Handlers
  const handleSelectNode = useCallback((nodeId: string, isMultiSelect: boolean) => {
    setSelectedNodeIds(prevSelectedIds => {
      if (isMultiSelect) {
        return prevSelectedIds.includes(nodeId)
          ? prevSelectedIds.filter(id => id !== nodeId)
          : [...prevSelectedIds, nodeId];
      }
      return [nodeId];
    });
  }, []);

  const handleDeselectAllNodes = useCallback(() => {
    setSelectedNodeIds([]);
  }, []);

  const handleUpdateNodePosition = useCallback((nodeId: string, newPosition: { x: number; y: number }) => {
    setCanvasNodes(prevNodes =>
      prevNodes.map(node =>
        node.id === nodeId ? { ...node, x: newPosition.x, y: newPosition.y } : node
      )
    );
  }, []);

  const handleNodeDoubleClick = useCallback((nodeId: string) => {
    console.log(`Node ${nodeId} double clicked. Navigating to full screen preview.`);
    // Store selected node ID in state/context if modal needs it, then navigate.
    // For now, just navigate. Actual data passing to modal is an advanced topic.
    navigate('/full-screen-preview-modal'); 
    toast.info(`Previewing node: ${nodeId}`);
  }, [navigate]);

  // Toolbar Action Handlers
  const ZOOM_STEP = 1.2;
  const handleZoomIn = useCallback(() => {
    if (canvasControls.zoom) {
      canvasControls.zoom(prevZoom => {
        const newZoom = prevZoom * ZOOM_STEP;
        setCurrentZoomForToolbar(newZoom);
        return newZoom;
      });
    }
  }, [canvasControls.zoom]);

  const handleZoomOut = useCallback(() => {
    if (canvasControls.zoom) {
      canvasControls.zoom(prevZoom => {
        const newZoom = prevZoom / ZOOM_STEP;
        setCurrentZoomForToolbar(newZoom);
        return newZoom;
      });
    }
  }, [canvasControls.zoom]);
  
  const handleFitToView = useCallback(() => {
    // Complex: Requires calculating bounding box of all nodes and then applying zoom/pan.
    // UIDesignInteractiveCanvas doesn't expose node bounds or a direct fitToView method.
    // For now, this will be a placeholder or reset.
    if (canvasControls.zoom && canvasControls.pan) {
        console.log("Fit to View clicked - Placeholder. Resetting view for now.");
        canvasControls.zoom(() => 1);
        canvasControls.pan(() => ({ x: 50, y: 50 })); // Pan to bring some content into view
        setCurrentZoomForToolbar(1);
        toast.info("View reset (Fit to View placeholder)");
    }
  }, [canvasControls.zoom, canvasControls.pan]);

  const handleResetView = useCallback(() => {
    if (canvasControls.zoom && canvasControls.pan) {
      canvasControls.zoom(() => 1);
      canvasControls.pan(() => ({ x: 0, y: 0 }));
      setCurrentZoomForToolbar(1);
      toast.info("View Reset");
    }
  }, [canvasControls.zoom, canvasControls.pan]);

  const handleSetViewMode = useCallback((mode: 'mobile' | 'desktop') => {
    setCurrentViewMode(mode);
    toast.info(`View mode changed to: ${mode}`);
    // Actual visual change on canvas would require UIDesignInteractiveCanvas to support this
  }, []);
  
  // AIChatInterface Handler
  const handleSendMessage = useCallback(async (text: string, imageFile?: File) => {
    if (!text.trim() && !imageFile) return;
    setIsChatSending(true);
    const userMessage: AIChatMessage = {
      id: `user-${Date.now()}`,
      text,
      sender: 'user',
      timestamp: new Date(),
      imageUrl: imageFile ? URL.createObjectURL(imageFile) : undefined
    };
    setChatMessages(prev => [...prev, userMessage]);

    // Simulate AI response
    await new Promise(resolve => setTimeout(resolve, 1500));
    const aiResponse: AIChatMessage = {
      id: `ai-${Date.now()}`,
      text: `Received: "${text}". ${imageFile ? `Image: ${imageFile.name}. ` : ''}I'm processing your request to design the UI...`,
      sender: 'ai',
      timestamp: new Date()
    };
    setChatMessages(prev => [...prev, aiResponse]);
    setIsChatSending(false);
    if (userMessage.imageUrl && imageFile) { // Clean up object URL after AI "processes" it
        URL.revokeObjectURL(userMessage.imageUrl);
    }
    toast.success("AI response received!");
  }, []);

  // Navigation Handler
  const handleExportProject = () => {
    navigate('/export-project-modal');
  };

  return (
    <div className="flex flex-col h-screen bg-slate-200 dark:bg-gray-950 text-slate-900 dark:text-slate-50">
      <PageAppHeader />
      <PageCodeWindowSpecificHeader onExportClick={handleExportProject} />
      <PageSplitScreenView
        leftPanel={
          <PageCodeWindowLeftSidebar>
            <p className="text-xs mt-4">Selected Nodes: {selectedNodeIds.join(', ') || 'None'}</p>
          </PageCodeWindowLeftSidebar>
        }
        mainContent={
          <>
            <CanvasToolbar
              onZoomIn={handleZoomIn}
              onZoomOut={handleZoomOut}
              onFitToView={handleFitToView}
              onResetView={handleResetView}
              onSetViewMode={handleSetViewMode}
              currentZoomLevel={currentZoomForToolbar}
              currentViewMode={currentViewMode}
            />
            <div className="flex-1 relative bg-white dark:bg-gray-800/50"> {/* Canvas container */}
              <UIDesignInteractiveCanvas
                nodes={canvasNodes}
                selectedNodeIds={selectedNodeIds}
                onSelectNode={handleSelectNode}
                onDeselectAllNodes={handleDeselectAllNodes}
                onUpdateNodePosition={handleUpdateNodePosition}
                onNodeDoubleClick={handleNodeDoubleClick}
                className="w-full h-full"
                // These props allow UIDesignInteractiveCanvas to provide its control functions
                setZoom={(zoomFnFromCanvas) => 
                  setCanvasControls(prev => ({ ...prev, zoom: zoomFnFromCanvas }))
                }
                setPan={(panFnFromCanvas) => 
                  setCanvasControls(prev => ({ ...prev, pan: panFnFromCanvas }))
                }
              />
            </div>
          </>
        }
        rightPanel={
          <PageCodeWindowRightSidebar>
            <AIChatInterface
              messages={chatMessages}
              onSendMessage={handleSendMessage}
              isSending={isChatSending}
              aiName="DesignAI"
              userName="Developer"
              placeholder="Describe your UI or upload an image..."
              className="h-full" // Ensure AIChatInterface takes full height of its container
            />
          </PageCodeWindowRightSidebar>
        }
      />
      <PageAppFooter />
    </div>
  );
};

export default UIDesignStudioPage;