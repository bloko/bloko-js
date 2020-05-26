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
      file: 'dist/index.js',
      format: 'cjs',
      exports: 'named',
    },
    plugins: [
      replace({ 'process.env.NODE_ENV': JSON.stringify('development') }),
      resolve(),
      babel(),
      commonjs(),
      sizeSnapshot(),
    ],
  },
  {
    input: 'src/index.js',
    output: {
      file: 'dist/index.min.js',
      format: 'cjs',
      exports: 'named',
      indent: false,
    },
    plugins: [
      replace({ 'process.env.NODE_ENV': JSON.stringify('production') }),
      resolve(),
      babel(),
      commonjs(),
      terser(),
      sizeSnapshot(),
    ],
  },
];
