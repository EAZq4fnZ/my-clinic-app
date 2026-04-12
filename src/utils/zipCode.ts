/**
 * 郵便番号から数字だけを抽出する (全角も半角へ)
 */
export const formatZipCode = (input: string): string => {
  return input
    .replace(/[０-９]/g, (s) => String.fromCharCode(s.charCodeAt(0) - 0xfee0))
    .replace(/[^\d]/g, '') // ハイフンも含め、数字以外をすべて削除
    .slice(0, 7);
};

// API取得関数 (郵便番号から住所を取得)
export const fetchAddressByZip = async (zip: string) => {
  const cleanZip = zip.replace('-', ''); // 通信時はハイフンを除く
  if (cleanZip.length !== 7) return null;
  try {
    const res = await fetch(
      `https://zipcloud.ibsnet.co.jp/api/search?zipcode=${cleanZip}`,
    );
    const data = await res.json();
    return data.results
      ? `${data.results[0].address1}${data.results[0].address2}${data.results[0].address3}`
      : null;
  } catch (err) {
    return null;
  }
};

// ハイフンを含めた形式に変換 (例: 1234567 → 123-4567)
export const formatZipCodeWithHyphen = (digits: string): string => {
  if (digits.length > 3) {
    return `${digits.slice(0, 3)}-${digits.slice(3)}`;
  }
  return digits;
};
