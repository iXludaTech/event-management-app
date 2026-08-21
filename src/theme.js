import { createSystem, defaultConfig, defineConfig } from '@chakra-ui/react';

const config = defineConfig({
    globalCss: {
        'html, body': {
            margin: '0',
            minHeight: '100vh',
            bg: 'bg.canvas',
            color: 'fg',
        },
        '#root': {
            minHeight: '100vh',
        },
    },
    theme: {
        tokens: {
            colors: {
                brand: {
                    50: { value: '#f5f0ff' },
                    100: { value: '#e9ddff' },
                    200: { value: '#d6c2ff' },
                    300: { value: '#bb9aff' },
                    400: { value: '#a06bff' },
                    500: { value: '#8b3dff' },
                    600: { value: '#7a1ff2' },
                    700: { value: '#6712cc' },
                    800: { value: '#5510a6' },
                    900: { value: '#451087' },
                    950: { value: '#2a0a5e' },
                },
            },
        },
        semanticTokens: {
            colors: {
                brandSolid: { value: '{colors.brand.600}' },
                brandSolidHover: { value: '{colors.brand.700}' },
            },
        },
    },
});

export const system = createSystem(defaultConfig, config);
