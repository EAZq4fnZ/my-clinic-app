// src/components/form/ZipAddressFields.tsx
import type { FieldApi } from '@tanstack/solid-form';

import { fetchAddressByZip, formatZipCode } from '@utils/zipCode';

// 郵便番号と住所のフィールドをまとめたコンポーネント
interface ZipAddressFieldsProps {
  zipField: any; // 郵便番号のfield
  addressField: any; // 住所1のfield
}

// 郵便番号入力と住所自動入力のコンポーネント
// 住所自動入力は、郵便番号が7桁入力されたタイミングでAPIを呼び出して住所を取得し、住所フィールドにセットします
export const ZipAddressFields = (props: ZipAddressFieldsProps) => {
  const handleZipInput = async (
    //e: InputEvent & { currentTarget: HTMLInputElement },  // 型定義を厳密にする場合はこちら
    e: any, // 型エラー回避のために any に変更
  ) => {
    const formatted = formatZipCode(e.currentTarget.value);

    props.zipField.handleChange(formatted);

    if (formatted.length === 8) {
      const address = await fetchAddressByZip(formatted);
      if (address) {
        props.addressField.handleChange(address);
      }
    }
  };

  return (
    <div class="space-y-4">
      <div class="flex flex-col gap-1.5 w-1/2">
        <label class="text-xs font-bold text-gray-500">郵便番号</label>
        <input
          value={props.zipField.state.value || ''}
          onInput={handleZipInput}
          placeholder="0000000"
          class="border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div class="flex flex-col gap-1.5">
        <label class="text-xs font-bold text-gray-500">住所</label>
        <input
          value={props.addressField.state.value || ''}
          onInput={(e) =>
            props.addressField.handleChange(e.currentTarget.value)
          }
          placeholder="郵便番号から自動入力されます"
          class="border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
    </div>
  );
};
