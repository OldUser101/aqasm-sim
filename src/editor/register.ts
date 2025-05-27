import type * as monacoEditor from 'monaco-editor';

export function RegisterLanguage(monaco: typeof monacoEditor) {
    monaco.languages.register({ id: 'aqa-asm' });

    monaco.languages.setMonarchTokensProvider('aqa-asm', {
        ignoreCase: true,
        tokenizer: {
            root: [
                [/;.*/, "comment"],
                [/\b(LDR|STR|ADD|SUB|MOV|CMP|B|BEQ|BNE|BGT|BLT|AND|ORR|EOR|MVN|LSL|LSR|HALT|NOP)\b/,"keyword"],
                [/\bR[0-9]+\b/, "variable"],
                [/#\d+/, "number.immediate"],
                [/\b\d+\b/, "number.address"],
                [/^\s*[a-zA-Z_]\w*:/, "type.identifier"],
            ]
        }
    });

    monaco.editor.defineTheme("aqa-light", {
        base: "vs",
        inherit: true,
        rules: [
            { token: "comment", foreground: "008000" },
            { token: "keyword", foreground: "0000FF" },
            { token: "variable", foreground: "800080" },
            { token: "number.immediate", foreground: "008080", fontStyle: "bold" },
            { token: "number.address", foreground: "A52A2A" },
            { token: "type.identifier", foreground: "795E26" },
        ],
        colors: {}
    });

    monaco.editor.defineTheme("aqa-dark", {
        base: "vs-dark",
        inherit: true,
        rules: [
            { token: "comment", foreground: "6A9955" },
            { token: "keyword", foreground: "569CD6" },
            { token: "variable", foreground: "C586C0" },
            { token: "number.immediate", foreground: "B5CEA8", fontStyle: "bold" },
            { token: "number.address", foreground: "D7BA7D" },
            { token: "type.identifier", foreground: "DCDCAA" },
        ],
        colors: {}
    });
}