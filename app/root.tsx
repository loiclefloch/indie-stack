// based on https://github.com/mui/material-ui/blob/master/examples/remix-with-typescript/app/root.tsx
import { useContext, useMemo } from 'react';
import { ActionFunction, LinksFunction, LoaderArgs, MetaFunction, redirect } from "@remix-run/node";
import { json } from "@remix-run/node";
import {
  Link as RmxLink,
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useCatch,
} from "@remix-run/react";
import { useLoaderData } from "@remix-run/react";
import { getUser } from "./session.server";
import { ThemeProvider, withEmotionCache } from '@emotion/react';
import Layout from './src/Layout';
import { getUserTheme, themeCookie } from './utils/theme.server';
import { getTheme, ThemeNames } from './themes';
import ClientStyleContext from "~/context/ClientStyleContext";
import { DEFAULT_THEME } from './constants';
import useEnhancedEffect from './hooks/useEnhancedEffect';
import { CssBaseline, Typography, Link as MuiLink } from '@mui/material';

export const links: LinksFunction = () => {
  return [];
};

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: "",
  viewport: "width=device-width,initial-scale=1",
});

export async function loader({ request }: LoaderArgs) {
  return json({
    user: await getUser(request),
    themeName: await getUserTheme(request),
  });
}

/**
 * Toggle theme based on the current theme in the cookie
 */
 export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData();
  // Get the redirectBack url from the hidden input that was submitted with the form
  const redirectBack = String(form.get("redirectBack"));

  const currentTheme = await getUserTheme(request);
  const newTheme: ThemeNames = currentTheme === "dark" ? "light" : "dark";

  return redirect(redirectBack || "/", {
    headers: {
      "Set-Cookie": await themeCookie.serialize(newTheme)
    }
  });
};

type DocumentProps = {
  children: React.ReactNode;
  title?: string;
  themeName?: ThemeNames;
};
const Document = withEmotionCache(({ children, title, themeName: propThemeName }: DocumentProps, emotionCache) => {
  const clientStyleData = useContext(ClientStyleContext);
  const loaderData = useLoaderData<RootLoaderData>();

  // not using useTheme yet, to use loaderData.
  // maybe we could access it from useTheme using useMatchesData("root")?
  let themeName: ThemeNames = useMemo(() => {
    return (
      propThemeName ||
      loaderData?.themeName ||
      clientStyleData.themeName ||
      DEFAULT_THEME
    );
  }, [loaderData, clientStyleData, propThemeName]);

  const theme = getTheme(themeName);

  // Only executed on client
  useEnhancedEffect(() => {
    // re-link sheet container
    emotionCache.sheet.container = document.head;
    // re-inject tags
    const tags = emotionCache.sheet.tags;
    emotionCache.sheet.flush();
    tags.forEach((tag) => {
      // eslint-disable-next-line no-underscore-dangle
      (emotionCache.sheet as any)._insertTag(tag);
    });
    // reset cache to reapply global styles
    clientStyleData.reset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Only executed on client
  useEnhancedEffect(() => {
    // change the theme in style context
    clientStyleData.setThemeName(themeName);
  }, [themeName]);

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <meta name="theme-color" content={theme.palette.primary.main} />
        {title ? <title>{title}</title> : null}
        <Meta />
        <Links />

        {/* NOTE: Very important meta tag */}
        {/* because using this, css is re-inserted in entry.server.tsx */}
        <meta
          name="emotion-insertion-point"
          content="emotion-insertion-point"
        />

        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
        />
      </head>
      <body>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          {children}
        </ThemeProvider>
        <ScrollRestoration />
        <Scripts />

        {process.env.NODE_ENV === "development" && <LiveReload />}
      </body>
    </html>
  );
})

// https://remix.run/api/conventions#default-export
// https://remix.run/api/conventions#route-filenames
export default function App() {
  const data = useLoaderData();

  return (
    <Document>
      <Layout isLoggedIn={!!data.user}>
        <Outlet />
      </Layout>
    </Document>
  );
}

// https://remix.run/docs/en/v1/api/conventions#errorboundary
export function ErrorBoundary({ error }: { error: Error }) {
  const errorMessage = JSON.parse(error.message);

  console.error(error);

  return (
    <Document title="Error!" themeName={errorMessage.themeName}>
      <Layout isLoggedIn={errorMessage.isLoggedIn}>
        <Typography variant="h4" component="h1">
          Root ErrorBoundary
        </Typography>
        <Typography component="pre" variant="inherit">
          {errorMessage.message || error.message}
        </Typography>
        <Typography component="p">The stack trace is:</Typography>
        <Typography component="pre" variant="inherit">
          <Typography component="code" variant="inherit">
            {error.stack}
          </Typography>
        </Typography>
        <MuiLink component={RmxLink} to="/">
          Go to Home
        </MuiLink>
      </Layout>
    </Document>
  );
}

// https://remix.run/docs/en/v1/api/conventions#catchboundary
export function CatchBoundary() {
  const caught = useCatch();

  let message;
  switch (caught.status) {
    case 401:
      message = <p>Oops! Looks like you tried to visit a page that you do not have access to.</p>;
      break;
    case 404:
      message = <p>Oops! Looks like you tried to visit a page that does not exist.</p>;
      break;

    default:
      throw new Error(caught.data || caught.statusText);
  }

  return (
    <Document title={`${caught.status} ${caught.statusText}`} themeName={caught.data?.themeName}>
      <Layout isLoggedIn={caught.data?.isLoggedIn}>
        <h1>
          {caught.status}: {caught.statusText}
        </h1>
        {message}
      </Layout>
    </Document>
  );
}
