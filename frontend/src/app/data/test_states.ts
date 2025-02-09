import { GameState, Role, State } from "./types";

export const testStates: GameState[] = [
    {
        human: "Alice",
        players: [
            { name: "Alice", alive: true, role: Role.TOWNSPERSON },
            { name: "Bob", alive: true, role: Role.MAFIA },
            { name: "Charlie", alive: false, role: Role.DETECTIVE },
            { name: "Diana", alive: true, role: Role.DOCTOR }
        ],
        state: State.READY,
        events: ["Night 1: Bob eliminated Charlie", "Day 1: Discussion started"],
        discussion: [
            { player_name: "Alice", message: "I think Bob is suspicious." },
            { player_name: "Bob", message: "I'm just a townsperson!" }
        ],
        accusation: "Bob",
        accusationNumber: 1,
        accusing: "Alice"
    },
    {
        human: "Bob",
        players: [
            { name: "Alice", alive: true, role: Role.TOWNSPERSON },
            { name: "Bob", alive: false, role: Role.MAFIA },
            { name: "Charlie", alive: false, role: Role.DETECTIVE },
            { name: "Diana", alive: true, role: Role.DOCTOR }
        ],
        state: State.NIGHT,
        events: ["Day 1: Bob was accused and eliminated", "Night 2: Mafia is planning"],
        discussion: [],
        accusation: "",
        accusationNumber: 0,
        accusing: ""
    },
    {
        human: "Charlie",
        players: [
            { name: "Alice", alive: true, role: Role.TOWNSPERSON },
            { name: "Bob", alive: false, role: Role.MAFIA },
            { name: "Charlie", alive: false, role: Role.DETECTIVE },
            { name: "Diana", alive: true, role: Role.DOCTOR }
        ],
        state: State.NIGHT,
        events: ["Day 1: Bob was accused and eliminated", "Night 2: Mafia is planning"],
        discussion: [],
        accusation: "",
        accusationNumber: 0,
        accusing: ""
    },
    {
        human: "Alice",
        players: [
            { name: "Alice", alive: true, role: Role.TOWNSPERSON },
            { name: "Bob", alive: true, role: Role.MAFIA },
            { name: "Charlie", alive: true, role: Role.DETECTIVE },
            { name: "Diana", alive: false, role: Role.DOCTOR }
        ],
        state: State.ACCUSATION,
        events: ["Night 2: Mafia eliminated Diana", "Day 2: Accusation started"],
        discussion: [
            { player_name: "Alice", message: "We need to find the mafia." },
            { player_name: "Charlie", message: "I have some clues." }
        ],
        accusation: "Alice",
        accusationNumber: 2,
        accusing: "Charlie"
    },
    {
        human: "Alice",
        players: [
            { name: "Alice", alive: true, role: Role.TOWNSPERSON },
            { name: "Bob", alive: false, role: Role.MAFIA },
            { name: "Charlie", alive: false, role: Role.DETECTIVE },
            { name: "Diana", alive: true, role: Role.DOCTOR }
        ],
        state: State.DISCUSSION,
        events: ["Day 1: Bob was accused and eliminated", "Night 2: Mafia is planning"],
        discussion: [],
        accusation: "",
        accusationNumber: 0,
        accusing: ""
    },
    {
        human: "Alice",
        players: [
            { name: "Alice", alive: true, role: Role.TOWNSPERSON },
            { name: "Bob", alive: false, role: Role.MAFIA },
            { name: "Charlie", alive: false, role: Role.DETECTIVE },
            { name: "Diana", alive: true, role: Role.DOCTOR }
        ],
        state: State.VOTING,
        events: ["Day 1: Bob was accused and eliminated", "Night 2: Mafia is planning"],
        discussion: [],
        accusation: "Bob",
        accusationNumber: 1,
        accusing: "Alice"
    },
];
