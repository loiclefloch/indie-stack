import { ListItemButton, ListItemIcon, ListItemText, Tooltip } from "@mui/material";
import { forwardRef, ReactEventHandler, ReactNode } from "react";
import { useSidebarState } from "~/hooks/useSidebarState";

type PropsType = {
	dense: boolean;
	href?: string | undefined;
	name: string;
	icon?: ReactNode;
	onClick?: ReactEventHandler;
}

const MenuItem = forwardRef<HTMLInputElement, PropsType>((props, ref) => {
	const { dense, href, name, icon, onClick } = props as PropsType
  const [sidebarIsOpen] = useSidebarState();

	const header = (
		<ListItemButton ref={ref} dense={dense} href={href} onClick={onClick}>
      <ListItemIcon>
					{icon}
      </ListItemIcon>
      <ListItemText primary={name} />
    </ListItemButton>
	)

	return sidebarIsOpen ? (
		header
	) : (
		<Tooltip title={name} placement="right">
			{header}
		</Tooltip>
	)
})

MenuItem.displayName = 'MenuItem'

export default MenuItem