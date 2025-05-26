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
    width = $state<number>(0);
    private minimalWidth = $state(DEFAULT_WIDTH);
    hovering = $state(false);
    resizable = $state(false);
    dragging = $state(false);

    constructor(conf: ColumnConfig) {
        this.updateConfig(conf);

        $effect(() => {
            this.updateConfig(conf);
        });
    }

    updateConfig(conf: ColumnConfig) {
        this.id = conf.id;
        if (conf.minWidth !== undefined) {
            this.minimalWidth = conf.minWidth;
        } else {
            this.minimalWidth = (conf.width ?? DEFAULT_WIDTH) * MINIMAL_WIDTH_MULTIPLIER;
        }
        if (typeof conf.width !== 'undefined' && !this.width) {
            this.width = conf.width;
        }
        this.header = conf.header;
        this.resizable = conf.resizable ?? false;
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
