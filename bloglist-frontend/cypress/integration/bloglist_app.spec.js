describe('Blog app', function () {
  let rootUser = null

  beforeEach(function () {
    cy.request('POST', 'http://localhost:3001/api/testing/reset')

    // create new user to backend
    rootUser = {
      name: 'Root Tester',
      username: 'root',
      password: 'root',
    }
    cy.registerUser(rootUser)
  })

  it('Login form is shown by default', function () {
    cy.contains('log in to application')
  })

  describe('Login', function () {
    it('succeeds with correct credentials', function () {
      cy.get('[data-cy=username]').type('root')
      cy.get('[data-cy=password]').type('root')
      cy.get('[data-cy=login-button]').click()
      cy.contains(`${rootUser.name} logged in`)
    })

    it('fails with wrong credentials', function () {
      cy.get('[data-cy=username]').type('wrong_username')
      cy.get('[data-cy=password]').type('wrongpassword')
      cy.get('[data-cy=login-button]').click()
      // cy.contains('invalid username or password')

      // ensure error is shown in notification component
      cy.get('[data-cy=notification]')
        .should('contain', 'invalid username or password')
        .and('have.css', 'color', 'rgb(255, 0, 0)')
        .and('have.css', 'border-style', 'solid')
    })
  })

  describe('When logged in', function () {
    beforeEach(function () {
      // log in user
      const loginDetails = { username: 'root', password: 'root' }
      cy.login(loginDetails)

      // ensure user logged in
      cy.contains(`${rootUser.name} logged in`).should('contain', 'logout')

      // create new blog
      const newBlogPost = {
        title: 'Test using Cypress',
        author: 'Mr. Miyagi',
        url: 'http://www.cypress.io',
      }
      cy.create(newBlogPost)

      // cy.get('[data-testid=create-new-blog-button]').click()
      // cy.get('[data-testid=title-input]').type('')
      // cy.get('[data-testid=author-input]').type('')
      // cy.get('[data-testid=url-input]').type('')
      // cy.get('[data-testid=create-button]').click()
    })

    it('A blog can be created', function () {
      // ensure newly created blog is added to list of all blogs
      cy.get('[data-testid=blog-list]')
        .should('contain', 'Test using Cypress Mr. Miyagi')
        .and('contain', 'view')
    })

    it('a user can like a blog', function () {
      // get the element containing the newly added blog
      cy.contains('Test using Cypress Mr. Miyagi')
        .find('button')
        .should('contain', 'view')
        .click()

      cy.contains('Test using Cypress Mr. Miyagi')
        .parent()
        .find('.likeButton')
        .should('contain', 'like')
        .click()
        .as('likeButton')

      // ensure that the value of likes increased by 1
      cy.contains('Test using Cypress Mr. Miyagi')
        .parent()
        .find('[data-testid=like-value]')
        .should('contain', '1')

      cy.get('@likeButton').click()

      cy.contains('Test using Cypress Mr. Miyagi')
        .parent()
        .find('[data-testid=like-value]')
        .should('contain', '2')

      cy.contains('Test using Cypress Mr. Miyagi')
        .parent()
        .find('[data-testid=like-value]')
        .should((value) => {
          console.log('====>', value.text())
        })
    })

    it('only user who created blog can delete', function () {
      cy.contains('Test using Cypress Mr. Miyagi')
        .find('button')
        .should('contain', 'view')
        .click()

      cy.contains('Test using Cypress Mr. Miyagi')
        .parent()
        .find('[data-testid=blog-poster]')
        .should('contain', `${rootUser.name}`)
        .parent()
        .should('contain', 'remove')
    })

    it('other user who did not create blog cannot delete', function () {
      // logout
      cy.contains('logout').click()

      // create new user
      const newUser = {
        name: 'Test 1',
        username: 'tester_1',
        password: 'tester_1',
      }
      cy.registerUser(newUser)

      // login
      cy.login({ username: newUser.username, password: newUser.password })

      cy.contains('Test using Cypress Mr. Miyagi')
        .find('button')
        .should('contain', 'view')
        .click()

      cy.contains('Test using Cypress Mr. Miyagi')
        .parent()
        .find('[data-testid=blog-poster]')
        .should('contain', `${rootUser.name}`)
        .parent()
        .should('not.contain', 'remove')
    })

    it.only('blogs are ordered according to likes', function () {
      // cy.get('[data-testid=blog-list]').debug()
      const likes = []

      // root user creates 3 additional blogs
      cy.create({
        title: 'iPhone 12',
        author: 'Foo',
        url: 'http://www.apple.com',
        likes: 7,
      })

      cy.create({
        title: 'US Election',
        author: 'Bar',
        url: 'http://www.apnews.com',
        likes: 10,
      })

      cy.create({
        title: 'React 17',
        author: 'Foo Bar',
        url: 'http://www.react.com',
        likes: 3,
      })

      // ensure the length of blogs is as expected
      cy.get('[data-testid=blog-list]')
        .children('[data-testid=the-blog]')
        .should('have.length', 4)
        .each((blog) => {
          cy.get(blog)
            .find('.titleAndAuthor')
            .find('button')
            .should('contain', 'view')
            .click()
            .parent()
            .parent()
            .find('[data-testid=like-value]')
            .then((span) => {
              likes.push(Number(span.text()))
            })
        })
        .then(() => {
          expect(likes).to.have.ordered.members([10, 7, 3, 0])
        })
    })
  })
})

