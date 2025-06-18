import React from 'react';
import { cn } from '@/lib/utils'; // Assuming cn is available for class merging

interface MobileDeviceFrameProps {
  children: React.ReactNode;
  className?: string; // Optional additional classes for the outermost container
}

const MobileDeviceFrame: React.FC<MobileDeviceFrameProps> = ({ children, className }) => {
  console.log('MobileDeviceFrame loaded');

  return (
    <div
      className={cn(
        "relative mx-auto border-gray-800 dark:border-gray-700 bg-gray-800 dark:bg-gray-700 border-[14px] rounded-[2.5rem] h-[712px] w-[350px] shadow-xl",
        className
      )}
    >
      {/* Notch */}
      <div className="w-[148px] h-[18px] bg-gray-800 dark:bg-gray-700 top-0 rounded-b-[1rem] left-1/2 -translate-x-1/2 absolute"></div>
      
      {/* Side button: Volume up */}
      <div className="h-[46px] w-[3px] bg-gray-800 dark:bg-gray-700 absolute -start-[17px] top-[124px] rounded-s-lg"></div>
      
      {/* Side button: Volume down */}
      <div className="h-[46px] w-[3px] bg-gray-800 dark:bg-gray-700 absolute -start-[17px] top-[178px] rounded-s-lg"></div>
      
      {/* Side button: Power/Lock */}
      <div className="h-[64px] w-[3px] bg-gray-800 dark:bg-gray-700 absolute -end-[17px] top-[142px] rounded-e-lg"></div>
      
      {/* Screen area */}
      <div className="rounded-[2rem] overflow-auto w-full h-full bg-white dark:bg-black">
        {children}
      </div>
    </div>
  );
};

export default MobileDeviceFrame;