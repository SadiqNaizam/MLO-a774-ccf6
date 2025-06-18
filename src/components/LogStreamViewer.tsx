import React, { useEffect, useRef } from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  Info,
  AlertCircle,
  AlertTriangle,
  Bug,
  Code2,
  Terminal,
  type LucideIcon,
} from 'lucide-react';

export type LogLevel = 'info' | 'error' | 'warn' | 'debug' | 'code' | 'system';

export interface LogEntry {
  id: string; // Unique ID for each log entry (e.g., from uuidv4 or timestamp)
  level: LogLevel;
  message: string;
  timestamp?: Date; // Optional: Date object for timestamp
}

interface LogStreamViewerProps {
  logs?: LogEntry[]; // Optional: array of log entries, defaults to empty
  title?: string; // Optional: title for the log viewer
  className?: string; // Optional: additional Tailwind classes for the root container
  maxHeight?: string; // Optional: max height for the scrollable area (e.g., "300px", "50vh")
}

// Configuration for visual representation of each log level
const logLevelConfig: Record<LogLevel, {
  Icon: LucideIcon;
  badgeVariant?: 'default' | 'secondary' | 'destructive' | 'outline';
  textColor?: string;
  iconColor?: string;
}> = {
  info: { Icon: Info, badgeVariant: 'default', iconColor: 'text-blue-500 dark:text-blue-400' },
  error: { Icon: AlertCircle, badgeVariant: 'destructive', textColor: 'text-red-600 dark:text-red-400', iconColor: 'text-red-500 dark:text-red-400' },
  warn: { Icon: AlertTriangle, badgeVariant: 'secondary', textColor: 'text-yellow-600 dark:text-yellow-500', iconColor: 'text-yellow-500 dark:text-yellow-400' },
  debug: { Icon: Bug, badgeVariant: 'outline', textColor: 'text-purple-600 dark:text-purple-400', iconColor: 'text-purple-500 dark:text-purple-400' },
  system: { Icon: Terminal, badgeVariant: 'outline', textColor: 'text-gray-600 dark:text-gray-400', iconColor: 'text-gray-500 dark:text-gray-400' },
  code: { Icon: Code2, badgeVariant: 'default', iconColor: 'text-green-500 dark:text-green-400' }, // Code blocks have special rendering
};

const LogStreamViewer: React.FC<LogStreamViewerProps> = ({
  logs = [],
  title,
  className,
  maxHeight = '300px', // Default max height for the scrollable area
}) => {
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    console.log('LogStreamViewer loaded');
  }, []);

  useEffect(() => {
    // Auto-scroll to the latest log message
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs]); // Dependency array: triggers effect when logs change

  return (
    <div className={cn("flex flex-col w-full", className)}>
      {title && (
        <h3 className="text-base font-medium mb-2 px-1 text-foreground">
          {title}
        </h3>
      )}
      <ScrollArea
        className="border rounded-md bg-background shadow-sm"
        style={{ height: maxHeight }} // Using height to ensure it occupies the space, scroll internally
      >
        <div className="p-3 space-y-1.5 text-xs"> {/* Reduced overall text size and spacing for density */}
          {logs.length === 0 && (
            <p className="text-muted-foreground italic text-center py-4">
              No logs to display.
            </p>
          )}
          {logs.map((log) => {
            const config = logLevelConfig[log.level];
            const IconComponent = config.Icon;

            return (
              <div
                key={log.id}
                className={cn(
                  "flex items-start space-x-2 p-1.5 rounded-md hover:bg-muted/60 transition-colors",
                  config.textColor
                )}
              >
                <IconComponent
                  className={cn("h-3.5 w-3.5 mt-0.5 flex-shrink-0", config.iconColor)}
                  aria-hidden="true"
                />
                <div className="flex-grow min-w-0"> {/* Prevents flex item from overflowing */}
                  <div className="flex items-center space-x-1.5 mb-0.5">
                    <Badge
                      variant={config.badgeVariant}
                      className="uppercase text-[9px] px-1 py-0 font-semibold leading-tight h-auto"
                    >
                      {log.level}
                    </Badge>
                    {log.timestamp && (
                      <span className="text-[10px] text-muted-foreground whitespace-nowrap">
                        {log.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })}
                      </span>
                    )}
                  </div>
                  {log.level === 'code' ? (
                    <pre className="mt-1 p-2 bg-muted rounded text-[11px] font-mono overflow-x-auto whitespace-pre-wrap break-all">
                      <code className="text-foreground/80">{log.message}</code>
                    </pre>
                  ) : (
                    <p className="text-foreground/90 whitespace-pre-wrap break-words leading-snug">
                      {log.message}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} /> {/* Invisible element to enable auto-scrolling */}
        </div>
      </ScrollArea>
    </div>
  );
};

export default LogStreamViewer;