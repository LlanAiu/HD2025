import React, { useState } from 'react';

interface VotingProps {
    accused: string;
    onVote: (vote: 'Y' | 'N') => void;
}

export default function Voting({ accused, onVote }: VotingProps) {
    const [vote, setVote] = useState<'Y' | 'N' | null>(null);

    const handleVote = (vote: 'Y' | 'N') => {
        setVote(vote);
        onVote(vote);
    };

    return (
        <div>
            <h2>Voting</h2>
            <p>Accused: {accused}</p>
            <div className='space-y-2'>
                <button
                    className='block'
                    onClick={() => handleVote('Y')}
                    style={{ fontWeight: vote === 'Y' ? 'bold' : 'normal' }}
                >
                    Convict
                </button>
                <button 
                    className='block'
                    onClick={() => handleVote('N')}
                    style={{ fontWeight: vote === 'N' ? 'bold' : 'normal' }}
                >
                    Pardon
                </button>
            </div>
            {vote && <p>You have voted to {vote} {accused}.</p>}
        </div>
    );
}
