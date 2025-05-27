"use client";

import { useRef } from 'react';
import Editor from '@monaco-editor/react';
import type * as monacoEditor from 'monaco-editor';
import { ParseContext, Parser } from './simulator/parser';
import { Assembler } from './simulator/asembler';
import { DEFAULT_SIGNATURES } from './simulator/signature';
import { RegisterLanguage } from './editor/register';

export function CodeEditor() {
    const editorRef = useRef<monacoEditor.editor.IStandaloneCodeEditor | null>(null);

    function handleEditorMount(
        editor: monacoEditor.editor.IStandaloneCodeEditor,
        monaco: typeof monacoEditor
    ) {
        editorRef.current = editor;
        RegisterLanguage(monaco);
        monaco.editor.setTheme("aqa-dark");
    }

    const runParser = () => {
        if (editorRef.current) {
            const code = editorRef.current.getValue();
            const context = new ParseContext();
            const parsed = Parser.parse(code, context);
            const assembler = new Assembler();
            assembler.loadSigTable(DEFAULT_SIGNATURES);
            const assembled = assembler.assemble(parsed, context);
            console.log(parsed);
            console.log(context);
            console.log(assembled);
        }
    };

    return (
        <>
            <Editor 
                height="60vh"
                width="100vw"
                defaultLanguage="aqa-asm"
                defaultValue={`; Start typing your code here\n`}
                onMount={handleEditorMount}
                options={{ automaticLayout: true }}
            />
            <button onClick={runParser}>Parse & Log</button>
        </>
    );
}