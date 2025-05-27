"use client";
import Editor from '@monaco-editor/react';

import { setInstances } from './editor/monaco-instance';

export function CodeEditor() {
    return (
        <div>
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