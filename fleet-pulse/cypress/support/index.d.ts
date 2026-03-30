declare namespace Cypress {
  interface Chainable {
    login(username: string, password: string): Chainable<void>;
    navigateTo(label: 'Dashboard' | 'Fleet' | 'Alerts'): Chainable<void>;
    getBySel(selector: string): Chainable<JQuery<HTMLElement>>;
  }
}
