import path from 'node:path';
import fs from 'node:fs/promises';
import { existsSync } from 'node:fs';

class FSUtil {
    async readData(target: string): Promise<string[]> {
        if (!existsSync(target)) {
            return [];
        }
        if (!(await fs.stat(target)).isFile()) {
            return [];
        }

        const data = await fs.readFile(target, 'utf8');
        return data.split('\n');
    }

    async writeData(target: string, data: string[]): Promise<void> {
        const dirname = path.dirname(target);
        if (!existsSync(dirname) || !(await fs.stat(dirname)).isDirectory()) {
            await fs.mkdir(dirname, { recursive: true });
        }
        await fs.writeFile(target, data.join('\n') + '\n');
    }
    async appendData(target: string, data: string[]): Promise<void> {
        const dirname = path.dirname(target);
        if (!existsSync(dirname) || !(await fs.stat(dirname)).isDirectory()) {
            await fs.mkdir(dirname, { recursive: true });
        }

        const appendContent = data.join('\n') + '\n';
        await fs.appendFile(target, appendContent); 
    }
    async deleteData(target: string): Promise<void> {
        if (existsSync(target)) {
            await fs.unlink(target);
        }
    }
}

export default FSUtil;