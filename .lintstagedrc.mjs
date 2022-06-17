export default {
    '*.*': filenames => [`case-police  --fix ${filenames.join(' ')}`],
    '*.{json,mjs,ts,vue}': filenames => [
        `eslint ${filenames.join(' ')}`,
        `vitest ${filenames.join(' ')} --passWithNoTests`,
    ],
};
