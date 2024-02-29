/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
			colors: {
				diligence: 'rgb(var(--color-diligence) / <alpha-value>)',
				verdict: 'rgb(var(--color-verdict) / <alpha-value>)',
				equity: 'rgb(var(--color-equity) / <alpha-value>)',
				trust: 'rgb(var(--color-trust) / <alpha-value>)',
				innocence: 'rgb(var(--color-innocence) / <alpha-value>)',
				oath: 'rgb(var(--color-oath) / <alpha-value>)',
			},
		},
	},
	plugins: [],
};