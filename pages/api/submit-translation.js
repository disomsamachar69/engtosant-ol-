import fs from 'fs';
import path from 'path';
import Papa from 'papaparse';

export default function handler(req, res) {
  const { englishSentence, olchikiSentence } = req.body;

  const filePath = path.join(process.cwd(), 'data', 'sentences.csv');
  const fileContent = fs.readFileSync(filePath, 'utf8');

  const csvData = Papa.parse(fileContent, { header: true });

  // Find the sentence and update the translation
  const updatedData = csvData.data.map(row => {
    if (row['english sentence'] === englishSentence) {
      row['olchiki sentence'] = olchikiSentence;
    }
    return row;
  });

  // Convert updated data back to CSV format
  const updatedCsv = Papa.unparse(updatedData, { header: true });

  // Save the updated CSV file
  fs.writeFileSync(filePath, updatedCsv);

  res.status(200).json({ message: 'Translation saved successfully' });
}
