import { default as HiddenBg, setClasses } from './HiddenBackground.svelte';

const HiddenBackground = Object.assign(HiddenBg, {
    setClasses
});

export default HiddenBackground;
export { type HiddenBackgroundProps } from './HiddenBackground.svelte';
