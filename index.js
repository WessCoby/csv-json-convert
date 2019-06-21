const fs = require('fs'),
    path = require('path'),
    util = require('util'),
    { exec } = require('child_process'),
    promisified_exec = util.promisify(exec),
    ProgressBar = require('progress'),
    { log } = console;

async function collect_csv_data() {
	let jsonData = { data: [] };

	// Push data from the csv file to jsonData.data 
	const collect = data => {
		let record = {};
		data = data.replace("\n", "").split(',');
		for(let element = 0; element < data.length; element++) {
			record[headings[element]] = data[element];
		}
		jsonData['data'].push(record);
	};

	// Get number of lines in file (header excluded)
	let lines = await promisified_exec(`cat ${process.argv[2]} | wc -l`);
	lines = lines.stdout - 1;

	// Progress Bar
	const bar = new ProgressBar('Converting File [:bar] Lines processed: :current/:total | :percent complete | :etas remaining', {
			complete: '=',
			incomplete: ' ',
			width: 30,
			total: lines
	});


	// Get first line from file [headings line]
	let headings = await promisified_exec(`read -r line < ${process.argv[2]} && echo $line`);
	headings = headings.stdout.replace('\n', '').split(',');
	

	// Get contents from file, line by line
	const content = exec(`./readlines ${process.argv[2]}`);
	content.stdout.on('data', data => {
			collect(data);
			bar.tick(); // Update progress
	});
	// Once Complete
	content.on('close', () => {
			log(jsonData);
			// call function to save data to new file and output completion message
	});
}

collect_csv_data();