
import { get_initial_state } from "@/app/data/data_client";
import Game from "../game";
import { FetchResult, GameState, Status } from "@/app/data/types";

export default async function Page({ params }: { params: { id: string } }) {
    const game_id = (await params).id;

    const result: FetchResult<GameState> = await get_initial_state(game_id);

    let state: GameState | undefined;

    if(result.status === Status.Ok) {
        state = result.data;
    } else {
        state = undefined;
    }


    return (
        <>
            {state !== undefined ? <Game game_id={game_id} init_state={state}/> : <p>Couldn't fetch game with id: {game_id}</p>}
        </>
    );
}