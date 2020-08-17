import typescript from '@rollup/plugin-typescript'

export default {
  input: './src/index.ts',
  plugins: [
    typescript({
      lib: ["es5", "es6", "dom"],
      target: "es5",
      declaration: true,
      declarationDir: 'types/',
      rootDir: 'src/'
    })
  ],
  output: [
    {
      dir: '.',
      entryFileNames: 'dist/index.js',
      format: 'esm'
    },
  ]
}