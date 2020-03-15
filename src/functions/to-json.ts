import * as fs from 'fs';
import * as readline from 'readline';
import * as path from 'path';

import Queue from '../Queue';
import { SaveOptions, API } from '../types';


const toJSON = (csvFile: string, callback: Function): void => {
  // Props
  let api: API, 
    keys: any, 
    jsonData: any = { data: [] };

  // Read csvFile line by line
  const readInterface = readline.createInterface({
    input: fs.createReadStream(csvFile),
    output: undefined
  });

  // Push argument (objectified) to jsonData object
  const collect = (csv_data: any) => {
    let record: any = {}; 
    csv_data = csv_data.values();  // turn into iterator
    
    Array.from(keys, (key: any) => {
      record[key] = csv_data.next().value
    });
    
    jsonData['data'].push(record);
  };

  // Save data to file
  const defaultSaveOptions: SaveOptions = {
    filename: csvFile,
    spaces: 1,
    prettify: false
  }
  const save = (
    { 
      filename = csvFile, 
      prettify = false, 
      spaces = 1 
    }: SaveOptions = defaultSaveOptions
  ) => {
    let data: any;
    // Stringify data
    if(prettify) {
      data = JSON.stringify(jsonData.data, null, spaces);
    } else {
      data = JSON.stringify(jsonData.data);
    }

    // extract name from csv file to be used as new json file name
    let file: string = path.basename(`${filename}`, '.csv');
      
    // Write data to file
    fs.writeFile(`./${file}.json`, data, (error) => {
      if (error) throw error;
      console.log(`> Done. New file [ ${file}.json ] saved in current working directory`);
    });
  }
  
  //* Read and enqueue data from csvFile
  readInterface.on('line', data => {
    Queue.enqueue(data.replace("\n", "").split(','));
  });

  //? Done Reading from csvFile?
  readInterface.on('close', () => {
    // Extract the first item from Queue, the column headers
    keys = Queue.dequeue();
    // Extract everything else from Queue 
    while(!Queue.is_empty()) collect(Queue.dequeue()); 

    // Public API
    api = {
      data: jsonData.data,
      save
    }

    // Serve API as callback argument
    callback(api);
  });
}

export default toJSON;