// https://marmelab.com/react-admin/Layout.html
import * as React from 'react';
import { Menu } from 'react-admin';
import PeopleIcon from '@mui/icons-material/People';

export default function MyMenu() {
	return (
		<Menu>
			<Menu.Item to="/boadmin/users" primaryText="Users" leftIcon={<PeopleIcon />} />
		</Menu>
	);
}