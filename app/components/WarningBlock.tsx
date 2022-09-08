import { Box } from "@mui/material"
import { ReactNode } from "react"
import { SxProps } from '@material-ui/system';

type Props = {
	children: ReactNode;
	sx: SxProps;
}

export default function WarningBlock({ children, sx } : Props) {
	return (
		<Box
			sx={{
				...sx,
				border: `1px solid`,
				borderColor: 'warning.main',
				color: 'warning.main',
				padding: 1,
				borderRadius: 1,
			}}
		>
			{children}
		</Box>
	)
}