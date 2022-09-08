import { Form, Link as RmxLink, useLocation, useMatches } from "@remix-run/react";

import Brightness2Icon from "@mui/icons-material/Brightness2";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import MuiLink from "@mui/material/Link";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";

import type { RootLoaderData } from "~/root";

export default function Index() {
	// Grabs theme from the loader that is in root.tsx
	const { themeName } = useMatches()[0].data as RootLoaderData;
	// Get location to provide redirect back url
	const location = useLocation();

	return (
		<Box
			sx={{
				height: "90vh",
				display: "flex",
				justifyContent: "center",
				alignItems: "center",
				textAlign: "center",
				flexDirection: "column",
				"& > *": {
					mb: 1
				}
			}}
		>
			<Form action="/" method="post">
				<input
					type="hidden"
					name="redirectBack"
					value={`${location.pathname}${location.search}`} />
				<Tooltip title="Toggle theme">
					<IconButton type="submit" aria-label="Toggle theme">
						{themeName === "light" ? <Brightness7Icon /> : <Brightness2Icon />}
					</IconButton>
				</Tooltip>
				<Typography component="h1" variant="h6">
					Selected theme: {themeName}
				</Typography>
			</Form>
			<Box>
				<MuiLink component={RmxLink} to="/404">
					Test Root CatchBoundary
				</MuiLink>
			</Box>
			<Box>
				<MuiLink component={RmxLink} to="/test-private-route">
					Test Root ErrorBoundary
				</MuiLink>
			</Box>
		</Box>
	);
}
