import { useRef } from "react";
import type { ReactElement, ReactNode } from "react";
import {
  List,
  ListItemText,
  ListItemIcon,
  Typography,
  Tooltip,
  Menu,
  Box,
  ListItemButton,
} from "@mui/material";
import ExpandMore from "@mui/icons-material/ExpandMore";
import { useSidebarState } from "~/hooks/useSidebarState";
import MenuItem from "./MenuItem"

interface Props {
  dense: boolean;
  handleToggle: () => void;
  icon: ReactElement;
  isOpen: boolean;
  name: string;
  children: ReactNode;
}

const SubMenu = (props: Props) => {
  const { handleToggle, isOpen, name, icon, children, dense } = props;
  const menuRef = useRef();
  const [sidebarIsOpen] = useSidebarState();

  const handleClose = () => {
    handleToggle();
  };

  console.log({ sidebarIsOpen })

  const header = (
    <MenuItem
      icon={isOpen ? <ExpandMore /> : icon}
      name={name}
      dense={dense}
      onClick={handleToggle}
    />
  );

  return (
    <Box sx={{ position: "relative" }} ref={menuRef}>
      <>
        {sidebarIsOpen || isOpen ? (
          header
        ) : (
          <Tooltip title={name} placement="right">
            {header}
          </Tooltip>
        )}

        <Menu
          open={isOpen}
          anchorEl={menuRef.current}
          anchorOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          onClose={handleClose}
        >
          <List
            dense={dense}
            component="div"
            disablePadding
            sx={{
              "& a": {
                transition:
                  "padding-left 195ms cubic-bezier(0.4, 0, 0.6, 1) 0ms",
                paddingLeft: sidebarIsOpen ? 4 : 2,
              },
            }}
          >
            {children}
          </List>
        </Menu>
      </>
    </Box>
  );
};

export default SubMenu;
