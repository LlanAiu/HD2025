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
        
    
    def role_assigner(self, num_players, num_mafia, num_villagers):
        roles = [Roles.MAFIA]*num_mafia + [Roles.VILLAGER]*(num_villagers-2) + [Roles.DOCTOR] + [Roles.DETECTIVE]
        names_list = [self.human] + self.get_names_list(num_players-1)

        random.shuffle(roles)

        for i in range(num_players):
            self.player_dict[names_list[i]] = Player(True, names_list[i], roles[i], i==0) # since human player corresponds to i=0, it sets as True and False for the rest
    
    def get_names_list(self, num_non_human_players): #TODO: test this
        """
        Returns a list of names for non-human players.
        """
        all_names = ['Aaliyah', 'Mateo', 'Naomi', 'Rohan', 'Amara', 'Diego', 'Sofia', 'Malik',
                       'Zahra', 'Javier', 'Leila', 'Elijah', 'Anaya', 'Omar', 'Kiara', 'Yusuf',
                         'Lucia', 'Kai', 'Imani', 'Miguel', 'Farah', 'Ezekiel', 'Ayana', 'Jalen',
                           'Priya', 'Xavier', 'Mei', 'Jorge', 'Zuri', 'Hassan', 'Sienna', 'Andrés',
                             'Maya', 'Rahul', 'Isabel', 'Kofi', 'Serena', 'Jabari', 'Layla', 'Niko',
                               'Tariq', 'Selena', 'Zayn', 'Fatima', 'Jaden', 'Elif', 'Cyrus', 'Lina', 'Tyrese', 'Amira']
        all_names.remove(self.human)
        return random.sample(all_names, num_non_human_players)

    def kill(self, name):
        """
        Arguments: string; name of player to kill.
        Sets alive status to false in player_dict and removes from alive_list
        Returns: void
        """
        self.player_dict[name].alive = False
        del self.alive_list[name]

    def day_accusations(self):
        accuser = random.choice(self.alive_list)
        return self.GPTManager.who_would_you_like_to_accuse(accuser, accuser.role)[0] #test tuple functionality (can i do [0])

    def day_voting(self, accused):
        """
        Arguments: string; name of player accused
        Sums accusation votes from all alive players. +1 if for, -1 if against
        Returns: boolean; True if player is killed, False otherwise
        """
        votes = 0
        for player in self.alive_list:
            vote_passed = self.GPTManager.vote(player, accused) #check correct function name
            if vote_passed:
                votes += 1
            else:
                votes -= 1
            
        if votes > 0:
            kill(accused)
            return True
        else:
            return False #if return false, run accusations again, 3 total times max. if still not passed, no one dies
    

    def night_voting(self, mafia_votes):
        """
        Arguments: 
        """
        if self.human in self.alive_list and self.player_dict[self.human].role == Roles.MAFIA:
            kill(self.GPTManager.who_to_kill(self.human))
            #TODO: maybe ask mafia what they think
        
        
        elif self.player_dict[self.human].role != Roles.MAFIA: 
            for player in self.alive_list:
                if self.player_dict[player].role == Roles.MAFIA:
                    kill(self.GPTManager.who_to_kill(player))
                    #TODO: communicate who was killed to narrator ()
                    break


    def night_investigating():
        return None

    def night_healing():
        return None
    
    
    def discussion(self):
        """
        Discussion method: uses random-weighted choice based off player dialogue to API call 
        """
        discussion_limit = random.randint(5,15)
        speaking_probabilities = dict.fromkeys(self.alive_list, 1/len(self.alive_list)) # Equal probability of speaking.
        for i in range(discussion_limit):
            talking = random.choices(self.alive_list, weights=list(speaking_probabilities.values()))
            response = self.GPTManager.contibute_to_general_discussion(talking)
            for j in self.alive_list:
                if j in response: # Increase their responsiveness by 10% (0.1), and decrease everyone else's proportion by 0.1/(n-1)
                    for()
                    
            

    


            
            
            
        

    def determine_game_over(self):
        return 2*self.count_type(Roles.MAFIA) >= self.get_list_of_active_players()

    def count_type(self, search:Roles):
        count = 0
        for i in list(self.player_dict.values()):
            if i.role == search:
                count += 1
        return count


    def run_game(self):
        """
        Main Game loop: Calls all event functions, updates memory
        """
        while not determine_game_over():