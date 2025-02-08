'use client'

import { useState } from "react";
import Ready from "../game_states/ready";
import Night from "../game_states/night";
import Discussion from "../game_states/discussion";
import Accusation from "../game_states/accusation";

export default function Game({ game_id }: { game_id: String }) {
    
    const [state, setState] = useState<String>("ready");
    const [round, setRound] = useState<number>(1);

    const test_state = ["ready", "night", "discussion", "accusation"];

    return (
        <>
            {state == "ready" && <Ready />}
            {state == "night" && <Night round={round} />}
            {state == "discussion" && <Discussion />}
            {state == "accusation" && <Accusation />}

            <div>
                Game with ID: {game_id}
            </div>

            <button onClick={() => setState(test_state[Math.floor(Math.random() * test_state.length)])}>
                Change State Randomly
            </button>
        </>
    );
}