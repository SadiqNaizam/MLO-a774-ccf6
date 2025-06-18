import React, { useState, useEffect, useRef } from 'react';
import { Loader2, AlertCircle, EyeOff } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface LivePreviewWindowProps {
  src: string | null | undefined; // URL for the iframe, can be null or undefined
  title?: string; // Accessibility and title for the iframe
  sandboxPermissions?: string[]; // Fine-grained sandbox permissions
  onLoad?: () => void;
  onError?: (message: string) => void;
}

const LivePreviewWindow: React.FC<LivePreviewWindowProps> = ({
  src,
  title = "Live Preview",
  sandboxPermissions = ["allow-scripts", "allow-same-origin", "allow-forms", "allow-modals", "allow-popups", "allow-presentation"],
  onLoad,
  onError,
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  console.log('LivePreviewWindow loaded. Initial src:', src);

  useEffect(() => {
    if (src) {
      console.log('LivePreviewWindow: src changed or component mounted with src:', src);
      setIsLoading(true);
      setError(null);
      // The iframe's `src` attribute is directly set from the `src` prop.
      // When `src` prop changes, the iframe will attempt to load the new URL.
      // The `onLoad` and `onError` handlers below will update `isLoading` and `error`.
    } else {
      // If src is null, undefined, or empty, clear loading and error states
      setIsLoading(false);
      setError(null);
    }
  }, [src]);

  const handleLoad = () => {
    console.log('LivePreviewWindow: iframe content loaded for src:', src);
    setIsLoading(false);
    setError(null);
    if (onLoad) {
      onLoad();
    }
  };

  const handleError = (event: React.SyntheticEvent<HTMLIFrameElement, Event>) => {
    // The native iframe error event doesn't provide much detail for cross-origin errors
    const errorMessage = `Failed to load content from: ${src || 'unknown source'}. Check browser console for more details.`;
    console.error('LivePreviewWindow: iframe content failed to load.', event, 'Current src:', src);
    setIsLoading(false);
    setError(errorMessage);
    if (onError) {
      onError(errorMessage);
    }
  };

  if (!src) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 text-gray-500 dark:text-gray-400 p-4">
        <EyeOff className="h-12 w-12 mb-3" />
        <p className="text-lg font-medium">No Preview Available</p>
        <p className="text-sm text-center">A source URL has not been provided for the preview.</p>
      </div>
    );
  }

  const sandboxAttrValue = sandboxPermissions.join(" ");

  return (
    <div className="relative w-full h-full bg-background dark:bg-muted/20 overflow-hidden">
      {isLoading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center z-20 bg-background/80 backdrop-blur-sm">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <p className="mt-3 text-sm text-muted-foreground">Loading Preview...</p>
        </div>
      )}
      {error && !isLoading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center z-20 bg-background/80 backdrop-blur-sm p-4">
          <Alert variant="destructive" className="max-w-lg w-full shadow-lg">
            <AlertCircle className="h-5 w-5" />
            <AlertTitle>Preview Error</AlertTitle>
            <AlertDescription>
              {error}
            </AlertDescription>
          </Alert>
        </div>
      )}
      <iframe
        ref={iframeRef}
        src={src} // src is guaranteed to be a string here due to the check above
        title={title}
        className={`w-full h-full border-0 transition-opacity duration-300 ease-in-out ${isLoading || error ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
        onLoad={handleLoad}
        onError={handleError}
        sandbox={sandboxAttrValue}
        id="live-preview-iframe" // ID for potential direct script interactions or testing
        key={src} // Force re-mount of iframe if src string changes, ensuring clean load
      />
    </div>
  );
};

export default LivePreviewWindow;