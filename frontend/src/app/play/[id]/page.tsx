
import Game from "../game";

export default async function Page({ params } : { params: Promise<{game_id: String}> }) {
    const game_id = (await params).game_id;

    return (
        <>
            <Game game_id={game_id}/>
        </>
    );
}