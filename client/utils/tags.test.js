/* global expect */

import { injectConditionalTags } from './tags';

describe('Tags', () => {
  it('injectConditionalTags should inject gap for english homeLocation', () => {
    let injectedTags = injectConditionalTags(
      [],
      'https://www.freecodecamp.org'
    );
    expect(injectedTags.length === 1).toBeTruthy();
    expect(injectedTags[0].props.id === 'gap').toBeTruthy();
  });
  it('injectConditionalTags should inject gap for espanol homeLocation', () => {
    let injectedTags = injectConditionalTags(
      [],
      'https://www.freecodecamp.org/espanol'
    );
    expect(injectedTags.length === 1).toBeTruthy();
    expect(injectedTags[0].props.id === 'gap').toBeTruthy();
  });
  it('injectConditionalTags should only inject cap for chinese homeLocation', () => {
    let injectedTags = injectConditionalTags(
      [],
      'https://chinese.freecodecamp.org'
    );

    expect(injectedTags.length === 1).toBeTruthy();
    expect(injectedTags[0].props.id === 'cap').toBeTruthy();
  });

  it('injectConditionalTags should not inject tags for localhost homeLocation', () => {
    let injectedTags = injectConditionalTags([], 'http://localhost:8000/');
    expect(injectedTags.length === 0).toBeTruthy();
  });
});
