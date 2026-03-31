// src/lib/supabase.ts
import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types/database';

// Vite の環境変数を取得
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// エラーチェック（ブラウザのコンソールに表示されます）
if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Supabaseの環境変数が設定されていません。.env ファイルを確認してください。");
}

export const supabase = createClient<Database>(
  supabaseUrl || '', 
  supabaseAnonKey || ''
);