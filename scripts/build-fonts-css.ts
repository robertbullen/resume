#!/usr/bin/env ts-node-script

import fetch from 'cross-fetch';
import deepEqual from 'fast-deep-equal';
import * as fs from 'fs';
import * as path from 'path';
import replaceAsync from 'string-replace-async';

function showUsageAndExit(errorMessage?: string): never {
	if (errorMessage) {
		console.error(errorMessage);
	}

	const scriptName: string = path.basename(__filename);
	console.info();
	console.info(
		`Usage: ${scriptName} --mapping <mapping-json-path> --input <input-css-path> --output <output-css-path>`,
	);
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
	if (args.length !== 6) {
		showUsageAndExit('Incorrect number of arguments');
	}

	let inputCssFilePath: string | undefined;
	let mappingJsonFilePath: string | undefined;
	let outputCssFilePath: string | undefined;

	for (let argIndex = 0; argIndex < args.length; argIndex += 2) {
		const arg: string = args[argIndex];
		const filePath: string = path.resolve(process.cwd(), args[argIndex + 1]);

		switch (arg) {
			case '--input':
				inputCssFilePath = filePath;
				break;

			case '--mapping':
				mappingJsonFilePath = filePath;
				break;

			case '--output':
				outputCssFilePath = filePath;
				break;
		}
	}

	if (!inputCssFilePath || !mappingJsonFilePath || !outputCssFilePath) {
		showUsageAndExit('Unspecified argument');
	}

	// Process the CSS file.
	const inputCss: string = fs.readFileSync(inputCssFilePath, 'utf8');
	const fontMapping: Record<string, Record<string, string>> = JSON.parse(
		fs.readFileSync(mappingJsonFilePath, 'utf8'),
	);

	const importStatementRegex: RegExp = /@import url\(["'](?<url>[^"']+)["']\);/g;
	const fontFaceBlockRegex: RegExp = /@font-face.*?}/gs;
	const fontFamilyDeclarationRegex: RegExp = /font-family:\s*["']?(?<fontFamily>[^"']+)["']?;/;
	const fontStyleDeclarationRegex: RegExp = /font-style:\s*(?<fontStyle>[^;]+);/;
	const fontWeightDeclarationRegex: RegExp = /font-weight:\s*(?<fontWeight>[^;]+);/;

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
			return text.replace(fontFaceBlockRegex, (fontFaceBlock: string): string => {
				// Locate the important font declarations.
				const declarations: Record<string, string> = Object.assign(
					{},
					...[
						fontFamilyDeclarationRegex,
						fontStyleDeclarationRegex,
						fontWeightDeclarationRegex,
					].map((regex: RegExp) => regex.exec(fontFaceBlock)?.groups),
				);

				// Determine the new font family name.
				for (const [newFontFamily, identifyingDeclarations] of Object.entries(
					fontMapping,
				)) {
					if (deepEqual(declarations, identifyingDeclarations)) {
						// Replace the original font family name with the new.
						fontFaceBlock = fontFaceBlock.replace(
							fontFamilyDeclarationRegex,
							(_fontFamilyDeclaration: string): string =>
								`font-family: '${newFontFamily}';`,
						);

						break;
					}
				}

				return fontFaceBlock;
			});
		},
	);
	fs.writeFileSync(outputCssFilePath, outputCss);
}

main();
