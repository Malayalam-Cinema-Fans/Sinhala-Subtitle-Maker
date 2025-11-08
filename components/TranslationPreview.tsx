
import React, { useRef, useEffect } from 'react';
import { SubtitleBlock } from '../types';
import { LoadingDots } from './IconComponents';

interface TranslationPreviewProps {
  originalSrt: SubtitleBlock[];
  translatedLines: string[];
}

const TranslationPreview: React.FC<TranslationPreviewProps> = ({ originalSrt, translatedLines }) => {
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
        }
    }, [translatedLines.length]);


    return (
        <div ref={scrollContainerRef} className="w-full max-w-3xl mx-auto h-80 overflow-y-auto bg-gray-900/50 border border-gray-700 rounded-lg p-4 text-left font-mono text-sm">
            <div className="grid grid-cols-2 gap-x-4 sticky top-0 bg-gray-800 py-2 px-2 -mx-4 -mt-4 mb-2 border-b border-gray-700 z-10">
                <h3 className="font-semibold text-gray-300">Original (English)</h3>
                <h3 className="font-semibold text-gray-300">Translation (Sinhala)</h3>
            </div>
            {originalSrt.map((block, index) => (
                <div key={block.index} className="grid grid-cols-2 gap-x-4 py-2 border-b border-gray-800 last:border-b-0">
                    <p className="text-gray-400 whitespace-pre-wrap break-words">{block.text}</p>
                    <div className="text-blue-300 whitespace-pre-wrap break-words">
                        {translatedLines[index] ? (
                            <span>{translatedLines[index]}</span>
                        ) : (
                           <div className="flex items-center h-full">
                             <LoadingDots />
                           </div>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default TranslationPreview;
