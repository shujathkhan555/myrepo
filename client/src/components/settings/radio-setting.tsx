import {
  FormGroup,
  ControlLabel,
  HelpBlock
} from '@freecodecamp/react-bootstrap';
import React from 'react';

import { ButtonSpacer } from '../helpers';
import TB from '../helpers/toggle-button';

import './toggle-setting.css';

type ToggleSettingProps = {
  action: string;
  explain?: string;
  flag: boolean;
  flagName: string;
  toggleFlag: () => void;
  offLabel: string;
  onLabel: string;
};

export const RadioSetting = ({
  action,
  explain,
  flag,
  flagName,
  toggleFlag,
  ...restProps
}: ToggleSettingProps): JSX.Element => {
  return (
    <>
      <div className='toggle-setting-container'>
        <FormGroup>
          <ControlLabel className='toggle-label' htmlFor={flagName}>
            <strong>{action}</strong>
            {explain ? (
              <HelpBlock>
                <em>{explain}</em>
              </HelpBlock>
            ) : null}
          </ControlLabel>
          <TB
            name={flagName}
            onChange={toggleFlag}
            value={flag}
            {...restProps}
          />
        </FormGroup>
      </div>
      <ButtonSpacer />
    </>
  );
};
