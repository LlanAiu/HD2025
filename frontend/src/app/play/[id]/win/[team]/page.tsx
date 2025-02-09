import { EndResult, GameState } from "@/app/data/types";
import Link from "next/link";
import { redirect } from 'next/navigation';

export default async function Win({ params }: { params: { team : string } }) {

    const team = (await params).team;

    return (
        <div>
            <h1>Congratulations!</h1>
            <p>The {team} have won the game!</p>
            <Link href={"/"}>
                <p>Return To Home</p>
            </Link>
        </div>
    );
}