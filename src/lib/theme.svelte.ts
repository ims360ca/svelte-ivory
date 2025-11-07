import type { ClassValue } from 'svelte/elements';

export interface Theme {
    heading?: {
        class?: ClassValue;
    };
    hiddenBackground?: {
        class?: ClassValue;
    };
    tabs?: {
        tab?: {
            class?: (active: boolean) => ClassValue;
        };
    };
    table?: {
        column?: {
            class?: ClassValue;
        };
    };
}

function createTheme() {
    let theme = $state<Theme>({});

    return {
        setTheme(newTheme: Theme) {
            theme = newTheme;
        },
        set current(newTheme: Theme) {
            theme = newTheme;
        },
        get current() {
            return theme;
        }
    };
}

export const theme = createTheme();
