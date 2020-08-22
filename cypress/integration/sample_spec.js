describe('My First Test', () => {
  it('Visits the test page', () => {
    cy.visit('https://spb-web.github.io/boxOverlay')
  })

  it('run', () => {
    cy.contains('Run example').click()
  })

  it('check overlay', () => {
    cy.get('body > div').as('area')
    cy.get('body > div').as('overlay')
  })
})