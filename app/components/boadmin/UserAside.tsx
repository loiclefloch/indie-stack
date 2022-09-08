import { Box, Typography } from "@mui/material";

export default function Aside() {
	return (
		<Box sx={{ width: '200px', margin: '1em' }}>
			<Typography variant="h6">User</Typography>
			<Typography variant="body2">
				aside view for the user
			</Typography>
		</Box>
	);
}
