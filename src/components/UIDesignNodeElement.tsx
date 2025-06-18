import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Skeleton } from "@/components/ui/skeleton";
import clsx from 'clsx';
import { Maximize2 } from 'lucide-react'; // Icon for full screen affordance

export interface UIDesignNodeElementProps {
  id: string;
  title: string;
  previewImageUrl?: string; // Optional: can be a placeholder or loading state if not provided
  isSelected: boolean;
  isLoading?: boolean;
  onSelect: (id: string) => void;
  onDoubleClick: (id: string) => void;
  className?: string;
  style?: React.CSSProperties;
  nodeType?: 'page' | 'component' | 'flow'; // For potential future styling or behavior
}

const UIDesignNodeElement: React.FC<UIDesignNodeElementProps> = ({
  id,
  title,
  previewImageUrl,
  isSelected,
  isLoading = false,
  onSelect,
  onDoubleClick,
  className,
  style,
  nodeType = 'page',
}) => {
  console.log(`UIDesignNodeElement loaded: ${title} (ID: ${id})`);

  const handleSelect = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent event bubbling if nested
    onSelect(id);
  };

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDoubleClick(id);
  };

  const fallbackImage = "https://via.placeholder.com/400x300?text=Preview+Not+Available";

  if (isLoading) {
    return (
      <Card
        className={clsx(
          "w-64 h-auto bg-background shadow-md transition-all duration-200 ease-in-out transform hover:shadow-lg",
          "flex flex-col",
          className
        )}
        style={style}
        aria-label={`Loading UI Node ${title}`}
      >
        <CardHeader className="p-3 border-b">
          <Skeleton className="h-5 w-3/4" />
        </CardHeader>
        <CardContent className="p-3 flex-grow">
          <AspectRatio ratio={16 / 9}>
            <Skeleton className="w-full h-full rounded-sm" />
          </AspectRatio>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      className={clsx(
        "w-64 h-auto bg-background shadow-md transition-all duration-200 ease-in-out transform hover:shadow-lg cursor-pointer",
        "flex flex-col group", // Added group for hover effects on children
        {
          'ring-2 ring-primary ring-offset-2 ring-offset-background': isSelected,
          'hover:scale-[1.02]': !isSelected, // Slight scale on hover if not selected
        },
        className
      )}
      style={style}
      onClick={handleSelect}
      onDoubleClick={handleDoubleClick}
      tabIndex={0} // Make it focusable
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          handleSelect(e as any); // Treat Enter/Space as select
        }
      }}
      aria-label={`UI Node ${title}, ${isSelected ? 'selected' : 'not selected'}. Double click to expand.`}
      role="button"
    >
      <CardHeader className="p-3 border-b flex flex-row justify-between items-center">
        <CardTitle className="text-sm font-medium truncate" title={title}>
          {title}
        </CardTitle>
        {/* Affordance for double click action, visible on hover/focus */}
        <Maximize2 
          className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity"
          aria-hidden="true"
        />
      </CardHeader>
      <CardContent className="p-0 flex-grow"> {/* p-0 to make image flush */}
        <AspectRatio ratio={16 / 9} className="bg-muted">
          <img
            src={previewImageUrl || fallbackImage}
            alt={`Preview of ${title}`}
            className="object-cover w-full h-full rounded-b-md" // rounded-b-md if CardHeader is present
            onError={(e) => (e.currentTarget.src = fallbackImage)}
          />
        </AspectRatio>
      </CardContent>
    </Card>
  );
};

export default UIDesignNodeElement;