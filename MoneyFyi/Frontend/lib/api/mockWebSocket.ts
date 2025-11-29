type EventCallback = (data: any) => void

export class MockWebSocket {
  private listeners: Map<string, EventCallback[]> = new Map()
  
  emit(event: string, data: any) {
    const callbacks = this.listeners.get(event) || []
    callbacks.forEach(cb => cb(data))
  }
  
  on(event: string, callback: EventCallback) {
    const existing = this.listeners.get(event) || []
    this.listeners.set(event, [...existing, callback])
  }
  
  off(event: string, callback: EventCallback) {
    const existing = this.listeners.get(event) || []
    this.listeners.set(event, existing.filter(cb => cb !== callback))
  }
  
  // Simulate document processing events
  simulateDocumentProcessing(documentId: string) {
    this.emit('document_processing_started', { id: documentId })
    
    let progress = 0
    const interval = setInterval(() => {
      progress += 10
      this.emit('document_processing_progress', { id: documentId, progress })
      
      if (progress >= 100) {
        clearInterval(interval)
        this.emit('document_processing_completed', { 
          id: documentId,
          status: 'completed'
        })
      }
    }, 500)
  }
  
  // Simulate new alert
  simulateNewAlert(alert: any) {
    setTimeout(() => {
      this.emit('new_alert_created', alert)
    }, 2000)
  }
}

export const mockWs = new MockWebSocket()
