import * as React from "react";
import type {
  LoaderFunction,
} from "@remix-run/node";
import { json } from "@remix-run/node";
import { getUserById } from "~/services/user.server";
import { useLoaderData } from "@remix-run/react";
import { Typography } from "@mui/material";
import RouteDrawer, { RouteDrawerCatchBoundary } from "~/components/layout/RouteDrawer";
import { notFound } from "~/utils/responses";

export const loader: LoaderFunction = async ({ params }) => {
  const userId = params.userId;
  if (!userId) throw notFound("User not found")

  const user = await getUserById(userId as string);
  
  if (!user) throw notFound("User not found")

  return json(user);
};

export default function UserShow() {
  const user = useLoaderData<typeof loader>();

  return (
    <RouteDrawer redirectTo="/users">
      <h3>User</h3>

      {!user && <Typography component="p">User not found</Typography>}

      <Typography component="p">
        {user.id} {user.email}
      </Typography>
    </RouteDrawer>
  );
}

export function CatchBoundary() {
 return <RouteDrawerCatchBoundary redirectTo="/users" />
}
