import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import json from '@rollup/plugin-json';
import { terser } from 'rollup-plugin-terser';

export default [
  {
    input: ['src/main.ts', 'src/preload.ts'],
    output: [
      {
        dir: "dist",  // 출력 디렉토리
        format: 'cjs',
        preserveModules: true,
      },
    ],
    plugins: [
      // resolve(),
      commonjs(),
      json(),
      typescript({ tsconfig: './tsconfig.json' }),

      // terser(),
    ],
    external: ['electron'],
  }
]
