import Column from './Column.svelte';
import Row from './Row.svelte';
import { default as TableComponent } from './Table.svelte';

export const Table = Object.assign(TableComponent, {
    Column: Column,
    Row: Row
});
