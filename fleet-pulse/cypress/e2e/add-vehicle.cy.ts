describe('Add Vehicle', () => {
  beforeEach(() => {
    cy.login('admin', 'password');
    cy.navigateTo('Fleet');
  });

  it('should open the add vehicle modal', () => {
    cy.get('.btn-add-vehicle').click();
    cy.get('app-add-vehicle-form').should('be.visible');
    cy.get('.form-title').should('contain.text', 'Add New Vehicle');
  });

  it('should show validation errors on empty submit', () => {
    cy.get('.btn-add-vehicle').click();
    // Clear default values and submit
    cy.get('#name').clear();
    cy.get('#registration').clear();
    cy.get('#driverName').clear();
    cy.get('#driverContact').clear();
    cy.get('.btn-submit').click();
    cy.get('.field-error').should('have.length.greaterThan', 0);
  });

  it('should validate registration format (ABC 123)', () => {
    cy.get('.btn-add-vehicle').click();
    cy.get('#registration').clear().type('invalid');
    cy.get('#registration').blur();
    cy.get('.field-error').should('contain.text', 'Registration must be in format ABC 123');
  });

  it('should submit a valid vehicle and show success notification', () => {
    cy.get('.btn-add-vehicle').click();
    cy.get('#name').type('Test Vehicle 01');
    cy.get('#registration').clear().type('TST 001');
    cy.get('#vehicleType').select('Van');
    cy.get('#driverName').type('Test Driver');
    cy.get('#driverContact').type('+46 70 000 0000');
    cy.get('#status').select('Active');
    cy.get('.btn-submit').click();

    // Modal closes and success toast appears
    cy.get('app-add-vehicle-form').should('not.exist');
    cy.get('.toast--success').should('contain.text', 'Vehicle added successfully');
  });

  it('should close modal on cancel', () => {
    cy.get('.btn-add-vehicle').click();
    cy.get('.btn-cancel').click();
    cy.get('app-add-vehicle-form').should('not.exist');
  });
});
