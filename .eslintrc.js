module.exports = {
	"root": true,
	"env": {
		"node": true,
		"browser": true,
		"es6": true
	},
	"extends": [
		"eslint:recommended",
		"plugin:vue/essential",
		"prettier"
	],
	"overrides": [
		{
			"env": {
				"node": true
			},
			"files": [
				".eslintrc.{js,cjs}"
			],
			"parserOptions": {
				"sourceType": "script"
			}
		}
	],
	"parser": "vue-eslint-parser",
	"parserOptions": {
		"parser": "@babel/eslint-parser",
		"ecmaVersion": "latest",
		"sourceType": "module"
	},
	"plugins": [
		"vue",
		"eslint-plugin-vue"
	],
	"rules": {
	}
}
