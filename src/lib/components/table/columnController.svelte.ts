import type { Snippet } from 'svelte';

const DEFAULT_WIDTH = 250;
export const MINIMAL_WIDTH_MULTIPLIER = 0.5;

export interface ColumnConfig {
    id: string;
    width?: number;
    minWidth?: number;
    resizable?: boolean;
    header: Snippet | string;
}

export class ColumnController {
    id = $state('');
    header = $state<Snippet | string>('');

    // resizing
    width = $state<number>();
    minWidth = $state(DEFAULT_WIDTH);
    hovering = $state(false);
    resizable = $state(false);
    dragging = $state(false);

    constructor(conf: ColumnConfig) {
        this.id = conf.id;
        this.updateConfig(conf);

        $effect(() => {
            this.updateConfig(conf);
        });
    }

    updateConfig(conf: ColumnConfig) {
        if (!this.header) this.header = conf.header;
        if (typeof this.width === 'undefined') {
            const newWidth = typeof conf.width === 'undefined' ? DEFAULT_WIDTH : conf.width;
            this.width = newWidth;
        }
        if (typeof conf.minWidth !== 'undefined') {
            this.minWidth = conf.minWidth;
        } else {
            this.minWidth = this.width * MINIMAL_WIDTH_MULTIPLIER;
        }
        const newResizable = conf.resizable ?? false;
        if (newResizable !== this.resizable) {
            this.resizable = newResizable;
        }
    }

    resize(newWidth?: number) {
        if (typeof newWidth === 'undefined') return;
        if (newWidth < this.minWidth) {
            this.width = this.minWidth;
        } else {
            this.width = newWidth;
        }
    }
}
