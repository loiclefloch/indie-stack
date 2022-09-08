import { Headers, json } from "@remix-run/node";
import type { LoaderFunction } from "@remix-run/node"; 

import { getUsers } from "~/models/user.server";

export const loader: LoaderFunction = async ({
  request: Request,
}) => {
  // handle "GET" request
	const users = await getUsers()

	const headers = new Headers()
	headers.set('Content-Range', users.length.toString())
	headers.set('Access-Control-Expose-Headers', 'Content-Range')

  return new Response(JSON.stringify(users), {
		status: 200,
		headers,
	});
};