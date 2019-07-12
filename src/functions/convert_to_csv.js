import fs from 'fs';
import path from 'path';
import CSV from 'fast-csv';

const convert_to_csv = (jsonFile, callback) => {
    // Props
    let keys, API, csvData;

    // Read and parse json file
    const jsonData = JSON.parse(fs.readFileSync(jsonFile));

    // Extract keys [column headers] from first element in jsonData
    keys = Object.keys(jsonData[0]);

    // csv Data
    csvData = [keys.join(',')]; // Headers as first element in array
    // Add the rest of the elements from jsonData
    jsonData.forEach(record => csvData.push(Object.values(record).join(',')));

    // Save to file
    const save = ({filename = jsonFile} = {filename: jsonFile}) => {
        // Conbine both keys and data from jsonData
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
    API = {
        data: csvData.join('\n'),
        save
    }

    // Pass API to callback
    callback(API);
};

export default convert_to_csv;