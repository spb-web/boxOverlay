import typescript from '@rollup/plugin-typescript'
import commonjs from '@rollup/plugin-commonjs';

export default {
  input: 'docs/index.ts',
  plugins: [
    typescript({
      lib: ["es2017.object", "es6", "dom"],
      target: "es5",
      rootDir: __dirname,
    }),
    commonjs(),
  ],
  output: [
    {
      dir: '.',
      entryFileNames: 'docs/index.js',
      format: 'iife'
    },
  ]
}