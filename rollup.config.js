import typescript from '@rollup/plugin-typescript'

export default {
  input: './src/index.ts',
  plugins: [
    typescript({
      lib: ["es2017.object", "es6", "dom"],
      target: "es6",
      declaration: true,
      declarationDir: 'types/',
      rootDir: 'src/',
      exclude: 'docs/**/*.ts'
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