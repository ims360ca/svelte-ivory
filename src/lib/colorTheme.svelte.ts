import { browser } from '$app/environment';
import type { Handle } from '@sveltejs/kit';
import { cookie } from './utils/functions';

const COOKIE_THEME_KEY = 'theme';

export type ColorThemePreference = 'system' | 'light' | 'dark';

class ThemeController {
    private currentTheme = $state<ColorThemePreference>('system');

    constructor() {
        if (!browser) return;
        const value = cookie.get(COOKIE_THEME_KEY);
        if (value === 'system' || value === 'dark' || value === 'light') {
            this.theme = value;
        } else {
            this.theme = 'system';
        }
    }

    get theme() {
        return this.currentTheme;
    }

    get current() {
        if (this.currentTheme === 'dark' || this.currentTheme === 'light') return this.currentTheme;
        if (!browser) return 'light';
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        return prefersDark ? 'dark' : 'light';
    }

    set theme(value: ColorThemePreference) {
        if (!browser) return;
        this.currentTheme = value;
        cookie.set({
            name: COOKIE_THEME_KEY,
            value
        });
        if (value === 'system') {
            const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            document.documentElement.classList.toggle('dark', systemDark);
        } else if (value === 'light') {
            document.documentElement.classList.toggle('dark', false);
        } else {
            document.documentElement.classList.toggle('dark', true);
        }
    }

    /** Add to hook sequence to enable correct prerendering ot the theme */
    handle: Handle = ({ event, resolve }) => {
        const theme = event.cookies.get(COOKIE_THEME_KEY);
        let isDark = false;
        if (theme !== undefined && (theme as ColorThemePreference) !== 'system') {
            isDark = theme === 'dark';
        } else {
            isDark = event.request.headers.get('sec-ch-prefers-color-scheme') === 'dark';
        }

        if (!isDark) return resolve(event);

        return resolve(event, {
            transformPageChunk: ({ html }) => html.replace('class="', 'class="dark ')
        });
    };
}

export const ColorTheme = new ThemeController();
