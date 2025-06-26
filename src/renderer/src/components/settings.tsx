import React, { useState } from 'react'
import { X, Info, Settings as SettingsIcon } from 'lucide-react'
import { Button } from './ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Separator } from './ui/separator'

interface SettingsProps {
  isOpen: boolean
  onClose: () => void
}

type SettingsTab = {
  id: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  description?: string
}

const settingsTabs: SettingsTab[] = [
  {
    id: 'about',
    label: 'About',
    icon: Info,
    description: 'Application information'
  }
  // Future tabs can be added here
  // {
  //   id: 'general',
  //   label: 'General',
  //   icon: SettingsIcon,
  //   description: 'General preferences'
  // },
  // {
  //   id: 'ai',
  //   label: 'AI Configuration',
  //   icon: Bot,
  //   description: 'AI models and API settings'
  // }
]

export function Settings({ isOpen, onClose }: SettingsProps): React.JSX.Element | null {
  const [activeTab, setActiveTab] = useState('about')
  
  if (!isOpen) return null
  
  const versions = window.api.getVersions()
  const currentTab = settingsTabs.find(tab => tab.id === activeTab)

  const renderTabContent = () => {
    switch (activeTab) {
      case 'about':
        return (
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium mb-4">Version Information</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between py-2">
                  <div>
                    <p className="font-medium">Electron</p>
                    <p className="text-sm text-muted-foreground">
                      Framework version
                    </p>
                  </div>
                  <div className="text-sm font-mono text-muted-foreground">
                    v{versions.electron}
                  </div>
                </div>
                
                <div className="flex items-center justify-between py-2">
                  <div>
                    <p className="font-medium">Node.js</p>
                    <p className="text-sm text-muted-foreground">
                      JavaScript runtime
                    </p>
                  </div>
                  <div className="text-sm font-mono text-muted-foreground">
                    v{versions.node}
                  </div>
                </div>
                
                <div className="flex items-center justify-between py-2">
                  <div>
                    <p className="font-medium">Chrome</p>
                    <p className="text-sm text-muted-foreground">
                      Browser engine
                    </p>
                  </div>
                  <div className="text-sm font-mono text-muted-foreground">
                    v{versions.chrome}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
      
      default:
        return (
          <div className="flex items-center justify-center h-32 text-muted-foreground">
            <p>Content for {currentTab?.label} will be implemented here.</p>
          </div>
        )
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl max-h-[85vh] flex flex-col overflow-hidden">
        {/* Header */}
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 border-b">
          <div>
            <CardTitle className="flex items-center gap-2">
              <SettingsIcon className="h-5 w-5" />
              Settings
            </CardTitle>
            <CardDescription>
              Configure {import.meta.env.VITE_APP_NAME} preferences
            </CardDescription>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </Button>
        </CardHeader>

        {/* Main Content */}
        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar */}
          <div className="w-64 border-r bg-muted/20 p-4">
            <nav className="space-y-1">
              {settingsTabs.map((tab) => {
                const Icon = tab.icon
                return (
                  <Button
                    key={tab.id}
                    variant={activeTab === tab.id ? "default" : "ghost"}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full h-auto justify-start p-3 text-left ${
                      activeTab === tab.id 
                        ? '' 
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <Icon className="h-4 w-4 flex-shrink-0 mr-3" />
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm">{tab.label}</div>
                      {tab.description && (
                        <div className="text-xs opacity-70 truncate">
                          {tab.description}
                        </div>
                      )}
                    </div>
                  </Button>
                )
              })}
            </nav>
          </div>

          {/* Content Area */}
          <div className="flex-1 overflow-auto">
            <CardContent className="p-6">
              <div className="mb-4">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  {currentTab && (
                    <>
                      <currentTab.icon className="h-5 w-5" />
                      {currentTab.label}
                    </>
                  )}
                </h2>
                {currentTab?.description && (
                  <p className="text-muted-foreground mt-1">
                    {currentTab.description}
                  </p>
                )}
              </div>
              <Separator className="mb-6" />
              {renderTabContent()}
            </CardContent>
          </div>
        </div>
      </Card>
    </div>
  )
} 