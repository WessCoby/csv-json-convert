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
		data = data.replace("\n", "").split(',').values(); // iterator
		Array.from(headings, header => {
			record[header] = data.next().value;
		});
		jsonData['data'].push(record);
	};

	// Get number of lines in file (header excluded)
	let lines = await promisified_exec(`cat ${process.argv[2]} | wc -l`);
	lines = lines.stdout - 1;

	// Progress Bar
	const bar = new ProgressBar('Converting [:bar] Lines processed: :current/:total [:percent] | Time: :elapseds elapsed, :etas remaining.', {
			complete: '=',
			incomplete: ' ',
			width: 20,
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
			// call function to save data to new file and output completion message
			save_data_to_file(jsonData)
	});
}

async function save_data_to_file(data) {
	// Stringify data
	data = JSON.stringify(data, null, 2);

	// extract name from csv file to be used as new json file name
	let file = path.basename(`${process.argv[2]}`, '.csv');
	
	// Write data to file
	fs.writeFile(`./${file}.json`, data, 'utf8', (error, data) => {
		if (error) throw error;
		log(`Done. New file [ ${file}.json ] saved in current working directory`);
	});
};

// Start
collect_csv_data();
