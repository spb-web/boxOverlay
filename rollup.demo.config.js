import typescript from '@rollup/plugin-typescript'

export default {
  input: './docs/index.ts',
  plugins: [
    typescript({
      lib: ["es2017.object", "es6", "dom"],
      target: "es5",
      rootDir: '/'
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