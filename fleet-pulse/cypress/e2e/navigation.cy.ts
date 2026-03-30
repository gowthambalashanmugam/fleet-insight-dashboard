describe('Sidebar Navigation', () => {
  beforeEach(() => {
    cy.login('admin', 'password');
  });

  it('should display all navigation items', () => {
    cy.get('app-sidebar nav a').should('have.length', 3);
    cy.get('app-sidebar nav a').eq(0).should('contain.text', 'Dashboard');
    cy.get('app-sidebar nav a').eq(1).should('contain.text', 'Fleet');
    cy.get('app-sidebar nav a').eq(2).should('contain.text', 'Alerts');
  });

  it('should navigate to Fleet page', () => {
    cy.navigateTo('Fleet');
    cy.url().should('include', '/fleet');
    cy.get('h2').should('contain.text', 'Fleet');
  });

  it('should navigate to Alerts page', () => {
    cy.navigateTo('Alerts');
    cy.url().should('include', '/alerts');
    cy.get('h2').should('contain.text', 'Alerts');
  });

  it('should navigate back to Dashboard', () => {
    cy.navigateTo('Fleet');
    cy.navigateTo('Dashboard');
    cy.url().should('include', '/dashboard');
    cy.get('h2').should('contain.text', 'Dashboard');
  });

  it('should highlight the active nav item', () => {
    cy.navigateTo('Fleet');
    cy.get('app-sidebar nav a').contains('Fleet')
      .should('have.class', 'bg-indigo-50');
  });
});
