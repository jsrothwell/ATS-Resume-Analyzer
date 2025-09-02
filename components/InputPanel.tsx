
import React, { useState, useCallback } from 'react';

const DEMO_RESUME = `
John Doe
(123) 456-7890 | john.doe@email.com | linkedin.com/in/johndoe | github.com/johndoe

Professional Summary
Results-driven Senior Software Engineer with 8+ years of experience in designing, developing, and deploying scalable web applications. Proficient in JavaScript, TypeScript, React, and Node.js with a strong background in cloud-native architectures using AWS. Proven ability to lead projects, mentor junior engineers, and collaborate effectively with cross-functional teams to deliver high-quality software solutions.

Work Experience

Senior Software Engineer | Tech Solutions Inc. | San Francisco, CA | June 2018 - Present
- Led the development of a new microservices-based e-commerce platform using React, Node.js, and AWS Lambda, resulting in a 40% improvement in page load times.
- Designed and implemented a CI/CD pipeline using Jenkins and Docker, reducing deployment time by 75%.
- Mentored a team of 3 junior engineers, providing code reviews and technical guidance.
- Collaborated with product managers to define project requirements and timelines.

Software Engineer | Web Innovators | Palo Alto, CA | May 2015 - June 2018
- Developed and maintained front-end components for a high-traffic web application using React and Redux.
- Optimized application performance, leading to a 20% reduction in server response time.
- Wrote unit and integration tests using Jest and Enzyme, achieving 90% code coverage.

Education
Bachelor of Science in Computer Science | University of California, Berkeley | 2011 - 2015

Skills
- Languages: JavaScript, TypeScript, Python, HTML/CSS
- Frameworks/Libraries: React, Node.js, Express.js, Redux, Jest
- Cloud & DevOps: AWS (EC2, S3, Lambda, DynamoDB), Docker, Jenkins, Terraform
- Databases: PostgreSQL, MongoDB, Redis
`;

const DEMO_JOB_DESCRIPTION = `
Senior Software Engineer - Full Stack
Innovate Corp - Austin, TX

About the Role:
We are looking for a passionate Senior Software Engineer to join our dynamic team. You will be responsible for building and maintaining our next-generation platform, working on both front-end and back-end services. The ideal candidate has a strong background in web development, experience with modern JavaScript frameworks, and a passion for creating high-quality, scalable software.

Responsibilities:
- Design, develop, and deploy robust, scalable, and high-performance software applications.
- Work with product, design, and other engineering teams to deliver new features and products.
- Lead technical design discussions and contribute to our technical architecture.
- Mentor junior engineers and promote best practices in code quality and testing.
- Troubleshoot and resolve complex production issues.
- Build and maintain CI/CD pipelines for automated testing and deployment.

Required Qualifications:
- 5+ years of professional software development experience.
- Expertise in JavaScript/TypeScript and modern frameworks like React and Node.js.
- Strong experience with cloud platforms (AWS, GCP, or Azure).
- Experience with relational (e.g., PostgreSQL) and NoSQL (e.g., MongoDB) databases.
- Proficient with containerization technologies like Docker and orchestration tools.
- Solid understanding of software development best practices, including agile methodologies, testing, and CI/CD.

Preferred Qualifications:
- Experience with microservices architecture.
- Knowledge of Infrastructure as Code (e.g., Terraform, CloudFormation).
- Contributions to open-source projects.
`;

interface InputPanelProps {
    onAnalyze: (resume: File | string, jobDescription: string) => void;
    isLoading: boolean;
}

const LoadingSpinner: React.FC = () => (
    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
);

const UploadIcon: React.FC = () => (
    <svg className="w-10 h-10 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
        <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const PdfIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-red-500" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M5 2a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7.414A2 2 0 0016.414 6L12 1.586A2 2 0 0010.586 1H5.414A2 2 0 005 2zm3 6a1 1 0 10-2 0v2a1 1 0 102 0V8zm2-2a1 1 0 00-1 1v2a1 1 0 102 0V7a1 1 0 00-1-1zm4 0a1 1 0 10-2 0v2a1 1 0 102 0V6z" clipRule="evenodd" />
  </svg>
);

