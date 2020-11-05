describe('Blog app', function () {
  beforeEach(function () {
    cy.request('POST', 'http://localhost:3001/api/testing/reset');
    const user = {
      name: 'Sami Smith',
      username: 'sami',
      password: 'sami',
    };
    cy.request('POST', 'http://localhost:3001/api/users', user);
    cy.visit('http://localhost:3000');
  });

  it.only('Login form is shown', function () {
    cy.contains('Log in to application');
  });

  it('login form can be opened', function () {
    cy.contains('login').click();
  });

  it('user can login', function () {
    cy.get('#username').type('sami');
    cy.get('#password').type('sami');
    cy.get('#loginButton').click();

    cy.contains('Sami Smith logged in');
  });

  it('login fails with wrong password', function () {
    cy.get('#username').type('sami');
    cy.get('#password').type('samiwrongpassword');
    cy.get('#loginButton').click();

    cy.get('.error')
      .should('contain', 'wrong username or password')
      .and('have.css', 'color', 'rgb(255, 255, 255)')
      .and('have.css', 'background-color', 'rgb(211, 211, 211)'); //rgb(211,211,211) === lightgray
    cy.get('html').should('not.contain', 'Sami Smith logged in');
  });

  describe('when logged in', function () {
    beforeEach(function () {
      cy.login({ username: 'sami', password: 'sami' });
    });

    it('a new blog entry can be added', function () {
      cy.contains('new note').click();
      cy.get('#title').type('What happened to Fullstack testing?');
      cy.get('#author').type('Neil Somebody');
      cy.get('#url').type('https://www.goodreads.com/what-happened-to-anything');
      cy.get('#createButton').click();

      cy.get('.error') // Note: This is not an error. The id is used in multipurpose component /components/Notification.js
        .should('contain', 'Added What happened to Fullstack testing?');
    });

    describe('and blog entries exists', function () {
      beforeEach(function () {
        cy.createNewBlog({
          title: 'First blog entry',
          author: 'Lisa Winfrey',
          url: 'https://www.cnn.com/a-ready-made-blog-entry',
        });

        cy.createNewBlog({
          title: 'Second blog entry',
          author: 'Lisa Winfrey',
          url: 'https://www.cnn.com/a-ready-made-blog-entry',
        });
      });

      it('it can be shown', function() {
        cy.contains('view').click();
      });
    });
  });
});