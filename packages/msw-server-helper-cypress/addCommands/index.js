module.exports = {
  addCommands() {
    Cypress.Commands.add('enableMockOverride', (props) => {
      cy.task('enableMockOverride', props)
    })
    Cypress.Commands.add('resetMockOverrides', (props) => {
      cy.task('resetMockOverrides')
    })
  },
}
