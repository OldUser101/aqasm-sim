"use client";

import { useRef } from 'react';
import Editor from '@monaco-editor/react';
import type * as monacoEditor from 'monaco-editor';
import { Parser } from './simulator/parser';
import { Assembler } from './simulator/asembler';

export function CodeEditor() {
    const editorRef = useRef<monacoEditor.editor.IStandaloneCodeEditor | null>(null);

    function handleEditorMount(
        editor: monacoEditor.editor.IStandaloneCodeEditor,
        monaco: typeof monacoEditor
    ) {
        editorRef.current = editor;
    }

    const runParser = () => {
        if (editorRef.current) {
            const code = editorRef.current.getValue();
            const parsed = Parser.parse(code);
            const assembled = Assembler.assemble(parsed);
            console.log(assembled);
        }
    };

    return (
        <>
            <Editor 
                height="60vh"
                width="100vw"
                defaultLanguage="typescript"
                defaultValue={`; Start typing your code here\n`}
                theme="vs-dark"
                onMount={handleEditorMount}
                options={{ automaticLayout: true }}
            />
            <button onClick={runParser}>Parse & Log</button>
        </>
    );
}