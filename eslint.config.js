import js from "@eslint/js";
import * as tsParser from "@typescript-eslint/parser";
import solid from "eslint-plugin-solid/configs/typescript";
import tseslint from "typescript-eslint";

export default tseslint.config(
	js.configs.recommended,
	...tseslint.configs.recommended,
	{
		files: ["src/**/*.{ts,tsx}"],
		plugins: {
			solid,
		},
		languageOptions: {
			parser: tsParser,
			parserOptions: {
				project: "tsconfig.json",
			},
		},
		rules: {
			// SolidJSのリアクティビティ崩れを厳格にチェック
			"solid/reactivity": "error",
			"solid/no-destructure": "error",
			"solid/jsx-no-undef": "error",

			// Biomeと競合する見た目に関するルールをオフ
			indent: "off",
			quotes: "off",
			semi: "off",
			"no-extra-semi": "off",
			"@typescript-eslint/no-unused-vars": [
				"warn",
				{ argsIgnorePattern: "^_" },
			],
		},
	},
);
