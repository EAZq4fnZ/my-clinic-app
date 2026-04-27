// @ui/ZipCodeSearchField.tsx
import { createSignal } from 'solid-js';

import { FormInputField } from '@ui/form/FormInputField';
import {
  type AddressResult,
  fetchAddressDetailByZip,
  formatZipCode,
  formatZipCodeWithHyphen,
} from '@utils/zipUtils';

interface Props {
  field: any; // TanStack Form field
  label?: string;
  helperText?: string;
  onAddressFound: (result: AddressResult) => void; // 郵便番号から住所が見つかったときのコールバック
}

export const ZipCodeSearchField = (props: Props) => {
  const [isSearching, setIsSearching] = createSignal(false);

  const handleSearch = async (zip: string) => {
    const cleanZip = formatZipCode(zip); // ハイフン等を除去して7桁の数字だけにする

    const formattedZip = formatZipCodeWithHyphen(cleanZip); // ハイフンを入れた形式に変換してフィールドに反映
    props.field.handleChange(formattedZip); // フォームの値を更新

    setIsSearching(true);

    try {
      const adress = await fetchAddressDetailByZip(cleanZip); // 郵便番号から住所を取得
      props.onAddressFound(adress); // 住所が見つかったときのコールバックを呼び出す
    } finally {
      setIsSearching(false); // 検索が完了したら(結果によらず)ローディング状態を解除
    }
  };

  return (
    <FormInputField
      label={props.label ?? '郵便番号'}
      field={props.field}
      placeholder="123-4567"
      onBlur={() => {
        props.field.handleBlur();
        handleSearch(props.field.state.value);
      }}
      // ローディング表示などの拡張も可能
      helperText={
        isSearching()
          ? '検索中...'
          : props.helperText ?? '7桁入力で自動検索します'
      }
    />
  );
};
