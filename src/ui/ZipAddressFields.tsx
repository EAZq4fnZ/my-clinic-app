// src/components/form/ZipAddressFields.tsx

import {
  fetchAddressByZip,
  formatZipCodeWithHyphen,
  formatZipCode,
} from '@utils/zipCode';

// 郵便番号と住所のフィールドをまとめたコンポーネント
interface ZipAddressFieldsProps {
  zipField: any; // 郵便番号のfield
  addressField: any; // 住所1のfield
}

// 郵便番号入力と住所自動入力のコンポーネント
export const ZipAddressFields = (props: ZipAddressFieldsProps) => {
  const handleZipInput = async (e: any) => {
    const val = e.currentTarget.value;
    // 入力された値をそのまま保存（ハイフンは含めない）
    props.zipField.handleChange(val);

    // 数字だけを抽出して7桁なら住所検索（内部処理のみ）
    const digits = val.replace(/[^\d０-９]/g, '');
    if (digits.length === 7) {
      const address = await fetchAddressByZip(digits);
      if (address) {
        props.addressField.handleChange(address);
      }
    }
  };

  // フォーカスが外れたときに、ハイフンを含めた形式に変換して保存する
  const handleBlur = (e: any) => {
    const rawValue = e.currentTarget.value;
    if (!rawValue) return; // 空文字の場合は何もしない

    const digits = formatZipCode(rawValue); // 数字だけを抽出して7桁に整形
    const r: string =
      digits.length === 7 ? formatZipCodeWithHyphen(digits) : digits; // ハイフンを含めた形式に変換

    props.zipField.handleChange(r);
  };

  // フォーカスが当たったときは、ハイフンを除いた数字だけの形式に変換して保存する
  const handleFocus = (e: any) => {
    const digits = formatZipCode(e.currentTarget.value);
    props.zipField.handleChange(digits); // ここで 1234567 に書き換わる
  };

  // フォーカスイベントを input に追加するため、input の onFocus と onBlur にハンドラーを割り当てる必要があります。
  return (
    <div class="space-y-4">
      <div class="flex flex-col gap-1.5 w-1/2">
        <label class="text-xs font-bold text-gray-500">郵便番号</label>
        <input
          value={props.zipField.state.value || ''}
          onInput={handleZipInput}
          onFocus={handleFocus}
          onBlur={handleBlur}
          maxLength={8} // ハイフン分を含めて8文字に制限
          placeholder="123-4567"
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
