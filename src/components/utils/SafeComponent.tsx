import React from 'react';

interface SafeComponentProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  componentName?: string;
}

export function SafeComponent({ 
  children, 
  fallback = null, 
  componentName = 'Component' 
}: SafeComponentProps) {
  try {
    return <>{children}</>;
  } catch (error) {
    console.error(`[${componentName}] Component error:`, error);
    
    if (fallback) {
      return <>{fallback}</>;
    }
    
    // Default fallback - empty div instead of crash
    return <div className="min-h-4" />;
  }
}

interface SafeDataDisplayProps<T> {
  data: T | null | undefined;
  fallback?: React.ReactNode;
  children: (data: T) => React.ReactNode;
  componentName?: string;
}

export function SafeDataDisplay<T>({ 
  data, 
  fallback = null, 
  children, 
  componentName = 'DataDisplay' 
}: SafeDataDisplayProps<T>) {
  try {
    if (data === null || data === undefined) {
      console.warn(`[${componentName}] Data is null/undefined`);
      return fallback ? <>{fallback}</> : <div className="min-h-4" />;
    }
    
    return <>{children(data)}</>;
  } catch (error) {
    console.error(`[${componentName}] Data display error:`, error);
    return fallback ? <>{fallback}</> : <div className="min-h-4" />;
  }
}