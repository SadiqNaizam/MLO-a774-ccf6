import React, { useState, useCallback } from 'react';
import { Folder, FileText, ChevronDown, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils'; // Assuming cn is available from shadcn/ui setup

export interface FileSystemNode {
  id: string; // Unique identifier for the node (e.g., path)
  name: string; // Display name of the file or folder
  type: 'file' | 'folder';
  path: string; // Full path, used for selection and expansion key
  children?: FileSystemNode[]; // Child nodes for folders
}

interface FileExplorerTreeProps {
  nodes: FileSystemNode[];
  onSelectFile: (path: string, node: FileSystemNode) => void;
  selectedFilePath?: string | null;
  initiallyExpandedPaths?: string[];
  className?: string;
}

const FileExplorerTree: React.FC<FileExplorerTreeProps> = ({
  nodes,
  onSelectFile,
  selectedFilePath,
  initiallyExpandedPaths = [],
  className,
}) => {
  const [expandedPaths, setExpandedPaths] = useState<Set<string>>(
    () => new Set(initiallyExpandedPaths)
  );

  console.log('FileExplorerTree loaded');

  const handleToggleExpand = useCallback((path: string) => {
    setExpandedPaths(prev => {
      const newSet = new Set(prev);
      if (newSet.has(path)) {
        newSet.delete(path);
      } else {
        newSet.add(path);
      }
      return newSet;
    });
  }, []);

  const renderNode = (node: FileSystemNode, level: number): JSX.Element => {
    const isExpanded = expandedPaths.has(node.path);
    const isSelected = node.type === 'file' && selectedFilePath === node.path;

    const indentClass = `pl-${2 + level * 4}`; // e.g. pl-2, pl-6, pl-10

    if (node.type === 'folder') {
      const hasChildren = node.children && node.children.length > 0;
      return (
        <div key={node.path} role="treeitem" aria-expanded={isExpanded}>
          <div
            className={cn(
              "flex items-center space-x-1.5 py-1 pr-2 rounded-md cursor-pointer hover:bg-muted",
              indentClass
            )}
            onClick={() => hasChildren && handleToggleExpand(node.path)}
            title={node.path}
          >
            {hasChildren ? (
              isExpanded ? (
                <ChevronDown className="h-4 w-4 flex-shrink-0 text-gray-500" />
              ) : (
                <ChevronRight className="h-4 w-4 flex-shrink-0 text-gray-500" />
              )
            ) : (
              <span className="w-4 h-4 flex-shrink-0" /> // Spacer for alignment
            )}
            <Folder className="h-4 w-4 flex-shrink-0 text-yellow-500" />
            <span className="truncate text-sm">{node.name}</span>
          </div>
          {isExpanded && hasChildren && (
            <div role="group">
              {node.children?.map(child => renderNode(child, level + 1))}
            </div>
          )}
        </div>
      );
    }

    // File node
    const fileIndentClass = `pl-${2 + (level * 4) + 4}`; // Files are indented further than their folder icon

    return (
      <div
        key={node.path}
        role="treeitem"
        aria-selected={isSelected}
        className={cn(
          "flex items-center space-x-1.5 py-1 pr-2 rounded-md cursor-pointer hover:bg-muted",
          fileIndentClass,
          isSelected && "bg-accent text-accent-foreground hover:bg-accent"
        )}
        onClick={() => onSelectFile(node.path, node)}
        title={node.path}
      >
        <FileText className="h-4 w-4 flex-shrink-0 text-blue-500" />
        <span className="truncate text-sm">{node.name}</span>
      </div>
    );
  };

  if (!nodes || nodes.length === 0) {
    return <div className={cn("p-4 text-sm text-muted-foreground", className)}>No files or folders to display.</div>;
  }

  return (
    <div role="tree" className={cn("space-y-0.5", className)}>
      {nodes.map(node => renderNode(node, 0))}
    </div>
  );
};

export default FileExplorerTree;