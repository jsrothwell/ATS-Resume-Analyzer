
import { type AnalysisReport, type KeywordAnalysis, type ScoreSection, type JobMatchAssessment, QualificationMatch } from '../types';

const getScore = (line: string): number => {
    const match = line.match(/\[(\d+)\/\d+\]/);
    return match ? parseInt(match[1], 10) : 0;
};

const getMaxScore = (line: string): number => {
    const match = line.match(/\[\d+\/(\d+)\]/);
    return match ? parseInt(match[1], 10) : 0;
};

const getSectionContent = (text: string, start: string, end: string): string[] => {
    const startIndex = text.indexOf(start);
    if (startIndex === -1) return [];
    const endIndex = text.indexOf(end, startIndex);
    const content = text.substring(startIndex + start.length, endIndex !== -1 ? endIndex : undefined).trim();
    return content.split('\n').map(s => s.trim().replace(/^-\s*/, '').replace(/^\d+\.\s*/, '')).filter(Boolean);
};

export const parseAnalysisResult = (text: string): AnalysisReport => {
    const report: Partial<AnalysisReport> = {};

    let lines = text.split('\n');
    
    // Overall Score and Grade
    const scoreLine = lines.find(l => l.includes('Overall ATS Score:'));
    report.overallScore = scoreLine ? parseInt(scoreLine.match(/\[(\d+)\/100\]/)?.[1] ?? '0', 10) : 0;
    
    const gradeLine = lines.find(l => l.includes('Grade**:'));
    report.grade = gradeLine ? gradeLine.match(/\[(.*?)\]/)?.[1]?.trim() ?? 'N/A' : 'N/A';
    
    // Detailed Breakdown
    report.detailedBreakdown = [];
    const breakdownLines = getSectionContent(text, '### Detailed Breakdown:', '### Top 5 Strengths:');
    breakdownLines.forEach(line => {
        const titleMatch = line.match(/\*\*(.*?)\*\*:/);
        if(titleMatch) {
            report.detailedBreakdown?.push({
                title: titleMatch[1].trim(),
                score: getScore(line),
                maxScore: getMaxScore(line)
            });
        } else {
             const plainTitleMatch = line.match(/^(.*?):/);
             if(plainTitleMatch){
                 report.detailedBreakdown?.push({
                    title: plainTitleMatch[1].replace(/^\d+\.\s*/, '').trim(),
                    score: getScore(line),
                    maxScore: getMaxScore(line)
                 });
             }
        }
    });

    // Strengths and Improvements
    report.strengths = getSectionContent(text, '### Top 5 Strengths:', '### Top 5 Areas for Improvement:');
    report.improvements = getSectionContent(text, '### Top 5 Areas for Improvement:', '### Keyword Analysis:');

    // Keyword Analysis
    const keywordAnalysis: Partial<KeywordAnalysis> = {};
    const missingKeywords = getSectionContent(text, '- **Missing Critical Keywords**:', '- **Well-Matched Keywords**:');
    keywordAnalysis.missing = missingKeywords.length > 0 ? missingKeywords[0].split(',').map(s => s.trim()).filter(Boolean) : [];

    const matchedKeywords = getSectionContent(text, '- **Well-Matched Keywords**:', '- **Keyword Density Recommendation**:');
    keywordAnalysis.matched = matchedKeywords.length > 0 ? matchedKeywords[0].split(',').map(s => s.trim()).filter(Boolean) : [];
    
    const recommendation = getSectionContent(text, '- **Keyword Density Recommendation**:', '### ATS-Specific Recommendations:');
    keywordAnalysis.recommendation = recommendation.join(' ');
    report.keywordAnalysis = keywordAnalysis as KeywordAnalysis;

    // ATS Recommendations
    report.atsRecommendations = getSectionContent(text, '### ATS-Specific Recommendations:', '### Job Match Assessment:');
    
    // Job Match Assessment
    const jobMatchAssessment: Partial<JobMatchAssessment> = {
        experienceLevelMatch: { level: 'N/A', commentary: '' },
        qualificationBreakdown: []
    };
    
    const jobMatchSection = text.substring(text.indexOf('### Job Match Assessment:'));
    const jobMatchLines = jobMatchSection.split('\n');

    const relevanceLine = jobMatchLines.find(l => l.includes('Relevance Score**:'));
    jobMatchAssessment.relevanceScore = relevanceLine ? parseInt(relevanceLine.match(/\[(\d+)\/10\]/)?.[1] ?? '0', 10) : 0;
    
    const experienceLine = jobMatchLines.find(l => l.includes('Experience Level Match**:'));
    if (jobMatchAssessment.experienceLevelMatch) {
        jobMatchAssessment.experienceLevelMatch.level = experienceLine ? experienceLine.match(/\[(.*?)\]/)?.[1] ?? 'N/A' : 'N/A';
    }

    const commentaryLine = jobMatchLines.find(l => l.includes('Experience Level Commentary**:'));
    if (jobMatchAssessment.experienceLevelMatch) {
        jobMatchAssessment.experienceLevelMatch.commentary = commentaryLine ? commentaryLine.match(/\[(.*?)\]/)?.[1] ?? '' : '';
    }

    const breakdownStartIndex = jobMatchLines.findIndex(l => l.includes('Key Qualifications Breakdown**:'));
    if (breakdownStartIndex !== -1) {
        const breakdownLines = jobMatchLines.slice(breakdownStartIndex + 1);
        const qualificationRegex = /-\s*\*\*(.*?)\*\*:\s*\*\*(Met|Partially Met|Not Met)\*\*\.\s*\[(.*?)\]/;
        
        breakdownLines.forEach(line => {
            const match = line.match(qualificationRegex);
            if (match) {
                jobMatchAssessment.qualificationBreakdown?.push({
                    qualification: match[1].trim(),
                    status: match[2].trim() as QualificationMatch['status'],
                    advice: match[3].trim()
                });
            }
        });
    }

    report.jobMatchAssessment = jobMatchAssessment as JobMatchAssessment;
    
    return report as AnalysisReport;
};