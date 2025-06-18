import React from 'react';

type ColorOption = 'primary' | 'primary-light' | 'primary-dark' | 'accent' | 'accent-light' | 'accent-dark' | 'white';

interface FlowingShapeProps {
  className?: string;
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  colors?: [ColorOption, ColorOption] | string[];
  opacity?: number;
}

const FlowingShape: React.FC<FlowingShapeProps> = ({ 
  className = '', 
  position = 'bottom-right',
  colors = ['primary', 'accent'],
  opacity = 0.3
}) => {
  // Map color names to actual color values
  const colorMap = {
    'primary': '#2B1F4F',
    'primary-light': '#3D2D70',
    'primary-dark': '#201639',
    'accent': '#058C42',
    'accent-light': '#06A54E',
    'accent-dark': '#046832',
    'white': '#FFFFFF'
  };

  // Determine position styles
  const positionStyles = {
    'top-left': 'top-0 left-0',
    'top-right': 'top-0 right-0',
    'bottom-left': 'bottom-0 left-0',
    'bottom-right': 'bottom-0 right-0'
  };

  // Determine clip path based on position
  const clipPathStyles = {
    'top-left': 'polygon(0 0, 100% 0, 0 100%)',
    'top-right': 'polygon(100% 0, 0 0, 100% 100%)',
    'bottom-left': 'polygon(0 100%, 0 0, 100% 100%)',
    'bottom-right': 'polygon(100% 100%, 0 100%, 100% 0)'
  };

  // Set color values
  const color1 = typeof colors[0] === 'string' && colors[0] in colorMap 
    ? colorMap[colors[0] as keyof typeof colorMap] 
    : colors[0];
    
  const color2 = typeof colors[1] === 'string' && colors[1] in colorMap 
    ? colorMap[colors[1] as keyof typeof colorMap] 
    : colors[1];

  return (
    <div 
      className={`absolute w-full h-40 md:h-56 lg:h-64 z-0 ${positionStyles[position]} ${className}`}
      style={{
        background: `linear-gradient(135deg, ${color1} 0%, ${color2} 100%)`,
        clipPath: clipPathStyles[position],
        opacity
      }}
    ></div>
  );
};

export default FlowingShape; 