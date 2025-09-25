import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { debugManager, type DebugInfo } from '@/lib/debugUtils'
import { Bug, RefreshCw, CheckCircle, XCircle, AlertTriangle, ChevronDown } from 'lucide-react'

export function DebugPanel() {
  const [debugInfo, setDebugInfo] = useState<DebugInfo | null>(null)
  const [isOpen, setIsOpen] = useState(false)

  const refreshDebugInfo = () => {
    setDebugInfo(debugManager.getDebugInfo())
  }

  useEffect(() => {
    refreshDebugInfo()
    // Auto-refresh every 5 seconds
    const interval = setInterval(refreshDebugInfo, 5000)
    return () => clearInterval(interval)
  }, [])

  if (!debugInfo) return null

  const getStatusIcon = (connected: boolean) => {
    return connected ? (
      <CheckCircle className="w-4 h-4 text-green-500" />
    ) : (
      <XCircle className="w-4 h-4 text-red-500" />
    )
  }

  const suggestions = debugManager.getSuggestions()

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger asChild>
        <Button 
          variant="outline" 
          size="sm"
          className="fixed bottom-4 left-4 z-50 bg-background border shadow-lg"
        >
          <Bug className="w-4 h-4 mr-2" />
          Debug ({debugInfo.performance.errorCount} errors)
          <ChevronDown className="w-4 h-4 ml-2" />
        </Button>
      </CollapsibleTrigger>
      
      <CollapsibleContent className="fixed bottom-16 left-4 w-96 max-h-96 z-50">
        <Card className="shadow-lg">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg">Debug Information</CardTitle>
                <CardDescription>System diagnostics and troubleshooting</CardDescription>
              </div>
              <Button size="sm" variant="outline" onClick={refreshDebugInfo}>
                <RefreshCw className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-4">
            {/* KV Store Status */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-medium">KV Store</span>
                <div className="flex items-center gap-2">
                  {getStatusIcon(debugInfo.kvStore.connected)}
                  <Badge variant={debugInfo.kvStore.connected ? "default" : "destructive"}>
                    {debugInfo.kvStore.connected ? 'Connected' : 'Disconnected'}
                  </Badge>
                </div>
              </div>
              
              {!debugInfo.kvStore.connected && (
                <Alert>
                  <AlertTriangle className="w-4 h-4" />
                  <AlertDescription className="text-sm">
                    Using mock data for local development
                  </AlertDescription>
                </Alert>
              )}
            </div>

            {/* Environment Info */}
            <div className="space-y-2">
              <span className="font-medium">Environment</span>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>Mode: <Badge variant={debugInfo.environment.isDev ? "secondary" : "default"}>
                  {debugInfo.environment.isDev ? 'Development' : 'Production'}
                </Badge></div>
                <div>Spark: <Badge variant={debugInfo.environment.sparkConnected ? "default" : "secondary"}>
                  {debugInfo.environment.sparkConnected ? 'Connected' : 'Offline'}
                </Badge></div>
              </div>
            </div>

            {/* Performance Metrics */}
            <div className="space-y-2">
              <span className="font-medium">Performance</span>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>Load Time: {debugInfo.performance.loadTime}ms</div>
                <div>Errors: {debugInfo.performance.errorCount}</div>
              </div>
            </div>

            {/* Suggestions */}
            {suggestions.length > 0 && (
              <div className="space-y-2">
                <span className="font-medium">Suggestions</span>
                <ScrollArea className="h-20">
                  <div className="space-y-1">
                    {suggestions.map((suggestion, index) => (
                      <div key={index} className="text-xs text-muted-foreground p-2 bg-muted/50 rounded">
                        {suggestion}
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            )}

            <div className="flex gap-2 pt-2">
              <Button 
                size="sm" 
                variant="outline" 
                onClick={() => debugManager.printDebugReport()}
                className="flex-1"
              >
                Print Report
              </Button>
              <Button 
                size="sm" 
                variant="outline" 
                onClick={() => debugManager.clearErrors()}
                className="flex-1"
              >
                Clear Errors
              </Button>
            </div>
          </CardContent>
        </Card>
      </CollapsibleContent>
    </Collapsible>
  )
}