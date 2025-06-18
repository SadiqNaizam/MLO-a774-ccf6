import React from 'react';
import { type LucideIcon } from 'lucide-react';
import { Button, ButtonProps } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils"; // Assuming cn is available for class merging

interface InteractiveIconProps {
  IconComponent: LucideIcon;
  onClick?: () => void;
  state?: 'default' | 'active' | 'disabled';
  size?: number;
  className?: string;
  activeClassName?: string; // Custom classes for the active state
  tooltipContent?: string;
  ariaLabel: string; // For accessibility
  buttonVariant?: ButtonProps['variant']; // Allow overriding button variant
}

const InteractiveIcon: React.FC<InteractiveIconProps> = ({
  IconComponent,
  onClick,
  state = 'default',
  size = 20,
  className,
  activeClassName = 'text-primary', // Default active style
  tooltipContent,
  ariaLabel,
  buttonVariant = 'ghost',
}) => {
  console.log(`InteractiveIcon loaded: ${ariaLabel}, state: ${state}`);

  const isDisabled = state === 'disabled';
  const isActive = state === 'active';

  const iconButton = (
    <Button
      variant={buttonVariant}
      size="icon"
      onClick={!isDisabled ? onClick : undefined}
      disabled={isDisabled}
      aria-label={ariaLabel}
      className={cn(
        "rounded-md", // Default styling
        { [activeClassName]: isActive && !isDisabled },
        className
      )}
    >
      <IconComponent size={size} aria-hidden="true" />
    </Button>
  );

  if (tooltipContent) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>{iconButton}</TooltipTrigger>
        <TooltipContent>
          <p>{tooltipContent}</p>
        </TooltipContent>
      </Tooltip>
    );
  }

  return iconButton;
};

export default InteractiveIcon;