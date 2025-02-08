import { GameState, Role } from "./types";

export const testStates: GameState[] = [
    {
        human: "Alice",
        players: [
            { name: "Alice", alive: true, role: Role.TOWNSPERSON },
            { name: "Bob", alive: true, role: Role.MAFIA },
            { name: "Charlie", alive: false, role: Role.DETECTIVE },
            { name: "Diana", alive: true, role: Role.DOCTOR }
        ],
        state: "ready",
        events: ["Night 1: Bob eliminated Charlie", "Day 1: Discussion started"],
        discussion: [
            { player_name: "Alice", message: "I think Bob is suspicious." },
            { player_name: "Bob", message: "I'm just a townsperson!" }
        ],
        accusation: "Bob"
    },
    {
        human: "Alice",
        players: [
            { name: "Alice", alive: true, role: Role.TOWNSPERSON },
            { name: "Bob", alive: false, role: Role.MAFIA },
            { name: "Charlie", alive: false, role: Role.DETECTIVE },
            { name: "Diana", alive: true, role: Role.DOCTOR }
        ],
        state: "night",
        events: ["Day 1: Bob was accused and eliminated", "Night 2: Mafia is planning"],
        discussion: [],
        accusation: ""
    },
    {
        human: "Alice",
        players: [
            { name: "Alice", alive: true, role: Role.TOWNSPERSON },
            { name: "Bob", alive: true, role: Role.MAFIA },
            { name: "Charlie", alive: true, role: Role.DETECTIVE },
            { name: "Diana", alive: false, role: Role.DOCTOR }
        ],
        state: "accusation",
        events: ["Night 2: Mafia eliminated Diana", "Day 2: Accusation started"],
        discussion: [
            { player_name: "Alice", message: "We need to find the mafia." },
            { player_name: "Charlie", message: "I have some clues." }
        ],
        accusation: "Alice"
    }
];
