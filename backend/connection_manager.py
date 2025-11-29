from fastapi import WebSocket

class ConnectionManager:
    """Manages WebSocket connections for active simulations"""
    
    def __init__(self):
        self.active_connections: dict[int, list[WebSocket]] = {}
    
    async def connect(self, websocket: WebSocket, simulation_id: int):
        """Register a new WebSocket connection for a simulation"""
        await websocket.accept()
        if simulation_id not in self.active_connections:
            self.active_connections[simulation_id] = []
        self.active_connections[simulation_id].append(websocket)
    
    def disconnect(self, simulation_id: int, websocket: WebSocket):
        """Remove a WebSocket connection"""
        if simulation_id in self.active_connections:
            self.active_connections[simulation_id].remove(websocket)
            if not self.active_connections[simulation_id]:
                del self.active_connections[simulation_id]
    
    async def broadcast(self, simulation_id: int, message: dict):
        """Send a message to all connections for a simulation"""
        if simulation_id in self.active_connections:
            disconnected = []
            for connection in self.active_connections[simulation_id]:
                try:
                    await connection.send_json(message)
                except Exception:
                    disconnected.append(connection)
            
            for connection in disconnected:
                self.disconnect(simulation_id, connection)

manager = ConnectionManager()
