# Style Guide

## Component Structure

Use the following structure for your components:

```html
<script lang="ts" module>
	// Imports if a module script exists
	// Module exports (functions / interfaces)
	// Module-level code
</script>

<script lang="ts">
	// Imports if no module script exists
	// Props interface
	// Props
	// State
	// Derived state
	// Functions
</script>

<!-- Markup -->
```

### Prop naming

[**Bindables**](https://svelte.dev/docs/svelte/$bindable): If a prop is bindable, prefix it with `b_` (e.g. `b_open`).  
[**Events**](https://svelte.dev/docs/svelte/basic-markup#Events): If a prop is an event handler, follow svelte's `onfooBar` naming convention (note that the first character of the name is not capitalized).

## Naming

- Use `PascalCase` for file names
- Use `camelCase` for prop names
- Use `camelCase` for state names
- Use `camelCase` for function names

## Functions

Prefer [functions](https://www.typescriptlang.org/docs/handbook/functions.html) over [arrow functions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions).

## Types

Prefer [interfaces](https://www.typescriptlang.org/docs/handbook/interfaces.html) over types.  
Do not use [namespaces](https://www.typescriptlang.org/docs/handbook/namespaces.html) and [module declarations](https://www.typescriptlang.org/docs/handbook/declaration-files/templates/module-d-ts.html).

## [$effect](https://svelte.dev/docs/svelte/$effect)

Avoid using `$effect` whenever you can.

If you need to run code when the component mounts, use [`onMount`](https://svelte.dev/docs/svelte/svelte#onMount).

## [$state](https://svelte.dev/docs/svelte/$state)

Define the type of a state like this:

```typescript
let myState = $state<string>('');
```

## [Context](https://svelte.dev/docs/svelte/context)

Wrap the setContext and getContext in functions as [described in the svelte docs](https://svelte.dev/docs/svelte/context#Type-safe-context) to preserve type safety.
