import React, { useState } from 'react'
import { X, Info, Settings as SettingsIcon, Sparkles, Monitor, Cpu } from 'lucide-react'
import { Button } from './ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Separator } from './ui/separator'
import { Badge } from './ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table'
import { Alert, AlertDescription, AlertTitle } from './ui/alert'

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
          <div className="space-y-6">
            {/* Application Header */}
            <Alert>
              <Monitor className="h-4 w-4" />
              <AlertTitle>
                {import.meta.env.VITE_APP_NAME}
              </AlertTitle>
              <AlertDescription>
                A modern desktop application built with Electron and React. 
                Version 1.0.0 • Built with ❤️ using modern web technologies
              </AlertDescription>
            </Alert>

            {/* System Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Cpu className="h-5 w-5" />
                  System Information
                </CardTitle>
                <CardDescription>
                  Runtime and framework versions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Component</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead className="text-right">Version</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">Electron</TableCell>
                      <TableCell className="text-muted-foreground">Cross-platform framework</TableCell>
                      <TableCell className="text-right">
                        <Badge variant="secondary" className="font-mono">
                          v{versions.electron}
                        </Badge>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Node.js</TableCell>
                      <TableCell className="text-muted-foreground">JavaScript runtime</TableCell>
                      <TableCell className="text-right">
                        <Badge variant="secondary" className="font-mono">
                          v{versions.node}
                        </Badge>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Chrome</TableCell>
                      <TableCell className="text-muted-foreground">Rendering engine</TableCell>
                      <TableCell className="text-right">
                        <Badge variant="secondary" className="font-mono">
                          v{versions.chrome}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* AI Libraries */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5" />
                  AI Libraries
                </CardTitle>
                <CardDescription>
                  Integrated AI SDK versions and availability
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Library</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead className="text-right">Version</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">OpenAI</TableCell>
                      <TableCell className="text-muted-foreground">ChatGPT & GPT models SDK</TableCell>
                      <TableCell className="text-right">
                        <Badge 
                          variant={versions.openai !== 'N/A' ? 'default' : 'destructive'} 
                          className="font-mono"
                        >
                          v{versions.openai}
                        </Badge>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Anthropic</TableCell>
                      <TableCell className="text-muted-foreground">Claude AI models SDK</TableCell>
                      <TableCell className="text-right">
                        <Badge 
                          variant={versions.anthropic !== 'N/A' ? 'default' : 'destructive'} 
                          className="font-mono"
                        >
                          v{versions.anthropic}
                        </Badge>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Google GenAI</TableCell>
                      <TableCell className="text-muted-foreground">Gemini models SDK</TableCell>
                      <TableCell className="text-right">
                        <Badge 
                          variant={versions.genai !== 'N/A' ? 'default' : 'destructive'} 
                          className="font-mono"
                        >
                          v{versions.genai}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
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