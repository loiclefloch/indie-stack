// https://marmelab.com/react-admin/Layout.html
// https://github.com/marmelab/react-admin/blob/master/examples/demo/src/layout/Menu.tsx
import type { MenuProps } from "react-admin";
import { Menu, useSidebarState } from "react-admin";
import PeopleIcon from "@mui/icons-material/People";
import { Box } from "@mui/material";

export default function BoAdminMenu({ dense = true }: MenuProps) {
  const [open] = useSidebarState();

  return (
    <Box
      sx={{
        width: open ? 200 : 50,
        marginTop: 1,
        marginBottom: 1,
        transition: (theme) =>
          theme.transitions.create("width", {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
      }}
    >
      <Menu dense={dense}>
        <Menu.Item
          to="/boadmin/users"
          primaryText="Users"
          leftIcon={<PeopleIcon />}
          dense={dense}
        />
      </Menu>
    </Box>
  );
}
