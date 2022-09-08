// https://marmelab.com/react-admin/Layout.html
import { Box, Typography } from '@mui/material';
import type { AppBarProps } from 'react-admin';
import { AppBar as ReactAdminAppBar } from 'react-admin';

export default function AdminAppBar({ open, ...props }: AppBarProps) {
	return (
    <ReactAdminAppBar
      color="primary"
      sx={{
        position: "relative",

        "& .RaAppBar-title": {
          flex: 1,
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
          overflow: "hidden",
        },
      }}
      {...props}
    >
      <Typography variant="h6" color="inherit" id="react-admin-title" />
			<Box sx={{ display: "flex", flex: 1}} />
    </ReactAdminAppBar>
  );
}