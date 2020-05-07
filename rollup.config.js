import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import replace from '@rollup/plugin-replace';
import babel from 'rollup-plugin-babel';
import { sizeSnapshot } from 'rollup-plugin-size-snapshot';
import { terser } from 'rollup-plugin-terser';

export default [
  {
    input: 'test/http-mock.js',
    output: {
      file: 'http-mock.js',
      format: 'cjs',
    },
    plugins: [
      replace({
        delimiters: ['', ''],
        values: {
          '../src/http': './dist/http',
          ').default': ')',
        },
      }),
    ],
  },
  {
    input: 'src/http.js',
    output: {
      file: 'dist/http.js',
      format: 'cjs',
    },
    external: ['axios'],
    plugins: [resolve(), babel(), commonjs(), terser()],
  },
  {
    input: 'src/index.js',
    output: {
      file: 'dist/index.js',
      format: 'cjs',
      exports: 'named',
    },
    external: ['./http'],
    plugins: [
      resolve(),
      babel(),
      commonjs(),
      replace({ 'process.env.NODE_ENV': JSON.stringify('development') }),
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
    external: ['./http'],
    plugins: [
      resolve(),
      babel(),
      commonjs(),
      replace({ 'process.env.NODE_ENV': JSON.stringify('production') }),
      terser(),
      sizeSnapshot(),
    ],
  },
];
