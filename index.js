import toJson from './functions/convert_to_json';
import path from 'path';

toJson('./sample-data/thousand-lines.csv', api => {
    console.log(api.data);
    api.save();
    
});