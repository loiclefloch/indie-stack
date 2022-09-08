// https://marmelab.com/react-admin/Remix.html
// https://marmelab.com/react-admin/Tutorial.html
import type { LoaderArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Link } from "@remix-run/react";

import { Admin, Resource, ListGuesser } from "react-admin";
import jsonServerProvider from "ra-data-json-server";

import Layout from "~/components/reactadmin/layout/Layout";
import useTheme from "~/hooks/useTheme"
import { requireUser } from "~/services/session.server";

export async function loader({ request }: LoaderArgs) {
  await requireUser(request)
  return json({});
}

const dataProvider = jsonServerProvider("https://jsonplaceholder.typicode.com");

export default function AdminPage() {
  const theme = useTheme()

  return (
    <>
      <Admin basename="/admin" dataProvider={dataProvider} layout={Layout} theme={theme}>
        <Resource name="posts" list={ListGuesser} />
        <Resource name="comments" list={ListGuesser} />
        <Resource name="users" list={ListGuesser} />
      </Admin>
    </>
  );
}
