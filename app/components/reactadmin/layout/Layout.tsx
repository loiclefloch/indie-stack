// https://marmelab.com/react-admin/Layout.html
import type { LayoutProps } from 'react-admin';
import { Layout as MuiLayout, Menu as ReactAdminMenu } from 'react-admin';

import Error from "./Error"
import AppBar from "./AppBar"

export default function Layout(props: LayoutProps) {

	return (
    <MuiLayout
      sx={{
        "& .RaLayout-appFrame": {
          marginTop: 0,
        },
        "& .MuiMenuItem-root": {
          textTransform: "capitalize",
        },
      }}
      {...props}
      appBar={AppBar}
      // custom menu given by the admin part, or fallback to default react-admin menu
      menu={props.menu || ReactAdminMenu}
      error={Error}
    />
  );
}