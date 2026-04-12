/**
 * 郵便番号を123-4567の形式に整形
 * (全角半角・ハイフン有無・数字以外の混入をすべて考慮)
 */
export const formatZipCode = (input: string): string => {
  // 1. まず数字だけを抽出 (全角もこの時点で半角数字へ)
  const digits = input
    .replace(/[０-９]/g, (s) => String.fromCharCode(s.charCodeAt(0) - 0xfee0))
    .replace(/[^\d]/g, '')
    .slice(0, 7);

  // 2. 3桁目以降があればハイフンを挿入
  if (digits.length > 3) {
    return `${digits.slice(0, 3)}-${digits.slice(3)}`;
  }
  return digits;
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
