import * as React from 'react';
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";

import Page from '~/components/Page'

export default function Layout({ isLoggedIn, children }: { isLoggedIn: boolean, children: React.ReactNode }) {
  return (
    <>
      <CssBaseline />
      <Page isLoggedIn={isLoggedIn}>{children}</Page>
    </>
  );
}
