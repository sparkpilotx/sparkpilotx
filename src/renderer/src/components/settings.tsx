import React from 'react'
import { X, Settings as SettingsIconLucide } from 'lucide-react'
import { Button } from './ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Separator } from './ui/separator'

interface SettingsProps {
  isOpen: boolean
  onClose: () => void
}

export function Settings({ isOpen, onClose }: SettingsProps): React.JSX.Element | null {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
      <Card className="w-full max-w-2xl max-h-[80vh] overflow-auto">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div>
            <CardTitle className="flex items-center gap-2">
              <SettingsIconLucide className="h-5 w-5" />
              Settings
            </CardTitle>
            <CardDescription>
              Configure your application preferences
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
        <Separator />
        <CardContent className="space-y-6 pt-6">
          {/* General Settings */}
          <div className="space-y-2">
            <h3 className="text-lg font-medium">General</h3>
            <div className="space-y-4 pl-2">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Theme</p>
                  <p className="text-sm text-muted-foreground">
                    Choose your preferred theme
                  </p>
                </div>
                <div className="text-sm text-muted-foreground">Auto</div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Language</p>
                  <p className="text-sm text-muted-foreground">
                    Select your language preference
                  </p>
                </div>
                <div className="text-sm text-muted-foreground">English</div>
              </div>
            </div>
          </div>

          <Separator />

          {/* AI Settings */}
          <div className="space-y-2">
            <h3 className="text-lg font-medium">AI Configuration</h3>
            <div className="space-y-4 pl-2">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Default Model</p>
                  <p className="text-sm text-muted-foreground">
                    Choose your preferred AI model
                  </p>
                </div>
                <div className="text-sm text-muted-foreground">GPT-4</div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">API Keys</p>
                  <p className="text-sm text-muted-foreground">
                    Manage your API keys for different services
                  </p>
                </div>
                <Button variant="outline" size="sm">
                  Configure
                </Button>
              </div>
            </div>
          </div>

          <Separator />

          {/* About */}
          <div className="space-y-2">
            <h3 className="text-lg font-medium">About</h3>
            <div className="space-y-4 pl-2">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Version</p>
                  <p className="text-sm text-muted-foreground">
                    Current application version
                  </p>
                </div>
                <div className="text-sm text-muted-foreground">1.0.0</div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Check for Updates</p>
                  <p className="text-sm text-muted-foreground">
                    Keep your app up to date
                  </p>
                </div>
                <Button variant="outline" size="sm">
                  Check Now
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export function SettingsIcon(): React.JSX.Element {
  return <SettingsIconLucide className="h-4 w-4" />
} 