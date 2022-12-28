export function addCommands() {
  Cypress.Commands.add('enableMockOverride', (props) => {
    cy.task('enableMockOverride', props)
  })
}
