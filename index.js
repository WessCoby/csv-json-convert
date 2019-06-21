const fs = require('fs'),
    path = require('path'),
    exec = require('child_process').exec,
    progress = require('progress'),
    { log } = console;


const lines = exec('cat ./data.csv | wc -l');
const read_heading = exec('read -r line < ./data.csv && echo $line');
const read_body = exec("./readlines ./data.csv");

let headings = [], jsonData = [];

const collect = data => {
        let record = {};
        data = data.replace("\n", "").split(',');
        for(let element = 0; element < data.length; element++) {
              record[headings[element]] = data[element];
        }
        // log(record);
        jsonData.push(record);
};

read_heading.stdout.on('data', head => {
        headings = head.replace("\n", "").split(",");

});

read_heading.on('close', () => {

        read_body.stdout.on('data', collect);
});

read_body.on('close', () => log(JSON.stringify(jsonData)));