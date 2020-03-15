import * as fs from 'fs';
import * as path from 'path';
import * as CSV from 'fast-csv';

import { API, SaveOptions } from '../types';


const toCSV = (jsonFile: string, callback: Function): void => {
  // Props
  let keys: any, api: API, csvData: any;

  // Read and parse json file
  const jsonData = JSON.parse(fs.readFileSync(jsonFile).toString());

  // Extract keys [column headers] from first element in jsonData
  keys = Object.keys(jsonData[0]);

  // csv Data
  csvData = [keys.join(',')]; // Headers as first element in array
  // Add the rest of the elements from jsonData
  jsonData.forEach((record: any) => 
    csvData.push(Object.values(record).join(','))
  );

  // Save to file
  const defaultSaveOptions: SaveOptions = { filename: jsonFile };
  const save = (
    { filename = jsonFile }: SaveOptions = defaultSaveOptions
  ) => {
    // Combine both keys and data from jsonData
    const mashup = [
      keys,
      ...jsonData
    ]

    let file = path.basename(`${filename}`, '.json');
    
    CSV.writeToPath(`./${file}.csv`, mashup)
      .on('error', err => console.error(err))
      .on('finish', () => console.log(`Done. New file [ ${file}.csv ] saved in current working directory`));
  }

  // API 
  api = {
    data: csvData.join('\n'),
    save
  }

  // Pass API to callback
  callback(api);
};

export default toCSV;