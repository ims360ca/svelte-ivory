<script lang="ts" module>
    import { FileUp, X } from '@lucide/svelte';
    import type { Snippet } from 'svelte';
    import type { InputProps } from './Input.svelte';
    import Input from './Input.svelte';

    export interface FileInputProps extends InputProps<File[] | File> {
        accept?: string[];
        children?: Snippet;
        multiple?: boolean;
    }
</script>

<script lang="ts">
    let { accept, children: passedChildren, multiple = false, ...rest }: FileInputProps = $props();

    let hovering = $state(false);

    function onDrop(
        event: DragEvent & {
            currentTarget: EventTarget & HTMLElement;
        }
    ) {
        add(event.dataTransfer?.files ? Array.from(event.dataTransfer.files) : []);
    }

    function add(files: File[]) {
        const value = rest.form.value();
        if (Array.isArray(value)) {
            rest.form.set([
                ...value.filter((f) => f && !files.includes(f)),
                ...Array.from(files || [])
            ]);
        } else {
            rest.form.set((files[0] ?? undefined) as File);
        }
    }

    function remove(file: File) {
        const value = rest.form.value();
        if (Array.isArray(value)) {
            rest.form.set(value.filter((e) => e !== file));
        } else {
            rest.form.set(undefined as unknown as File);
        }
    }

    const files = $derived.by(() => {
        const value = rest.form.value();
        if (Array.isArray(value)) {
            return value;
        } else {
            return value ? [value] : [];
        }
    });

    const formAttributes = $derived(rest.form.as(multiple ? 'file multiple' : 'file'));
</script>

<Input {...rest} fixTitle>
    {#snippet children({ id })}
        <!-- svelte-ignore a11y_no_static_element_interactions -->
        <div
            class={[
                'group relative h-full min-h-16 w-full rounded transition-all',
                hovering ? 'bg-primary-50-950' : ''
            ]}
            ondragover={() => {
                hovering = true;
            }}
            ondragleave={() => {
                hovering = false;
            }}
            ondrop={(e) => {
                e.preventDefault();
                e.stopPropagation();
                hovering = false;
                onDrop(e);
            }}
        >
            {#if passedChildren}
                {@render passedChildren()}
            {:else}
                <div class="flex h-full w-full flex-col items-center justify-center gap-2 p-4">
                    {#if files && files.length > 0}
                        <div class="flex flex-row items-center gap-4">
                            {#each files.filter((f) => !!f) as file (file)}
                                {@render fileRender(file)}
                            {/each}
                        </div>
                    {:else}
                        <div
                            class="text-primary-200-800 group-hover:text-primary-300-700 group-hover:bg-primary-100-900 flex h-14 w-14 shrink-0 items-center justify-center rounded-full text-xl transition-colors"
                        >
                            <FileUp />
                        </div>
                    {/if}
                </div>
            {/if}
            <input
                type={formAttributes.type}
                aria-invalid={formAttributes['aria-invalid']}
                name={formAttributes.name}
                oninput={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    add(e.currentTarget.files ? Array.from(e.currentTarget.files) : []);
                }}
                {multiple}
                title=""
                accept={accept?.join(', ')}
                class="absolute top-0 left-0 h-full w-full grow cursor-pointer opacity-0"
                {id}
            />
        </div>
    {/snippet}
</Input>

{#snippet fileRender(file: File)}
    <div class="bg-primary-200-800 flex w-fit items-center rounded-full py-2 pr-2 pl-4">
        <p>{file.name}</p>
        <button
            type="button"
            class="btn-icon hover:text-primary-500"
            onclick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                remove(file);
            }}
        >
            <X />
        </button>
    </div>
{/snippet}
