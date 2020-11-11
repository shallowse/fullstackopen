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

  it('Login form is shown', function () {
    cy.contains('Log in to application');
  });

  describe('Login', function () {
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

      cy.get('.error').should('contain', 'wrong username or password');
      cy.get('html').should('not.contain', 'Sami Smith logged in');
    });
  });

  describe('When logged in', function () {
    beforeEach(function () {
      cy.login({ username: 'sami', password: 'sami' });
    });

    it('A blog can be created', function () {
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
          likes: '0',
        });

        cy.createNewBlog({
          title: 'Second blog entry',
          author: 'Lisa Winfrey',
          url: 'https://www.cnn.com/a-ready-made-blog-entry',
          likes: '1',
        });

        cy.createNewBlog({
          title: 'Third blog entry',
          author: 'Michael Attenborough',
          url: 'https://www.example.com/third-in-the-entry',
          likes: '2',
        });

      });

      it('A blog can be liked', function () {
        cy.contains('Third blog entry').click();
        cy.get('.likeButton').click();
        cy.get('.blogEntry--likes').should('contain', 'likes 3');
      });

    });
  });
});