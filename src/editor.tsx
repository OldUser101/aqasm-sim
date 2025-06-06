"use client";
import Editor from "@monaco-editor/react";
import "./editor.css";

import { setInstances } from "./editor/instance";

interface Props {
    assembled: boolean;
    reset: () => void;
}

export function CodeEditor({ assembled, reset }: Props) {
    const handleContentChange = () => {
        if (assembled) {
            reset();
        }
    };

    return (
        <div className="editor">
            <Editor
                defaultLanguage="aqa-asm"
                defaultValue={`; Start typing your code here\n`}
                onMount={setInstances}
                onChange={handleContentChange}
                options={{
                    automaticLayout: true,
                    minimap: {
                        enabled: false,
                    },
                }}
            />
        </div>
    );
}
