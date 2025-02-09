import React, { useState } from 'react';

interface VotingProps {
    accused: string;
    onVote: (vote: 'Y' | 'N') => void;
}

export default function Voting({ accused, onVote }: VotingProps) {
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
        <div className="p-6 border border-gray-300 rounded-lg bg-gray-50 max-w-md mx-auto">
            <h2 className="text-2xl font-bold mb-4">Voting</h2>
            <p className="text-lg mb-6">Accused: {accused}</p>
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
            {vote && <p className="mt-4 text-lg font-semibold">You have voted that {accused} is {voteMessage}.</p>}

            <button onClick={handleSubmit}>Confirm</button>
        </div>
    );
}
