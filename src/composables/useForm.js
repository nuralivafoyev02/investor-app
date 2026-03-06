import { ref } from 'vue'

export function useForm(initialValues = {}, onSubmit) {
  const values = ref({ ...initialValues })
  const errors = ref({})
  const touched = ref({})
  const isSubmitting = ref(false)

  function resetForm() {
    values.value = { ...initialValues }
    errors.value = {}
    touched.value = {}
  }

  function setFieldValue(field, value) {
    values.value[field] = value
  }

  function setFieldError(field, error) {
    errors.value[field] = error
  }

  function setFieldTouched(field) {
    touched.value[field] = true
  }

  function setErrors(newErrors) {
    errors.value = { ...newErrors }
  }

  async function handleSubmit(e) {
    if (e) {
      e.preventDefault()
    }

    isSubmitting.value = true
    try {
      if (onSubmit) {
        await onSubmit(values.value)
      }
    } catch (err) {
      console.error('Form submission error:', err)
    } finally {
      isSubmitting.value = false
    }
  }

  const hasError = (field) => {
    return touched.value[field] && errors.value[field]
  }

  const getError = (field) => {
    return touched.value[field] ? errors.value[field] : ''
  }

  return {
    values,
    errors,
    touched,
    isSubmitting,
    resetForm,
    setFieldValue,
    setFieldError,
    setFieldTouched,
    setErrors,
    handleSubmit,
    hasError,
    getError,
  }
}
