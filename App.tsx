
import React, { useState, useCallback, useMemo } from 'react';
import { AppStatus, SubtitleBlock } from './types';
import { parseSrt, buildSrt } from './utils/srtParser';
import { translateSubtitles } from './services/geminiService';
import FileUpload from './components/FileUpload';
import LoadingSpinner from './components/LoadingSpinner';
import ResultDisplay from './components/ResultDisplay';
import { Header } from './components/Header';
import { ErrorDisplay } from './components/ErrorDisplay';
import ProgressBar from './components/ProgressBar';

const App: React.FC = () => {
  const [status, setStatus] = useState<AppStatus>(AppStatus.IDLE);
  const [error, setError] = useState<string | null>(null);
  const [originalSrt, setOriginalSrt] = useState<SubtitleBlock[]>([]);
  const [translatedSrtText, setTranslatedSrtText] = useState<string>('');
  const [fileName, setFileName] = useState<string>('');
  const [translationProgress, setTranslationProgress] = useState(0);

  const handleFileSelect = useCallback(async (file: File) => {
    if (!file) return;
    
    setFileName(file.name.replace('.srt', '_sinhala.srt'));
    setStatus(AppStatus.PARSING);
    setError(null);
    setTranslationProgress(0);

    try {
      const content = await file.text();
      const parsedBlocks = parseSrt(content);
      if (parsedBlocks.length === 0) {
        throw new Error('Could not parse the SRT file. Please check its format.');
      }
      setOriginalSrt(parsedBlocks);
      setStatus(AppStatus.TRANSLATING);

      const englishTexts = parsedBlocks.map(block => block.text);
      const translatedTexts = await translateSubtitles(englishTexts, (progress) => {
        setTranslationProgress(progress);
      });

      if (translatedTexts.length !== englishTexts.length) {
        throw new Error('Translation failed: The number of translated lines does not match the original.');
      }
      
      const newSrtContent = buildSrt(parsedBlocks, translatedTexts);
      setTranslatedSrtText(newSrtContent);
      setStatus(AppStatus.DONE);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'An unknown error occurred during translation.');
      setStatus(AppStatus.ERROR);
    }
  }, []);

  const handleReset = () => {
    setStatus(AppStatus.IDLE);
    setError(null);
    setOriginalSrt([]);
    setTranslatedSrtText('');
    setFileName('');
    setTranslationProgress(0);
  };
  
  const statusMessage = useMemo(() => {
    switch (status) {
        case AppStatus.PARSING:
            return "Parsing SRT file...";
        case AppStatus.TRANSLATING:
            return `Translating ${originalSrt.length} subtitle lines...`;
        default:
            return "";
    }
  }, [status, originalSrt.length]);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 font-sans">
      <div className="w-full max-w-3xl mx-auto">
        <Header />
        <main className="mt-8 bg-gray-800 border border-gray-700 rounded-2xl shadow-2xl shadow-blue-500/10 p-6 sm:p-8 transition-all duration-300 min-h-[300px] flex flex-col justify-center items-center">
          {status === AppStatus.IDLE && <FileUpload onFileSelect={handleFileSelect} />}
          
          {(status === AppStatus.PARSING || status === AppStatus.TRANSLATING) && (
            <div className="text-center w-full">
              <LoadingSpinner />
              <p className="mt-4 text-lg text-blue-300">{statusMessage}</p>
              {status === AppStatus.TRANSLATING && (
                <div className="mt-4 w-full max-w-md mx-auto">
                    <ProgressBar progress={translationProgress} />
                    <p className="text-sm text-gray-400 mt-2">{translationProgress}% Complete</p>
                </div>
              )}
            </div>
          )}

          {status === AppStatus.DONE && (
            <ResultDisplay 
              translatedSrtContent={translatedSrtText}
              onReset={handleReset}
              fileName={fileName}
            />
          )}

          {status === AppStatus.ERROR && error && (
            <ErrorDisplay message={error} onRetry={handleReset} />
          )}
        </main>
        <footer className="text-center mt-8 text-gray-500 text-sm">
            <p>&copy; {new Date().getFullYear()} Sinhala Subtitle Translator. Powered by Gemini.</p>
        </footer>
      </div>
    </div>
  );
};

export default App;
