module.exports = {
	future: {
		purgeLayersByDefault: true,
		removeDeprecatedGapUtilities: true,
	},
	plugins: [],
	purge: {
		content: ['./src/**/*.tsx'],
		enabled: true,
	},
	theme: {
		extend: {},
	},
	variants: {},
};
