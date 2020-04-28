import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import replace from '@rollup/plugin-replace';
import babel from 'rollup-plugin-babel';
import { sizeSnapshot } from 'rollup-plugin-size-snapshot';
import { terser } from 'rollup-plugin-terser';

export default [
  {
    input: 'src/index.js',
    output: {
      file: 'dist/core.js',
      format: 'cjs',
    },
    external: ['axios'],
    plugins: [
      resolve(),
      commonjs(),
      babel(),
      replace({ 'process.env.NODE_ENV': JSON.stringify('development') }),
      sizeSnapshot(),
    ],
  },
  {
    input: 'src/index.js',
    output: {
      file: 'dist/core.min.js',
      format: 'cjs',
      indent: false,
    },
    external: ['axios'],
    plugins: [
      resolve(),
      commonjs(),
      babel(),
      replace({ 'process.env.NODE_ENV': JSON.stringify('production') }),
      terser(),
      sizeSnapshot(),
    ],
  },
];
