// https://marmelab.com/react-admin/Layout.html
import type { LayoutProps, AppBarProps } from 'react-admin';
import { Layout, AppBar } from 'react-admin';

import Menu from "./Menu"
import Error from "./Error"

function AdminAppBar({ open, title, ...props }: AppBarProps) {

	return (
		<AppBar
			color="primary"
			sx={{
				position: 'relative'
			}}
			{...props}
		>
			{title}
		</AppBar>
	)
}

export default function BoAdminLayout(props: LayoutProps) {

	return (
    <Layout
      sx={{
        "& .RaLayout-appFrame": {
          marginTop: 2, // TODO: better
        },
      }}
      {...props}
      appBar={AdminAppBar}
      menu={Menu}
      error={Error}
    />
  );
}