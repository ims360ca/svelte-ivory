// Reexport your entry components here
export { theme, type Theme } from './theme.svelte';
export { type IvoryComponent } from './types';

export type Variant =
    | 'primary'
    | 'secondary'
    | 'tertiary'
    | 'success'
    | 'warning'
    | 'error'
    | 'surface';
