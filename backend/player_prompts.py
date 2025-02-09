from enum import Enum
import anthropic
import random


class Roles(Enum):
    VILLAGER = "villager"
    MAFIA = "mafia"
    DOCTOR = "doctor"
    DETECTIVE = "detective"


TEMPERATURE_SETTING = 1
GENERAL_TOKEN_LIMIT = 200


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
                self.mafia.append(player)
                self.mafiaAlive.append(player)
            else:
                self.townsfolkAlive.append(player)

    def generate_system_prompt_for_player(self, playerName):
        # TODO Add Examples and say The following is the game as it has happened so far...
        if (self.playerRoles[playerName] == Roles.VILLAGER):
            prompt = [  
                f"You are {playerName}, a player in a game of Mafia. Your name is {playerName}, and your role is citizen. There are {len(self.mafia)} mafia, 1 detective, and 1 doctor in the game. Everyone else is a citizen.",
                f"Your goal is to find the mafia and vote them out before you die. The players who started the game are: {", ".join(player for player in self.playersStartingGame)}. ",
                f"Respond conversationally in short sentences, like a human player would. Write only 1-3 sentences per response, unless specified otherwise. ",
                f"Here are a few examples of how to respond:",
                f"<example 1>\nNarrator: Please contribute 1-2 sentences to the discussion.\n{playerName}: I think it has to be {random.choice(self.playersStartingGame)}, who else would kill {random.choice(self.playersStartingGame)}? I think they were looking at me funny, it makes me a little scared.",
                f"<example 2>\nNarrator: Please contribute 1-2 sentences to the discussion.\n{playerName}: Guys, it's not me! I swear I didn't kill them!!!",
                f"<example 3>\nNarrator: Would you like to vote for Bill? Respond with yes or no.\n{playerName}: Yes."
            ]
            return "\n".join(prompt)
        if (self.playerRoles[playerName] == Roles.MAFIA):
            prompt = (  
                f"You are {playerName}, a player in a game of Mafia. Your name is {playerName}, and your role is mafia. There are {len(self.mafia)} mafia, 1 detective, and 1 doctor in the game. Everyone else is a citizen. The mafia  are: {", ".join(player for player in self.mafia)}",
                f"Your goal is to kill all the townsfolk before the players vote you out. The players who started the game are: {", ".join(player for player in self.playersStartingGame)}.\n",
                f"Respond conversationally in short sentences, like a human player would. Write only 1-3 sentences per response, unless specified otherwise.\n\n",
                f"Here are a few examples of how to respond:",
                f"<example 1>\nNarrator: Please contribute 1-2 sentences to the discussion.\n{playerName}: I think it has to be {random.choice(self.playersStartingGame)}, who else would kill {random.choice(self.playersStartingGame)}? I think they were looking at me funny, it makes me a little scared.",
                f"<example 2>\nNarrator: Please contribute 1-2 sentences to the discussion.\n{playerName}: Guys, it's not me! I swear I didn't kill them!!!",
                f"<example 3>\nNarrator: Would you like to vote for Bill? Respond with yes or no.\n{playerName}: Yes."
            )
            return "\n".join(prompt)
        if (self.playerRoles[playerName] == Roles.DETECTIVE):
            prompt = (  
                f"You are {playerName}, a player in a game of Mafia. Your name is {playerName}, and your role is detective. There are {len(self.mafia)} mafia, 1 detective, and 1 doctor in the game. Everyone else is a citizen.",
                f"Your goal is to find the mafia and vote them out before you die. When you investigate a player, you will learn if they are the mafia. If you find mafia, you should try to accuse them and convince others to vote them out. The players who started the game are: {", ".join(player for player in self.playersStartingGame)}. ",
                f"Respond conversationally in short sentences, like a human player would. Be careful about revealing you are the detective, or the mafia might kill you. Sometimes, though it is the best move to reveal yourself and accuse the mafia. Write only 1-3 sentences per response, unless specified otherwise. ",
                f"Here are a few examples of how to respond:",
                f"<example 1>\nNarrator: Please contribute 1-2 sentences to the discussion.\n{playerName}: I think it has to be {random.choice(self.playersStartingGame)}, who else would kill {random.choice(self.playersStartingGame)}? I think they were looking at me funny, it makes me a little scared.",
                f"<example 2>\nNarrator: Please contribute 1-2 sentences to the discussion.\n{playerName}: Guys, it's not me! I swear I didn't kill them!!!",
                f"<example 3>\nNarrator: Would you like to vote for Bill? Respond with yes or no.\n{playerName}: Yes."
            )
            return "\n".join(prompt)
        if (self.playerRoles[playerName] == Roles.DOCTOR):
            prompt = (  
                f"You are {playerName}, a player in a game of Mafia. Your name is {playerName}, and your role is doctor. There are {len(self.mafia)} mafia, 1 detective, and 1 doctor in the game. Everyone else is a citizen.",
                f"Your goal is to find the mafia and vote them out before you die. Every night you will be able to heal a player, including yourself, and hopefully prevent them from being killed by the mafia. The players who started the game are: {", ".join(player for player in self.playersStartingGame)}. ",
                f"Respond conversationally in short sentences, like a human player would. Try not to let the mafia know you are the doctor, or they might kill you. Write only 1-3 sentences per response, unless specified otherwise. ",
                f"Here are a few examples of how to respond:",
                f"<example 1>\nNarrator: Please contribute 1-2 sentences to the discussion.\n{playerName}: I think it has to be {random.choice(self.playersStartingGame)}, who else would kill {random.choice(self.playersStartingGame)}? I think they were looking at me funny, it makes me a little scared.",
                f"<example 2>\nNarrator: Please contribute 1-2 sentences to the discussion.\n{playerName}: Guys, it's not me! I swear I didn't kill them!!!",
                f"<example 3>\nNarrator: Would you like to vote for Bill? Respond with yes or no.\n{playerName}: Yes."
            )
            return "\n".join(prompt)
        

    def update_memory(self, name, text, players_alive):
        """
        Argument string: The name of the player who said this sentence (can be narrator)
                string: The text that the palyer said
                List[string]: A list of the names of all the players alive
        """
        memoryEntry = {
            "role" : "user",
            "content" : [
                {
                    "type" : "text",
                    "text" : name + ": " + text
                }
            ]
        }
        self.villagerKnowledge.append(memoryEntry)
        self.detectiveKnowledge.append(memoryEntry)
        self.doctorKnowledge.append(memoryEntry)
        self.mafiaKnowledge.append(memoryEntry)
        self.playersAlive = players_alive
        self.mafiaAlive = []
        self.townsfolkAlive = []
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
            "role" : "user",
            "content" : [
                {
                    "type" : "text",
                    "text" : f"Narrator: It is now night and no players can hear you. Who would you like to kill? The townsfolk alive are {", ".join(player for player in self.townsfolkAlive)}. Please respond with only one of these players and nothing else."
                }
            ]
        })

        message = self.client.messages.create(
            model="claude-3-5-sonnet-20241022",
            max_tokens=GENERAL_TOKEN_LIMIT,
            temperature=TEMPERATURE_SETTING,
            system=self.generate_system_prompt_for_player(player_being_asked),
            messages=self.mafiaKnowledge
        )
        response = message.content[0].text.lower()

        playerToKill = ""
        for player in self.townsfolkAlive:
            if (player.lower() in response):
                playerToKill = player
            
        if playerToKill == "":
            print('RANDOM PLAYER KILLED')
            playerToKill = random.choice(self.townsfolkAlive)

        self.mafiaKnowledge.append({
            "role" : "assistant",
            "content" : [
                {
                    "type" : "text",
                    "text" : f"{player_being_asked}: (To narrator) I would like to kill {playerToKill}."
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
            "role" : "user",
            "content" : [
                {
                    "type" : "text",
                    "text" : f"Narrator: It is now night and no players can hear you. Who would you like to save and prevent the mafia from killing? The alive players are {", ".join(player for player in self.playersAlive)}. Please respond with only one of these players and nothing else."
                }
            ]
        })

        message = self.client.messages.create(
            model="claude-3-5-sonnet-20241022",
            max_tokens=GENERAL_TOKEN_LIMIT,
            temperature=TEMPERATURE_SETTING,
            system=self.generate_system_prompt_for_player(player_being_asked),
            messages=self.doctorKnowledge
        )
        response = message.content[0].text.lower()
        playerToSave = ""
        for player in self.playersAlive:
            if (player.lower() in response):
                playerToSave = player
            
        if playerToSave == "":
            print("PLAYER TO SAVE RANDOMLY PICKED")
            playerToSave = random.choice(self.playersAlive)

        self.doctorKnowledge.append({
            "role" : "assistant",
            "content" : [
                {
                    "type" : "text",
                    "text" : f"({player_being_asked}: (To narrator) I would like to save {playerToSave}."
                }
            ]
        })

        return playerToSave


    def who_to_investigate(self, player_being_asked):
        """
        Argument, string: name of player being asked.
        Return, string: name of player they would like to investigate.
        """

        self.detectiveKnowledge.append({
            "role" : "user",
            "content" : [
                {
                    "type" : "text",
                    "text" : f"Narrator: It is now night and no players can hear you. Who would you like to investigate and learn if they are the mafia? The alive players are {", ".join(player for player in self.playersAlive)}. Please respond with only one of these players and nothing else."
                }
            ]
        })

        message = self.client.messages.create(
            model="claude-3-5-sonnet-20241022",
            max_tokens=GENERAL_TOKEN_LIMIT,
            temperature=TEMPERATURE_SETTING,
            system=self.generate_system_prompt_for_player(player_being_asked),
            messages=self.detectiveKnowledge
        )
        response = message.content[0].text.lower()

        playerToInvestigate = ""
        for player in self.playersAlive:
            if (player.lower() in response):
                playerToInvestigate = player
            
        if playerToInvestigate == "":
            print("PLAYER TO INVESTIGATE RANDOMLY PICKED")
            playerToInvestigate = random.choice(self.playersAlive)

        self.detectiveKnowledge.append({
            "role" : "assistant",
            "content" : [
                {
                    "type" : "text",
                    "text" : f"{player_being_asked}: (To narrator) I would like to investigate {playerToInvestigate}."
                }
            ]
        })

        if (playerToInvestigate in self.mafiaAlive):
            self.detectiveKnowledge.append({
            "role" : "user",
            "content" : [
                {
                    "type" : "text",
                    "text" : f"Narrator: {playerToInvestigate} is one of the mafia. Next time you speak you may want reveal you are the investigator to accuse him, at the risk of being killed by the mafia."
                }
            ]
            })
        else:
            self.detectiveKnowledge.append({
                "role" : "user",
                "content" : [
                    {
                        "type" : "text",
                        "text" : f"Narrator: {playerToInvestigate} is a townsfolk."
                    }
                ]
            })
        
        return playerToInvestigate


    def contribute_to_general_discussion(self, player_being_asked):
        """
        Argument, string: name of player being asked.
        Return, string: The text they would like to contribute to the discussion
        """
        context = []
        if self.playerRoles[player_being_asked] == Roles.VILLAGER:
            context = list(self.villagerKnowledge)
        elif self.playerRoles[player_being_asked] == Roles.DETECTIVE:
            context = list(self.detectiveKnowledge)
        elif self.playerRoles[player_being_asked] == Roles.DOCTOR:
            context = list(self.doctorKnowledge)
        elif self.playerRoles[player_being_asked] == Roles.MAFIA:
            context = list(self.mafiaKnowledge)

        context.append({
            "role" : "user",
            "content" : [
                {
                    "type" : "text",
                    "text" : "Narrator: Please contribute 1-2 sentences to the discussion."
                }
            ]
        })
        message = self.client.messages.create(
            model="claude-3-5-sonnet-20241022",
            max_tokens=GENERAL_TOKEN_LIMIT,
            temperature=TEMPERATURE_SETTING,
            system=self.generate_system_prompt_for_player(player_being_asked),
            messages=self.detectiveKnowledge
        )
        return message.content[0].text


    def who_would_you_like_to_accuse(self, player_being_asked):
        """
        Argument  string: name of player being asked.
                Role enum: role - the role of the player being asked
        Return, string: name of player they would like to accuse.
                string: text explaining why they want to accuse them
        """
        context = []
        if self.playerRoles[player_being_asked] == Roles.VILLAGER:
            context = list(self.villagerKnowledge)
        elif self.playerRoles[player_being_asked] == Roles.DETECTIVE:
            context = list(self.detectiveKnowledge)
        elif self.playerRoles[player_being_asked] == Roles.DOCTOR:
            context = list(self.doctorKnowledge)
        elif self.playerRoles[player_being_asked] == Roles.MAFIA:
            context = list(self.mafiaKnowledge)

        context.append({
            "role" : "user",
            "content" : [
                {
                    "type" : "text",
                    "text" : f"Narrator: Please say who you would like to accuse and why in 2-3 sentences. Your options are {", ".join(player for player in self.playersAlive)}."
                }
            ]
        })
        message = self.client.messages.create(
            model="claude-3-5-sonnet-20241022",
            max_tokens=GENERAL_TOKEN_LIMIT,
            temperature=TEMPERATURE_SETTING,
            system=self.generate_system_prompt_for_player(player_being_asked),
            messages=self.detectiveKnowledge
        )

        response = message.content[0].text
        lowerCaseResponse = response.lower()

        playerToAccuse = None
        for player in self.playersAlive:
            if (player in lowerCaseResponse):
                playerToAccuse = player

        return (playerToAccuse, response)

    def defence_from_accusation(self, player_being_asked):
        """
        Argument  string: name of player being asked.
                Role enum: role - the role of the player being asked
        Return, string: The text they would like to contribute to the discussion
        """
        context = []
        if self.playerRoles[player_being_asked] == Roles.VILLAGER:
            context = list(self.villagerKnowledge)
        elif self.playerRoles[player_being_asked] == Roles.DETECTIVE:
            context = list(self.detectiveKnowledge)
        elif self.playerRoles[player_being_asked] == Roles.DOCTOR:
            context = list(self.doctorKnowledge)
        elif self.playerRoles[player_being_asked] == Roles.MAFIA:
            context = list(self.mafiaKnowledge)

        context.append({
            "role" : "user",
            "content" : [
                {
                    "type" : "text",
                    "text" : f"Narrator: You have been accused. Please defend yourself with a 2-3 sentence response."
                }
            ]
        })
        message = self.client.messages.create(
            model="claude-3-5-sonnet-20241022",
            max_tokens=GENERAL_TOKEN_LIMIT,
            temperature=TEMPERATURE_SETTING,
            system=self.generate_system_prompt_for_player(player_being_asked),
            messages=self.detectiveKnowledge
        )

        return message.content[0].text


    def vote(self, player_being_asked, player_being_accused):
        """
        Argument  string: name of player being asked.
                Role enum: role - the role of the player being asked
                string: name of player being accused / voted for
        Return: True if they would like to vote to kill or False if not
        """
        context = []
        if self.playerRoles[player_being_asked] == Roles.VILLAGER:
            context = list(self.villagerKnowledge)
        elif self.playerRoles[player_being_asked] == Roles.DETECTIVE:
            context = list(self.detectiveKnowledge)
        elif self.playerRoles[player_being_asked] == Roles.DOCTOR:
            context = list(self.doctorKnowledge)
        elif self.playerRoles[player_being_asked] == Roles.MAFIA:
            context = list(self.mafiaKnowledge)

        context.append({
            "role" : "user",
            "content" : [
                {
                    "type" : "text",
                    "text" : f"Narrator: Would you like to vote for {player_being_accused}?\n System: Answer with yes or no."
                }
            ]
        })
        message = self.client.messages.create(
            model="claude-3-5-sonnet-20241022",
            max_tokens=5,
            temperature=TEMPERATURE_SETTING,
            system=self.generate_system_prompt_for_player(player_being_asked),
            messages=self.detectiveKnowledge
        )

        response = message.content[0].text.lower()

        if ("yes" in response):
            return True
        elif ("no" in response):
            return False
        print('VOTE RANDOMIZED')
        return random.choice([True], [False])
