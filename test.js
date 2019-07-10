const { toJSON } = require('./dist');

// toJson('../../misc/test-convert/sample-data/thousand-lines.csv', api => {
//     console.log(api.data);
//     api.save();
// });

toJSON('../../twenty.csv', api => {
    console.log(api.data);
})