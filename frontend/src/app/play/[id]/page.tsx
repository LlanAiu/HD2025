import Game from "../game";

export default function Page({ params }: { params: { id: string } }) {
    const { id: game_id } = params;

    console.log(game_id);

    return (
        <>
            <Game game_id={game_id} />
        </>
    );
}