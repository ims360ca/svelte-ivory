import { pseudoRandomId } from '$lib/utils/functions';
import type { Icon } from '@lucide/svelte';

export interface ToastSettings {
    message: string;
    autohide?: boolean;
    timeout?: number;
    hideDismiss?: boolean;
    icon?: typeof Icon;
    variant: 'info' | 'success' | 'warning' | 'error';
}

interface Toast extends ToastSettings {
    id: string;
    timeoutId?: ReturnType<typeof setTimeout>;
}

const TOAST_DEFAULTS: ToastSettings = {
    message: 'Missing Toast Message',
    autohide: true,
    timeout: 3000,
    variant: 'info'
};

class ToastStore {
    toasts = $state<Toast[]>([]);

    trigger(toast: ToastSettings, id = pseudoRandomId('toast')) {
        const mergedToasts: Toast = { ...TOAST_DEFAULTS, ...toast, id };

        // start the autohide timeout
        this.startAutoHide(mergedToasts);

        // add the toasts to the list
        this.toasts.push(mergedToasts);
        return id;
    }

    close(id: string) {
        const toast = this.toasts.find((t) => t.id === id);
        if (!toast) return;
        this.stopAutoHide(toast);
        this.toasts = this.toasts.filter((t) => t.id !== id);
    }

    update(id: string, toast: ToastSettings) {
        const existingToast = this.toasts.find((t) => t.id === id);
        if (!existingToast) {
            this.trigger(toast, id);
            return;
        }
        const mergedToast: Toast = {
            ...TOAST_DEFAULTS,
            ...existingToast,
            ...toast
        };
        // clear the existing timeout and restart the autohide
        this.stopAutoHide(existingToast);
        this.startAutoHide(mergedToast);
        this.toasts.splice(this.toasts.indexOf(existingToast), 1, mergedToast);
    }

    freeze(id: string) {
        const toast = this.toasts.find((t) => t.id === id);
        if (!toast) return;
        this.stopAutoHide(toast);
    }

    unfreeze(id: string) {
        const toast = this.toasts.find((t) => t.id === id);
        if (!toast) return;
        this.startAutoHide(toast);
    }

    private startAutoHide(toast: Toast) {
        if (!toast.autohide) return;
        toast.timeoutId = setTimeout(() => {
            this.close(toast.id);
        }, toast.timeout);
    }

    private stopAutoHide(toast: Toast) {
        if (!toast.timeoutId) return;
        clearTimeout(toast.timeoutId);
        delete toast.timeoutId;
    }
}

/** Exposes functions to manage toasts, contains currently active toasts */
export const Toasts = new ToastStore();
