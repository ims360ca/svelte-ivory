import Column from './Column.svelte';
import Row from './Row.svelte';
import TableComponent, { getTableContext } from './Table.svelte';
import { TableController } from './table.svelte';

const Table = Object.assign(
    TableComponent<{ id: string }> as typeof TableComponent<{ id: string }>,
    {
        Column,
        Row,
        getContext: getTableContext,
        Controller: TableController
    }
);
export default Table;
