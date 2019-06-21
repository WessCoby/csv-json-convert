const fs = require('fs'),
    path = require('path'),
    util = require('util'),
    { exec } = require('child_process'),
    promisified_exec = util.promisify(exec),
    ProgressBar = require('progress'),
    { log } = console;

async function line_count() {
        let jsonData = [];

        const collect = data => {
			let record = {};
			data = data.replace("\n", "").split(',');
			for(let element = 0; element < data.length; element++) {
				record[headings[element]] = data[element];
			}
			jsonData.push(record);
        };

        let lines = await promisified_exec(`cat ${process.argv[2]} | wc -l`);
        lines = lines.stdout;
        const bar = new ProgressBar('Converting File [:bar>] Lines processed: :current/:total | :percent complete | :etas remaining', {
                complete: '=',
                incomplete: ' ',
                width: 30,
                total: lines - 1        // Not counting header line
        });

        let headings = await promisified_exec(`read -r line < ${process.argv[2]} && echo $line`);
        headings = headings.stdout.replace('\n', '').split(',');
        
        const read_body = exec("./readlines ./data.csv");

        
        log('headings: ', headings)
        read_body.stdout.on('data', data => {
                collect(data);
                bar.tick();
        });
        read_body.on('close', () => {
                log('Done!!!');
                log(jsonData);
        });
}

line_count();
