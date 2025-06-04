import { monacoInstance } from "./editor/instance";

export const applyTheme = (theme: "light" | "dark") => {
    document.documentElement.setAttribute("data-theme", theme);
    if (monacoInstance) {
        monacoInstance.editor.setTheme(theme === "dark" ? "aqa-dark" : "aqa-light");
    }
    localStorage.setItem("theme", theme);
};

export const loadTheme = () => {
    const savedTheme = localStorage.getItem("theme");
    if (!savedTheme || (savedTheme !== "light" && savedTheme !== "dark")) {
        const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        applyTheme(prefersDark ? "dark" : "light");
    } else {
        applyTheme(savedTheme);
    }  
}

export function ThemeToggle() {
    const toggle = () => {
        const current = document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark";
        applyTheme(current as "light" | "dark");
    };

    return (
        <button className="button" onClick={toggle}>
            Toggle Theme
        </button>
    );
}