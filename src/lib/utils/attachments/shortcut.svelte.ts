import { browser } from '$app/environment';
import type { Attachment } from 'svelte/attachments';
import { pseudoRandomId } from '../functions';

export interface ShortcutParams {
    alt?: boolean;
    shift?: boolean;
    control?: boolean;
    code: string;
    callback: () => void;
}

// eslint-disable-next-line svelte/prefer-svelte-reactivity
const callbacks: Map<string, IdShortcutParams[]> = new Map();

function setupListener() {
    if (!browser) return;
    window.addEventListener('keydown', (e) => {
        const key = mapKey({
            code: e.code,
            alt: e.altKey,
            shift: e.shiftKey,
            control: e.ctrlKey
        });
        const value = callbacks.get(key);
        if (!value || value.length === 0) return;
        e.preventDefault();
        e.stopPropagation();
        value[value.length - 1].callback();
    });
}

setupListener();

function mapKey(config: Omit<ShortcutParams, 'callback'>) {
    return `${config.alt ? 'alt' : ''}${config.shift ? 'shift' : ''}${
        config.control ? 'ctrl' : ''
    }${config.code}`;
}

function registerCallback(config: IdShortcutParams) {
    const key = mapKey(config);
    callbacks.set(key, [...(callbacks.get(key) || []), config]);
}

function unregisterCallback(config: IdShortcutParams) {
    const key = mapKey(config);
    callbacks.set(key, callbacks.get(key)?.filter((c) => c.id !== config.id) ?? []);
}

interface IdShortcutParams extends ShortcutParams {
    id: string;
}

export function shortcut(params: ShortcutParams): Attachment {
    const id = pseudoRandomId();
    return (_node: Element) => {
        registerCallback({ ...params, id });
        return () => {
            unregisterCallback({ ...params, id });
        };
    };
}