describe('Blog app solution', function () {
  beforeEach(function () {
    cy.request('POST', 'http://localhost:3001/api/testing/reset')
    cy.request('POST', 'http://localhost:3001/api/users', {
      username: 'mluukkai',
      name: 'Matti Luukkainen',
      password: 'salainen',
    })
    cy.request('POST', 'http://localhost:3001/api/users', {
      username: 'hellas',
      name: 'Arto Hellas',
      password: 'salainen',
    })
    cy.visit('http://localhost:3000')
  })

  it('Login from is shown', function () {
    cy.contains('login to application')
  })

  describe('Login', function () {
    it('succeeds with correct credentials', function () {
      cy.get('#username').type('mluukkai')
      cy.get('#password').type('salainen')
      cy.get('#login').click()

      cy.contains('Matti Luukkainen logged in')
    })

    it('fails with wrong credentials', function () {
      cy.get('#username').type('mluukkai')
      cy.get('#password').type('wrong')
      cy.get('#login').click()

      cy.contains('wrong username/password').should(
        'have.css',
        'color',
        'rgb(255, 0, 0)'
      )
    })
  })

  describe('When logged in', function () {
    beforeEach(function () {
      cy.login({ username: 'mluukkai', password: 'salainen' })
    })

    it('A blog can be created', function () {
      cy.contains('create new blog').click()
      cy.get('#author').type('Gleb Bahmutov')
      cy.get('#title').type('Readable Cypress.io tests')
      cy.get('#url').type('https://glebbahmutov.com/blog/readable-tests/')
      cy.get('#create').click()

      cy.contains('Readable Cypress.io tests')
      cy.contains('Gleb Bahmutov')
    })
  })

  describe('When several blogs creaded by many people exist', function () {
    beforeEach(function () {
      cy.login({ username: 'mluukkai', password: 'salainen' })
      cy.createBlog({
        author: 'John Doe',
        title: 'test1',
        url: 'http://example.com./test1',
      })
      cy.createBlog({
        author: 'John Doe',
        title: 'test2',
        url: 'http://example.com./test2',
      })
      cy.contains('logout').click()
      cy.login({ username: 'hellas', password: 'salainen' })
      cy.createBlog({
        author: 'Jane Doe',
        title: 'test3',
        url: 'http://example.com./test3',
      })

      cy.contains('test1').parent().parent().as('blog1')
      cy.contains('test2').parent().parent().as('blog2')
      cy.contains('test3').parent().parent().as('blog3')
    })

    it('Blogs can be liked', function () {
      cy.get('@blog2').contains('view').click()
      cy.get('@blog2').contains('like').click()
      cy.get('@blog2').contains('likes 1')
    })

    it('they are ordered by number of likes', function () {
      cy.get('@blog1').contains('view').click()
      cy.get('@blog2').contains('view').click()
      cy.get('@blog3').contains('view').click()
      cy.get('@blog1').contains('like').as('like1')
      cy.get('@blog2').contains('like').as('like2')
      cy.get('@blog3').contains('like').as('like3')

      cy.get('@like2').click()
      cy.get('@like1').click()
      cy.get('@like1').click()
      cy.get('@like3').click()
      cy.get('@like3').click()
      cy.get('@like3').click()

      cy.get('.blog').then((blogs) => {
        cy.wrap(blogs[0]).contains('likes 3')
        cy.wrap(blogs[1]).contains('likes 2')
        cy.wrap(blogs[2]).contains('likes 1')
      })
    })

    it('The creator can delete a blog', function () {
      cy.get('@blog3').contains('view').click()
      cy.get('@blog3').contains('remove').click()
      cy.get('home').should('not.contain', 'test3')

      cy.get('@blog2').contains('view').click()
      cy.get('@blog2').should('not.contain', 'remove')
    })
  })
})
