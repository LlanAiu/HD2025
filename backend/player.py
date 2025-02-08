import player_prompts
from enum import Enum


class Roles(Enum):
    VILLAGER = "villager"
    MAFIA = "mafia"
    DOCTOR = "doctor"
    DETECTIVE = "detective"

class Player:
    roles = {"Mafia":0,"Detective":1,"Doctor":2,"Villager":3} # Just a list for now, not actually used me thinks.
    def __init__(self, alive:bool, name:str, role:Roles, is_human:bool):
        self.alive = True
        self.name = name
        self.role = role
        self.is_human = is_human
        #TODO: implement temperature

    def call_player_prompts(self, prompt:str):




    

    

