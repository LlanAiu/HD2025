from pydantic import BaseModel

class NewGameRequest(BaseModel):
    game_id: str
    player_name: str
    num_players: int
