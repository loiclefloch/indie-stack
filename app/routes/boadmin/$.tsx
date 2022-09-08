// https://marmelab.com/react-admin/Remix.html
// https://marmelab.com/react-admin/Tutorial.html
import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";

import { Admin, Resource } from "react-admin";

import boDataProvider from "~/utils/boDataProvider";

import UserEdit from "~/components/boadmin/UserEdit";
import UserShow from "~/components/boadmin/UserShow";
import UsersList from "~/components/boadmin/UsersList";
import BoAdminMenu from "~/components/reactadmin/layout/BoAdminMenu";
import Layout from "~/components/reactadmin/layout/Layout";
import useTheme from "~/hooks/useTheme";
import { requireUser } from "~/services/session.server";

export async function loader({ request }: LoaderArgs) {
  await requireUser(request);

  return json({});
}

export default function AdminPage() {
  const theme = useTheme();

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
