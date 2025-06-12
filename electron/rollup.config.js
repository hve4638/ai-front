import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from 'rollup-plugin-typescript2';
import json from '@rollup/plugin-json';
import { terser } from 'rollup-plugin-terser';

export default [
  {
    input: ['src/main.ts', 'src/preload.ts'],
    output: [
      {
        dir: "dist",
        format: 'cjs',
        preserveModules: true,
        sourcemap: true,
      },
    ],
    plugins: [
      // resolve(),
      commonjs(),
      json(),
      typescript({
        tsconfig: './tsconfig.json',
        clean: true,
      }),
      // terser(),
    ],
    external: ['electron'],
  }
]
