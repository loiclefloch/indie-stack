// https://marmelab.com/react-admin/Remix.html
// https://marmelab.com/react-admin/Tutorial.html
import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";

import { Admin, Resource  } from "react-admin";

import boDataProvider from "~/utils/boDataProvider"

import UsersList from "~/components/boadmin/UsersList"
import UserEdit from "~/components/boadmin/UserEdit"
import UserShow from "~/components/boadmin/UserShow"
import Layout from "~/components/reactadmin/layout/Layout";
import BoAdminMenu from "~/components/reactadmin/layout/BoAdminMenu";
import useTheme from "~/hooks/useTheme"

export async function loader({ request }: LoaderArgs) {
  return json({});
}

export default function AdminPage() {
  const theme = useTheme()
  
  return (
    <>
      <Admin
      	theme={theme}
        menu={BoAdminMenu}
        basename="/boadmin"
        dataProvider={boDataProvider("/api")}
        layout={Layout}
        title="Admin 2"
      >
        <Resource
          name="users"
          edit={UserEdit}
          show={UserShow}
          list={UsersList}
        />
      </Admin>
    </>
  );
}
