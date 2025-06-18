import React from 'react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { ZoomIn, ZoomOut, Maximize2, RefreshCcw, Smartphone, Monitor } from 'lucide-react';

interface CanvasToolbarProps {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onFitToView: () => void;
  onResetView: () => void;
  onSetViewMode: (mode: 'mobile' | 'desktop') => void;
  currentZoomLevel?: number; // e.g., 1 for 100%
  currentViewMode: 'mobile' | 'desktop';
}

const CanvasToolbar: React.FC<CanvasToolbarProps> = ({
  onZoomIn,
  onZoomOut,
  onFitToView,
  onResetView,
  onSetViewMode,
  currentZoomLevel = 1, // Default to 100% if not provided
  currentViewMode,
}) => {
  console.log('CanvasToolbar loaded');

  return (
    <div className="flex items-center justify-between p-2 bg-card border rounded-lg shadow-sm h-14">
      <div className="flex items-center gap-1.5">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" onClick={onZoomIn} aria-label="Zoom In">
              <ZoomIn className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Zoom In</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" onClick={onZoomOut} aria-label="Zoom Out">
              <ZoomOut className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Zoom Out</p>
          </TooltipContent>
        </Tooltip>

        <div className="w-16 text-center text-sm font-medium text-muted-foreground px-2">
          {`${Math.round(currentZoomLevel * 100)}%`}
        </div>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" onClick={onFitToView} aria-label="Fit to View">
              <Maximize2 className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Fit to View</p>
          </TooltipContent>
        </Tooltip>
        
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" onClick={onResetView} aria-label="Reset View">
              <RefreshCcw className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Reset View</p>
          </TooltipContent>
        </Tooltip>
      </div>

      <div className="flex items-center">
         <ToggleGroup
          type="single"
          value={currentViewMode}
          onValueChange={(value) => {
            if (value === 'mobile' || value === 'desktop') {
              onSetViewMode(value as 'mobile' | 'desktop');
            }
          }}
          aria-label="View Mode"
        >
          <Tooltip>
            <TooltipTrigger asChild>
              <ToggleGroupItem value="mobile" aria-label="Mobile View">
                <Smartphone className="h-4 w-4" />
              </ToggleGroupItem>
            </TooltipTrigger>
            <TooltipContent>
              <p>Mobile View</p>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <ToggleGroupItem value="desktop" aria-label="Desktop View">
                <Monitor className="h-4 w-4" />
              </ToggleGroupItem>
            </TooltipTrigger>
            <TooltipContent>
              <p>Desktop View</p>
            </TooltipContent>
          </Tooltip>
        </ToggleGroup>
      </div>
    </div>
  );
};

export default CanvasToolbar;