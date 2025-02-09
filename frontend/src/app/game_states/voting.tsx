import React, { useState } from 'react';
import { PlayerData, State } from '../data/types';

interface VotingProps {
    player: PlayerData;
    accused: string;
    narratorMessage: string;
    onVote: (vote: 'Y' | 'N') => void;
    continueTurn: (next: State) => void;
    nextTurn: () => void;
}

export default function Voting({ player, accused, narratorMessage, onVote, continueTurn, nextTurn }: VotingProps) {
    const [vote, setVote] = useState<'Y' | 'N' | null>(null);
    const [voteMessage, setVoteMessage] = useState<'guilty' | 'not guilty' | null>(null);

    const handleVote = (vote: 'Y' | 'N') => {
        const vote_message: 'guilty' | 'not guilty' = vote === 'Y' ? 'guilty' : 'not guilty';
        setVote(vote);
        setVoteMessage(vote_message);
    };

    const handleSubmit = () => {
        if(vote !== null) {
            onVote(vote)
        }
    }

    return (
        <div className="mt-5 p-6 border border-gray-300 rounded-lg bg-gray-50 max-w-lg mx-auto">
            <h2 className="text-2xl font-bold mb-4">Voting</h2>
            <p className="text-lg mb-6">Accused: {accused}</p>
            {player.alive && 
                <div className='space-y-2'>
                    <button
                        className={`block w-full py-2 px-4 rounded ${vote === 'Y' ? 'bg-blue-600 text-white font-bold' : 'bg-blue-500 text-white'}`}
                        onClick={() => handleVote('Y')}
                    >
                        Guilty!
                    </button>
                    <button 
                        className={`block w-full py-2 px-4 rounded ${vote === 'N' ? 'bg-green-600 text-white font-bold' : 'bg-green-500 text-white'}`}
                        onClick={() => handleVote('N')}
                    >
                        Not Guilty!
                    </button>
                </div>
            }

            {vote && <p className="mt-4 text-lg font-semibold">You have voted that {accused} is {voteMessage}.</p>}

            {player.alive && 
                <button 
                    className="mt-4 w-full py-2 px-4 bg-indigo-600 text-white font-bold rounded hover:bg-indigo-700"
                    onClick={handleSubmit}
                >
                    Confirm
                </button>
            }
            {!player.alive && 
                <button 
                    className="mt-4 w-full py-2 px-4 bg-gray-600 text-white font-bold rounded hover:bg-gray-700"
                    onClick={() => continueTurn(State.NIGHT)}
                >
                    Continue
                </button>
            }
            <p className="mt-4 text-lg">{narratorMessage}</p>

            { (player.alive && narratorMessage.length > 0) && 
                <button 
                    className="mt-4 w-full py-2 px-4 bg-gray-600 text-white font-bold rounded hover:bg-gray-700"
                    onClick={nextTurn}
                >
                    Continue
                </button>
            }
        </div>
    );
}
