import type { Snippet } from 'svelte';

const DEFAULT_WIDTH = 250;
const MINIMAL_WIDTH_MULTIPLIER = 0.5;

interface ColumnConfig {
    label: string;
    id: string;
    width?: number;
    minWidth?: number;
    resizable?: boolean;
    filter?: Snippet;
}

export class Column {
    label = $state('');
    id = $state('');
    width = $state(DEFAULT_WIDTH);
    private minimalWidth = $state(DEFAULT_WIDTH);

    // resizing
    hovering = $state(false);
    resizable = $state(false);
    dragging = $state(false);

    // filtering ui
    filter?: Snippet = $state();

    constructor(conf: ColumnConfig) {
        this.updateConfig(conf);

        $effect(() => {
            this.updateConfig(conf);
        });
    }

    private updateConfig(conf: ColumnConfig) {
        this.label = conf.label;
        this.id = conf.id;
        this.width = Math.max(
            typeof conf.width !== 'undefined' ? conf.width : DEFAULT_WIDTH,
            conf.minWidth ?? 0
        );
        if (conf.minWidth) {
            this.minimalWidth = conf.minWidth;
        } else {
            this.minimalWidth = (conf.width ?? DEFAULT_WIDTH) * MINIMAL_WIDTH_MULTIPLIER;
        }
        this.filter = conf.filter;
        this.resizable = conf.resizable ?? false;
    }

    resize(newWidth: number) {
        if (newWidth < this.minimalWidth) {
            this.width = this.minimalWidth;
            return;
        }
        this.width = newWidth;
    }
}
