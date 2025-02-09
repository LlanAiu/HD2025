from pydantic import BaseModel

class NewGameRequest(BaseModel):
    game_id: str
    player_name: str
    num_players: int

class GetGameRequest(BaseModel):
    game_id: str

class PlayerData(BaseModel):
    name: str
    alive: bool
    role: str

class Message(BaseModel):
    player_name: str
    message: str

class Vote(BaseModel):
    player_name: str
    vote: bool

class GetGameResponse(BaseModel):
    human: str
    players: list[PlayerData]
    state: str
    night_summary: list[str]
    discussion: list[Message]
    accused: str
    accusationNumber: int
    accuser: str
    votes: list[Vote]
    game_over: str