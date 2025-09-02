
import React from 'react';

interface RadialProgressBarProps {
    score: number;
    maxScore: number;
    title: string;
}

export const RadialProgressBar: React.FC<RadialProgressBarProps> = ({ score, maxScore, title }) => {
    const radius = 50;
    const stroke = 8;
    const normalizedRadius = radius - stroke / 2;
    const circumference = normalizedRadius * 2 * Math.PI;
    const percentage = maxScore > 0 ? score / maxScore : 0;
    const strokeDashoffset = circumference - percentage * circumference;

    const percentValue = Math.round(percentage * 100);
    let colorClass = 'text-green-500';
    if (percentValue < 75) colorClass = 'text-yellow-500';
    if (percentValue < 50) colorClass = 'text-red-500';

    return (
        <div className="flex flex-col items-center">
            <div className="relative w-32 h-32">
                <svg
                    height="100%"
                    width="100%"
                    viewBox={`0 0 ${radius * 2} ${radius * 2}`}
                    className="transform -rotate-90"
                >
                    <circle
                        stroke="#e6e6e6"
                        fill="transparent"
                        strokeWidth={stroke}
                        r={normalizedRadius}
                        cx={radius}
                        cy={radius}
                    />
                    <circle
                        stroke="currentColor"
                        fill="transparent"
                        strokeWidth={stroke}
                        strokeDasharray={circumference + ' ' + circumference}
                        style={{ strokeDashoffset, transition: 'stroke-dashoffset 0.5s ease-out' }}
                        r={normalizedRadius}
                        cx={radius}
                        cy={radius}
                        className={`${colorClass} stroke-linecap-round`}
                    />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className={`text-2xl font-bold ${colorClass}`}>
                        {score}
                    </span>
                    <span className="text-xs text-gray-500">/{maxScore}</span>
                </div>
            </div>
            <p className="mt-2 text-sm font-semibold text-gray-700">{title}</p>
        </div>
    );
};
