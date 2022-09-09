// based on https://github.com/mui/material-ui/blob/master/examples/remix-with-typescript/app/root.tsx
import { useContext, useMemo, useEffect } from "react";
import nProgressStyles from "nprogress/nprogress.css";

import {
  ActionFunction,
  LinksFunction,
  LoaderArgs,
  MetaFunction,
  redirect,
} from "@remix-run/node";
import {
  Link as RmxLink,
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useCatch,
  useFetchers,
  useTransition,
} from "@remix-run/react";
import { useLoaderData } from "@remix-run/react";
import { commitSession, getSession, getUser } from "./services/session.server";
import { ThemeProvider, withEmotionCache } from "@emotion/react";
import Layout from "~/components/layout/Layout";
import { getUserTheme, themeCookie } from "./utils/theme.server";
import { getTheme } from "./themes";
import ClientStyleContext from "~/contexts/ClientStyleContext";
import { DEFAULT_THEME, ThemeNames } from "./constants";
import useEnhancedEffect from "./hooks/useEnhancedEffect";
import { CssBaseline, Typography, Link as MuiLink, Box } from "@mui/material";
import type { User } from "~/services/user.server";
import { AuthenticityTokenProvider } from "~/components/csrf";
import { createAuthenticityToken } from "./utils/csrf.server";
// import { getClientIPAddress } from "~/services/clientip.server"
import { json } from "@remix-run/node";
import type { Locales } from "./services/request.server";
import { getClientLocales } from "./services/request.server";
import { logger } from "~/services/logger";
import { LoadingBar } from "~/components/layout/LoadingBar"
import { StoreContextProvider, localStorageStore } from '~/modules/stores';

export type RootLoaderData = {
  user: User | null;
  themeName: ThemeNames;
  csrf: string;
  locales: Locales;
};

export async function loader({ request }: LoaderArgs) {
  const session = await getSession(request);
  const token = createAuthenticityToken(session);

  // let ipAddress = getClientIPAddress(request);

  // console.log({ ipAddress })

  logger.info({
    token,
    session: session.get("csrf"),
    // ipAddress
  });

  return json<RootLoaderData>(
    {
      csrf: token, // https://github.com/sergiodxa/remix-utils
      user: await getUser(request),
      themeName: await getUserTheme(request),
      locales: getClientLocales(request),
    },
    { headers: { "Set-Cookie": await commitSession(session) } }
  );
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
      "Set-Cookie": await themeCookie.serialize(newTheme),
    },
  });
};

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: nProgressStyles }];
};

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: "",
  viewport: "width=device-width,initial-scale=1",
});

type DocumentProps = {
  children: React.ReactNode;
  title?: string;
  themeName?: ThemeNames;
};
const Document = withEmotionCache(
  (
    {
      children,
      title,
      themeName: propThemeName,
      themeName: loaderDataThemeName,
    }: DocumentProps,
    emotionCache
  ) => {
    const transition = useTransition();
    const fetchers = useFetchers();

    /**
     * This gets the state of every fetcher active on the app and combine it with
     * the state of the global transition (Link and Form), then use them to
     * determine if the app is idle or if it's loading.
     * Here we consider both loading and submitting as loading.
     */
    const loadingState = useMemo<"idle" | "loading">(
      function getGlobalState() {
        let states = [
          transition.state,
          ...fetchers.map((fetcher) => fetcher.state),
        ];
        if (states.every((state) => state === "idle")) return "idle";
        return "loading";
      },
      [transition.state, fetchers]
    );
    // const isLoading = true
    const isLoading = loadingState === "loading"

    const clientStyleData = useContext(ClientStyleContext);

    // not using useTheme yet, to use loaderData.
    // maybe we could access it from useTheme using useRouteData("root")?
    const themeName: ThemeNames = useMemo(() => {
      return (
        propThemeName ||
        loaderDataThemeName ||
        clientStyleData.themeName ||
        DEFAULT_THEME
      );
    }, [loaderDataThemeName, clientStyleData, propThemeName]);

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
          <StoreContextProvider value={localStorageStore()}> 
            <ThemeProvider theme={theme}>
              <CssBaseline />

              <LoadingBar isLoading={isLoading} />

              {children}
            </ThemeProvider>
          </StoreContextProvider>
          <ScrollRestoration />
          <Scripts />
          {process.env.NODE_ENV === "development" && <LiveReload />}
        </body>
      </html>
    );
  }
);

// https://remix.run/api/conventions#default-export
// https://remix.run/api/conventions#route-filenames
export default function App() {
  const { csrf, user, themeName } = useLoaderData<typeof loader>();

  logger.info({ csrf });

  return (
    <AuthenticityTokenProvider token={csrf}>
      <Document themeName={themeName}>
        <Layout isLoggedIn={!!user}>
          <Outlet />
        </Layout>
      </Document>
    </AuthenticityTokenProvider>
  );
}

function parse(error: Error) {
  try {
    return JSON.parse(error.message);
  } catch (e) {}
  return error;
}

// https://remix.run/docs/en/v1/api/conventions#errorboundary
export function ErrorBoundary({ error }: { error: Error }) {
  logger.error(error);

  const errorMessage = parse(error);

  return (
    <Document title="Error!" themeName={errorMessage.themeName}>
      <Layout isLoggedIn={errorMessage.isLoggedIn}>
        <Box sx={{ padding: 2 }}>
          <Typography variant="h4" component="h1">
            An error occured
          </Typography>

          <Box sx={{ marginTop: 4 }}>
            <Typography
              component="pre"
              variant="inherit"
              sx={{ color: "error.main" }}
            >
              {errorMessage.message || error.message}
            </Typography>
          </Box>

          {/* TODO: toggle on non-dev env? */}
          <Box sx={{ marginTop: 4 }}>
            <Typography component="pre" variant="inherit">
              <Typography component="code" variant="inherit">
                {error.stack}
              </Typography>
            </Typography>
          </Box>

          <Box sx={{ marginTop: 4 }}>
            <MuiLink component={RmxLink} to="/">
              Go to Home
            </MuiLink>
          </Box>
        </Box>
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
      message = (
        <p>
          Oops! Looks like you tried to visit a page that you do not have access
          to.
        </p>
      );
      break;
    case 404:
      message = (
        <p>Oops! Looks like you tried to visit a page that does not exist.</p>
      );
      break;

    default:
      throw new Error(caught.data || caught.statusText);
  }

  return (
    <Document
      title={`${caught.status} ${caught.statusText}`}
      themeName={caught.data?.themeName}
    >
      <Layout isLoggedIn={caught.data?.isLoggedIn}>
        <h1>
          {caught.status}: {caught.statusText}
        </h1>
        {message}
      </Layout>
    </Document>
  );
}
