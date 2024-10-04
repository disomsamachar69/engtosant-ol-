import fs from 'fs';
import path from 'path';
import Papa from 'papaparse';

export default function handler(req, res) {
  const filePath = path.join(process.cwd(), 'data', 'sentences.csv');
  const fileContent = fs.readFileSync(filePath, 'utf8');

  const csvData = Papa.parse(fileContent, { header: true }).data;

  // Get only untranslated sentences
  const untranslated = csvData.filter(row => row['olchiki sentence'] === '');

  if (untranslated.length === 0) {
    return res.status(200).json({ sentence: null });
  }

  // Return the first untranslated sentence
  const sentence = untranslated[0]['english sentence'];

  res.status(200).json({ sentence });
}
