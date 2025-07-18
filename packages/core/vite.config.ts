/// <reference types="vitest" />
import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
    resolve: {
        alias: {
            '@': path.resolve(__dirname, 'src'), // src 경로 alias
        },
    },
    test: {
        globals: true,
        environment: 'node',
        include: ['src/**/*.test.ts'], // 테스트 경로
        exclude: ['node_modules', 'dist'],
    },
});
