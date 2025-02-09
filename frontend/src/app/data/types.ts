

export type SetupData = {
    game_id: string,
    player_name: string,
    num_players: number
}

export type FetchResult<T> = {
    status: Status,
    data?: T,
    message?: string
}

export enum Status {
    Ok = 1,
    Error = 0
}

export type GameState = {
    human: string
    players: PlayerData[],
    state: State,
    night_summary: string[],
    discussion: Message[],
    accused: string,
    accusationNumber: number,
    accuser: string,
    votes: Vote[]
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

export type Vote = {
    player_name: string,
    vote: boolean
}

export enum Role {
    VILLAGER = "villager",
    MAFIA = "mafia",
    DETECTIVE = "detective",
    DOCTOR = "doctor"
}

export enum State {
    READY = "ready",
    NIGHT = "night",
    DISCUSSION = "discussion",
    ACCUSATION = "accusation",
    VOTING = "voting"
}

export enum Actions {
    VOTE = "vote",
    ACCUSE = "accuse",
    DISCUSS = "discuss",
    DEFEND = "defend",
    HEAL = "heal",
    INVESTIGATE = "investigate",
    KILL = "kill",
    SLEEP = "sleep"
}

export type SocketData = {
    game_id: string,
    action_type: Actions,
    voted?: string,
    accused?: string,
    discussed?: string,
    defence?: string,
    healed?: string,
    investigate?: string,
    kill?: string
}