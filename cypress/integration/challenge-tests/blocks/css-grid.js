/* global cy */
const superblockPathData = require('../../../fixtures/pathData/responsive-web-design.json');

const challengePaths = superblockPathData['blocks']['css-grid'];

challengePaths.forEach(challenge => {
  let challengeName = challenge.split('/');

  it(
    'Challenge ' +
      challengeName[challengeName.length - 1] +
      ' should work correctly',
    () => {
      cy.testChallenges(challenge);
    }
  );
});
