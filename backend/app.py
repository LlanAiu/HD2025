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

test_data = {
    "human": "player1",
    "players": [
        {"name": "player1", "alive": True, "role": "villager"},
        {"name": "player2", "alive": True, "role": "mafia"},
        {"name": "player3", "alive": True, "role": "detective"},
        {"name": "player4", "alive": True, "role": "doctor"}
    ],
    "state": "discussion",
    "night_summary": ["Literally nothing happened last night"],
    "discussion": [
        {"player_name": "player1", "message": "Let's find the mafia!"},
        {"player_name": "player2", "message": "I'm not the mafia!"}
    ],
    "accused": "",
    "accusationNumber": 0,
    "accuser": ""
}

@app.websocket("/ws/game/{game_id}")
async def websocket_endpoint(websocket: WebSocket, game_id: str):
    await manager.connect(game_id, websocket)
    try:
        while True:
            data = await websocket.receive_json()
            print("Received:", data)
            await manager.broadcast(game_id, test_data)
    except WebSocketDisconnect:
        manager.disconnect(game_id, websocket)

@app.get("/")
def root():
    return {"message" : "Hello world!"}