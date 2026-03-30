describe('Dashboard Page', () => {
  beforeEach(() => {
    cy.login('admin', 'password');
  });

  it('should display the dashboard heading', () => {
    cy.get('h2').should('contain.text', 'Dashboard');
  });

  it('should render KPI cards section', () => {
    cy.get('app-kpi-card-list').should('exist');
  });

  it('should render the live tracking section', () => {
    cy.get('app-live-tracking-section').should('exist');
  });

  it('should render trip summary section on scroll', () => {
    // The trip section uses @defer (on viewport), so scroll to trigger it
    cy.get('.dashboard-bottom-section').scrollIntoView();
    cy.get('app-trip-summary-card-list').should('exist');
    cy.get('app-latest-trip-table').should('exist');
  });
});
