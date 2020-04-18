import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import replace from '@rollup/plugin-replace';
import babel from 'rollup-plugin-babel';
import { sizeSnapshot } from 'rollup-plugin-size-snapshot';
import { terser } from 'rollup-plugin-terser';

export default [
  {
    input: 'packages/index.js',
    output: {
      file: 'dist/bloko.js',
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
    input: 'packages/index.js',
    output: {
      file: 'dist/bloko.min.js',
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
