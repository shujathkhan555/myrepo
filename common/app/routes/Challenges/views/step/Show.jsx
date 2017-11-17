import React from 'react';
import { addNS } from 'berkeleys-redux-utils';

import ns from './ns.json';
import Step from './Step.jsx';
import { types } from '../../redux';
import Panes from '../../../../Panes';
import _Map from '../../../../Map';
import ChildContainer from '../../../../Child-Container.jsx';

const propTypes = {};
export const mapStateToPanes = addNS(
  ns,
  () => ({
    [types.toggleMap]: 'Map',
    [types.toggleStep]: 'Step'
  })
);

const nameToComponent = {
  Map: {
    Component: _Map
  },
  Step: {
    Component: Step
  }
};

export default function ShowStep() {
  return (
    <ChildContainer isFullWidth={ true }>
      <Panes nameToComponent={ nameToComponent }/>
    </ChildContainer>
  );
}

ShowStep.displayName = 'ShowStep';
ShowStep.propTypes = propTypes;
