import MenuIcon from '@mui/icons-material/Menu';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import { styled } from '@mui/material/styles';
import MuiToolbar, { ToolbarProps as MuiToolbarProps } from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import { DRAWER_WIDTH } from "~/constants";
import { useSidebarState } from '~/hooks/useSidebarState';
import ClientOnly from '~/utils/ClientOnly';
import SidebarMenu from './SidebarMenu';

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
  withDrawer: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open' && prop !== 'withDrawer'
})<AppBarProps>(({ theme, open, withDrawer }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: withDrawer ? DRAWER_WIDTH : 0,
    width: withDrawer ? `calc(100% - ${DRAWER_WIDTH}px)` : '100%',
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));


function Toolbar(props: MuiToolbarProps) {
  return (
    <MuiToolbar variant="dense" {...props} />
  )
}

export default function Layout({ isLoggedIn, children }: { isLoggedIn: boolean, children: ReactNode }) {
  const location = useLocation();

  const isAdminPage = location.pathname.startsWith("/boadmin") || location.pathname.startsWith("/admin")

  // since we have aa sidebar specific for the admin pages, we hide by default the layout here
  const [sidebarIsOpen, setSidebarOpen] = useSidebarState(!isAdminPage);

  console.log({ sidebarState: sidebarIsOpen })

  const withSidebar = isLoggedIn

  const toggleDrawer = () => {
    setSidebarOpen(!sidebarIsOpen);
  };

  return (
    <Box sx={{ display: "flex" }}>
      {/* Header */}
      <AppBar position="absolute" open={sidebarIsOpen} withDrawer={withSidebar}>
        <Toolbar
          variant="dense"
          sx={{
            pr: isLoggedIn ? 4 : 0, // keep right padding when drawer closed. 0 when logedout, no sidebar
          }}
        >
          <IconButton
            edge="start"
            color="inherit"
            aria-label="open drawer"
            onClick={toggleDrawer}
            sx={{
              marginRight: "36px",
              ...(sidebarIsOpen && { display: "none" }),
            }}
          >
            <MenuIcon />
          </IconButton>

          <Typography
            component="h1"
            variant="h6"
            color="inherit"
            noWrap
            sx={{ flexGrow: 1 }}
          >
            <ClientOnly fallback="">{() => window.document?.title}</ClientOnly>
            {/* only when on a react admin page, will replace the title for us */}
            <span id="react-admin-title" />
          </Typography>

          <List dense sx={{ padding: 0 }}>
            {isLoggedIn && (
              <ListItem disablePadding>
                <ListItemButton sx={{ textAlign: "center" }} href="/logout">
                  <ListItemText primary="Logout" />
                </ListItemButton>
              </ListItem>
            )}

            {!isLoggedIn && location.pathname !== "/login" && (
              <ListItem disablePadding>
                <ListItemButton sx={{ textAlign: "center" }} href="/login">
                  <ListItemText primary="Login" />
                </ListItemButton>
              </ListItem>
            )}
          </List>
        </Toolbar>
      </AppBar>

      {/* Sidebar menu */}
      {withSidebar && (
        <SidebarMenu open={sidebarIsOpen} toggleDrawer={toggleDrawer} />
      )}

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          height: "100vh",
          overflow: "auto",
        }}
      >
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
}
