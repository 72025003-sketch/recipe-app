export class Validation {
  private customValidators: { [key: string]: (value: any, ruleValue: any) => { valid: boolean; message?: string } };
  private errorMessages: { [key: string]: string } = {
    required: "[{field}] is required.\n[{field}] は必須です。",
    maxLength: "[{field}] must be at most {max} characters.\n[{field}] の最大文字数は {max} です。",
    minLength: "[{field}] must be at least {min} characters.\n[{field}] の最小文字数は {min} です。",
    rangeLength: "[{field}] must be between {min} and {max} characters.\n[{field}] の文字数は {min}～{max} です。",
    min: "[{field}] must be at least {min}.\n[{field}] の最小値は {min} です。",
    max: "[{field}] must be at most {max}.\n[{field}] の最大値は {max} です。",
    between: "[{field}] must be between {min} and {max}.\n[{field}] は {min}～{max} の範囲である必要があります。",
    pattern: "[{field}] format is invalid.\n[{field}] の形式が正しくありません。",
    equalsTo: "[{field}] must match {targetField}.\n[{field}] は {targetField} と一致する必要があります。",
    email: "[{field}] must be a valid email address.\n[{field}] は有効なメールアドレスである必要があります。",
    date: "[{field}] must be a valid date (YYYY/MM/DD).\n[{field}] は YYYY/MM/DD 形式の日付である必要があります。",
    alphaNumeric: "[{field}] must contain only letters and numbers.\n[{field}] は英数字のみ使用できます。",
    alpha: "[{field}] must contain only letters.\n[{field}] は英字のみ使用できます。",
    numeric: "[{field}] must contain only numbers.\n[{field}] は数字のみ使用できます。",
    checkboxMin: "[{field}] must select at least {min} options.\n[{field}] は最低 {min} 個選択してください。",
    checkboxMax: "[{field}] must select at most {max} options.\n[{field}] は最大 {max} 個まで選択できます。",
  };

  constructor(customValidators: { [key: string]: (value: any, ruleValue: any) => { valid: boolean; message?: string } } = {}) {
    this.customValidators = customValidators;
  }

  /**
   * 指定されたフィールドの値をバリデーションする
   * @param {string} fieldName - 検証するフィールド名
   * @param {string | Array} value - 入力値（チェックボックスの場合は配列）
   * @param {Object} rules - バリデーションルールのオブジェクト
   * @return {Object} - `valid` (boolean), `errors` (エラーメッセージの配列)
   */
  validate(fieldName: string, value: any, rules: { [key: string]: any }) {
    const errors: string[] = [];

    for (const rule in rules) {
      const ruleValue = rules[rule];
      let valid = true;
      let errorMessage = this.errorMessages[rule]?.replace("{field}", fieldName);

      switch (rule) {
        case "required":
          valid = value !== undefined && value !== null && value !== "";
          break;
        case "maxLength":
          valid = typeof value === "string" && value.length <= ruleValue;
          errorMessage = errorMessage.replace("{max}", ruleValue);
          break;
        case "minLength":
          valid = typeof value === "string" && value.length >= ruleValue;
          errorMessage = errorMessage.replace("{min}", ruleValue);
          break;
        case "rangeLength":
          valid = typeof value === "string" && value.length >= ruleValue[0] && value.length <= ruleValue[1];
          errorMessage = errorMessage.replace("{min}", ruleValue[0]).replace("{max}", ruleValue[1]);
          break;
        case "min":
          valid = parseFloat(value) >= ruleValue;
          errorMessage = errorMessage.replace("{min}", ruleValue);
          break;
        case "max":
          valid = parseFloat(value) <= ruleValue;
          errorMessage = errorMessage.replace("{max}", ruleValue);
          break;
        case "between":
          valid = parseFloat(value) >= ruleValue[0] && parseFloat(value) <= ruleValue[1];
          errorMessage = errorMessage.replace("{min}", ruleValue[0]).replace("{max}", ruleValue[1]);
          break;
        case "pattern":
          valid = new RegExp(ruleValue).test(value);
          break;
        case "equalsTo":
          valid = value === ruleValue;
          errorMessage = errorMessage.replace("{targetField}", ruleValue);
          break;
        case "email":
          valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
          break;
        case "date":
          valid = /^\d{4}\/\d{2}\/\d{2}$/.test(value);
          break;
        case "alphaNumeric":
          valid = /^[a-zA-Z0-9]+$/.test(value);
          break;
        case "alpha":
          valid = /^[a-zA-Z]+$/.test(value);
          break;
        case "numeric":
          valid = /^[0-9]+$/.test(value);
          break;
        case "checkboxMin":
          valid = Array.isArray(value) && value.length >= ruleValue;
          errorMessage = errorMessage.replace("{min}", ruleValue);
          break;
        case "checkboxMax":
          valid = Array.isArray(value) && value.length <= ruleValue;
          errorMessage = errorMessage.replace("{max}", ruleValue);
          break;
        default:
          if (this.customValidators[rule]) {
            const result = this.customValidators[rule](value, ruleValue);
            valid = result.valid;
            if (!valid && result.message) errorMessage = result.message;
          }
      }

      if (!valid && errorMessage) errors.push(errorMessage);
    }

    return { valid: errors.length === 0, errors };
  }

  /**
   * 複数のフィールドをまとめてバリデーションする
   * @param {Object} fields - フィールドごとの入力値とルールのオブジェクト
   * @return {Object} - `valid` (boolean), `results` (各フィールドのバリデーション結果)
   */
  validateAll(fields: { [key: string]: { value: any; rules: { [key: string]: any } } }) {
    let allValid = true;
    const results: { [key: string]: { valid: boolean; errors: string[] } } = {};

    for (const field in fields) {
      const { value, rules } = fields[field];
      const result = this.validate(field, value, rules);
      results[field] = result;
      if (!results[field].valid) allValid = false;
    }

    return { valid: allValid, results };
  }
}