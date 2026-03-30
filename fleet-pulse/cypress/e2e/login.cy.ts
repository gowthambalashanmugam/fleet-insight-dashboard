describe('Login Page', () => {
  beforeEach(() => {
    cy.visit('/login');
  });

  it('should display the login form', () => {
    cy.get('#username').should('be.visible');
    cy.get('#password').should('be.visible');
    cy.get('button[type="submit"]').should('contain.text', 'Sign In');
  });

  it('should show error when submitting empty form', () => {
    cy.get('button[type="submit"]').click();
    cy.get('.text-red-400').should('contain.text', 'Please enter both username and password');
  });

  it('should show error when only username is provided', () => {
    cy.get('#username').type('admin');
    cy.get('button[type="submit"]').click();
    cy.get('.text-red-400').should('contain.text', 'Please enter both username and password');
  });

  it('should navigate to dashboard on valid login', () => {
    cy.get('#username').type('admin');
    cy.get('#password').type('password');
    cy.get('button[type="submit"]').click();
    cy.url().should('include', '/dashboard');
    cy.get('app-sidebar').should('be.visible');
  });
});
