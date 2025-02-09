# builtin
from contextlib import asynccontextmanager

# external
from fastapi import FastAPI, WebSocket, WebSocketDisconnect

# internal

@asynccontextmanager
async def lifespan(app: FastAPI):
    app.state.games = {"lol" : "what"}
    yield

app: FastAPI = FastAPI(lifespan=lifespan)

class ConnectionManager:
    def __init__(self):
        self.active_connections: dict[str, list[WebSocket]] = {}

    async def connect(self, game_id: str, websocket: WebSocket):
        await websocket.accept()
        if game_id not in self.active_connections:
            self.active_connections[game_id] = []
        self.active_connections[game_id].append(websocket)

    def disconnect(self, game_id: str, websocket: WebSocket):
        self.active_connections[game_id].remove(websocket)
        if not self.active_connections[game_id]:
            del self.active_connections[game_id]

    async def broadcast(self, game_id: str, message: dict):
        if game_id in self.active_connections:
            for connection in self.active_connections[game_id]:
                await connection.send_json(message)

manager = ConnectionManager()

@app.websocket("/ws/game/{game_id}")
async def websocket_endpoint(websocket: WebSocket, game_id: str):
    await manager.connect(game_id, websocket)
    try:
        while True:
            data = await websocket.receive_json()
            print(app.state.games["lol"])
            print("Received:", data)
            await manager.broadcast(game_id, {
                "recieved_data" : data,
                "message" : "Got data back" 
            })
    except WebSocketDisconnect:
        manager.disconnect(game_id, websocket)

@app.get("/")
def root():
    return {"message" : "Hello world!"}