import { createContext } from 'react';
import { DEFAULT_THEME } from '~/constants';

export interface ClientStyleContextData {
  themeName: string;
  setThemeName: () => void;
  reset: () => void;
}

export default createContext<ClientStyleContextData>({
  themeName: DEFAULT_THEME,
  setThemeName: () => {},
  reset: () => {},
});