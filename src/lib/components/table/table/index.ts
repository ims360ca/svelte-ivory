import Column from './Column.svelte';
import Row from './Row.svelte';
import TableComponent from './Table.svelte';

const Table = Object.assign(
    TableComponent<{ id: string }> as typeof TableComponent<{ id: string }>,
    {
        Column,
        Row
    }
);
export default Table;
