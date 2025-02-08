import { GameState, Role, SetupData } from "./types";

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
    } else {

    }
}

export async function fetchGameState(id: string) {
    checkValidEnvironment();
    const response = await fetch(`/api/game/${id}/state`);

    if (response.ok) {
        const data = await response.json();
        return data;
    } else {
        console.error("Error fetching game state");
    }
}
