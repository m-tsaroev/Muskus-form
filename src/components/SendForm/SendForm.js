import { ValidateForm } from "../ValidateForm/ValidateForm.js"

const validForm = new ValidateForm()

class SendForm {
  selectors = {
    form: "[data-js-form]",
    sendComliteMessage: "[data-js-message]",
  }

  stateClasses = {
    isActive: "is-active",
  }

  constructor() {
    this.bindEvents()
  }

  onSendForm(event) {
    const { target } = event
    const isForm = target.matches(this.selectors.form)

    if (!isForm) {
      return
    }

    event.preventDefault()

    const formData = new FormData(target)
    const formDataObject = Object.fromEntries(formData)
    const sendComliteMessageElement = document.querySelector(
      this.selectors.sendComliteMessage
    )

    let isCorrect = true

    for (const element of target.elements) {
      if (!validForm.validateField(element)) {
        isCorrect = false
      }
    }

    if (!isCorrect) {
      return
    } else {
      fetch("http://localhost:3000/posts", {
        method: "post",
        body: JSON.stringify(formDataObject),
      }).then((response) => {
        console.log(response);
        if (response.ok) {
          sendComliteMessageElement.innerHTML = `
          <span class="message__text">Вы были зарегестрирваны</span>
        `

          sendComliteMessageElement.classList.add(this.stateClasses.isActive)

          setTimeout(() => {
            sendComliteMessageElement.classList.remove(
              this.stateClasses.isActive
            )
          }, 3000)
        } else if(response.status > 300) {
          const errorMessage = `Код ошибки ${response.status}`

          throw new Error(errorMessage)
        }

        for (const element of target.elements) {
          element.value = ""
          element.checked = false
        }
      }).catch((error) => {
        
        sendComliteMessageElement.innerHTML = `
        <span class="message__text">${error.message}</span>
      `

        sendComliteMessageElement.classList.add(this.stateClasses.isActive)

        setTimeout(() => {
          sendComliteMessageElement.classList.remove(
            this.stateClasses.isActive
          )
        }, 5000)
      })
    }
  }

  bindEvents() {
    document.addEventListener("submit", (event) => this.onSendForm(event))
  }
}

export { SendForm }
