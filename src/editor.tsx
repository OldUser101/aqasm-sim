"use client";
import Editor from '@monaco-editor/react';
import './editor.css';

import { setInstances } from './editor/instance';

export function CodeEditor() {
    return (
        <div className="editor">
            <Editor
                defaultLanguage="aqa-asm"
                defaultValue={`; Start typing your code here\n`}
                onMount={setInstances}
                options={{
                    automaticLayout: true,
                    minimap: {
                        enabled: false
                    }
                }}
            />
        </div>
    );
}