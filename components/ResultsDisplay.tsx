
import React from 'react';
import { type AnalysisReport, type ScoreSection, QualificationMatch } from '../types';
import { RadialProgressBar } from './RadialProgressBar';

interface ResultsDisplayProps {
    report: AnalysisReport | null;
    isLoading: boolean;
    error: string | null;
}

const KeywordTag: React.FC<{ text: string, type: 'missing' | 'matched' }> = ({ text, type }) => {
    const baseClasses = "text-xs font-medium mr-2 mb-2 px-2.5 py-1 rounded-full";
    const typeClasses = type === 'matched'
        ? "bg-green-100 text-green-800"
        : "bg-red-100 text-red-800";
    return <span className={`${baseClasses} ${typeClasses}`}>{text}</span>;
};

const ReportSection: React.FC<{ title: string; children: React.ReactNode, icon: React.ReactNode }> = ({ title, children, icon }) => (
    <div className="bg-white p-6 rounded-xl shadow-lg">
        <div className="flex items-center mb-4">
             {icon}
            <h3 className="text-xl font-bold text-gray-800 ml-3">{title}</h3>
        </div>
        {children}
    </div>
);

const QualificationBreakdownItem: React.FC<{ item: QualificationMatch }> = ({ item }) => {
    const statusMap = {
        'Met': {
            icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>,
            textColor: 'text-green-700',
            borderColor: 'border-green-200',
        },
        'Partially Met': {
            icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-500" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm-1-5a1 1 0 102 0v2a1 1 0 10-2 0v-2zm1-9a1 1 0 00-1 1v4a1 1 0 102 0V5a1 1 0 00-1-1z" clipRule="evenodd" /></svg>,
            textColor: 'text-yellow-700',
            borderColor: 'border-yellow-200',
        },
        'Not Met': {
            icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" /></svg>,
            textColor: 'text-red-700',
            borderColor: 'border-red-200',
        }
    };

    const currentStatus = statusMap[item.status] || statusMap['Not Met'];

    return (
        <div className={`p-4 rounded-lg border ${currentStatus.borderColor} bg-gray-50/50`}>
            <div className="flex items-start">
                <div className="flex-shrink-0 pt-0.5">{currentStatus.icon}</div>
                <div className="ml-3 flex-1">
                    <p className="text-sm font-semibold text-gray-800">{item.qualification}</p>
                    <p className={`text-sm font-medium ${currentStatus.textColor} mt-1`}>{item.status}</p>
                    <p className="mt-2 text-sm text-gray-600">{item.advice}</p>
                </div>
            </div>
        </div>
    );
};

const InitialState: React.FC = () => (
    <div className="text-center bg-white p-8 rounded-xl shadow-lg">
        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <h3 className="mt-2 text-lg font-medium text-gray-900">Your analysis will appear here</h3>
        <p className="mt-1 text-sm text-gray-500">Upload your resume and a job description to get started.</p>
    </div>
);

const LoadingState: React.FC = () => (
    <div className="bg-white p-8 rounded-xl shadow-lg animate-pulse">
        <div className="h-8 bg-gray-200 rounded-md w-1/3 mb-6"></div>
        <div className="space-y-4">
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        </div>
         <div className="h-8 bg-gray-200 rounded-md w-1/3 mt-10 mb-6"></div>
        <div className="space-y-4">
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
    </div>
);

