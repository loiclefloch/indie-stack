import type { LoaderArgs, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, Link, NavLink, Outlet, useLoaderData } from "@remix-run/react";

import { requireUserId } from "~/session.server";
import { useUser } from "~/utils/utils";
import { getNoteListItems } from "~/models/note.server";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";

export async function loader({ request }: LoaderArgs) {
  const userId = await requireUserId(request);
  const noteListItems = await getNoteListItems({ userId });
  return json({ noteListItems });
}

export const meta: MetaFunction = () => {
  return {
    title: "Notes",
  };
};


export default function NotesPage() {
  const data = useLoaderData<typeof loader>();
  const user = useUser();

  return (
    <div>
      <main>
        <div>
          <Button to="new">
            + New Note
          </Button>

          <hr />

          {data.noteListItems.length === 0 ? (
            <p>No notes yet</p>
          ) : (
            <ol>
              {data.noteListItems.map((note) => (
                <li key={note.id}>
                  <NavLink
                    // className={({ isActive }) =>
                    //   `block border-b p-4 text-xl ${isActive ? "bg-white" : ""}`
                    // }
                    to={note.id}
                  >
                    📝 {note.title}
                  </NavLink>
                </li>
              ))}
            </ol>
          )}
        </div>

        <Paper>
          <Box sx={{ padding: 6 }}>
            <Outlet />
          </Box>
        </Paper>
      </main>
    </div>
  );
}
