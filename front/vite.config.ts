import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path'

function alias(find:string, replacement:string) {
    return {
        find : find,
        replacement : path.resolve(__dirname, replacement)
    }
}

export default defineConfig({
    server: {
        port : 3600,
    },
    plugins: [react()],
    resolve: {
        alias: [
            
            alias('@', 'src'),
            alias('data', 'src/data'),
            alias('components', 'src/components'),
            alias('context', 'src/context'),
            alias('utils', 'src/utils'),
            alias('lib', 'src/lib'),
            alias('api', 'src/api'),
            alias('types', 'src/types'),
            alias('hooks', 'src/hooks'),
            alias('assets', 'src/assets'),
            alias('pages', 'src/pages'),
            alias('features', 'src/features'),
        ]
    }
})
