import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Paperclip, Send, X, User, Bot, Image as ImageIcon } from 'lucide-react';
import { cn } from '@/lib/utils'; // Assuming utils.ts exists for cn

export interface AIChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  imageUrl?: string; // URL of an image already part of the message history
  timestamp: Date;
}

interface AIChatInterfaceProps {
  messages: AIChatMessage[];
  onSendMessage: (text: string, imageFile?: File) => Promise<void> | void;
  isSending?: boolean;
  aiName?: string;
  userName?: string;
  aiAvatarSrc?: string;
  userAvatarSrc?: string;
  placeholder?: string;
  className?: string;
}

const AIChatInterface: React.FC<AIChatInterfaceProps> = ({
  messages,
  onSendMessage,
  isSending = false,
  aiName = 'AI Assistant',
  userName = 'You',
  aiAvatarSrc,
  userAvatarSrc,
  placeholder = 'Type your message or upload an image...',
  className,
}) => {
  const [inputValue, setInputValue] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreviewUrl, setFilePreviewUrl] = useState<string | null>(null);

  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  console.log('AIChatInterface loaded');

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollViewport = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollViewport) {
        scrollViewport.scrollTop = scrollViewport.scrollHeight;
      }
    }
  }, [messages]);

  // Cleanup for file preview URL
  useEffect(() => {
    return () => {
      if (filePreviewUrl) {
        URL.revokeObjectURL(filePreviewUrl);
      }
    };
  }, [filePreviewUrl]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      if (filePreviewUrl) {
        URL.revokeObjectURL(filePreviewUrl);
      }
      setFilePreviewUrl(URL.createObjectURL(file));
    }
    // Clear the input value to allow selecting the same file again
    if (e.target) e.target.value = '';
  };

  const handleRemoveSelectedFile = () => {
    setSelectedFile(null);
    if (filePreviewUrl) {
      URL.revokeObjectURL(filePreviewUrl);
      setFilePreviewUrl(null);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = ''; // Reset file input
    }
  };

  const handleSendMessage = useCallback(async () => {
    if ((inputValue.trim() || selectedFile) && !isSending) {
      await onSendMessage(inputValue.trim(), selectedFile || undefined);
      setInputValue('');
      setSelectedFile(null);
      if (filePreviewUrl) {
        URL.revokeObjectURL(filePreviewUrl);
      }
      setFilePreviewUrl(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  }, [inputValue, selectedFile, isSending, onSendMessage, filePreviewUrl]);

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTimestamp = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <Card className={cn("flex flex-col h-full w-full overflow-hidden", className)}>
      <ScrollArea className="flex-grow p-4 space-y-4" ref={scrollAreaRef}>
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
            <Bot className="w-12 h-12 mb-2" />
            <p>No messages yet. Start the conversation!</p>
          </div>
        )}
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={cn(
              "flex items-end gap-2 mb-4",
              msg.sender === 'user' ? 'justify-end' : 'justify-start'
            )}
          >
            {msg.sender === 'ai' && (
              <Avatar className="w-8 h-8">
                <AvatarImage src={aiAvatarSrc} alt={aiName} />
                <AvatarFallback><Bot size={18} /></AvatarFallback>
              </Avatar>
            )}
            <div
              className={cn(
                "max-w-[70%] p-3 rounded-lg shadow",
                msg.sender === 'user'
                  ? 'bg-primary text-primary-foreground rounded-br-none'
                  : 'bg-muted text-muted-foreground rounded-bl-none'
              )}
            >
              <p className="text-sm font-semibold mb-1">
                {msg.sender === 'user' ? userName : aiName}
              </p>
              {msg.text && <p className="whitespace-pre-wrap break-words">{msg.text}</p>}
              {msg.imageUrl && (
                <div className="mt-2">
                  <img
                    src={msg.imageUrl}
                    alt="Sent image"
                    className="rounded-md max-w-full h-auto max-h-60 object-contain"
                  />
                </div>
              )}
              <p className="text-xs mt-1 opacity-75 text-right">
                {formatTimestamp(msg.timestamp)}
              </p>
            </div>
            {msg.sender === 'user' && (
              <Avatar className="w-8 h-8">
                <AvatarImage src={userAvatarSrc} alt={userName} />
                <AvatarFallback><User size={18} /></AvatarFallback>
              </Avatar>
            )}
          </div>
        ))}
        {isSending && messages.length > 0 && messages[messages.length -1].sender === 'user' && (
           <div className="flex items-end gap-2 mb-4 justify-start">
             <Avatar className="w-8 h-8">
                <AvatarImage src={aiAvatarSrc} alt={aiName} />
                <AvatarFallback><Bot size={18} /></AvatarFallback>
              </Avatar>
              <div className="max-w-[70%] p-3 rounded-lg shadow bg-muted text-muted-foreground rounded-bl-none">
                <p className="text-sm italic">AI is typing...</p>
              </div>
           </div>
        )}
      </ScrollArea>

      {filePreviewUrl && (
        <div className="p-2 border-t border-b relative">
          <img src={filePreviewUrl} alt="Selected preview" className="max-h-24 rounded object-contain" />
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-1 right-1 h-6 w-6 bg-background/50 hover:bg-background/80"
            onClick={handleRemoveSelectedFile}
            aria-label="Remove selected image"
          >
            <X size={16} />
          </Button>
        </div>
      )}

      <div className="p-3 border-t bg-background">
        <div className="flex items-center gap-2">
          <Input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            id="file-upload"
            disabled={isSending}
          />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => fileInputRef.current?.click()}
            disabled={isSending}
            aria-label="Attach image"
          >
            <Label htmlFor="file-upload" className="cursor-pointer">
              <Paperclip className="h-5 w-5" />
            </Label>
          </Button>
          <Input
            type="text"
            placeholder={placeholder}
            value={inputValue}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            className="flex-grow"
            disabled={isSending}
            aria-label="Message input"
          />
          <Button onClick={handleSendMessage} disabled={isSending || (!inputValue.trim() && !selectedFile)} aria-label="Send message">
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default AIChatInterface;