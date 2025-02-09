import { GameState, Role, State, EndResult } from "./types";

export const testStates: GameState[] = [
    {
        human: "Alice",
        players: [
            { name: "Alice", alive: true, role: Role.VILLAGER },
            { name: "Bob", alive: true, role: Role.MAFIA },
            { name: "Charlie", alive: false, role: Role.DETECTIVE },
            { name: "Diana", alive: true, role: Role.DOCTOR }
        ],
        state: State.READY,
        night_summary: ["Night 1: Bob eliminated Charlie", "Day 1: Discussion started"],
        discussion: [
            { player_name: "Alice", message: "I think Bob is suspicious." },
            { player_name: "Bob", message: "I'm just a villager!" }
        ],
        accused: "Bob",
        accusationNumber: 1,
        accuser: "Alice",
        votes: [
            { player_name: "Alice", vote: true },
            { player_name: "Bob", vote: false },
            { player_name: "Charlie", vote: true },
            { player_name: "Diana", vote: false }
        ],
        game_over: EndResult.IN_PROGRESS
    },
    {
        human: "Bob",
        players: [
            { name: "Alice", alive: true, role: Role.VILLAGER },
            { name: "Bob", alive: true, role: Role.MAFIA },
            { name: "Charlie", alive: false, role: Role.DETECTIVE },
            { name: "Diana", alive: true, role: Role.DOCTOR }
        ],
        state: State.NIGHT,
        night_summary: ["Day 1: Bob was accused and eliminated", "Night 2: Mafia is planning"],
        discussion: [],
        accused: "",
        accusationNumber: 0,
        accuser: "",
        votes: [
            { player_name: "Alice", vote: true },
            { player_name: "Bob", vote: false },
            { player_name: "Charlie", vote: true },
            { player_name: "Diana", vote: false }
        ],
        game_over: EndResult.IN_PROGRESS
    },
    {
        human: "Charlie",
        players: [
            { name: "Alice", alive: true, role: Role.VILLAGER },
            { name: "Bob", alive: false, role: Role.MAFIA },
            { name: "Charlie", alive: false, role: Role.DETECTIVE },
            { name: "Diana", alive: true, role: Role.DOCTOR }
        ],
        state: State.NIGHT,
        night_summary: ["Day 1: Bob was accused and eliminated", "Night 2: Mafia is planning"],
        discussion: [],
        accused: "",
        accusationNumber: 0,
        accuser: "",
        votes: [
            { player_name: "Alice", vote: true },
            { player_name: "Bob", vote: false },
            { player_name: "Charlie", vote: true },
            { player_name: "Diana", vote: false }
        ],
        game_over: EndResult.IN_PROGRESS
    },
    {
        human: "Alice",
        players: [
            { name: "Alice", alive: true, role: Role.VILLAGER },
            { name: "Bob", alive: true, role: Role.MAFIA },
            { name: "Charlie", alive: true, role: Role.DETECTIVE },
            { name: "Diana", alive: false, role: Role.DOCTOR }
        ],
        state: State.ACCUSATION,
        night_summary: ["Night 2: Mafia eliminated Diana", "Day 2: Accusation started"],
        discussion: [
            { player_name: "Alice", message: "We need to find the mafia." },
            { player_name: "Charlie", message: "I have some clues." }
        ],
        accused: "Alice",
        accusationNumber: 2,
        accuser: "Charlie",
        votes: [
            { player_name: "Alice", vote: true },
            { player_name: "Bob", vote: false },
            { player_name: "Charlie", vote: true }
        ],
        game_over: EndResult.IN_PROGRESS
    },
    {
        human: "Alice",
        players: [
            { name: "Alice", alive: true, role: Role.VILLAGER },
            { name: "Bob", alive: false, role: Role.MAFIA },
            { name: "Charlie", alive: false, role: Role.DETECTIVE },
            { name: "Diana", alive: true, role: Role.DOCTOR }
        ],
        state: State.DISCUSSION,
        night_summary: ["Day 1: Bob was accused and eliminated", "Night 2: Mafia is planning"],
        discussion: [],
        accused: "",
        accusationNumber: 0,
        accuser: "",
        votes: [
            { player_name: "Alice", vote: true },
            { player_name: "Charlie", vote: true },
            { player_name: "Diana", vote: false }
        ],
        game_over: EndResult.IN_PROGRESS
    },
    {
        human: "Alice",
        players: [
            { name: "Alice", alive: true, role: Role.VILLAGER },
            { name: "Bob", alive: false, role: Role.MAFIA },
            { name: "Charlie", alive: false, role: Role.DETECTIVE },
            { name: "Diana", alive: true, role: Role.DOCTOR }
        ],
        state: State.VOTING,
        night_summary: ["Day 1: Bob was accused and eliminated", "Night 2: Mafia is planning"],
        discussion: [],
        accused: "Bob",
        accusationNumber: 1,
        accuser: "Alice",
        votes: [
            { player_name: "Alice", vote: true },
            { player_name: "Charlie", vote: true },
            { player_name: "Diana", vote: false }
        ],
        game_over: EndResult.IN_PROGRESS
    }
];
