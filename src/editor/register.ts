import * as monacoEditor from 'monaco-editor';

function generateCompletions(range: { startLineNumber: number, endLineNumber: number, startColumn: number, endColumn: number}) {
    return [
        {
            label: 'LDR',
            kind: monacoEditor.languages.CompletionItemKind.Function,
            documentation: "Load a value from a memory address into a register.",
            insertText: 'LDR',
            range: range,
        },
        {
            label: 'STR',
            kind: monacoEditor.languages.CompletionItemKind.Function,
            documentation: "Store a value in a register at a memory address.",
            insertText: 'STR',
            range: range,
        },
        {
            label: 'ADD',
            kind: monacoEditor.languages.CompletionItemKind.Function,
            documentation: "Add a register and another register or immediate value into a register.",
            insertText: 'ADD',
            range: range,
        },
        {
            label: 'SUB',
            kind: monacoEditor.languages.CompletionItemKind.Function,
            documentation: "Subtract a register or immediate value from another register into a register.",
            insertText: 'SUB',
            range: range,
        },
        {
            label: 'MOV',
            kind: monacoEditor.languages.CompletionItemKind.Function,
            documentation: "Move a register value or an immediate into a register.",
            insertText: 'MOV',
            range: range,
        },
        {
            label: 'CMP',
            kind: monacoEditor.languages.CompletionItemKind.Function,
            documentation: "Compare a register with another register or immediate value.",
            insertText: 'CMP',
            range: range,
        },
        {
            label: 'B',
            kind: monacoEditor.languages.CompletionItemKind.Function,
            documentation: "Branch unconditionally to a label.",
            insertText: 'B',
            range: range,
        },
        {
            label: 'BEQ',
            kind: monacoEditor.languages.CompletionItemKind.Function,
            documentation: "Branch to a label if the last comparison was equal.",
            insertText: 'BEQ',
            range: range,
        },
        {
            label: 'BNE',
            kind: monacoEditor.languages.CompletionItemKind.Function,
            documentation: "Branch to a label if the last comparison was not equal.",
            insertText: 'BNE',
            range: range,
        },
        {
            label: 'BGT',
            kind: monacoEditor.languages.CompletionItemKind.Function,
            documentation: "Branch to a label if the last comparison was greater than.",
            insertText: 'BGT',
            range: range,
        },
        {
            label: 'BLT',
            kind: monacoEditor.languages.CompletionItemKind.Function,
            documentation: "Branch to a label if the last comparison was less than.",
            insertText: 'BLT',
            range: range,
        },
        {
            label: 'AND',
            kind: monacoEditor.languages.CompletionItemKind.Function,
            documentation: "Bitwise AND of a register and either a register or an immediate into a register.",
            insertText: 'AND',
            range: range,
        },
        {
            label: 'ORR',
            kind: monacoEditor.languages.CompletionItemKind.Function,
            documentation: "Bitwise OR of a register and either a register or an immediate into a register.",
            insertText: 'ORR',
            range: range,
        },
        {
            label: 'EOR',
            kind: monacoEditor.languages.CompletionItemKind.Function,
            documentation: "Bitwise EOR/XOR of a register and either a register or an immediate into a register.",
            insertText: 'EOR',
            range: range,
        },
        {
            label: 'MVN',
            kind: monacoEditor.languages.CompletionItemKind.Function,
            documentation: "Bitwise NOT of either a register or an immediate into a register.",
            insertText: 'MVN',
            range: range,
        },
        {
            label: 'LSL',
            kind: monacoEditor.languages.CompletionItemKind.Function,
            documentation: "Logical shift left of a register and either a register or an immediate into a register.",
            insertText: 'LSL',
            range: range,
        },
        {
            label: 'LSR',
            kind: monacoEditor.languages.CompletionItemKind.Function,
            documentation: "Logical shift right of a register and either a register or an immediate into a register.",
            insertText: 'LSR',
            range: range,
        },
        {
            label: 'HALT',
            kind: monacoEditor.languages.CompletionItemKind.Function,
            documentation: "Stop the CPU.",
            insertText: 'HALT',
            range: range,
        },
    ];
}

export function RegisterLanguage(monaco: typeof monacoEditor) {
    monaco.languages.register({ id: 'aqa-asm' });

    monaco.languages.setMonarchTokensProvider('aqa-asm', {
        ignoreCase: true,
        tokenizer: {
            root: [
                [/;.*/, "comment"],
                [/\b(LDR|STR|ADD|SUB|MOV|CMP|B|BEQ|BNE|BGT|BLT|AND|ORR|EOR|MVN|LSL|LSR|HALT|NOP)\b/,"keyword"],
                [/\bR[0-9]+\b/, "variable"],
                [/#-?\d+/, "number.immediate"],
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

    monaco.languages.registerCompletionItemProvider('aqa-asm', {
        provideCompletionItems: function(model, position) {
            var word = model.getWordUntilPosition(position);
            var range = {
                startLineNumber: position.lineNumber,
                endLineNumber: position.lineNumber,
                startColumn: word.startColumn,
                endColumn: word.endColumn,
            };

            return {
                suggestions: generateCompletions(range)
            };
        },
    });
}