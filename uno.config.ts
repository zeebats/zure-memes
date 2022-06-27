import transformerDirective from '@unocss/transformer-directives';
import { defineConfig } from 'unocss';

export default defineConfig({ transformers: [transformerDirective()] });
