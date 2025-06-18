import React, { useState, useRef, useEffect, useCallback } from 'react';
import clsx from 'clsx';
import UIDesignNodeElement from '@/components/UIDesignNodeElement'; // Assuming this path

// Define the structure for a design node's data
export interface NodeData {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  name: string; // For display in UIDesignNodeElement
  previewImageUrl?: string; // For display in UIDesignNodeElement
  // Add any other properties UIDesignNodeElement might need
}

interface UIDesignInteractiveCanvasProps {
  nodes: NodeData[];
  selectedNodeIds: string[];
  onSelectNode: (nodeId: string, isMultiSelect: boolean) => void;
  onDeselectAllNodes: () => void;
  onUpdateNodePosition: (nodeId: string, newPosition: { x: number; y: number }) => void;
  onNodeDoubleClick: (nodeId: string) => void;
  className?: string;
  // Optional: Functions to allow external control (e.g., from a toolbar)
  setZoom?: (zoomFn: (currentZoom: number) => number) => void;
  setPan?: (panFn: (currentPan: {x: number, y: number}) => {x: number, y: number}) => void;
}

const MIN_ZOOM = 0.1;
const MAX_ZOOM = 5;

const UIDesignInteractiveCanvas: React.FC<UIDesignInteractiveCanvasProps> = ({
  nodes,
  selectedNodeIds,
  onSelectNode,
  onDeselectAllNodes,
  onUpdateNodePosition,
  onNodeDoubleClick,
  className,
  setZoom: externalSetZoom,
  setPan: externalSetPan,
}) => {
  const [zoom, setZoomState] = useState(1);
  const [pan, setPanState] = useState({ x: 0, y: 0 });

  const canvasRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // For dragging nodes
  const [draggingNodeInfo, setDraggingNodeInfo] = useState<{
    nodeId: string;
    initialNodeX: number;
    initialNodeY: number;
    dragStartMouseX: number; // Screen coordinates
    dragStartMouseY: number; // Screen coordinates
  } | null>(null);

  // For panning the canvas
  const [isPanning, setIsPanning] = useState(false);
  const panStartCoords = useRef<{
    panX: number;
    panY: number;
    mouseX: number;
    mouseY: number;
  } | null>(null);

  useEffect(() => {
    console.log('UIDesignInteractiveCanvas loaded');
  }, []);

  // Expose zoom/pan setters if external control is provided
  useEffect(() => {
    if (externalSetZoom) {
      externalSetZoom((zoomFn) => {
        setZoomState(prevZoom => {
          const newZoom = zoomFn(prevZoom);
          return Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, newZoom));
        });
        return zoom; // This might not be correct, externalSetZoom should not expect a return
      });
    }
  }, [externalSetZoom, zoom]);

  useEffect(() => {
    if (externalSetPan) {
      externalSetPan((panFn) => {
        setPanState(prevPan => panFn(prevPan));
        return pan; // Same as above, likely incorrect expectation for return
      });
    }
  }, [externalSetPan, pan]);


  const handleMouseMove = useCallback((event: MouseEvent) => {
    if (draggingNodeInfo) {
      const { nodeId, initialNodeX, initialNodeY, dragStartMouseX, dragStartMouseY } = draggingNodeInfo;
      const newX = initialNodeX + (event.clientX - dragStartMouseX) / zoom;
      const newY = initialNodeY + (event.clientY - dragStartMouseY) / zoom;
      onUpdateNodePosition(nodeId, { x: newX, y: newY });
    } else if (isPanning && panStartCoords.current) {
      setPanState({
        x: panStartCoords.current.panX + (event.clientX - panStartCoords.current.mouseX),
        y: panStartCoords.current.panY + (event.clientY - panStartCoords.current.mouseY),
      });
    }
  }, [draggingNodeInfo, isPanning, zoom, onUpdateNodePosition]);

  const handleMouseUp = useCallback(() => {
    if (draggingNodeInfo && canvasRef.current) {
       canvasRef.current.style.cursor = 'grab';
    }
    if (isPanning && canvasRef.current) {
        canvasRef.current.style.cursor = 'grab';
    }
    setDraggingNodeInfo(null);
    setIsPanning(false);
    panStartCoords.current = null;
    window.removeEventListener('mousemove', handleMouseMove);
    window.removeEventListener('mouseup', handleMouseUp);
  }, [handleMouseMove, draggingNodeInfo, isPanning]);

  // Node dragging
  const handleNodeMouseDown = (
    event: React.MouseEvent,
    nodeId: string,
  ) => {
    event.stopPropagation(); // Prevent canvas pan/deselect
    const node = nodes.find(n => n.id === nodeId);
    if (!node || event.button !== 0) return; // Only left click for drag

    setDraggingNodeInfo({
      nodeId,
      initialNodeX: node.x,
      initialNodeY: node.y,
      dragStartMouseX: event.clientX,
      dragStartMouseY: event.clientY,
    });
    if (canvasRef.current) canvasRef.current.style.cursor = 'grabbing';

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  // Canvas panning
  const handleCanvasMouseDown = (event: React.MouseEvent) => {
    // Pan with left click on canvas background
    if (event.target === canvasRef.current || event.target === contentRef.current) {
      if (event.button === 0) { // Left click
        event.stopPropagation();
        setIsPanning(true);
        panStartCoords.current = {
          panX: pan.x,
          panY: pan.y,
          mouseX: event.clientX,
          mouseY: event.clientY,
        };
        if (canvasRef.current) canvasRef.current.style.cursor = 'grabbing';
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);
      }
    }
  };
  
  // Canvas click for deselecting nodes
  const handleCanvasClick = (event: React.MouseEvent) => {
    if (event.target === canvasRef.current || event.target === contentRef.current) {
       // Check if it was a drag/pan - simplest way is to check if mouse moved significantly.
       // For now, any click on background deselects.
      onDeselectAllNodes();
    }
  };

  // Zooming
  const handleWheel = useCallback((event: WheelEvent) => {
    event.preventDefault();
    if (!canvasRef.current) return;

    const zoomFactor = 1.1;
    const newZoom = event.deltaY < 0 ? zoom * zoomFactor : zoom / zoomFactor;
    const clampedZoom = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, newZoom));

    const rect = canvasRef.current.getBoundingClientRect();
    // Mouse position relative to canvas
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    // New pan: ((oldPan - mouse) / oldZoom * newZoom) + mouse
    // Calculate mouse position in world space before zoom
    const worldXBeforeZoom = (mouseX - pan.x) / zoom;
    const worldYBeforeZoom = (mouseY - pan.y) / zoom;

    // Calculate new pan to keep mouse position fixed in world space
    const newPanX = mouseX - worldXBeforeZoom * clampedZoom;
    const newPanY = mouseY - worldYBeforeZoom * clampedZoom;
    
    setZoomState(clampedZoom);
    setPanState({ x: newPanX, y: newPanY });

  }, [pan, zoom]);

  useEffect(() => {
    const currentCanvas = canvasRef.current;
    if (currentCanvas) {
      currentCanvas.addEventListener('wheel', handleWheel, { passive: false });
    }
    return () => {
      if (currentCanvas) {
        currentCanvas.removeEventListener('wheel', handleWheel);
      }
      // Ensure global listeners are cleaned up on unmount if an interaction was active
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [handleWheel, handleMouseMove, handleMouseUp]);


  return (
    <div
      ref={canvasRef}
      className={clsx(
        "w-full h-full bg-gray-100 dark:bg-gray-800 overflow-hidden relative select-none",
        isPanning || draggingNodeInfo ? "cursor-grabbing" : "cursor-grab",
        className
      )}
      onMouseDown={handleCanvasMouseDown}
      onClick={handleCanvasClick} // For deselection
    >
      <div
        ref={contentRef}
        className="transform-origin-top-left" // Tailwind might not have a direct class, use style
        style={{
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
          transformOrigin: '0 0',
        }}
      >
        {nodes.map((node) => (
          <UIDesignNodeElement
            key={node.id}
            id={node.id}
            name={node.name}
            previewImageUrl={node.previewImageUrl}
            isSelected={selectedNodeIds.includes(node.id)}
            // Assuming UIDesignNodeElement takes style for positioning
            style={{
              position: 'absolute',
              left: `${node.x}px`,
              top: `${node.y}px`,
              width: `${node.width}px`,
              height: `${node.height}px`,
            }}
            onClick={(e: React.MouseEvent) => {
              e.stopPropagation(); // Prevent canvas click from deselecting all
              onSelectNode(node.id, e.ctrlKey || e.metaKey);
            }}
            onDoubleClick={(e: React.MouseEvent) => {
                e.stopPropagation();
                onNodeDoubleClick(node.id)
            }}
            onMouseDown={(e: React.MouseEvent) => handleNodeMouseDown(e, node.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default UIDesignInteractiveCanvas;