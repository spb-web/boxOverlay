import typescript from 'rollup-plugin-typescript'
import { terser } from 'rollup-plugin-terser'

export default {
  input: './src/index.ts',
  plugins: [
    typescript({
      lib: ["es5", "es6", "dom"],
      target: "es5",
    })
  ],
  output: [
    {
      file: './dist/webgl-circle-loader.js',
      format: 'esm'
    },
    {
      file: './dist/webgl-circle-loader.min.js',
      format: 'esm',
      plugins: [ terser() ]
    }
  ]
}