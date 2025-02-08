import Game from "../game";

export default async function Page({ params }: { params: { id: string } }) {
    const game_id = (await params).id;

    return (
        <>
            <Game game_id={game_id} />
        </>
    );
}