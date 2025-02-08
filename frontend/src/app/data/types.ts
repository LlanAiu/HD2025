

export type SetupData = {
    game_id: string,
    num_players: number
}

export type GameState = {
    human: string
    players: PlayerData[],
    state: string,
    events: string[],
    discussion: Message[],
    accusation: string
}

export type PlayerData = {
    name: string, 
    alive: boolean,
    role: Role
}

export type Message = {
    player_name: string,
    message: string
}

export enum Role {
    TOWNSPERSON = "townsperson",
    MAFIA = "mafia",
    DETECTIVE = "detective",
    DOCTOR = "doctor"
}