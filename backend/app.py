# builtin
from contextlib import asynccontextmanager

# external
from fastapi import FastAPI, WebSocket, WebSocketDisconnect

# internal

@asynccontextmanager
async def lifespan(app: FastAPI):
    app.state.games = {}
    yield

app: FastAPI = FastAPI(lifespan=lifespan)

class ConnectionManager:
    def __init__(self):
        self.active_connections: list[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)

    async def broadcast(self, message: dict):
        for connection in self.active_connections:
            await connection.send_json(message)

manager = ConnectionManager()

@app.websocket("/ws/game")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            data = await websocket.receive_json()
            print("Received:", data)
            await manager.broadcast({
                "recieved_data" : data,
                "message" : "Got data back" 
            })
    except WebSocketDisconnect:
        manager.disconnect(websocket)

@app.get("/")
def root():
    return {"message" : "Hello world!"}