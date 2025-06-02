import type { Snippet } from 'svelte';

const DEFAULT_WIDTH = 250;
const MINIMAL_WIDTH_MULTIPLIER = 0.5;

export interface ColumnConfig {
    id: string;
    width?: number;
    minWidth?: number;
    resizable?: boolean;
    header: Snippet | string;
}

export class Column {
    id = $state('');
    header = $state<Snippet | string>('');

    // resizing
    width = $state<number>();
    private minimalWidth = $state(DEFAULT_WIDTH);
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
        if (conf.minWidth !== undefined) {
            this.minimalWidth = conf.minWidth;
        } else {
            this.minimalWidth = (conf.width ?? DEFAULT_WIDTH) * MINIMAL_WIDTH_MULTIPLIER;
        }
        if (this.width === undefined) {
            const newWidth = conf.width ?? DEFAULT_WIDTH;
            this.width = newWidth;
        }
        if (!this.header) this.header = conf.header;
        const newResizable = conf.resizable ?? false;
        if (newResizable !== this.resizable) {
            this.resizable = newResizable;
        }
    }

    resize(newWidth?: number) {
        if (newWidth === undefined) return;
        if (newWidth < this.minimalWidth) {
            this.width = this.minimalWidth;
        } else {
            this.width = newWidth;
        }
    }
}
