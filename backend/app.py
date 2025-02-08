# builtin

# external
from fastapi import FastAPI

# internal
from 

app: FastAPI = FastAPI()


@app.get("/")
def root():
    return {"message" : "Hello world!"}

@app.post("/game/new")
def new_game():
    return None

@app.post("/game/start")
def game_start():
    return None

@app.put("/night/update")
def game_night():
    return None

@app.post("day/discussion")
def game_discussion():
    return None

@app.put("/day/accusations")
def game_accusations():
    return None

@app.get("/day/vote")
def game_vote():
    return None

@app.put("/day/convict")
def game_convict():
    return None



