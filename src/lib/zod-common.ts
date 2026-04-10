import { isValid, parse } from 'date-fns';
import jaconv from 'jaconv';
import { parsePhoneNumberFromString } from 'libphonenumber-js';
import { z } from 'zod';

// --- 個別のバリデーションルール ---

/**
 * カナバリデーションを生成する関数
 * @param message エラー時に表示したい独自のメッセージ
 */
export const createKatakanaSchema = (
  message = '全角カタカナで入力してください',
) =>
  z
    .string()
    .min(1, '入力してください')
    .transform((val) => jaconv.toZen(jaconv.toKatakana(val)))
    .pipe(
      // ここで引数のメッセージを正規表現チェックに適用
      z
        .string()
        .regex(/^[ァ-ヶー・\s]+$/, message),
    );

/** 郵便番号のルール */
export const zipCodeSchema = z
  .string()
  .min(1, '郵便番号を入力してください')
  .transform((val) => jaconv.toHanAscii(val)) // 全角英数記号 -> 半角
  .transform((val) => {
    const digits = val.replace(/\D/g, '');
    return digits.length === 7
      ? `${digits.slice(0, 3)}-${digits.slice(3)}`
      : val;
  })
  .pipe(
    z
      .string()
      .regex(
        /^\d{3}-\d{4}$/,
        '郵便番号を適切な形式で入力してください (例: 123-4567 or 1234567)',
      ),
  );

/*export const zipCodeSchema = z
  .string()
  .min(1, '郵便番号を入力してください')
  .transform((val) => {
    // 全角数字 -> 半角数字
    const half = jaconv.normalize(val);
    // 数字以外をすべて削除（ハイフン、長音、スペース等）
    const digits = half.replace(/\D/g, '');
    // 7桁なら整形、それ以外は元の値を返して後続のregexでエラーにする
    return digits.length === 7 
      ? `${digits.slice(0, 3)}-${digits.slice(3)}` 
      : val;
  })
  .pipe(
    z.string().regex(/^\d{3}-\d{4}$/, '郵便番号を適切な形式で入力してください (例: 123-4567 or 1234567)')
  );*/

/** 電話番号のルール */
export const phoneNumberSchema = z
  .string()
  .min(1, '電話番号を入力してください')
  .transform((val, ctx) => {
    const normalized = jaconv.toHanAscii(val); // 全角英数記号 -> 半角
    const parsed = parsePhoneNumberFromString(normalized, 'JP');
    if (!parsed || !parsed.isValid()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: '有効な電話番号を入力してください',
      });
      return z.NEVER;
    }
    return parsed.formatNational();
  });

/** 年月日のルール */
export const dateSchema = z
  .string()
  .min(1, '年月日を選択してください')
  // 1. まずは最低限の書式チェック (YYYY-MM-DD)
  .regex(/^\d{4}-\d{2}-\d{2}$/, '正しい日付形式で入力してください')
  // 2. date-fns で実在する日付かチェック
  .refine(
    (val) => {
      const date = parse(val, 'yyyy-MM-dd', new Date());
      return isValid(date);
    },
    {
      message: '実在しない日付です',
    },
  );
// 3. (任意) 未来の日付を禁止するなどの業務ルールも追加可能
/*.refine((val) => {
    const date = parse(val, "yyyy-MM-dd", new Date());
    return date <= new Date();
  }, {
    message: "未来の日付は入力できません"
  });*/
