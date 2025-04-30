class ValidateForm {
  selectors = {
    form: '[data-js-form]',
    fieldErrors: '[data-js-form-field-errors]',
    fieldPassword: '[data-js-form-field-password]',
    fieldPasswordConfirm: '[data-js-form-field-password-confirm]'
  }

  

  errorMessages = {
    valueMissing: () => 'Пожалуйста, заполните поле',
    patternMismatch: ({title}) => `${title}`,
    tooShort: ({minLength}) => `минимальное количество символов - ${minLength}`,
    tooLong: ({maxLength}) => `максимальное количество символов - ${maxLength}`,
  }

  constructor() {
    this.bindEvents()
  }

  manageErrors(fieldControlElement, errorMessages) {
    let fieldErrorsElement = fieldControlElement.parentElement.querySelector(this.selectors.fieldErrors)

    if (['radio', 'checkbox'].includes(fieldControlElement.type)) {
      fieldErrorsElement = fieldControlElement.parentElement.parentElement.querySelector(this.selectors.fieldErrors)
    }

    fieldErrorsElement.innerHTML = errorMessages
      .map((message) => `
        <span class="field__error">${message}</span>
      `).join('')
  }

  validateField(fieldControlElement) {
    const errors = fieldControlElement.validity
    const errorMessages = []

    if (fieldControlElement.classList[0] === 'confirm__password') {
      if (document.querySelector(this.selectors.form).querySelector(this.selectors.fieldPassword).value !== document.querySelector(this.selectors.form).querySelector(this.selectors.fieldPasswordConfirm).value) {
        errorMessages.push('Пароли не совпадают')
      }
    }
    Object.entries(this.errorMessages).forEach(([errorType, getErrorMessage]) => {
      if (errors[errorType]) {
        errorMessages.push(getErrorMessage(fieldControlElement))
      }
    })

    this.manageErrors(fieldControlElement, errorMessages)

    const isValid = errorMessages.length === 0

    fieldControlElement.ariaInvalid = isValid

    return isValid
  }

  onBlur(event) {
    const { target } = event
    const isFormField = target.closest(this.selectors.form)
    const isRequired = target.required
  
    if (isFormField && isRequired) {
      this.validateField(target)
    }
  }

  onChange(event) {
    const { target } = event
    const isRequired = target.required
    const isToggleType = ['radio', 'checkbox'].includes(target.type)

    if (isRequired && isToggleType) {
      this.validateField(target)
    }
  }

  onSubmit(event) {
    const isFormElement = event.target.matches(this.selectors.form)

    if (!isFormElement) {
      return
    }

    const requiredControlElements = [...event.target.elements].filter(({required}) => required)

    let isFormValid = true
    let firstInvalidFieldControl = null

    requiredControlElements.forEach((element) => {
      const isFieldValid = this.validateField(element)

      if (!isFieldValid) {
        isFormValid = false

        if (!firstInvalidFieldControl) {
          firstInvalidFieldControl = element
        }
      }

      if (!isFormValid) {
        event.preventDefault()
        firstInvalidFieldControl.focus()
      }
    })
  }

  bindEvents() {
    document.addEventListener('blur', (event) => {
      this.onBlur(event)
    }, {capture: true})
    document.addEventListener('change', (event) => this.onChange(event))
    document.addEventListener('submit', (event) => this.onSubmit(event))
  }
}

export { ValidateForm }