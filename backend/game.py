from player import Player
from player import Roles
from player_prompts import GPTManager
import random

class Game:
    human = ""
    player_dict = {}
    alive_list = {}
    all_discussion = []
    GPTManager = None


    def __init__(self, human_name:str, num_players:int):
        """
        Args:
        human_name: str
        num_players: int
        """
        num_mafia = round(num_players/4)
        num_villagers = num_players - num_mafia
        
        self.human = human_name
        self.player_dict = self.role_assigner(num_players, num_mafia, num_villagers)
        for name in self.player_dict.keys():
            self.alive_list.append(name)
        
        GPT_dict = {}
        for (name, player) in self.player_dict.items():
            GPT_dict[name] = player.role
        
        self.GPTManager = GPTManager(GPT_dict)  
        self.run_game() # Loop for game events
        
    def role_assigner(self, num_players: int, num_mafia: int, num_villagers: int):
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
            self.player_dict[names_list[i]] = Player(True, names_list[i], roles[i], i==0, random.random()) # since human player corresponds to i=0, it sets as True and False for the rest
    
    def get_names_list(self, num_non_human_players): #TODO: test this
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
        all_names.remove(self.human)
        return random.sample(all_names, num_non_human_players)

    def kill(self, name):
        """
        Arguments: string; name of player to kill.
        Sets alive status to false in player_dict and removes from alive_list.
        Returns: void.
        """
        self.player_dict[name].alive = False
        del self.alive_list[name]

    def day_accusations(self): #TODO: handle case when human is accused. Frontend might need to handle this.
        """
        Arguments: none.
        Randomly selects a player to accuse another player by calling GPTManager.
        Returns: string; name of player accused.
        """
        accuser = random.choice(self.alive_list)
        accused = self.GPTManager.who_would_you_like_to_accuse(accuser, accuser.role)[0]
        self.GPTManager.update_memory("Narrator", f"{accuser} is accusing {accused}.", self.alive_list) #test tuple functionality (can i do [0])
        return accused

    def day_voting(self, accused):
        """
        Arguments: string; name of player accused.
        Sums accusation votes from all alive players. +1 if for, -1 if against.
        Tells GPTManager who was killed.
        Returns: boolean; True if player is killed, False otherwise.
        """
        votes = 0
        for player in self.alive_list:
            vote_passed = self.GPTManager.vote(player, accused) #check correct function name
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
    
    def night_voting(self):
        """
        Arguments: none.
        If human is mafia, human chooses who to kill. 
        If human is not mafia, one mafia member chosen at random decides who to kill.
        They are not killed, but passed to night_healing().
        GPTManager communication is handled in night_healing().
        Returns: string; name of player killed.
        """
        person_killed = None
        if self.human in self.alive_list and self.player_dict[self.human].role == Roles.MAFIA:
            person_killed = self.GPTManager.who_to_kill(self.human)
            #TODO: maybe ask mafia what they think
        
        
        elif self.player_dict[self.human].role != Roles.MAFIA:
            for player in self.alive_list:
                if self.player_dict[player].role == Roles.MAFIA:
                    person_killed = self.GPTManager.who_to_kill(player)
                    break
        return person_killed

    def night_investigating(self):
        """
        Arguments: none.
        The detective is passed to GPTManager.
        Returns: void.
        """

        detective = None
        for player in self.alive_list:
            if self.player_dict[player].role == Roles.DETECTIVE:
                detective = player
                break

        self.GPTManager.who_to_investigate(detective)
        #TODO: maybe make narrator say "the detective is investigating someone"

    def night_healing(self, person_killed):
        """
        Arguments: string; name of player killed by mafia.
        The argument is checked to see if the doctor saved them.
        The doctor is passed to GPTManager.
        Returns: void.
        """
        doctor = None
        for player in self.alive_list:
            if self.player_dict[player].role == Roles.DOCTOR:
                doctor = player
                break

        person_saved = self.GPTManager.who_to_heal(doctor)
        if person_killed == person_saved:
            sentence = f"The mafia attempted to kill {person_killed}, but the doctor saved them."
            self.GPTManager.update_memory("Narrator", sentence, self.alive_list)
        else:
            sentence = f"{person_killed} was killed by the mafia."
            self.GPTManager.update_memory("Narrator", sentence, self.alive_list)
            self.kill(person_killed)
    
    def discussion(self):
        """
        Discussion method: uses random-weighted choice based off player dialogue to API call.
        """
        discussion_limit = random.randint(5,15)
        speaking_probabilities = dict.fromkeys(self.alive_list, 1/len(self.alive_list)) # Equal probability of speaking.
        for i in range(discussion_limit):
            talking = random.choices(self.alive_list, weights=list(speaking_probabilities.values()))
            response = self.GPTManager.contribute_to_general_discussion(talking)
            self.GPTManager.update_memory(talking, response, self.alive_list)
            for j in self.alive_list:
                if j in response: # Increase their responsiveness by 10% (0.1), and decrease everyone else's proportion by 0.1/(n-1)
                    for k in list(speaking_probabilities.keys()):
                        speaking_probabilities[k] += 0.1 if j == k else -0.1/(len(self.alive_list)-1)
                        
    def listen_for_user(self, user_message):
        # TODO: Testing to see if this works, if not we need async.
        self.GPTManager.contribute_to_general_discussion(self.human,user_message)
        
    def determine_game_over(self):
        return 2*self.count_type(Roles.MAFIA) >= self.get_list_of_active_players() # Crazy inequality math, figure it out lol.
    
    def count_type(self, search:Roles):
        count = 0
        for player in self.alive_list:
            if player.role == search:
                count += 1
        return count


    def run_game(self):
        """
        Main Game loop: Calls all event functions.
        """
        while not self.determine_game_over():
            person_killed = self.night_voting()
            self.night_investigating()
            self.night_healing(person_killed)
            self.discussion()
            accused = self.day_accusations()
            
            i=0
            while i < 3:
                if self.day_voting(accused):
                    break

                accused = self.day_accusations()
                i+=1
        
            
