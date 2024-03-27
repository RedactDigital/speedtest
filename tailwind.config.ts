import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  purge: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {},
  },
  plugins: [
    // eslint-disable-next-line import/no-commonjs, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-require-imports, @typescript-eslint/no-var-requires
    require('@sira-ui/tailwind')({
      themes: [
        {
          name: 'light',
          colorScheme: 'light',
        },
        {
          name: 'dark',
          colorScheme: 'dark',
          prefersColorScheme: true,
        },
      ],
    }),
  ],
} satisfies Config;
