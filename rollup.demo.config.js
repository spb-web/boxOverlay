import typescript from '@rollup/plugin-typescript'
import commonjs from '@rollup/plugin-commonjs';
import resolve from 'rollup-plugin-node-resolve';

export default {
  input: 'docs/index.ts',
  plugins: [
    resolve(),
    commonjs(),
    typescript({
      lib: ["es2017.object", "es6", "dom"],
      target: "es5",
      rootDir: __dirname,
    }),
  ],
  output: [
    {
      dir: '.',
      entryFileNames: 'docs/index.js',
      format: 'iife'
    },
  ]
}
