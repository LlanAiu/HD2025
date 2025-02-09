import React, { useState } from 'react';
import { PlayerData } from '../data/types';

interface VotingProps {
    accused: PlayerData;
    onVote: (vote: 'convict' | 'pardon') => void;
}

export default function Voting({ accused, onVote }: VotingProps) {
    const [vote, setVote] = useState<'convict' | 'pardon' | null>(null);

    const handleVote = (vote: 'convict' | 'pardon') => {
        setVote(vote);
        onVote(vote);
    };

    return (
        <div>
            <h2>Voting</h2>
            <p>Accused: {accused.name}</p>
            <div>
                <button 
                    onClick={() => handleVote('convict')}
                    style={{ fontWeight: vote === 'convict' ? 'bold' : 'normal' }}
                >
                    Convict
                </button>
                <button 
                    onClick={() => handleVote('pardon')}
                    style={{ fontWeight: vote === 'pardon' ? 'bold' : 'normal' }}
                >
                    Pardon
                </button>
            </div>
            {vote && <p>You have voted to {vote} {accused.name}.</p>}
        </div>
    );
}
