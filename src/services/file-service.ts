import { createReadStream } from 'fs';

export default class FileService {
    static getReadStream(filePath: string) {
        return createReadStream(filePath);
    }
}
