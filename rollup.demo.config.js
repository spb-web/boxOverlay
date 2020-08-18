import typescript from '@rollup/plugin-typescript'

export default {
  input: './demo/index.ts',
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
      entryFileNames: 'demo/index.js',
      format: 'iife'
    },
  ]
}