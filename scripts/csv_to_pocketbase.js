import fs from 'fs';
import csv from 'csv-parser';
import PocketBase from 'pocketbase';
import { fileURLToPath } from 'url';

const COLLECTION_NAME = 'locations';

const FIELD_MAPPINGS = {
	name_en: 'text',
	name_fr: 'text',
	description_preview_en: 'text',
	description_preview_fr: 'text',
	description_en: 'text',
	description_fr: 'text',
	has_qr_code: 'bool',
	text_on_scan_en: 'text',
	text_on_scan_fr: 'text',
	location: 'geoPoint'
};

const convertValue = (value, fieldType, fieldName) => {
	if (value === null || value === undefined || value === '') {
		return null;
	}

	switch (fieldType) {
		case 'bool':
			if (typeof value === 'boolean') return value;
			const lowerValue = value.toString().toLowerCase().trim();
			return lowerValue === 'true' || lowerValue === '1' || lowerValue === 'yes';

		case 'geoPoint':
			if (typeof value === 'string') {
				try {
					if (value.includes(',')) {
						const [lat, lon] = value.split(',').map((coord) => parseFloat(coord.trim()));
						console.log('Got point: ', lat, lon);
						if (!isNaN(lat) && !isNaN(lon)) {
							return { lat, lon };
						}
					} else {
						const parsed = JSON.parse(value);
						if (parsed.lat !== undefined && parsed.lon !== undefined) {
							return { lat: parseFloat(parsed.lat), lon: parseFloat(parsed.lon) };
						}
					}
				} catch (e) {
					console.warn(`Warning: Could not parse geoPoint for ${fieldName}: ${value}`);
					return null;
				}
			}
			return value;

		case 'text':
		default:
			return value.toString().trim();
	}
};

const uploadCsvToPocketBase = async (csvFilePath, pocketbaseUrl, adminEmail, adminPassword) => {
	try {
		const pb = new PocketBase(pocketbaseUrl);

		console.log('Authenticating with PocketBase...');
		await pb.admins.authWithPassword(adminEmail, adminPassword);
		console.log('Authentication successful!');

		const records = [];
		const csvStream = fs.createReadStream(csvFilePath).pipe(csv());

		for await (const row of csvStream) {
			const record = {};
			let hasValidData = false;

			for (const [csvColumn, csvValue] of Object.entries(row)) {
				const fieldName = csvColumn.trim();

				if (FIELD_MAPPINGS.hasOwnProperty(fieldName)) {
					const fieldType = FIELD_MAPPINGS[fieldName];
					const convertedValue = convertValue(csvValue, fieldType, fieldName);

					if (convertedValue !== null) {
						record[fieldName] = convertedValue;
						hasValidData = true;
					}
				} else {
					console.log(`Skipping unknown field: ${fieldName}`);
				}
			}

			if (hasValidData) {
				records.push(record);
			}
		}

		console.log(`Found ${records.length} records to upload`);

		let successCount = 0;
		let errorCount = 0;

		for (let i = 0; i < records.length; i++) {
			const record = records[i];

			try {
				const result = await pb.collection(COLLECTION_NAME).create(record);
				console.log(
					`✅ Record ${i + 1}/${records.length} uploaded successfully (ID: ${result.id})`
				);
				successCount++;
			} catch (error) {
				console.error(`❌ Error uploading record ${i + 1}/${records.length}:`, error.message);
				console.error('Record data:', JSON.stringify(record, null, 2));
				errorCount++;
			}
		}

		console.log('\n=== Upload Summary ===');
		console.log(`Total records processed: ${records.length}`);
		console.log(`Successfully uploaded: ${successCount}`);
		console.log(`Errors: ${errorCount}`);
	} catch (error) {
		console.error('Fatal error:', error.message);
		process.exit(1);
	}
};

const parseArgs = (args) => {
	const config = {
		csvFile: null,
		pocketbaseUrl: 'http://127.0.0.1:8090',
		adminEmail: null,
		adminPassword: null
	};

	for (let i = 0; i < args.length; i++) {
		const arg = args[i];

		if (arg === '--url' || arg === '-u') {
			config.pocketbaseUrl = args[++i];
		} else if (arg === '--email' || arg === '-e') {
			config.adminEmail = args[++i];
		} else if (arg === '--password' || arg === '-p') {
			config.adminPassword = args[++i];
		} else if (arg === '--help' || arg === '-h') {
			showHelp();
			process.exit(0);
		} else if (!arg.startsWith('-') && !config.csvFile) {
			config.csvFile = arg;
		} else if (arg.startsWith('-')) {
			console.error(`Unknown flag: ${arg}`);
			showHelp();
			process.exit(1);
		}
	}

	return config;
};

const showHelp = () => {
	console.log(`
CSV to PocketBase Uploader

Usage: node csv-to-pocketbase.js <csv-file> [options]

Arguments:
  <csv-file>              Path to the CSV file to upload

Options:
  -u, --url <url>         PocketBase URL (default: http://127.0.0.1:8090)
  -e, --email <email>     Admin email for authentication
  -p, --password <pass>   Admin password for authentication
  -h, --help              Show this help message

Examples:
  node csv-to-pocketbase.js locations.csv -e admin@example.com -p mypassword
  node csv-to-pocketbase.js data.csv --url http://localhost:8090 --email admin@test.com --password secret123
    `);
};

const main = async () => {
	const args = process.argv.slice(2);
	console.log('Arguments received:', args);

	if (args.length === 0) {
		console.error('Error: No arguments provided');
		showHelp();
		process.exit(1);
	}

	const config = parseArgs(args);
	console.log('Parsed config:', { ...config, adminPassword: '***' });

	if (!config.csvFile) {
		console.error('Error: CSV file path is required');
		showHelp();
		process.exit(1);
	}

	if (!config.adminEmail) {
		console.error('Error: Admin email is required (use --email or -e)');
		process.exit(1);
	}

	if (!config.adminPassword) {
		console.error('Error: Admin password is required (use --password or -p)');
		process.exit(1);
	}

	if (!fs.existsSync(config.csvFile)) {
		console.error(`Error: File not found: ${config.csvFile}`);
		process.exit(1);
	}

	if (!config.csvFile.toLowerCase().endsWith('.csv')) {
		console.error('Error: File must be a CSV file');
		process.exit(1);
	}

	console.log(`Starting upload from: ${config.csvFile}`);
	console.log(`PocketBase URL: ${config.pocketbaseUrl}`);
	console.log(`Admin Email: ${config.adminEmail}`);
	console.log(`Collection: ${COLLECTION_NAME}\n`);

	await uploadCsvToPocketBase(
		config.csvFile,
		config.pocketbaseUrl,
		config.adminEmail,
		config.adminPassword
	);
};

console.log('Script loaded successfully');

const isMainModule = () => {
	try {
		return process.argv[1] === fileURLToPath(import.meta.url);
	} catch (e) {
		return process.argv.length > 1;
	}
};

if (isMainModule()) {
	console.log('Script starting...');
	main().catch((error) => {
		console.error('Unhandled error:', error);
		process.exit(1);
	});
}

export { uploadCsvToPocketBase, parseArgs };
