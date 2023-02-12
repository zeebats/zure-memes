export default {
	'*.*': filenames => [`case-police --fix ${filenames.join(' ')}`],
	'*.{css,vue}': filenames => [`stylelint --fix ${filenames.join(' ')}`],
	'*.{js,mjs,json,ts,vue}': filenames => [
		`eslint --fix ${filenames.join(' ')}`,
		`vitest ${filenames.join(' ')} --passWithNoTests`,
	],
};
