// vite.config.ts

import { tanstackRouter } from "@tanstack/router-vite-plugin";
import path from "path";
import { defineConfig } from "vite";
import solidPlugin from "vite-plugin-solid";

export default defineConfig({
	plugins: [
		// 最新版では引数なしの呼び出しが推奨されています（SolidJSを自動検知します）
		tanstackRouter(),
		solidPlugin(),
	],
	resolve: {
		alias: {
			// 基本のsrcエイリアス
			"@": path.resolve(__dirname, "./src"),

			// ハイブリッド案に基づいた主要ディレクトリのエイリアス
			// これにより import ... from '@features/patients/...' と書けます
			"@features": path.resolve(__dirname, "./src/features"),
			"@ui": path.resolve(__dirname, "./src/components/ui"),
			"@lib": path.resolve(__dirname, "./src/lib"),
			"@utils": path.resolve(__dirname, "./src/utils"),
		},
	},
	server: {
		port: 5173,
		// ホストを公開する場合（スマホ等から確認する場合）は以下を有効に
		// host: true,
	},
	build: {
		target: "esnext",
	},
});
