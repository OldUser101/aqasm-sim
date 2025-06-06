export class Error {
    line: number | null = 0;
    message: string = "";

    constructor(line: number | null, message: string) {
        this.line = line;
        this.message = message;
    }
}
