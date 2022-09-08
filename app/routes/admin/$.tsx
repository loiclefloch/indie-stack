// https://marmelab.com/react-admin/Remix.html
// https://marmelab.com/react-admin/Tutorial.html
import type { LoaderArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Link } from "@remix-run/react";

import { Admin, Resource, ListGuesser } from "react-admin";
import jsonServerProvider from "ra-data-json-server";

export async function loader({ request }: LoaderArgs) {
  return json({});
}

const dataProvider = jsonServerProvider("https://jsonplaceholder.typicode.com");

export default function AdminPage() {
  return (
    <>
      <Admin basename="/admin" dataProvider={dataProvider}>
        <Resource name="posts" list={ListGuesser} />
        <Resource name="comments" list={ListGuesser} />
        <Resource name="users" list={ListGuesser} />
      </Admin>
    </>
  );
}
