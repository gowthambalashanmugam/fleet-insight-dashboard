describe('Fleet Page', () => {
  beforeEach(() => {
    cy.login('admin', 'password');
    cy.navigateTo('Fleet');
  });

  it('should display the fleet heading and Add Vehicle button', () => {
    cy.get('h2').should('contain.text', 'Fleet');
    cy.get('.btn-add-vehicle').should('contain.text', 'Add Vehicle');
  });

  it('should render the vehicle table with data', () => {
    cy.get('table tbody tr').should('have.length.greaterThan', 0);
  });

  it('should filter vehicles by search term', () => {
    cy.get('.filter-input').type('Truck');
    cy.get('table tbody tr').each(($row) => {
      cy.wrap($row).should('contain.text', 'Truck');
    });
  });

  it('should filter vehicles by status', () => {
    cy.get('.filter-select').first().select('Active');
    cy.get('table tbody tr').each(($row) => {
      cy.wrap($row).find('app-status-badge').should('contain.text', 'Active');
    });
  });

  it('should reset filters', () => {
    cy.get('.filter-input').type('xyz');
    cy.get('.reset-btn').click();
    cy.get('.filter-input').should('have.value', '');
    cy.get('table tbody tr').should('have.length.greaterThan', 0);
  });

  it('should expand a vehicle row to show details', () => {
    cy.get('table tbody tr').first().click();
    cy.get('app-fleet-detail-panel').should('be.visible');
  });

  it('should collapse an expanded row on second click', () => {
    cy.get('table tbody tr').first().click();
    cy.get('app-fleet-detail-panel').should('be.visible');
    cy.get('table tbody tr').first().click();
    cy.get('app-fleet-detail-panel').should('not.exist');
  });

  it('should paginate when there are many vehicles', () => {
    cy.get('app-pagination').should('exist');
  });
});
