#!/usr/bin/env ts-node-script

import fetch from 'cross-fetch';
import * as fs from 'fs';
import * as path from 'path';
import replaceAsync from 'string-replace-async';

function showUsageAndExit(errorMessage?: string): void {
	if (errorMessage) {
		console.error(errorMessage);
	}

	const scriptName: string = path.basename(__filename);
	console.info();
	console.info(`Usage: ${scriptName} <input-css-path> --output <output-css-path>`);
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

	const inputCssFilePath: string = path.resolve(process.cwd(), args[0]);
	const outputSwitch: string = args[1];
	const outputCssFilePath: string = args[2];

	if (outputSwitch !== '--output') {
		showUsageAndExit(`Unknown argument: '${outputSwitch}'`);
	}

	// Process the CSS file.
	const inputCss: string = fs.readFileSync(inputCssFilePath, 'utf8');

	const importStatementRegex: RegExp = /@import url\(["'](?<url>[^"']+)["']\);/g;
	const fontFaceBlockRegex: RegExp = /@font-face.*?}/gs;
	const localFontFamilyFragmentRegex: RegExp = /local\((?<fontFamilyName>[^)]+)\)/;
	const fontFamilyDeclarationRegex: RegExp = /font-family:[^;]+;/;

	const outputCss: string = await replaceAsync(
		inputCss,
		importStatementRegex,
		async (_importStatement: string, url: string): Promise<string> => {
			const response: Response = await fetch(url, { headers: { accept: 'text/css' } });
			if (!response.ok) {
				throw new Error(`Failed to fetch ${url}`);
			}
			const text = await response.text();

			// Within each font face block...
			return text.replace(fontFaceBlockRegex, (fontFaceBlock: string): string =>
				// ...find the `font-family:...;` declaration...
				fontFaceBlock.replace(
					fontFamilyDeclarationRegex,
					(_fontFamilyDeclaration: string): string => {
						// ...and replace it with the first local font family name.
						const fontFamilyName: string | undefined = fontFaceBlock.match(
							localFontFamilyFragmentRegex,
						)?.groups?.fontFamilyName;
						if (!fontFamilyName) {
							throw new Error(
								`Failed to find local font family name in ${fontFaceBlock}`,
							);
						}
						return `font-family: ${fontFamilyName};`;
					},
				),
			);
		},
	);
	fs.writeFileSync(outputCssFilePath, outputCss);
}

main();
