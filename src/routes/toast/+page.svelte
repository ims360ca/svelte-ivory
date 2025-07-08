<script lang="ts">
    import { Toasts } from '$lib/components/toast';
    import { ShowerHead } from '@lucide/svelte';
</script>

<button
    class="btn preset-filled-success-500 w-96"
    onclick={() => {
        Toasts.trigger({
            variant: 'success',
            message: 'triggered toast',
            icon: ShowerHead
        });
    }}
>
    Trigger success
</button>
<button
    class="btn preset-filled-warning-500 w-96"
    onclick={() => {
        Toasts.trigger({
            variant: 'warning',
            message: 'triggered toast',
            icon: ShowerHead
        });
    }}
>
    Trigger warning
</button>
<button
    class="btn preset-filled-primary-500 w-96"
    onclick={() => {
        Toasts.trigger({
            variant: 'info',
            message: 'triggered toast',
            icon: ShowerHead
        });
    }}
>
    Trigger info
</button>
<button
    class="btn preset-filled-error-500 w-96"
    onclick={() => {
        Toasts.trigger({
            variant: 'error',
            message: 'triggered toast',
            icon: ShowerHead
        });
    }}
>
    Trigger error
</button>
