import * as React from "react";
import type {
  ActionFunction,
  LoaderFunction,
} from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import { getUserById } from "~/models/user.server";
import { useLoaderData, useNavigate } from "@remix-run/react";

export const loader: LoaderFunction = async ({ params }) => {
  const userId = params.userId;
  if (!userId) return null;

  const user = getUserById(userId as string);

  return json(user);
};

export const action: ActionFunction = async ({ request }) => {
  // Here we can update our database with the updated invoice

  // Redirect back to invoice list
  return redirect("/dashboard");
};

export default function UserShow() {
  const navigate = useNavigate();
  const user = useLoaderData<typeof loader>();

  function onClose() {
    navigate("/users");
  }

  function onOpen() {
    navigate("/users");
  }

  return (
    <SwipeableDrawer anchor="right" open onClose={onClose} onOpen={onOpen}>
      <h3>User</h3>

      {user.id} {user.email}
    </SwipeableDrawer>
  );
}