export const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ report, isLoading, error }) => {
    if (isLoading) {
        return <LoadingState />;
    }

    if (error) {
        return (
            <div className="bg-red-50 border-l-4 border-danger text-red-700 p-4 rounded-md" role="alert">
                <p className="font-bold">Error</p>
                <p>{error}</p>
            </div>
        );
    }
    
    if (!report) {
        return <InitialState />;
    }

    const { overallScore, grade, detailedBreakdown, strengths, improvements, keywordAnalysis, atsRecommendations, jobMatchAssessment } = report;

    let gradeColor = 'text-gray-800';
    if (grade.startsWith('A')) gradeColor = 'text-green-600';
    else if (grade.startsWith('B')) gradeColor = 'text-blue-600';
    else if (grade.startsWith('C')) gradeColor = 'text-yellow-600';
    else if (grade.startsWith('D') || grade.startsWith('F')) gradeColor = 'text-red-600';

    return (
        <div className="space-y-8">
            <div className="bg-white p-6 rounded-xl shadow-lg flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-bold text-gray-800">Overall ATS Score</h2>
                    <p className="text-6xl font-extrabold text-primary">{overallScore}<span className="text-3xl text-gray-500">/100</span></p>
                </div>
                <div className="text-right">
                    <p className="text-xl font-bold text-gray-800">Grade</p>
                     <p className={`text-6xl font-extrabold ${gradeColor}`}>{grade}</p>
                </div>
            </div>

            <ReportSection title="Detailed Breakdown" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-primary" viewBox="0 0 20 20" fill="currentColor"><path d="M5 4a1 1 0 00-2 0v7.268a2 2 0 000 3.464V16a1 1 0 102 0v-1.268a2 2 0 000-3.464V4zM11 4a1 1 0 10-2 0v1.268a2 2 0 000 3.464V16a1 1 0 102 0V8.732a2 2 0 000-3.464V4zM16 3a1 1 0 011 1v7.268a2 2 0 010 3.464V16a1 1 0 11-2 0v-1.268a2 2 0 010-3.464V4a1 1 0 011-1z" /></svg>}>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center pt-2">
                    {detailedBreakdown.map(section => <RadialProgressBar key={section.title} {...section} />)}
                </div>
            </ReportSection>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <ReportSection title="Top 5 Strengths" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-green-500" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>}>
                    <ul className="space-y-2 list-disc list-inside text-gray-600">
                        {strengths.map((item, index) => <li key={index}>{item}</li>)}
                    </ul>
                </ReportSection>
                <ReportSection title="Top 5 Areas for Improvement" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-yellow-500" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.21 3.03-1.742 3.03H4.42c-1.532 0-2.492-1.696-1.742-3.03l5.58-9.92zM10 13a1 1 0 110-2 1 1 0 010 2zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>}>
                    <ol className="space-y-2 list-decimal list-inside text-gray-600">
                         {improvements.map((item, index) => <li key={index}><span className="font-semibold">{item.split(':')[0]}:</span>{item.split(':').slice(1).join(':')}</li>)}
                    </ol>
                </ReportSection>
            </div>
            
             <ReportSection title="Keyword Analysis" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-indigo-500" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-5.5-2.5a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0zM10 12a5.5 5.5 0 100 11 5.5 5.5 0 000-11z" clipRule="evenodd" /></svg>}>
                <div>
                    <h4 className="font-semibold text-gray-700 mb-2">Missing Critical Keywords:</h4>
                    <div className="flex flex-wrap mb-4">
                        {keywordAnalysis.missing.map(kw => <KeywordTag key={kw} text={kw} type="missing"/>)}
                    </div>
                    <h4 className="font-semibold text-gray-700 mb-2">Well-Matched Keywords:</h4>
                     <div className="flex flex-wrap mb-4">
                        {keywordAnalysis.matched.map(kw => <KeywordTag key={kw} text={kw} type="matched"/>)}
                    </div>
                     <h4 className="font-semibold text-gray-700 mb-2">Keyword Density Recommendation:</h4>
                     <p className="text-sm text-gray-600">{keywordAnalysis.recommendation}</p>
                </div>
            </ReportSection>
            
            <ReportSection title="ATS-Specific Recommendations" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-gray-700" viewBox="0 0 20 20" fill="currentColor"><path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" /><path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" /></svg>}>
                <ul className="space-y-2 list-disc list-inside text-gray-600">
                    {atsRecommendations.map((item, index) => <li key={index}>{item}</li>)}
                </ul>
            </ReportSection>

             <ReportSection title="Job Match Assessment" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-teal-500" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zM9 11a1 1 0 112 0v2a1 1 0 11-2 0v-2zm1-4a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd" /></svg>}>
                <div className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
                        <div className="text-center sm:text-left">
                            <p className="text-sm text-gray-500 font-medium">Relevance Score</p>
                            <p className="text-3xl font-bold text-gray-900">{jobMatchAssessment.relevanceScore}<span className="text-xl">/10</span></p>
                        </div>
                         <div className="text-center sm:text-left">
                            <p className="text-sm text-gray-500 font-medium">Experience Level</p>
                            <p className="text-2xl font-bold text-gray-900">{jobMatchAssessment.experienceLevelMatch.level}</p>
                            <p className="text-sm text-gray-600 mt-1">{jobMatchAssessment.experienceLevelMatch.commentary}</p>
                        </div>
                    </div>
                    <div>
                        <h4 className="text-lg font-semibold text-gray-800 mb-3">Key Qualifications Breakdown</h4>
                        <div className="space-y-3">
                            {jobMatchAssessment.qualificationBreakdown.map((item, index) => (
                                <QualificationBreakdownItem key={index} item={item} />
                            ))}
                        </div>
                    </div>
                </div>
            </ReportSection>

        </div>
    );
};
