import { Form, Button, ControlLabel } from '@freecodecamp/react-bootstrap';
import React from 'react';
import { useTranslation } from 'react-i18next';

import ToggleCheck from '../../assets/icons/toggle-check';

const checkIconStyle = {
  height: '15px',
  paddingTop: '5',
  width: '20px'
};

export enum Themes {
  Night = 'night',
  Default = 'default'
}

type ThemeProps = {
  currentTheme: Themes | null;
  toggleNightMode: (theme: Themes | null) => void;
};

export default function ThemeSettings({
  currentTheme,
  toggleNightMode
}: ThemeProps): JSX.Element {
  const { t } = useTranslation();

  return (
    <Form
      inline={true}
      onSubmit={(e: React.FormEvent): void => e.preventDefault()}
    >
      <ControlLabel className='setting-theme'>
        {t('settings.labels.theme-mode')}
        <Button
          className={`${
            currentTheme !== 'night' ? 'toggle-not-active' : 'toggle-active'
          }`}
          disabled={currentTheme === 'night'}
          onClick={() => toggleNightMode((currentTheme = Themes.Night))}
        >
          {t('settings.labels.dark-theme')}
          <span className='sr-only'>{t('settings.labels.sr-theme')}</span>
          {currentTheme === 'night' && <ToggleCheck style={checkIconStyle} />}
        </Button>
        <Button
          className={`${
            currentTheme !== 'default' ? 'toggle-not-active' : 'toggle-active'
          }}`}
          disabled={currentTheme === 'default'}
          onClick={() => toggleNightMode((currentTheme = Themes.Default))}
        >
          {t('settings.labels.light-theme')}
          <span className='sr-only'>{t('settings.labels.sr-theme')}</span>
          {currentTheme === 'default' && <ToggleCheck style={checkIconStyle} />}
        </Button>
        <Button
          className={`${
            currentTheme !== null ? 'toggle-not-active' : 'toggle-active'
          }`}
          disabled={currentTheme === null}
          onClick={() => toggleNightMode((currentTheme = null))}
        >
          {t('settings.labels.system-theme')}
          <span className='sr-only'>{t('settings.labels.sr-theme')}</span>
          {currentTheme === null && <ToggleCheck style={checkIconStyle} />}
        </Button>
      </ControlLabel>
    </Form>
  );
}
