from enum import Enum

class Roles(Enum):
    VILLAGER = "villager"
    MAFIA = "mafia"
    DOCTOR = "doctor"
    DETECTIVE = "detective"

class Player:
    def __init__(self, alive:bool, name:str, role:Roles, is_human:bool, temperature:float):
        self.alive = True
        self.name = name
        self.role = role
        self.is_human = is_human
        self.temperature = temperature

    def __str__(self):
        ret = f"Name: {self.name}, Role: {self.role}, Human: {self.is_human}, Temperature: {self.temperature}"
        return ret
        




    

    

