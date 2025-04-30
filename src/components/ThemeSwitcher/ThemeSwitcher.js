class ThemeSwitcher {
  selectors = {
    switcherButton: "[data-js-theme-swothcer-btn]",
  }

  themes = {
    dark: "dark",
    light: "light",
  }

  stateClasses = {
    isDarkTheme: "is-dark-theme",
  }

  storageKey = "theme"

  constructor() {
    this.switcherButtonElement = document.querySelector(
      this.selectors.switcherButton
    )
    this.setInitialTheme()
    this.bindEvents()
  }

  get isDarkThemeChanged() {
    return localStorage.getItem(this.storageKey) == this.themes.dark
  }

  setInitialTheme() {
    document.documentElement.classList.toggle(
      this.stateClasses.isDarkTheme,
      this.isDarkThemeChanged
    )
  }

  onClick = () => {
    localStorage.setItem(
      this.storageKey,
      this.isDarkThemeChanged ? this.themes.light : this.themes.dark
    )

    document.documentElement.classList.toggle(this.stateClasses.isDarkTheme)
  }

  bindEvents() {
    this.switcherButtonElement.addEventListener('click', this.onClick)
  }
}

export { ThemeSwitcher }
