import { mergeProps } from 'solid-js';

/**
 * 複数のパーツ（Root, Item等）のPropsをまとめて生成するユーティリティ
 * T は { root: Props, item: Props, ... } のような構造を受け取ります
 */
export function createPartsFactory<T extends Record<string, any>>(
  defaultSets: T,
) {
  return (overrides: { [K in keyof T]?: Partial<T[K]> }): T => {
    const result = {} as any;

    for (const key in defaultSets) {
      // パーツごとに、デフォルト設定と呼び出し側の上書き分をマージ
      result[key] = mergeProps(defaultSets[key], overrides[key] || {});
    }

    return result as T;
  };
}
