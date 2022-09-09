import { Drawer as MuiDrawer, IconButton, Divider, Toolbar, List, Tooltip } from "@mui/material";
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import type { MouseEventHandler, ReactNode } from "react";
import { useState } from "react";
import { styled } from '@mui/material/styles';
import { DRAWER_WIDTH } from "~/constants";
import DashboardIcon from '@mui/icons-material/Dashboard';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PeopleIcon from '@mui/icons-material/People';
import BarChartIcon from '@mui/icons-material/BarChart';
import LayersIcon from '@mui/icons-material/Layers';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import ConstructionIcon from '@mui/icons-material/Construction';
import MenuItem from "./MenuItem"
import SubMenu from "./SubMenu"

type MenuProps = {
  openedMenu: MenuName;
	dense: boolean;
  handleToggle: Function;
}

type MenuName = 'menuAdmin' | 'menuDevTools' | undefined



const MainListItems = ({ openedMenu, handleToggle, dense }: MenuProps) => (
  <>
    <MenuItem
      name="Dashboard"
      href="/dashboard"
      icon={<DashboardIcon />} dense={dense}
    />

    <MenuItem name="Orders" icon={<ShoppingCartIcon />} dense={dense} />

    <MenuItem name="Users" href="/users"  icon={<PeopleIcon />}  dense={dense}/>

    <MenuItem name="Reports" icon={<BarChartIcon />}  dense={dense}/>

    <MenuItem name="Integrations" icon={<LayersIcon />}  dense={dense} />
  </>
);

const SecondaryListItems = ({ openedMenu, handleToggle, dense }: MenuProps) => (
  <>
    {/* <ListSubheader component="div" inset>
      Admin
    </ListSubheader> */}

    <SubMenu
      handleToggle={() => handleToggle("menuAdmin")}
      isOpen={openedMenu === "menuAdmin"}
      name="Admin"
      icon={<AdminPanelSettingsIcon />}
      dense={false}
    >
      <MenuItem
        name="Admin tests"
        href="/admin"
        icon={<AdminPanelSettingsIcon />}
        dense={dense}
      />

      <MenuItem
        name="Bo admin"
        href="/boadmin"
        icon={<AdminPanelSettingsIcon />}
        dense={dense}
      />
    </SubMenu>
  </>
);

const BottomListItems = ({ openedMenu, handleToggle, dense }: MenuProps) => (
  <>
    <SubMenu
      handleToggle={() => handleToggle("menuDevTools")}
      isOpen={openedMenu === "menuDevTools"}
      name="Dev tools"
      icon={<ConstructionIcon />}
      dense={false}
    >
       <MenuItem
        name="Theme"
        href="/dev/theme"
        icon={<ConstructionIcon />}
        dense={dense}
      />

      <MenuItem
        name="Test Page"
        href="/dev/test"
        icon={<ConstructionIcon />}
        dense={dense}
      />
    </SubMenu>
  </>
);

interface Props {
  open?: boolean;
  toggleDrawer: MouseEventHandler<any>;
}

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    '& .MuiDrawer-paper': {
      position: 'relative',
      whiteSpace: 'nowrap',
      width: DRAWER_WIDTH,
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
      boxSizing: 'border-box',
      ...(!open && {
        overflowX: 'hidden',
        transition: theme.transitions.create('width', {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.leavingScreen,
        }),
        width: theme.spacing(7),
        [theme.breakpoints.up('sm')]: {
          width: theme.spacing(9),
        },
      }),
    },
  }),
);


export default function SidebarMenu({ open: sidebarIsOpen, toggleDrawer }: Props) {
	const [openedSubMenu, setOpenedSubMenu] = useState<MenuName>();

	const dense = true

	const handleToggle = (menu: MenuName) => {
    setOpenedSubMenu(openedMenu => openedMenu === menu ? undefined : menu);
  };

  return (
    <Drawer variant="permanent" open={sidebarIsOpen}>
      <Toolbar
        variant="dense"
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
          px: [1],
        }}
      >
        <IconButton onClick={toggleDrawer}>
          <ChevronLeftIcon />
        </IconButton>
      </Toolbar>

      <Divider />
      <List component="nav">
        <MainListItems
          dense={dense}
          openedMenu={openedSubMenu}
          handleToggle={handleToggle}
        />
        <Divider sx={{ my: 1 }} />
        <SecondaryListItems
          dense={dense}
          openedMenu={openedSubMenu}
          handleToggle={handleToggle}
        />
      </List>

      <List
        component="nav"
        sx={{
          display: "flex",
          flex: 1,
          flexDirection: "column",
          justifyContent: "flex-end",
          padding: 0,
        }}
      >
        <Divider />
        <BottomListItems
          dense={dense}
          openedMenu={openedSubMenu}
          handleToggle={handleToggle}
        />
      </List>
    </Drawer>
  );
}
