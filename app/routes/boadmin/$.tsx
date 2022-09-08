// https://marmelab.com/react-admin/Remix.html
// https://marmelab.com/react-admin/Tutorial.html
import type { LoaderArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Link } from "@remix-run/react";

import { Admin, Resource  } from "react-admin";
// import { ReactQueryDevtools } from "react-query/devtools";

import boDataProvider from "~/utils/boDataProvider"

import UsersList from "~/components/boadmin/UsersList"
import UserEdit from "~/components/boadmin/UserEdit"
import UserShow from "~/components/boadmin/UserShow"

export async function loader({ request }: LoaderArgs) {
  return json({});
}

export default function AdminPage() {
  return (
    <>
      <Admin
        basename="/boadmin"
        dataProvider={boDataProvider("/api")}
        // layout={MyLayout}
      >
        <Resource
          name="users"
          edit={UserEdit}
          show={UserShow}
          list={UsersList}
        />
      </Admin>

      {/* <ReactQueryDevtools initialIsOpen={false} /> */}
    </>
  );
}
