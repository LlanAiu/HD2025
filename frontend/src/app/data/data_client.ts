'use server'

import { FetchResult, GameState, Role, SetupData, State, Status } from "./types";

const BACKEND_URL_DEV: string | undefined = process.env.BACKEND_DEV;
const BACKEND_URL_DEPLOY: string | undefined = process.env.BACKEND_DEPLOY;

function isProduction(): boolean {
    return process.env.NODE_ENV === "production";
}

const BACKEND_URL: string | undefined = isProduction() ? BACKEND_URL_DEPLOY : BACKEND_URL_DEV
console.log(`Set backend URL to ${BACKEND_URL}`);

class InvalidEnvironmentError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "InvalidEnvironmentError";
    }
}

function checkValidEnvironment() {
    if (BACKEND_URL === undefined) {
        throw new InvalidEnvironmentError("Environment missing valid backend url!");
    }
}

const JSON_HEADER: Headers = new Headers();
JSON_HEADER.append("Content-Type", "application/json");


export async function create_new_game(setup_data: SetupData) {
    checkValidEnvironment();
    const response = await fetch(`${BACKEND_URL}/game/new`, {
        method: "POST",
        headers: JSON_HEADER,
        body: JSON.stringify(setup_data)
    });

    if (response.ok) {
        const data = await response.json();

        return {
            status: Status.Ok,
            data: data
        };
    } else {
        return {
            status: Status.Error,
            message: "Failed To create game"
        }
    }
}

export async function get_initial_state(id: string): Promise<FetchResult<GameState>> {
    checkValidEnvironment();
    // const response = await fetch(`${BACKEND_URL}/game/${id}`);

    const sampleData: GameState = {
        human: "Alice",
        players: [
            { name: "Alice", alive: true, role: Role.TOWNSPERSON },
            { name: "Bob", alive: true, role: Role.MAFIA }
        ],
        state: State.NIGHT,
        events: ["Day 1 started", "Alice voted for Bob"],
        discussion: [
            { player_name: "Alice", message: "I think Bob is suspicious." },
            { player_name: "Bob", message: "I'm not the mafia!" }
        ],
        accusation: "Bob"
    };
    
    return {
        status: Status.Ok,
        data: sampleData
    };

    // if (response.ok) {
    //     const data = await response.json();

    //     return {
    //         status: Status.Ok,
    //         data: data
    //     };
    // } else {
    //     return {
    //         status: Status.Error,
    //         message: "Failed To create game"
    //     }
    // }
}
