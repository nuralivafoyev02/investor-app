export function useValidation() {
  const validate = {
    email: (value) => {
      if (!value) return 'Email talab qilinadi'
      const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      return regex.test(value) ? '' : 'Email noto\'g\'ri'
    },
    required: (value, label = 'Maydon') => {
      return value && String(value).trim() ? '' : `${label} talab qilinadi`
    },

    minLength: (value, min) => {
      return !value || value.length >= min ? '' : `Kamita ${min} ta belgidan iborat bo'lishi kerak`
    },

    maxLength: (value, max) => {
      return !value || value.length <= max ? '' : `Ko\'pi bilan ${max} ta belgigacha bo\'lishi mumkin`
    },

    minValue: (value, min) => {
      return !value || Number(value) >= min ? '' : `${min}dan katta bo'lishi kerak`
    },

    maxValue: (value, max) => {
      return !value || Number(value) <= max ? '' : `${max}dan kichik bo'lishi kerak`
    },

    phone: (value) => {
      if (!value) return 'Telefon talab qilinadi'
      const regex = /^[\d\s+\-()]+$/
      return regex.test(value) && value.length >= 10 ? '' : 'Telefon noto\'g\'ri'
    },

    url: (value) => {
      if (!value) return 'URL talab qilinadi'
      try {
        new URL(value)
        return ''
      } catch {
        return 'URL noto\'g\'ri'
      }
    },

    match: (value1, value2) => {
      return value1 === value2 ? '' : 'Qiymatlar mos kelmadi'
    },

    custom: (value, validator) => {
      return validator(value)
    },
  }

  const validateForm = (formValues, rules) => {
    const errors = {}

    for (const field in rules) {
      const fieldRules = Array.isArray(rules[field]) ? rules[field] : [rules[field]]
      const value = formValues[field]

      for (const rule of fieldRules) {
        let error = ''

        if (typeof rule === 'function') {
          error = rule(value)
        } else if (rule.required) {
          error = validate.required(value, rule.label || field)
        }

        if (error) {
          errors[field] = error
          break
        }
      }
    }

    return errors
  }

  return { validate, validateForm }
}
