from enum import Enum
import anthropic
import random

class Roles(Enum):
    VILLAGER = "villager"
    MAFIA = "mafia"
    DOCTOR = "doctor"
    DETECTIVE = "detective"


TEMPERATURE_SETTING = 0.5


class GPTManager:
    playersAlive = []
    mafiaAlive = []
    townsfolkAlive = []
    playersStartingGame = []
    playerRoles = {}
    mafia = []
    client = anthropic.Anthropic()

    villagerKnowledge = []
    detectiveKnowledge = []
    mafiaKnowledge = []
    doctorKnowledge = []

    def __init__(self, player_role_dict):
        """
        Argument: Dictionary{string (player's name): enum (player's role)}
        """
        self.playersAlive = list(player_role_dict.keys())
        self.playersStartingGame = list(player_role_dict.keys())
        self.playerRoles = player_role_dict
        for player, role in self.playerRoles.items():
            if role == Roles.MAFIA:
                self.mafia.add(player)

    def generate_system_prompt_for_player(self, playerName):
        # TODO Add Examples and say The following is the game as it has happened so far...
        if (self.playerRoles[playerName] == Roles.VILLAGER):
            prompt = (  
                f"You are {playerName}, a player in a game of Mafia. Your name is {playerName}, and your role is citizen. There are {len(self.mafia)} mafia, 1 detective, and 1 doctor in the game. Everyone else is a citizen.",
                f"Your goal is to find the mafia and vote them out before you die. The players who started the game are: {", ".join(player for player in self.playersStartingGame)}. ",
                f"Respond conversationally in short sentences, like a human player would. Write only 1-3 sentences per response, unless specified otherwise. "
            )
            return prompt
        if (self.playerRoles[playerName] == Roles.MAFIA):
            prompt = (  
                f"You are {playerName}, a player in a game of Mafia. Your name is {playerName}, and your role is mafia. There are {len(self.mafia)} mafia, 1 detective, and 1 doctor in the game. Everyone else is a citizen. The mafia  are: {", ".join(player for player in self.mafia)}",
                f"Your goal is to find the mafia and vote them out before you die. The players who started the game are: {", ".join(player for player in self.playersStartingGame)}.\n",
                f"Respond conversationally in short sentences, like a human player would. Write only 1-3 sentences per response, unless specified otherwise.\n\n",
                f"Here are a few examples of how you can respond to my queries: \n",
            )
            return prompt
        if (self.playerRoles[playerName] == Roles.DETECTIVE):
            prompt = (  
                f"You are {playerName}, a player in a game of Mafia. Your name is {playerName}, and your role is detective. There are {len(self.mafia)} mafia, 1 detective, and 1 doctor in the game. Everyone else is a citizen.",
                f"Your goal is to find the mafia and vote them out before you die. When you investigate a player, you will learn if they are the mafia. If you find mafia, you should try to accuse them and convince others to vote them out. The players who started the game are: {", ".join(player for player in self.playersStartingGame)}. ",
                f"Respond conversationally in short sentences, like a human player would. Write only 1-3 sentences per response, unless specified otherwise. "
            )
            return prompt
        if (self.playerRoles[playerName] == Roles.DOCTOR):
            prompt = (  
                f"You are {playerName}, a player in a game of Mafia. Your name is {playerName}, and your role is detective. There are {len(self.mafia)} mafia, 1 detective, and 1 doctor in the game. Everyone else is a citizen.",
                f"Your goal is to find the mafia and vote them out before you die. Every night you will be able to heal a player, including yourself, and hopefully prevent them from being killed by the mafia. The players who started the game are: {", ".join(player for player in self.playersStartingGame)}. ",
                f"Respond conversationally in short sentences, like a human player would. Write only 1-3 sentences per response, unless specified otherwise. "
            )
            return prompt
        

    def update_memory(self, name, text, players_alive):
        """
        Argument string: The name of the player who said this sentence (can be narrator)
                string: The text that the palyer said
                List[string]: A list of the names of all the players alive
        """
        memoryEntry = {
            "role" : name,
            "content" : [
                {
                    "type" : "text",
                    "text" : text
                }
            ]
        }
        self.villagerKnowledge.append(memoryEntry)
        self.detectiveKnowledge.append(memoryEntry)
        self.doctorKnowledge.append(memoryEntry)
        self.mafiaKnowledge.append(memoryEntry)
        self.playersAlive = players_alive
        for player in players_alive:
            if self.playerRoles[player] == Roles.MAFIA:
                self.mafiaAlive.append(player)
            else:
                self.townsfolkAlive.append(player)


    def who_to_kill(self, player_being_asked):
        """
        Argument, string: name of player being asked.
        Return, string: name of player they would like to kill.
        """
        self.mafiaKnowledge.append({
            "role" : "Narrator",
            "content" : [
                {
                    "type" : "text",
                    "text" : f"It is now night and no players can hear you. Who would you like to kill? The townsfolk alive are {", ".join(player for player in self.townsfolkAlive)}. Please respond with only one of these players and nothing else."
                }
            ]
        })

        message = self.client.messages.create(
            model="claude-3-5-sonnet-20241022",
            max_tokens=1000,
            temperature=TEMPERATURE_SETTING,
            system=self.generate_system_prompt_for_player(player_being_asked),
            messages=self.mafiaKnowledge
        )
        response = message.content

        playerToKill = ""
        for player in self.townsfolkAlive:
            if (player in response):
                playerToKill = player
            
        if playerToKill == "":
            playerToKill = random.choice(self.townsfolkAlive)

        self.mafiaKnowledge.append({
            "role" : player_being_asked,
            "content" : [
                {
                    "type" : "text",
                    "text" : f"(To narrator) I would like to kill {player}."
                }
            ]
        })

        return playerToKill
    

    def who_to_save(self, player_being_asked):
        """
        Argument, string: name of player being asked.
        Return, string: name of player they would like to save.
        """
        self.doctorKnowledge.append({
            "role" : "Narrator",
            "content" : [
                {
                    "type" : "text",
                    "text" : f"It is now night and no players can hear you. Who would you like to save? The alive players are {", ".join(player for player in self.playersAlive)}. Please respond with only one of these players and nothing else."
                }
            ]
        })

        message = self.client.messages.create(
            model="claude-3-5-sonnet-20241022",
            max_tokens=1000,
            temperature=TEMPERATURE_SETTING,
            system=self.generate_system_prompt_for_player(player_being_asked),
            messages=self.doctorKnowledge
        )
        response = message.content

        playerToSave = ""
        for player in self.playersAlive:
            if (player in response):
                playerToSave = player
            
        if playerToSave == "":
            playerToSave = random.choice(self.playersAlive)

        self.doctorKnowledge.append({
            "role" : player_being_asked,
            "content" : [
                {
                    "type" : "text",
                    "text" : f"(To narrator) I would like to save {player}."
                }
            ]
        })

        return playerToSave


    def who_to_investigate(self, player_being_asked):
        """
        Argument, string: name of player being asked.
        Return, string: name of player they would like to investigate.
        """

        # make sure to update the memory of the investigator
        return "Albert"


    def contibute_to_general_discussion(self, player_being_asked):
        """
        Argument, string: name of player being asked.
        Return, string: The text they would like to contribute to the discussion
        """
        return "I think Alex was being pretty sus."


    def accuse(self, player_being_asked, role):
        """
        Argument  string: name of player being asked.
                Role enum: role - the role of the player being asked
        Return, string: name of player they would like to investigate.
                string: text explaining why they want to accuse them
        """
        return ("Albert", "I want to accuse him because he is sus")


    def defence_from_accusation(self, player_being_asked, role):
        """
        Argument  string: name of player being asked.
                Role enum: role - the role of the player being asked
        Return, string: The text they would like to contribute to the discussion
        """
        return "I shouldn't be voted because of X"


    def vote(self, player_being_asked, role, player_being_accused):
        """
        Argument  string: name of player being asked.
                Role enum: role - the role of the player being asked
                string: name of player being accused / voted for
        Return: True if they would like to vote to kill or False if not
        """
        return True
