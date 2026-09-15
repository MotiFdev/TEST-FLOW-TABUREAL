import React from 'react';

interface WaitingForRoundProps {
    title?: string;
    description?: string;
}

/**
 * In-place waiting state rendered inside the judge scoring page when no
 * round is open. Gentle transform/opacity animations only; automatically
 * disabled by the global prefers-reduced-motion rule in index.css.
 */
export const WaitingForRound: React.FC<WaitingForRoundProps> = ({
    title = 'Waiting for the next round',
    description = 'Scoring is currently closed. The tabulator will open the next round shortly — this screen updates automatically once it does.',
}) => {
    return (
        <div className="anim-fade-in flex h-full min-h-96 flex-col items-center justify-center text-center">
            {/* Breathing rings — opacity + scale only, two staggered pulses */}
            <div className="relative mb-8 flex h-24 w-24 items-center justify-center" aria-hidden="true">
                <span className="waiting-ring absolute inset-0 rounded-full border-2 border-primary" />
                <span className="waiting-ring waiting-ring-delay absolute inset-0 rounded-full border-2 border-primary" />
                <span className="absolute inset-3 rounded-full border border-hairline bg-surface" />
                <svg
                    className="relative h-8 w-8 text-primary"
                    viewBox="0 0 16 16"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <circle cx="8" cy="8" r="6.25" />
                    <path d="M8 4.75V8l2.25 1.5" />
                </svg>
            </div>

            <h1 className="text-xl font-semibold text-ink">{title}</h1>
            <p className="mt-2 max-w-sm text-sm text-ink-secondary">{description}</p>

            <div className="mt-6 flex items-center gap-2">
                <span className="badge badge-neutral">Scoring locked</span>
                <span className="badge badge-neutral">Connected</span>
            </div>
        </div>
    );
};