export const InputPanel: React.FC<InputPanelProps> = ({ onAnalyze, isLoading }) => {
    const [resumeFile, setResumeFile] = useState<File | null>(null);
    const [jobDescription, setJobDescription] = useState<string>('');
    const [isDragging, setIsDragging] = useState<boolean>(false);
    const [error, setError] = useState<string>('');
    const [isDemoMode, setIsDemoMode] = useState<boolean>(false);

    const handleFileChange = (files: FileList | null) => {
        if (files && files.length > 0) {
            const file = files[0];
            const validTypes = ['application/pdf'];
            if (validTypes.includes(file.type)) {
                setResumeFile(file);
                setError('');
            } else {
                setError('Invalid file type. Please upload a PDF file.');
            }
        }
    };

    const handleDragEvent = (e: React.DragEvent<HTMLDivElement>, dragging: boolean) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(dragging);
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        handleDragEvent(e, false);
        const files = e.dataTransfer.files;
        handleFileChange(files);
    };
    
    const handleLoadDemo = () => {
        setResumeFile(null);
        setJobDescription(DEMO_JOB_DESCRIPTION);
        setIsDemoMode(true);
        setError('');
    };

    const handleClearDemo = () => {
        setIsDemoMode(false);
        setJobDescription('');
    };
    
    const handleAnalyzeClick = useCallback(() => {
        setError('');
        if (isDemoMode) {
            if (!jobDescription.trim()) {
                setError('Please paste the job description.');
                return;
            }
            onAnalyze(DEMO_RESUME, jobDescription);
        } else {
            if (!resumeFile) {
                setError('Please upload your resume.');
                return;
            }
            if (!jobDescription.trim()) {
                setError('Please paste the job description.');
                return;
            }
            onAnalyze(resumeFile, jobDescription);
        }
    }, [resumeFile, jobDescription, onAnalyze, isDemoMode]);

    const clearFile = () => {
        setResumeFile(null);
    }

    return (
        <div className="bg-white p-6 rounded-xl shadow-lg space-y-6">
            <div>
                 <div className="flex justify-between items-center mb-2">
                    <label htmlFor="resume-upload" className="block text-lg font-semibold text-gray-800">1. Upload Your Resume</label>
                    {!isDemoMode && (
                        <button onClick={handleLoadDemo} className="text-sm font-medium text-primary hover:text-primary-dark transition-colors">
                            Try a Demo
                        </button>
                    )}
                </div>

                {isDemoMode ? (
                     <div className="mt-1 flex items-center justify-between bg-blue-50 border-2 border-dashed border-primary p-4 rounded-md">
                        <div className="flex items-center space-x-3">
                           <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                           </svg>
                            <p className="text-sm text-gray-800 font-medium">Using a sample Software Engineer resume.</p>
                        </div>
                        <button onClick={handleClearDemo} className="text-sm font-semibold text-gray-600 hover:text-gray-900">Clear</button>
                    </div>
                ) : (
                    <div
                        onDragEnter={(e) => handleDragEvent(e, true)}
                        onDragLeave={(e) => handleDragEvent(e, false)}
                        onDragOver={(e) => handleDragEvent(e, true)}
                        onDrop={handleDrop}
                        className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md transition-colors duration-200 ${isDragging ? 'border-primary bg-blue-50' : ''}`}
                    >
                        {!resumeFile ? (
                            <div className="space-y-1 text-center">
                                <UploadIcon/>
                                <div className="flex text-sm text-gray-600">
                                    <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-primary hover:text-primary-dark focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary">
                                        <span>Upload a file</span>
                                        <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={(e) => handleFileChange(e.target.files)} accept=".pdf" />
                                    </label>
                                    <p className="pl-1">or drag and drop</p>
                                </div>
                                <p className="text-xs text-gray-500">PDF up to 10MB</p>
                            </div>
                        ) : (
                             <div className="w-full flex items-center justify-between bg-gray-100 p-3 rounded-md">
                                <div className="flex items-center space-x-3">
                                    <PdfIcon />
                                    <div className="text-sm">
                                        <p className="font-medium text-gray-900 truncate max-w-xs">{resumeFile.name}</p>
                                        <p className="text-gray-500">{(resumeFile.size / 1024).toFixed(2)} KB</p>
                                    </div>
                                </div>
                                <button onClick={clearFile} className="p-1 rounded-full text-gray-400 hover:bg-gray-200 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>

            <div>
                <label htmlFor="job-description" className="block text-lg font-semibold text-gray-800 mb-2">2. Paste Job Description</label>
                <textarea
                    id="job-description"
                    rows={10}
                    className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary transition"
                    placeholder="Paste the full job description here..."
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                />
            </div>

            <div className="pt-2">
                {error && <p className="text-sm text-danger mb-4">{error}</p>}
                <button
                    onClick={handleAnalyzeClick}
                    disabled={isLoading || (isDemoMode ? !jobDescription.trim() : (!resumeFile || !jobDescription.trim()))}
                    className="w-full flex items-center justify-center bg-primary text-white font-bold py-3 px-4 rounded-lg shadow-md hover:bg-primary-dark disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105"
                >
                    {isLoading ? <LoadingSpinner /> : null}
                    {isLoading ? 'Analyzing...' : 'Analyze My Resume'}
                </button>
                 <p className="text-xs text-center text-gray-500 mt-4">
                   <strong>PRIVACY GUARANTEE</strong>: We do not retain, store, or remember any personal information, resume content, or job descriptions. All data is processed temporarily for analysis purposes only.
                </p>
            </div>
        </div>
    );
};
