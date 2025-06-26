import * as React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { cn } from '@/lib/utils'
import { Badge } from './ui/badge'
import { Separator } from './ui/separator'
import type { Model } from '@google/genai'

interface GoogleGenAIModelCardProps extends React.ComponentProps<typeof Card> {
  model: Model
  showFullDetails?: boolean
}

export function GoogleGenAIModelCard({ model, showFullDetails = false, className, ...props }: GoogleGenAIModelCardProps) {
  return (
    <Card className={cn('w-full', className)} {...props}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>{model.displayName || model.name}</span>
          {model.version && (
            <Badge variant="secondary" className="text-xs">
              v{model.version}
            </Badge>
          )}
        </CardTitle>
        {model.description && (
          <CardDescription className="line-clamp-2">
            {model.description}
          </CardDescription>
        )}
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Basic Information */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          {model.name && (
            <div>
              <span className="font-medium text-muted-foreground">Resource Name:</span>
              <p className="font-mono text-xs break-all">{model.name}</p>
            </div>
          )}
          
          {model.inputTokenLimit && (
            <div>
              <span className="font-medium text-muted-foreground">Input Token Limit:</span>
              <p>{model.inputTokenLimit.toLocaleString()}</p>
            </div>
          )}
          
          {model.outputTokenLimit && (
            <div>
              <span className="font-medium text-muted-foreground">Output Token Limit:</span>
              <p>{model.outputTokenLimit.toLocaleString()}</p>
            </div>
          )}
          
          {model.defaultCheckpointId && (
            <div>
              <span className="font-medium text-muted-foreground">Default Checkpoint:</span>
              <p className="font-mono text-xs">{model.defaultCheckpointId}</p>
            </div>
          )}
        </div>

        {/* Supported Actions */}
        {model.supportedActions && model.supportedActions.length > 0 && (
          <div>
            <span className="font-medium text-muted-foreground text-sm">Supported Actions:</span>
            <div className="flex flex-wrap gap-1 mt-2">
              {model.supportedActions.map((action, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {action}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Labels */}
        {model.labels && Object.keys(model.labels).length > 0 && (
          <div>
            <span className="font-medium text-muted-foreground text-sm">Labels:</span>
            <div className="flex flex-wrap gap-1 mt-2">
              {Object.entries(model.labels).map(([key, value]) => (
                <Badge key={key} variant="secondary" className="text-xs">
                  {key}: {value}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Tuned Model Information */}
        {model.tunedModelInfo && (
          <>
            <Separator />
            <div>
              <span className="font-medium text-muted-foreground text-sm">Tuned Model Info:</span>
              <div className="mt-2 space-y-2">
                {model.tunedModelInfo.baseModel && (
                  <div className="text-sm">
                    <span className="font-medium">Base Model:</span>
                    <p className="font-mono text-xs break-all">{model.tunedModelInfo.baseModel}</p>
                  </div>
                )}
                {model.tunedModelInfo.createTime && (
                  <div className="text-sm">
                    <span className="font-medium">Created:</span>
                    <p className="text-xs">{new Date(model.tunedModelInfo.createTime).toLocaleString()}</p>
                  </div>
                )}
                {model.tunedModelInfo.updateTime && (
                  <div className="text-sm">
                    <span className="font-medium">Updated:</span>
                    <p className="text-xs">{new Date(model.tunedModelInfo.updateTime).toLocaleString()}</p>
                  </div>
                )}
              </div>
            </div>
          </>
        )}

        {/* Full Details Section */}
        {showFullDetails && (
          <>
            {/* Endpoints */}
            {model.endpoints && model.endpoints.length > 0 && (
              <>
                <Separator />
                <div>
                  <span className="font-medium text-muted-foreground text-sm">Endpoints:</span>
                  <div className="mt-2 space-y-2">
                    {model.endpoints.map((endpoint, index) => (
                      <div key={index} className="text-sm p-2 bg-muted rounded-md">
                        {endpoint.name && (
                          <div className="font-mono text-xs text-muted-foreground">
                            {endpoint.name}
                          </div>
                        )}
                        {endpoint.deployedModelId && (
                          <div className="text-xs text-muted-foreground">
                            Model ID: {endpoint.deployedModelId}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* Checkpoints */}
            {model.checkpoints && model.checkpoints.length > 0 && (
              <>
                <Separator />
                <div>
                  <span className="font-medium text-muted-foreground text-sm">Checkpoints:</span>
                  <div className="mt-2 space-y-2">
                    {model.checkpoints.map((checkpoint, index) => (
                      <div key={index} className="text-sm p-2 bg-muted rounded-md">
                        {checkpoint.checkpointId && (
                          <div className="font-mono text-xs">{checkpoint.checkpointId}</div>
                        )}
                        {checkpoint.epoch && (
                          <div className="text-xs text-muted-foreground">
                            Epoch: {checkpoint.epoch}
                          </div>
                        )}
                        {checkpoint.step && (
                          <div className="text-xs text-muted-foreground">
                            Step: {checkpoint.step}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </>
        )}
      </CardContent>
    </Card>
  )
}

export type { GoogleGenAIModelCardProps }
export type { Model } from '@google/genai' 