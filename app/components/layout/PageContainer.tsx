import { ReactNode } from 'react';
import Container from '@mui/material/Container';

/**
 * Container for a page, to have a centered layout content.
 */
export default function PageContainer({ children } : { children: ReactNode }) {
	return (
		<Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
			{children}
		</Container>
	)
}
