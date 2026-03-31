/// <reference types="vite/client" />

/**
 * Vite の環境変数の型定義
 * import.meta.env.VITE_XXXX で参照する際の型を補完します。
 */
interface ImportMetaEnv {
  // Supabase 接続情報
  readonly VITE_SUPABASE_URL: string;
  readonly VITE_SUPABASE_ANON_KEY: string;

  // 今後、APIのURLなどを追加する場合はここに追記します
  // readonly VITE_API_ENDPOINT: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

/**
 * 画像やCSSファイルなどのインポートに関する型定義は、
 * 冒頭の <reference types="vite/client" /> によって自動的に含まれます。
 */
