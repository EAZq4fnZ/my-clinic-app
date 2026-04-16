// @ui/ZipCodeSearchField.tsx
import { createSignal } from 'solid-js';

import {
  type AddressResult,
  fetchAddressDetailByZip,
  formatZipCode,
  formatZipCodeWithHyphen,
} from '@/utils/zipUtils';
import { FormInputField } from '@ui/FormInputField';

interface Props {
  field: any; // TanStack Form field
  label?: string;
  helperText?: string;
  // 検索結果を親に返すためのコールバック
  onAddressFound: (result: AddressResult) => void;
}

export const ZipCodeSearchField = (props: Props) => {
  const [isSearching, setIsSearching] = createSignal(false);

  const handleSearch = async (zip: string) => {
    // ハイフン除去などの正規化
    const cleanZip = formatZipCode(zip);

    const formattedZip = formatZipCodeWithHyphen(cleanZip);
    props.field.handleChange(formattedZip);

    setIsSearching(true);

    try {
      const adress = await fetchAddressDetailByZip(cleanZip);
      props.onAddressFound(adress);
    } finally {
      setIsSearching(false);
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
