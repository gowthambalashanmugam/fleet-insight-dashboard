describe('Alerts Page', () => {
  beforeEach(() => {
    cy.login('admin', 'password');
    cy.navigateTo('Alerts');
  });

  it('should display the alerts heading', () => {
    cy.get('h2').should('contain.text', 'Alerts');
  });

  it('should display the alerts description', () => {
    cy.contains('Fleet alerts and notifications').should('be.visible');
  });
});
