import React from 'react';
import { ChevronRight } from 'lucide-react';

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'accent' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  icon,
  iconPosition = 'right',
  onClick,
  type = 'button',
}) => {
  const baseClasses = 'rounded-md font-medium transition-colors inline-flex items-center justify-center';
  
  const variantClasses = {
    primary: 'bg-primary hover:bg-primary-dark text-white',
    secondary: 'bg-white hover:bg-gray-100 text-primary border border-gray-200',
    accent: 'bg-accent hover:bg-accent-dark text-white',
    outline: 'bg-transparent hover:bg-primary/5 text-primary border border-primary',
  };
  
  const sizeClasses = {
    sm: 'text-sm px-3 py-1.5',
    md: 'text-base px-5 py-2',
    lg: 'text-lg px-8 py-3',
  };
  
  const iconClasses = icon ? 'gap-2' : '';
  
  return (
    <button
      type={type}
      onClick={onClick}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${iconClasses} ${className} group`}
    >
      {icon && iconPosition === 'left' && (
        <span className="transition-transform group-hover:-translate-x-0.5">{icon}</span>
      )}
      {children}
      {icon && iconPosition === 'right' && (
        <span className="transition-transform group-hover:translate-x-0.5">{icon}</span>
      )}
      {!icon && variant === 'accent' && (
        <ChevronRight size={20} className="transition-transform group-hover:translate-x-1 ml-1" />
      )}
    </button>
  );
};

export default Button; 