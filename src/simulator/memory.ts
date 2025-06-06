export class Memory {
    private size: number = 0;
    private data: Uint8Array = new Uint8Array(0);

    constructor(size: number) {
        this.size = size;
        this.data = new Uint8Array(this.size);
    }

    read(i: number): number {
        return this.data[i];
    }

    write(i: number, v: number): void {
        this.data[i] = v;
    }
}
