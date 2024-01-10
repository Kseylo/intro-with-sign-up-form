// @ts-ignore
import errorIcon from './assets/images/icon-error.svg'
class CustomInput extends HTMLInputElement {
    private errorMsg!: HTMLSpanElement
    private errorIcon!: HTMLImageElement
    private previousPlaceholder!: string
    constructor() {
        super()
    }

    setupErrorElement() {
        this.errorMsg = document.createElement('span')
        this.errorMsg.classList.add(
            'text-primary-red',
            'block',
            'mt-1',
            'text-end'
        )
        this.after(this.errorMsg)
    }

    setupErrorIcon() {
        this.errorIcon = document.createElement('img')
        this.errorIcon.classList.add('absolute', 'top-4', 'right-8')
        this.errorIcon.setAttribute('src', errorIcon)
        this.errorIcon.setAttribute('alt', 'error icon')
        this.after(this.errorIcon)
    }

    render() {
        this.classList.add(
            'text-neutral-dark-blue',
            'focus:ring-accent-blue',
            'w-full',
            'rounded-md',
            'border',
            'border-neutral-200',
            'p-4',
            'pl-8',
            'font-medium',
            'placeholder-neutral-500',
            'outline-0',
            'focus:ring-1'
        )
        this.previousPlaceholder = this.placeholder

        this.addEventListener('focus', () => {
            if (!this.checkValidity()) {
                this.errorMsg.remove()
                this.errorIcon.remove()
                this.classList.remove('border-primary-red')
                this.placeholder = this.previousPlaceholder
                this.classList.remove('placeholder-primary-red')
            }
        })
    }

    connectedCallback() {
        this.render()
    }

    validate() {
        const existingErrorMsg = this.parentElement?.querySelector('span')
        if (existingErrorMsg) existingErrorMsg.remove()

        const existingErrorIcon = this.parentElement?.querySelector('img')
        if (existingErrorIcon) existingErrorIcon.remove()

        if (!this.checkValidity()) {
            this.setupErrorElement()
            this.setupErrorIcon()
            this.classList.add('border-primary-red')
            if (this.type === 'email' && this.validity.typeMismatch) {
                this.placeholder = 'email@example.com'
                this.classList.add('placeholder-primary-red')
                this.errorMsg.textContent = 'Looks like this is not an email'
                this.value = ''
            } else {
                this.placeholder = ''
                this.errorMsg.textContent = `${this.placeholder} cannot be empty`
            }
        }
    }
}

customElements.define('custom-input', CustomInput, { extends: 'input' })

const form = document.querySelector('form')
form?.addEventListener('submit', (event) => {
    event.preventDefault()
    let isValid = true
    const inputs = form.querySelectorAll(
        'input[is="custom-input"]'
    ) as NodeListOf<CustomInput>
    inputs.forEach((input) => {
        input.validate()
        if (!input.checkValidity()) isValid = false
    })
    if (isValid) {
        inputs.forEach((input) => {
            input.value = ''
        })
        alert('Success!')
    }
})
