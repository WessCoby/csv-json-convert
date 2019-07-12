const convert_to_json = require('./functions/convert_to_json');
const convert_to_csv = require('./functions/convert_to_csv');

// Export modules
module.exports.toJSON = convert_to_json.default;
module.exports.toCSV = convert_to_csv.default;