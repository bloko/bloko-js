import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import replace from '@rollup/plugin-replace';
import babel from 'rollup-plugin-babel';
import { sizeSnapshot } from 'rollup-plugin-size-snapshot';
import { terser } from 'rollup-plugin-terser';

export default [
  {
    input: 'test/mock-http.js',
    output: {
      file: 'dist/mock-http.js',
      format: 'cjs',
    },
    plugins: [
      replace({
        delimiters: ['', ''],
        values: {
          '../packages/core/http': './core/http',
          ').default': ')',
        },
      }),
    ],
  },
  {
    input: 'packages/core/index.lib.js',
    output: {
      file: 'dist/index.js',
      format: 'cjs',
    },
  },
  {
    input: 'packages/core/http.js',
    output: {
      file: 'dist/core/http.js',
      format: 'cjs',
    },
    external: ['axios'],
    plugins: [resolve(), commonjs(), babel(), terser()],
  },
  {
    input: 'packages/core/index.js',
    output: {
      file: 'dist/core/index.js',
      format: 'cjs',
    },
    external: ['./http'],
    plugins: [
      resolve(),
      commonjs(),
      babel(),
      replace({ 'process.env.NODE_ENV': JSON.stringify('development') }),
      sizeSnapshot(),
    ],
  },
  {
    input: 'packages/core/index.js',
    output: {
      file: 'dist/core/index.min.js',
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
