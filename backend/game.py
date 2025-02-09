from player import Player
from player import Roles
from enum import Enum
from player_prompts import GPTManager
import random
import json
from models import GetGameResponse, PlayerData, Message, Vote

class State(Enum):
    READY = "ready"
    NIGHT = "night"
    DISCUSSION = "discussion"
    ACCUSATION = "accusation"
    VOTING = "voting"


class EndResult(Enum):
    MAFIA_WIN = "mafia_win"
    VILLAGER_WIN = "villager_win"
    IN_PROGRESS = "in_progress"


class Game:
    human = ""
    player_dict = {}
    alive_list = []
    all_discussion = []
    current_state = ""
    GPTManager = None
    accusations = 0
    is_human_accuser = False
    accuser = ""
    accused = ""
    current_night_summary = ""
    current_discussion = []
    current_votes = []
    person_killed = ""


    def __init__(self, human_name:str, num_players:int, api_key):
        """
        Args:
        human_name: str
        num_players: int
        """
        num_mafia = round(num_players/4)
        num_villagers = num_players - num_mafia
        
        self.human = human_name
        self.player_dict = self.role_assigner(num_players, num_mafia, num_villagers)

        for name in list(self.player_dict.keys()):
            self.alive_list.append(name)

        
        GPT_dict = {}
        for (name, player) in self.player_dict.items():
            GPT_dict[name] = player.role
        
        self.GPTManager = GPTManager(GPT_dict, api_key=api_key) 
        # for name, player in self.player_dict.items(): #testing
        #     print(f"{name}: {player.role}, Human: {player.is_human}, Alive: {player.alive}") #testing

        self.current_state = State.READY
        
    def role_assigner(self, num_players: int, num_mafia: int, num_villagers: int): #WORKS
        """
        Args:
        num_players: int.
        num_mafia: int.
        num_villagers: int.

        Returns:
        None.

        Method takes in a certain number of players, number of mafias, number of villagers, 
        and assumes 1 doctor and detective. 
        Creates a list of roles and shuffles them, creating new players.
        """
        roles = [Roles.MAFIA]*num_mafia + [Roles.VILLAGER]*(num_villagers-2) + [Roles.DOCTOR] + [Roles.DETECTIVE]
        names_list = [self.human] + self.get_names_list(num_players-1)

        random.shuffle(roles)

        for i in range(num_players):
            self.player_dict[names_list[i]] = Player(True, names_list[i], roles[i], i==0, random.random()) 
            # since human player corresponds to i=0, it sets as True and False for the rest
        return self.player_dict
    
    def get_names_list(self, num_non_human_players): #WORKS
        """
        Arguments: int; number of non-human players.
        Returns a list of names for non-human players.
        
        """
        all_names = ['Aaliyah', 'Mateo', 'Naomi', 'Rohan', 'Amara', 'Diego', 'Sofia', 'Malik',
                       'Zahra', 'Javier', 'Leila', 'Elijah', 'Anaya', 'Omar', 'Kiara', 'Yusuf',
                         'Lucia', 'Kai', 'Imani', 'Miguel', 'Farah', 'Ezekiel', 'Ayana', 'Jalen',
                           'Priya', 'Xavier', 'Mei', 'Jorge', 'Zuri', 'Hassan', 'Sienna', 'Andrés',
                             'Maya', 'Rahul', 'Isabel', 'Kofi', 'Serena', 'Jabari', 'Layla', 'Niko',
                               'Tariq', 'Selena', 'Zayn', 'Fatima', 'Jaden', 'Elif', 'Cyrus', 'Lina',
                                 'Tyrese', 'Amira', 'Avrick', 'Srinath', 'Alan', 'Georgiy']
        if (self.human in all_names):
            all_names.remove(self.human)
        return random.sample(all_names, num_non_human_players) 
        #return all_names[:num_non_human_players] #temp hardcode for testing


    def kill(self, name): #WORKS
        """
        Arguments: string; name of player to kill.
        Sets alive status to false in player_dict and removes from alive_list.
        Returns: void.
        """
        self.player_dict[name].alive = False
        del self.alive_list[self.alive_list.index(name)]

    def get_day_accuser(self):
        self.accuser = random.choice(self.alive_list)
        if self.accuser == self.human:
            self.is_human_accuser = True
        else:
            self.is_human_accuser = False
        return self.accuser
        
    def get_day_accusation(self, who_player_accusing):
        self.accusations+=1
        if self.is_human_accuser and who_player_accusing != "":
            self.accused = who_player_accusing
        else:
            self.accused = self.GPTManager.who_would_you_like_to_accuse(self.accuser)[0] 
        self.GPTManager.update_memory("Narrator", f"{self.accuser} is accusing {self.accused}.", self.alive_list) #test tuple functionality (can i do [0])
        #testing
        return self.accused

    def get_defense(self, player_defense):
        if self.accused == self.human and player_defense != "":
            self.GPTManager.update_memory(self.accused, player_defense, self.alive_list)
            self.current_discussion.append({"player_name":self.accused, "message":player_defense})
        elif self.accused != self.human:
            response = self.GPTManager.defence_from_accusation(self.accused)
            self.current_discussion.append({"player_name":self.accused, "message":response})
            self.GPTManager.update_memory(self.accused, response, self.alive_list)

    def day_voting(self, accused, user_vote:str=""):
        """
        Arguments: string, string; name of player accused, the user's vote that's either "True" or "False".
        Sums accusation votes from all alive players. +1 if for, -1 if against.
        Tells GPTManager who was killed.
        Returns: boolean; True if player is killed, False otherwise.
        """
        self.current_state = State.VOTING
        self.current_votes = []
        votes = 0
        for player in self.alive_list:
            if (player == self.human):
                self.current_votes.append({"player_name":player, "Vote":user_vote})
                if user_vote:
                    votes += 1
                else:
                    votes -= 1
            else:
                vote_passed = self.GPTManager.vote(player, accused)
                self.current_votes.append({"player_name":player, "Vote":vote_passed})
                if vote_passed:
                    votes += 1
                else:
                    votes -= 1
            
        if votes > 0:
            self.kill(accused)
            sentence = f"The villagers voted {accused} to die."
            self.GPTManager.update_memory("Narrator", sentence, self.alive_list)
            return True
        else:
            sentence = f"The villagers failed to reach a consensus. No one has died."
            self.GPTManager.update_memory("Narrator", sentence, self.alive_list)
            return False #if return false, run accusations again, 3 total times max. if still not passed, no one dies
    
    def night_voting(self, user_choice : str = ""):
        """
        Arguments: string; name of player the human would like to kill 
        if the user is part of the mafia (this condition is handled externally).
        If human is mafia, human chooses who to kill. 
        If human is not mafia, one mafia member chosen at random decides who to kill.
        They are not killed, but passed to night_healing().
        GPTManager communication is handled in night_healing().
        Returns: string; name of player killed.
        """
        self.current_state = State.NIGHT
        person_killed = ""
    
        if (user_choice != "" and user_choice != None):
            person_killed = user_choice
            #TODO: maybe ask mafia what they think
        elif self.player_dict[self.human].role != Roles.MAFIA:
            for player in self.alive_list:
                if self.player_dict[player].role == Roles.MAFIA:
                    person_killed = self.GPTManager.who_to_kill(player) 
                    #person_killed = "Naomi" #testing
                    break
        self.person_killed = person_killed
        return person_killed

    def night_investigating(self): #WORKS without GPTManager
        """
        Arguments: None. 
        The detective is passed to GPTManager.
        Returns: void.
        """

        if self.player_dict[self.human].role == Roles.DETECTIVE:
            pass
            #Front end handles this case
        else:
            detective = None
            for player in self.alive_list:
                 if self.player_dict[player].role == Roles.DETECTIVE:
                    detective = player
                    break
            self.GPTManager.who_to_investigate(detective)
        #TODO: maybe make narrator say "the detective is investigating someone"

    def night_healing(self, user_choice:str=""):
        """
        Arguments: string, string; name of player killed by mafia, name of player to be saved by human 
        if they are the doctor (this condition is handled externally).
        The argument is checked to see if the doctor saved them.
        The doctor is passed to GPTManager.
        Returns: void.
        """
        person_killed = self.person_killed
        # print(f"Saved {person_saved}")
        print(f"Killed {person_killed}")
        if self.player_dict[self.human].role == Roles.DOCTOR:
            person_saved = user_choice
        else: 
            doctor = None
            for player in self.alive_list:
                if self.player_dict[player].role == Roles.DOCTOR:
                    doctor = player
                    break
            person_saved = self.GPTManager.who_to_save(doctor)
            #person_saved = "Aaliyah" # for testing
            
        if person_killed == person_saved:
            sentence = f"The mafia attempted to kill {person_killed}, but the doctor saved them."
            self.GPTManager.update_memory("Narrator", sentence, self.alive_list) #testing
            self.current_night_summary = sentence
            #print(sentence) #testing
        else:
            sentence = f"{person_killed} was killed by the mafia."
            self.GPTManager.update_memory("Narrator", sentence, self.alive_list) #testing
            self.current_night_summary = sentence
            # print(sentence) #testing
            # print(person_killed) #testing
            self.kill(person_killed)
    
    def discussion(self): #don't know how to test the response stuff without the GPTManager
        """
        Discussion method: uses random-weighted choice based off player dialogue to API call.
        """
        self.current_state = State.DISCUSSION
        self.current_discussion = []
        discussion_limit = random.randint(5,15)
        speaking_probabilities = dict.fromkeys(self.alive_list, 1/len(self.alive_list)) # Equal probability of speaking.
        for _ in range(discussion_limit):
            talking = random.choices(self.alive_list, weights=list(speaking_probabilities.values()))[0]
            response = self.GPTManager.contribute_to_general_discussion(talking)
            self.current_discussion.append({"player_name":talking, "message":response})
            self.GPTManager.update_memory(talking, response, self.alive_list)
            for j in self.alive_list:
                if j in response: # Increase their responsiveness by 10% (0.1), and decrease everyone else's proportion by 0.1/(n-1)
                    for k in list(speaking_probabilities.keys()):
                        speaking_probabilities[k] += 0.1 if j == k else -0.1/(len(self.alive_list)-1)
        self.current_state = State.ACCUSATION

    def listen_for_user(self, user_message):
        """
        Listens to see if the user chats anything during discussion.
        """
        # TODO: Testing to see if this works, if not we need async.
        self.current_discussion.append({"player_name":self.human, "message":user_message})
        self.GPTManager.update_memory(self.human,user_message, self.alive_list)
        
    def determine_game_result(self):
        if 2*self.count_type(Roles.MAFIA) >= len(self.alive_list): # Crazy inequality math, figure it out lol.
            return EndResult.MAFIA_WIN
        if self.count_type(Roles.MAFIA) == 0:
            return EndResult.VILLAGER_WIN
        return EndResult.IN_PROGRESS
        
    
    def count_type(self, search:Roles):
        count = 0
        for player in self.alive_list:
            if self.player_dict[player].role == search:
                count += 1
        return count

    def get_gamestate_json(self):
        data = {}
        data['human'] = self.human
        data['players'] = []
        for name, player in self.player_dict.items():
            json_player = {}
            json_player['name'] = name
            json_player['alive'] = player.alive
            json_player['role'] = player.role
            data['players'].append(json_player)
        data['state'] = self.current_state
        data['night_summary'] = self.current_night_summary
        data['discussion'] = self.current_discussion
        data['accused'] = self.accused
        data['accusationNumber'] = self.accusations
        data['accuser'] = self.accuser
        data['votes'] = self.current_votes
        data['game_result'] = self.determine_game_result()
        json_data = json.dumps(data)
        print(json_data)
        return json_data
    
    def get_web_response(self) -> GetGameResponse:
        return GetGameResponse(
            human=self.human,
            players=[PlayerData(name=player.name, alive=player.alive, role=player.role.value) for player in self.player_dict.values()],
            state=self.current_state.value,
            night_summary=[self.current_night_summary],
            discussion=[Message(player_name=msg["player_name"], message=msg["message"]) for msg in self.current_discussion],
            accused=self.accused,
            accusationNumber=self.accusations,
            accuser=self.accuser,
            votes=[Vote(player_name=vote["player_name"], vote=vote["Vote"]) for vote in self.current_votes],
            game_over=self.determine_game_result().value
        )

if __name__ == "__main__":
    game = Game("human", 7)
    person_killed = game.night_voting() #Killing Naomi
    #game.night_investigating() #doesn't do anything tbh, nothing to test
    #game.night_healing(person_killed) #Saving Aaliyah, or Naomi works
    # accuser = game.get_day_accuser()
    # print(accuser)
    # print(accuser)
    accused = game.get_day_accusation("Aaliyah")
    print(accused)
    
    #test defense
    """
    i=0
    while i < 3:
        if game.day_voting(accused):
            break

        accused = game.day_accusations()
        i+=1
    """
