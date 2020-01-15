import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import babel from 'rollup-plugin-babel'
import postcss from 'rollup-plugin-postcss'
import replace from 'rollup-plugin-replace'
import { terser } from 'rollup-plugin-terser'
import pkg from './package.json'

export default [
  {
    input: 'src/index.js',
    output: [
      {
        format: 'esm',
        file: pkg.module,
      },
      {
        format: 'cjs',
        file: pkg.main,
      },
    ],
    external: [
      ...Object.keys(pkg.peerDependencies),
      ...Object.keys(pkg.dependencies),
    ],
    plugins: [
      postcss({
        minimize: true,
      }),
      babel({
        exclude: ['node_modules/**'],
      }),
    ],
  },
  {
    input: 'src/index.js',
    output: {
      format: 'umd',
      name: 'NetworkVisualization',
      file: pkg.unpkg,
      globals: {
        react: 'React',
        three: 'THREE',
      },
    },
    external: ['react', 'three'],
    plugins: [
      replace({ 'process.env.NODE_ENV': JSON.stringify('production') }),
      postcss({
        minimize: true,
      }),
      resolve({
        // Use `events` package instead of trying to use `events` node builtin
        // (which would need `rollup-plugin-node-builtins`)
        preferBuiltins: false,
      }),
      babel({
        exclude: ['node_modules/**'],
      }),
      commonjs(),
      terser(),
    ],
  },
]
