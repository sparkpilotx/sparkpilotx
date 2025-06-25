import { ModeToggle } from '@/components/mode-toggle'

export function TitleBar(): React.JSX.Element {
  return (
    <div className="titlebar fixed top-0 left-0 right-0 h-8 select-none bg-muted/40 flex items-center justify-between pr-2">
      <div className="flex-grow text-center">{import.meta.env.VITE_APP_NAME}</div>
      <div className="non-draggable">
        <ModeToggle />
      </div>
    </div>
  )
} 