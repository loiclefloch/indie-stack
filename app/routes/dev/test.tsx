import { Form, Link as RmxLink, useLocation } from "@remix-run/react";

import Brightness2Icon from "@mui/icons-material/Brightness2";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import { 
	Box,
	IconButton,
	Link as MuiLink,
	Tooltip,
	Typography,
} from "@mui/material";

import type { RootLoaderData } from "~/root";
import { useRouteData } from "~/utils/routing";

export default function Index() {
	const { locales, themeName } = useRouteData<RootLoaderData>("root")

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

			<Box sx={{ marginTop: 4 }}>
				locales: {locales?.join(', ')}
			</Box>
		</Box>
	);
}
