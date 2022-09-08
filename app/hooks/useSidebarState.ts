// https://github.com/marmelab/react-admin/blob/master/packages/ra-ui-materialui/src/layout/useSidebarState.ts
import { useStore } from 'react-admin'; // TODO: use our own?

/**
 * A hook that returns the sidebar open state and a function to toggle it.
 *
 * @example
 * const ToggleSidebar = () => {
 *     const [open, setOpen] = useSidebarState();
 *     return (
 *         <Button onClick={() => setOpen(!open)}>
 *             {open ? 'Open' : 'Close'}
 *         </Button>
 *     );
 * };
 */
export const useSidebarState = (defaultValue: boolean = true): useSidebarStateResult =>
    useStore<boolean>('sidebar.open', defaultValue);

export type useSidebarStateResult = [boolean, (open: boolean) => void];