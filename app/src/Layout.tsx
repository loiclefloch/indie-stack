import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';

import Page from '~/components/Page'

export default function Layout({ isLoggedIn, children }: { isLoggedIn: boolean, children: React.ReactNode }) {
  return (
    <Page isLoggedIn={isLoggedIn}>
      <CssBaseline />
      {children}
    </Page>
  );
}
