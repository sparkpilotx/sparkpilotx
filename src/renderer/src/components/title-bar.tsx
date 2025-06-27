import React from 'react'
import { Settings as SettingsIconLucide } from 'lucide-react'
import { Button } from './ui/button'

interface TitleBarProps {
  onOpenSettings: () => void
}

export function TitleBar({ onOpenSettings }: TitleBarProps): React.JSX.Element {

  return (
    <>
      <header className="titlebar h-8 select-none bg-muted/40 flex items-center justify-between px-3">
        {/* Left side icons - for future functionality */}
        <div className="flex items-center gap-1">
          {/* Placeholder for future left-side icons */}
          <div className="w-6"></div>
        </div>
        
        {/* Center title */}
        <div className="text-center flex-1">{import.meta.env.VITE_APP_NAME}</div>
        
        {/* Right side icons - functional entry points */}
        <div className="flex items-center gap-1">
          {/* Settings icon */}
          <Button
            variant="ghost"
            size="sm"
            onClick={onOpenSettings}
            className="h-6 w-6 p-0 hover:bg-muted/60 non-draggable"
            title="Settings"
          >
            <SettingsIconLucide className="h-4 w-4" />
            <span className="sr-only">Open Settings</span>
          </Button>
          
          {/* Placeholder for future right-side icons */}
          {/* 
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {}}
            className="h-6 w-6 p-0 hover:bg-muted/60 non-draggable"
            title="Feature Name"
          >
            <FeatureIcon className="h-4 w-4" />
            <span className="sr-only">Feature Description</span>
          </Button>
          */}
        </div>
      </header>
    </>
  )
} 