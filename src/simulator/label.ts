export class LabelReference {
    labelName: string;
    line: number;

    constructor(labelName: string, line: number) {
        this.labelName = labelName;
        this.line = line;
    }
}