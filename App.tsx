
import React, { useState } from 'react';
import { InputPanel } from './components/InputPanel';
import { ResultsDisplay } from './components/ResultsDisplay';
import { analyzeResumeAndJd } from './services/geminiService';
import { type AnalysisReport } from './types';
import { parseAnalysisResult } from './utils/parsingUtils';

const App: React.FC = () => {
    const [analysisReport, setAnalysisReport] = useState<AnalysisReport | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const handleAnalysis = async (resume: File | string, jobDescription: string) => {
        setIsLoading(true);
        setError(null);
        setAnalysisReport(null);

        try {
            const resultText = await analyzeResumeAndJd(resume, jobDescription);
            if(resultText) {
                 const parsedReport = parseAnalysisResult(resultText);
                 setAnalysisReport(parsedReport);
            } else {
                throw new Error("Received an empty analysis from the server.");
            }
        } catch (e: unknown) {
            const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
            console.error("Analysis failed:", errorMessage);
            setError(`Analysis failed. ${errorMessage}. Please check your API key and try again.`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 font-sans text-gray-800">
            <header className="bg-white shadow-sm sticky top-0 z-10">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center space-x-3">
                         <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" viewBox="0 0 20 20" fill="currentColor">
                           <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 0v12h8V4H6zm3 2.5a.5.5 0 00-1 0V8a.5.5 0 001 0V6.5zM11 6a.5.5 0 01.5.5V8a.5.5 0 01-1 0V6.5A.5.5 0 0111 6zm-3.5 4a.5.5 0 000 1h5a.5.5 0 000-1h-5zM8 12.5a.5.5 0 00-1 0V14a.5.5 0 001 0v-1.5zM11 12a.5.5 0 01.5.5V14a.5.5 0 01-1 0v-1.5a.5.5 0 01.5-.5z" clipRule="evenodd" />
                         </svg>
                        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">ATS Resume Analyzer</h1>
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                    <div className="lg:sticky top-24">
                        <InputPanel onAnalyze={handleAnalysis} isLoading={isLoading} />
                    </div>
                    <div>
                        <ResultsDisplay report={analysisReport} isLoading={isLoading} error={error} />
                    </div>
                </div>
            </main>
             <footer className="text-center py-4 text-sm text-gray-500">
                Powered by Google Gemini
            </footer>
        </div>
    );
};

export default App;
