<script lang="ts">
    import Toggle from '$lib/components/basic/toggle/Toggle.svelte';
    import { searchPlugin } from '$lib/components/table/plugins/search.svelte';
    import Column from '$lib/components/table/table/Column.svelte';
    import Table from '$lib/components/table/table/Table.svelte';
    import { Toasts } from '$lib/components/toast';
    import { pseudoRandomId } from '$lib/utils/functions';
    import { Mail } from '@lucide/svelte';

    interface Row {
        id: string;
        name: string;
        age: number;
        email: string;
        children?: Row[];
    }

    let children = $state(false);
    let rowHeight = $state(64);
    let search = $state('');

    let rows: Row[] = $derived.by(() => {
        const rows = [
            { id: '1', name: 'Dwight', age: 42, email: 'dwight@example.com' },
            { id: '3', name: 'Jane', age: 36, email: 'jane@example.com' },
            { id: '4', name: 'John', age: 28, email: 'john@example.com' },
            { id: '5', name: 'Alice', age: 30, email: 'alice@example.com' },
            {
                id: '2',
                name: 'Max',
                age: 24,
                email: 'max@example.com',
                children: children
                    ? [
                          {
                              id: '2.1',
                              name: 'Max.1',
                              age: 24,
                              email: 'max@example.com',
                              children: [
                                  {
                                      id: '2.1.1',
                                      name: 'Max.1.1',
                                      age: 24,
                                      email: 'max@example.com'
                                  },
                                  {
                                      id: '2.1.2',
                                      name: 'Max.1.2',
                                      age: 24,
                                      email: 'max@example.com'
                                  }
                              ]
                          },
                          {
                              id: '2.2',
                              name: 'Max.2',
                              age: 24,
                              email: 'max@example.com'
                          }
                      ]
                    : undefined
            },
            { id: '6', name: 'Bob', age: 32, email: 'bob@example.com' },
            { id: '7', name: 'Carol', age: 34, email: 'carol@example.com' }
        ];

        for (let i = 0; i < 1_000; i++) {
            rows.push({
                id: crypto.randomUUID(),
                name: pseudoRandomId('Name'),
                age: Math.floor(Math.random() * 100),
                email: pseudoRandomId('Email')
            });
        }

        return rows;
    });
</script>

<div class="flex flex-row items-center gap-2">
    <button onclick={() => (children = !children)} class="flex flex-row items-center gap-2">
        <Toggle value={children} />
        Toggle children
    </button>
    <input type="number" bind:value={rowHeight} />
    <input type="text" bind:value={search} placeholder="Search" />
</div>
<Table
    data={rows}
    class="border-surface-300-700 w-full grow rounded border"
    onclick={() => {
        Toasts.trigger({
            variant: 'success',
            message: 'Clicked on a row'
        });
    }}
    {rowHeight}
    plugins={[
        searchPlugin({
            get search() {
                return search;
            },
            matches(row) {
                return row.name.includes(search);
            }
        })
    ]}
>
    {#snippet children({ row })}
        <Column id="name" header="Name">
            {row.name}
        </Column>
        <Column id="age" header="Age">
            {row.age}
        </Column>
        <Column id="email">
            {#snippet header()}
                <div class="flex flex-row items-center gap-2">
                    <Mail size={20} />
                    <p>Email</p>
                </div>
            {/snippet}
            {row.email}
        </Column>
    {/snippet}
</Table>
