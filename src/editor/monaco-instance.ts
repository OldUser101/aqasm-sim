import { RegisterLanguage } from './register';
import type * as monacoEditor from 'monaco-editor';

export let editorInstance: monacoEditor.editor.IStandaloneCodeEditor | null = null;
export let monacoInstance: typeof monacoEditor | null = null;

export function setInstances(editor: monacoEditor.editor.IStandaloneCodeEditor, monaco: typeof monacoEditor) {
    editorInstance = editor;
    monacoInstance = monaco;

    RegisterLanguage(monaco);

    const theme = document.documentElement.getAttribute('data-theme');
    if (theme) {
        monaco.editor.setTheme(theme === "dark" ? "aqa-dark" : "aqa-light");
    }
}