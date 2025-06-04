export function getStorageItem(name: string, defaultValue: string, check: (value: string) => boolean): string {
    const item = localStorage.getItem(name);

    if (!item) {
        return defaultValue;
    }

    if (!check(item)) {
        return defaultValue;
    }

    return item;
}