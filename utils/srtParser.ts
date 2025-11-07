
import { SubtitleBlock } from '../types';

export const parseSrt = (srtContent: string): SubtitleBlock[] => {
  const blocks: SubtitleBlock[] = [];
  // Normalize line endings and split into blocks
  const blockStrings = srtContent.replace(/\r\n/g, '\n').split('\n\n');

  for (const blockStr of blockStrings) {
    const trimmedBlock = blockStr.trim();
    if (!trimmedBlock) continue;

    const lines = trimmedBlock.split('\n');
    if (lines.length < 3) continue;

    const index = parseInt(lines[0], 10);
    const timestamp = lines[1];
    const text = lines.slice(2).join('\n');

    if (!isNaN(index) && timestamp.includes('-->') && text) {
      blocks.push({ index, timestamp, text });
    }
  }

  return blocks;
};

export const buildSrt = (blocks: SubtitleBlock[], translations: string[]): string => {
  if (blocks.length !== translations.length) {
    throw new Error("Mismatch between subtitle blocks and translations count.");
  }

  return blocks.map((block, i) => {
    return `${block.index}\n${block.timestamp}\n${translations[i]}`;
  }).join('\n\n');
};
