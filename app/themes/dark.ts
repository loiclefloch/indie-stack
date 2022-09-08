import { createTheme } from '@mui/material/styles';
import { CLOSED_DRAWER_WIDTH, DRAWER_WIDTH } from '~/constants';

const theme = createTheme({
  palette: {
    mode: "dark",
  },
  sidebar: {
    width: DRAWER_WIDTH, 
    closedWidth: CLOSED_DRAWER_WIDTH, 
  },

});

export default theme;
