import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X, Smartphone, Monitor } from 'lucide-react';

import MobileDeviceFrame from '@/components/MobileDeviceFrame';
import UIDesignNodeElement from '@/components/UIDesignNodeElement'; // As per layout_info
import LivePreviewWindow from '@/components/LivePreviewWindow';

// Mock data for the node being previewed.
// In a real app, this might come from route state, query params, or a global store.
const mockNodeForPreview = {
  id: 'node-fs-preview-001',
  title: 'Interactive Dashboard Mockup',
  // A more relevant placeholder image for a dashboard
  previewImageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8ZGFzaGJvYXJkfGVufDB8fDB8fHww&auto=format&fit=crop&w=400&q=60',
  // A generic placeholder for live preview content
  liveUrl: 'https://codesandbox.io/s/react',
};

const FullScreenPreviewModalPage: React.FC = () => {
  console.log('FullScreenPreviewModalPage loaded');
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(true);
  const [viewMode, setViewMode] = useState<'desktop' | 'mobile'>('desktop');

  useEffect(() => {
    if (!isOpen) {
      // Short delay to allow dialog close animation before navigating
      const timer = setTimeout(() => navigate(-1), 200); 
      return () => clearTimeout(timer);
    }
  }, [isOpen, navigate]);

  // Placeholder handlers for UIDesignNodeElement's props, as it's not meant to be interactive here.
  const handleNodeSelect = (id: string) => console.log(`Node ${id} selected (in modal preview context - no-op)`);
  const handleNodeDoubleClick = (id: string) => console.log(`Node ${id} double-clicked (in modal preview context - no-op)`);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-none w-[calc(100vw-4rem)] h-[calc(100vh-4rem)] p-0 flex flex-col shadow-2xl rounded-lg bg-card text-card-foreground sm:rounded-xl">
        <DialogHeader className="p-3 border-b flex flex-row justify-between items-center space-x-4 shrink-0">
          <DialogTitle className="truncate text-base sm:text-lg font-semibold">
            Preview: {mockNodeForPreview.title}
          </DialogTitle>
          <div className="flex items-center space-x-1.5">
            <Button 
              variant={viewMode === 'desktop' ? 'secondary' : 'ghost'} 
              size="sm" 
              onClick={() => setViewMode('desktop')} 
              aria-label="Desktop view"
              className="h-8 px-2 md:px-3"
            >
              <Monitor className="h-4 w-4 md:mr-1.5" /> <span className="hidden md:inline">Desktop</span>
            </Button>
            <Button 
              variant={viewMode === 'mobile' ? 'secondary' : 'ghost'} 
              size="sm" 
              onClick={() => setViewMode('mobile')} 
              aria-label="Mobile view"
              className="h-8 px-2 md:px-3"
            >
              <Smartphone className="h-4 w-4 md:mr-1.5" /> <span className="hidden md:inline">Mobile</span>
            </Button>
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="ml-2 h-8 w-8" aria-label="Close preview">
              <X className="h-5 w-5" />
            </Button>
          </div>
        </DialogHeader>

        <div className="flex-grow bg-muted/10 p-1.5 sm:p-3 flex items-center justify-center overflow-auto relative">
          <div key={viewMode + mockNodeForPreview.liveUrl} className="w-full h-full flex items-center justify-center">
            {viewMode === 'mobile' ? (
              <MobileDeviceFrame className="my-auto transform scale-[0.6] xs:scale-[0.7] sm:scale-75 md:scale-90 lg:scale-100 transition-transform duration-300 ease-in-out max-w-full max-h-full">
                <LivePreviewWindow
                  src={mockNodeForPreview.liveUrl}
                  title={`Mobile Preview - ${mockNodeForPreview.title}`}
                />
              </MobileDeviceFrame>
            ) : ( // Desktop view
              <div className="w-full h-full bg-background shadow-inner rounded-md overflow-hidden border border-border">
                <LivePreviewWindow
                  src={mockNodeForPreview.liveUrl}
                  title={`Desktop Preview - ${mockNodeForPreview.title}`}
                  className="rounded-md" 
                />
              </div>
            )}
          </div>
        </div>
        
        <DialogFooter className="p-1.5 sm:p-2 border-t shrink-0 bg-card flex justify-between items-center">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="font-medium hidden sm:inline">Source Node:</span>
            {/* Using UIDesignNodeElement here. It's a card, its default width is w-64 (256px).
                We wrap it to constrain its size for display in the footer. Scaling might be needed for better visuals. */}
            <div className="w-32 h-auto sm:w-40 transform scale-[0.85] sm:scale-100 origin-bottom-left"> 
              <UIDesignNodeElement
                id={mockNodeForPreview.id}
                title={mockNodeForPreview.title.length > 20 ? mockNodeForPreview.title.substring(0, 18) + '...' : mockNodeForPreview.title}
                previewImageUrl={mockNodeForPreview.previewImageUrl}
                isSelected={false}
                isLoading={false}
                onSelect={handleNodeSelect}
                onDoubleClick={handleNodeDoubleClick}
                className="!shadow-sm !border-input !w-full" 
              />
            </div>
          </div>
          <span className="text-[10px] text-muted-foreground/80">Node ID: {mockNodeForPreview.id}</span>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default FullScreenPreviewModalPage;