export function createDebouncedValue<T>(delay: number, value: T) {
    let current = $state<T>(value);
    let debounced = $state<T>(value);
    let timeout: ReturnType<typeof setTimeout>;
    return {
        set current(value: T) {
            current = value;
            if (timeout) clearTimeout(timeout);
            timeout = setTimeout(() => {
                debounced = value;
            }, delay);
        },
        get current() {
            return current;
        },
        get debounced() {
            return debounced;
        }
    };
}
