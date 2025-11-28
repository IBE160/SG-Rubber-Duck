/**
 * WebSocket Client Service
 * Manages real-time connections to backend simulation events
 */

const WS_BASE_URL = import.meta.env.VITE_WS_BASE_URL || 'ws://localhost:8001';

export interface SimulationEvent {
  type: 'progress' | 'task_update' | 'risk_occurred' | 'cost_update' | 'error' | 'complete';
  data: Record<string, unknown>;
  timestamp: string;
}

export class WebSocketClient {
  private ws: WebSocket | null = null;
  private url: string;
  private listeners: Map<string, Set<(event: SimulationEvent) => void>> = new Map();
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000; // ms
  private isIntentionallyClosed = false;

  constructor(simulationId: string) {
    this.url = `${WS_BASE_URL}/ws/simulations/${simulationId}/events`;
  }

  /**
   * Connect to the WebSocket server
   */
  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        this.ws = new WebSocket(this.url);

        this.ws.onopen = () => {
          console.log('WebSocket connected:', this.url);
          this.reconnectAttempts = 0;
          this.emit('connected', {
            type: 'progress',
            data: { status: 'connected' },
            timestamp: new Date().toISOString(),
          });
          resolve();
        };

        this.ws.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data) as SimulationEvent;
            this.emit(data.type, data);
          } catch (err) {
            console.error('Failed to parse WebSocket message:', err);
          }
        };

        this.ws.onerror = (error) => {
          console.error('WebSocket error:', error);
          this.emit('error', {
            type: 'error',
            data: { error: String(error) },
            timestamp: new Date().toISOString(),
          });
          reject(error);
        };

        this.ws.onclose = () => {
          console.log('WebSocket closed');
          this.ws = null;
          
          if (!this.isIntentionallyClosed) {
            this.attemptReconnect();
          }
        };
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Attempt to reconnect to WebSocket
   */
  private attemptReconnect(): void {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1); // Exponential backoff
      console.log(`Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts}) in ${delay}ms`);

      setTimeout(() => {
        this.connect().catch((err) => {
          console.error('Reconnection failed:', err);
        });
      }, delay);
    } else {
      console.error('Max reconnection attempts reached');
      this.emit('error', {
        type: 'error',
        data: { error: 'Connection lost - max reconnect attempts exceeded' },
        timestamp: new Date().toISOString(),
      });
    }
  }

  /**
   * Subscribe to a specific event type
   */
  on(eventType: string, callback: (event: SimulationEvent) => void): () => void {
    if (!this.listeners.has(eventType)) {
      this.listeners.set(eventType, new Set());
    }
    this.listeners.get(eventType)!.add(callback);

    // Return unsubscribe function
    return () => {
      const callbacks = this.listeners.get(eventType);
      if (callbacks) {
        callbacks.delete(callback);
      }
    };
  }

  /**
   * Emit an event to all subscribed listeners
   */
  private emit(eventType: string, event: SimulationEvent): void {
    const callbacks = this.listeners.get(eventType);
    if (callbacks) {
      callbacks.forEach((callback) => {
        try {
          callback(event);
        } catch (err) {
          console.error(`Error in listener for ${eventType}:`, err);
        }
      });
    }
  }

  /**
   * Disconnect from WebSocket
   */
  disconnect(): void {
    this.isIntentionallyClosed = true;
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

  /**
   * Check if connected
   */
  isConnected(): boolean {
    return this.ws !== null && this.ws.readyState === WebSocket.OPEN;
  }
}

/**
 * React Hook for WebSocket connection management
 */
import { useEffect, useRef, useCallback, useState } from 'react';

export const useWebSocket = (simulationId: string | null) => {
  const clientRef = useRef<WebSocketClient | null>(null);
  const eventsRef = useRef<SimulationEvent[]>([]);
  const [events, setEvents] = useState<SimulationEvent[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const subscribe = useCallback((eventType: string, callback: (event: SimulationEvent) => void) => {
    if (clientRef.current) {
      return clientRef.current.on(eventType, callback);
    }
    return () => {};
  }, []);

  useEffect(() => {
    if (!simulationId) return;

    const client = new WebSocketClient(simulationId);
    clientRef.current = client;

    // Subscribe to all events
    const unsubscribeProgress = client.on('progress', (event) => {
      eventsRef.current = [event, ...eventsRef.current].slice(0, 100); // Keep last 100 events
      setEvents([...eventsRef.current]);
    });

    const unsubscribeError = client.on('error', (event) => {
      eventsRef.current = [event, ...eventsRef.current].slice(0, 100);
      setEvents([...eventsRef.current]);
      setError(String(event.data.error));
    });

    const unsubscribeComplete = client.on('complete', (event) => {
      eventsRef.current = [event, ...eventsRef.current].slice(0, 100);
      setEvents([...eventsRef.current]);
    });

    const unsubscribeConnected = client.on('connected', () => {
      setIsConnected(true);
      setError(null);
    });

    // Connect
    client.connect().catch((err) => {
      setError(String(err));
      setIsConnected(false);
    });

    // Cleanup
    return () => {
      unsubscribeProgress();
      unsubscribeError();
      unsubscribeComplete();
      unsubscribeConnected();
      client.disconnect();
      clientRef.current = null;
    };
  }, [simulationId]);

  return {
    events,
    isConnected,
    error,
    subscribe,
  };
};
