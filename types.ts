
export interface ScoreSection {
    title: string;
    score: number;
    maxScore: number;
}

export interface KeywordAnalysis {
    missing: string[];
    matched: string[];
    recommendation: string;
}

export interface QualificationMatch {
    qualification: string;
    status: 'Met' | 'Partially Met' | 'Not Met';
    advice: string;
}

export interface JobMatchAssessment {
    relevanceScore: number;
    qualificationBreakdown: QualificationMatch[];
    experienceLevelMatch: {
        level: string;
        commentary: string;
    };
}

export interface AnalysisReport {
    overallScore: number;
    grade: string;
    detailedBreakdown: ScoreSection[];
    strengths: string[];
    improvements: string[];
    keywordAnalysis: KeywordAnalysis;
    atsRecommendations: string[];
    jobMatchAssessment: JobMatchAssessment;
}
