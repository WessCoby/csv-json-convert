import toJson from './functions/convert_to_json';
import path from 'path';

toJson(path.join(__dirname, 'sample-data', 'twenty-lines.csv'), api => {
    // console.log(api.data)
    api.save();
});