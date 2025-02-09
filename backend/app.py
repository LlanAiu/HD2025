# builtin
from contextlib import asynccontextmanager
import json

# external
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from typing import List

# internal
from game import Game
from player import Player
from player_prompts import GPTManager

app = FastAPI()

@asynccontextmanager
async def lifespan(app: FastAPI):
    app.state.games = {}
    yield


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
            message = await websocket.receive_json()  # General receiver
            game = app.state.games[message[game_id]]
            if message["action_type"] == "vote":
                user_vote = message["voted"]
                game.day_voting(game.accused, user_vote)
            elif message["action_type"] == "defense":
                user_defense = message["defense"]
                game.get_defense(user_defense)
            elif message["action_type"] == "accuse":
                accuse_choice = message["accused"]
                game.day_accusations(game.is_human_accuser,accuse_choice)
            elif message["action_type"] == "discuss":
                user_message = message["discuss"]
                game.listen_for_user(user_message)
            elif message["action_type"] == "heal":
                heal_choice = message["healed"]
                game.night_voting("")
                game.night_healing(heal_choice)
                game.night_investigating("")
            elif message["action_type"] == "investigate":
                investigate_choice = message["investigate"]
                game.night_voting("")
                game.night_healing("")
                game.night_investigating(investigate_choice)
            elif message["action_type"] == "kill":
                kill_choice = message["kill"]
                game.night_voting(kill_choice)
                game.night_healing("")
                game.night_investigating("")
            elif message["action_type"] == "sleep":
                game.night_voting("")
                game.night_healing("")
                game.night_investigating("")
        
            await manager.broadcast(game_id, game.get_gamestate_json())

    except WebSocketDisconnect:
        manager.disconnect(game_id, websocket)


@app.post("/game/new")
async def new_game(data: json):
    id = data["game_id"]
    player_name = data["player_name"]
    num_players = int(data["num_players"])
    app.state.games[id] = Game(player_name, num_players)
