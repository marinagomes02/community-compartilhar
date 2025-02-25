import { fontFamily } from "tailwindcss/defaultTheme";

/** @type {import('tailwindcss').Config} */
const config = {
	darkMode: ["class"],
	content: ["./src/**/*.{html,js,svelte,ts}"],
	safelist: ["dark"],
	plugins: [
		require('@tailwindcss/typography'),
		require('flowbite/plugin')
	],
	theme: {
		container: {
			center: true,
			padding: "2rem",
			screens: {
				"2xl": "1400px"
			}
		},
		extend: {
			colors: {
				border: "hsl(var(--border) / <alpha-value>)",
				input: "hsl(var(--input) / <alpha-value>)",
				ring: "hsl(var(--ring) / <alpha-value>)",
				background: "hsl(var(--background) / <alpha-value>)",
				foreground: "hsl(var(--foreground) / <alpha-value>)",
				primary: {
					DEFAULT: "hsl(var(--primary) / <alpha-value>)",
					foreground: "hsl(var(--primary-foreground) / <alpha-value>)"
				},
				secondary: {
					DEFAULT: "hsl(var(--secondary) / <alpha-value>)",
					foreground: "hsl(var(--secondary-foreground) / <alpha-value>)"
				},
				destructive: {
					DEFAULT: "hsl(var(--destructive) / <alpha-value>)",
					foreground: "hsl(var(--destructive-foreground) / <alpha-value>)"
				},
				muted: {
					DEFAULT: "hsl(var(--muted) / <alpha-value>)",
					foreground: "hsl(var(--muted-foreground) / <alpha-value>)"
				},
				accent: {
					DEFAULT: "hsl(var(--accent) / <alpha-value>)",
					foreground: "hsl(var(--accent-foreground) / <alpha-value>)"
				},
				popover: {
					DEFAULT: "hsl(var(--popover) / <alpha-value>)",
					foreground: "hsl(var(--popover-foreground) / <alpha-value>)"
				},
				card: {
					DEFAULT: "hsl(var(--card) / <alpha-value>)",
					foreground: "hsl(var(--card-foreground) / <alpha-value>)"
				},
				'yellow': {
					100: 'rgb(255, 238, 202)',
					200: 'rgb(255, 236, 194)',
					600: 'rgb(255, 200, 78)',
					800: 'rgb(255, 184, 31)',
				},
				'cien': {
					100: 'rgb(239, 251, 249)',
					200: 'rgb(239, 251, 249)',
					400: 'rgb(222, 247, 243)',
					600: 'rgb(42, 157, 143)',
					800: '#007e71',
				},
				'samon': {
					600: 'rgb(240, 128, 91)'
				},
				'purple': {
					100: 'rgb(234, 223, 255)',
					800: 'rgb(139, 47, 201)',
				},
				'turquoise': {
					800: 'rgb(0, 168, 150)',
				},
				'bgreen': {
					100: '#daf2da',
					200: '#b8e6b8',
					400: '#7acc7a',
				},
				'byellow': {
					100: '#fff2b2',
					200: '#fff0ad',
					400: '#ffd61f',
				},
				'orange': {
					100: '#ffdbb7',
					200: '#ffdbb7',
					400: '#ffbe6d',
				}
				
			},
			borderRadius: {
				lg: "var(--radius)",
				md: "calc(var(--radius) - 2px)",
				sm: "calc(var(--radius) - 4px)"
			},
			fontFamily: {
				sans: [...fontFamily.sans]
			}
		}
	},
};

export default config;
