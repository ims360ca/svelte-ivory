import type { RemoteFormIssue } from '@sveltejs/kit';
import type { ClassValue } from 'svelte/elements';

export interface Theme {
    checkbox?: {
        class?: (checked: boolean, partial: boolean) => ClassValue;
    };
    heading?: {
        class?: ClassValue;
    };
    hiddenBackground?: {
        class?: ClassValue;
    };
    dialog?: {
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
    modal?: {
        class?: ClassValue;
        innerClass?: ClassValue;
        dialog?: {
            class?: ClassValue;
        };
    };
    popover?: {
        class?: ClassValue;
    };
    input?: {
        outerClass?: ClassValue;
        class?: (value: boolean, issues?: boolean) => ClassValue;
        label?: {
            class?: (value: boolean, issues?: boolean) => ClassValue;
        };
        issues?: {
            issue?: {
                label?: (issue: RemoteFormIssue) => string;
                class?: ClassValue;
            };
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
