export class Error {
    line: number = 0;
    message: string = "";

    constructor(line: number, message: string) {
        this.line = line;
        this.message = message;
    }
}