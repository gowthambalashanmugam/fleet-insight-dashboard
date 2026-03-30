Cypress.Commands.add('login', (username: string, password: string) => {
  cy.visit('/login');
  cy.get('#username').type(username);
  cy.get('#password').type(password);
  cy.get('button[type="submit"]').click();
  cy.url().should('include', '/dashboard');
});

Cypress.Commands.add('navigateTo', (label: 'Dashboard' | 'Fleet' | 'Alerts') => {
  const routeMap: Record<string, string> = { Dashboard: '/dashboard', Fleet: '/fleet', Alerts: '/alerts' };
  cy.get('app-sidebar nav a').contains(label).click();
  cy.url().should('include', routeMap[label]);
});

Cypress.Commands.add('getBySel', (selector: string) => {
  return cy.get(`[data-cy="${selector}"]`);
});
