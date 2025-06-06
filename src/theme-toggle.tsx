import { monacoInstance } from "./editor/instance";
import { useEffect, useState } from "react";
import { MoonIcon, SunIcon } from "./icons";

export const applyTheme = (theme: "light" | "dark") => {
    document.documentElement.setAttribute("data-theme", theme);
    if (monacoInstance) {
        monacoInstance.editor.setTheme(
            theme === "dark" ? "aqa-dark" : "aqa-light"
        );
    }
    localStorage.setItem("theme", theme);
};

export const loadTheme = () => {
    const savedTheme = localStorage.getItem("theme");
    if (!savedTheme || (savedTheme !== "light" && savedTheme !== "dark")) {
        const prefersDark = window.matchMedia(
            "(prefers-color-scheme: dark)"
        ).matches;
        applyTheme(prefersDark ? "dark" : "light");
    } else {
        applyTheme(savedTheme);
    }
};

export function ThemeToggle() {
    const [theme, setTheme] = useState<"light" | "dark">("light");

    const toggle = () => {
        const current =
            document.documentElement.getAttribute("data-theme") === "dark"
                ? "light"
                : "dark";
        applyTheme(current as "light" | "dark");
        setTheme(current);
    };

    useEffect(() => {
        const current = document.documentElement.getAttribute("data-theme") as
            | "light"
            | "dark";
        setTheme(current);

        const observer = new MutationObserver(() => {
            const current = document.documentElement.getAttribute(
                "data-theme"
            ) as "light" | "dark";
            setTheme(current);
        });
        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ["data-theme"],
        });

        return () => observer.disconnect();
    }, []);

    return (
        <button className="icon-button" onClick={toggle}>
            {theme === "dark" ? <MoonIcon /> : <SunIcon />}
        </button>
    );
}
