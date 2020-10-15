#!/usr/bin/env ts-node-script

import * as fs from 'fs';
import * as path from 'path';
import { ResumeModel } from '../src/resume/resume-model';

function showUsageAndExit(errorMessage?: string): void {
	if (errorMessage) {
		console.error(errorMessage);
	}

	const scriptName: string = path.basename(__filename);
	console.info();
	console.info(`Usage: ${scriptName} <input-ts-file> --output <output-json-path>`);
	console.info();

	process.exit(1);
}

async function main(): Promise<void> {
	// Process arguments.
	const argsScriptIndex: number = process.argv.indexOf(__filename);
	if (argsScriptIndex < 0) {
		showUsageAndExit('Failed to parse arguments');
	}

	const args: string[] = process.argv.slice(argsScriptIndex + 1);
	if (args.length !== 3) {
		showUsageAndExit('Incorrect number of arguments');
	}

	const inputTsFilePath: string = path.resolve(process.cwd(), args[0]);
	const outputSwitch: string = args[1];
	const outputJsonFilePath: string = args[2];

	if (outputSwitch !== '--output') {
		showUsageAndExit(`Unknown argument: '${outputSwitch}'`);
	}

	// Generate the JSON file.
	const resume = (await import(inputTsFilePath)) as ResumeModel;
	fs.writeFileSync(outputJsonFilePath, JSON.stringify(resume, undefined, '\t'));
}
main();
