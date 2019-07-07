import fs from 'fs';
import readline from 'readline';
import path from 'path';


module.exports = (csvFile, callback) => {
    // Props
    let API, jsonData = { data: [] };
    const keys = ['id', 'first_name', 'last_name', 'email', 'gender', 'ip_address'];

    // Push data from the csv file to jsonData object
    const collect = csv_data => {
        let record = {}; 
        csv_data = csv_data.replace("\n", "").split(',').values();  // turn into iterator
        
        Array.from(keys, key => {
            record[key] = csv_data.next().value
        });
        jsonData['data'].push(record);
    };

    const save = (options = {}) => {
        
        const data = JSON.stringify(jsonData.data, null, 0);

        // extract name from csv file to be used as new json file name
        let file = path.basename(`${csvFile}`, '.csv');
        let dir = path.dir(csvFile);
        
        // Write data to file
        fs.writeFile(`./${file}.json`, data, 'utf8', (error, data) => {
            if (error) throw error;
            console.log(`Done. New file [ ${file}.json ] saved in current working directory`);
        });
    }
     

    const readInterface = readline.createInterface({
        input: fs.createReadStream(csvFile),
        output: null,
        console: false
    });
    
    
    
    readInterface.on('line', data => {
        
    });
    readInterface.on('close', () => {
        API = {
            data: jsonData.data,
            save
        }
        callback(API);
    });
}