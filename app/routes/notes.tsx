import type { LoaderArgs, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { NavLink, Outlet, useLoaderData } from "@remix-run/react";

import { Box, Button, Paper } from "@mui/material";
import { getNoteListItems } from "~/services/note.server";
import { requireUserId } from "~/services/session.server";
import { useUser } from "~/utils/routing";

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
