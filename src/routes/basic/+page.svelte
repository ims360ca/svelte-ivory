<script lang="ts">
    import { Checkbox } from '$lib/components/basic';
    import Toggle from '$lib/components/basic/toggle/Toggle.svelte';

    let checked = $state(false);
    let partial = $state(false);
    let disabled = $state(false);
</script>

<div class="flex flex-row items-center gap-2">
    <Checkbox />
    <Checkbox disabled />
    <Checkbox checked />
    <Checkbox checked disabled />
    <Checkbox partial />
    <Checkbox partial disabled />
</div>

<div class="flex flex-row items-center gap-2">
    {@render toggleInput('Checked', checked, () => (checked = !checked))}
    {@render toggleInput('Partial', partial, () => (partial = !partial))}
    {@render toggleInput('Disabled', disabled, () => (disabled = !disabled))}
</div>

<Checkbox
    {partial}
    {checked}
    {disabled}
    onclick={() => {
        checked = !checked;
    }}
/>

{#snippet toggleInput(label: string, value: boolean, onclick: () => void)}
    <button class="flex flex-row items-center gap-2" {onclick}>
        <Toggle {value} />
        <p>{label}</p>
    </button>
{/snippet}
