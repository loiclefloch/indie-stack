// based on https://github.com/mui/material-ui/blob/master/examples/remix-with-typescript/app/entry.server.tsx
import * as React from 'react';
import { renderToString } from 'react-dom/server';
import { PassThrough } from "stream";
import type { EntryContext } from "@remix-run/node"
import { Response } from "@remix-run/node";
import { RemixServer } from "@remix-run/react";
import isbot from "isbot";
import { renderToPipeableStream } from "react-dom/server";
import createEmotionCache from './utils/createEmotionCache';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import { CacheProvider } from '@emotion/react';
import createEmotionServer from '@emotion/server/create-instance';
import { getUserTheme, themeCookie } from '~/utils/theme.server';
import { getTheme } from '~/themes';

// const ABORT_DELAY = 5000;

export default async function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext
) {
  // const callbackName = isbot(request.headers.get("user-agent"))
  //   ? "onAllReady"
  //   : "onShellReady";

    const cache = createEmotionCache();
    const { extractCriticalToChunks } = createEmotionServer(cache);

    const userTheme = await getUserTheme(request);
    const theme = getTheme(userTheme);
  
    const MuiRemixServer = () => (
      <CacheProvider value={cache}>
        <ThemeProvider theme={theme}>
          {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
          <CssBaseline />
          <RemixServer context={remixContext} url={request.url} />
        </ThemeProvider>
      </CacheProvider>
    );
  
    // Render the component to a string.
    const html = renderToString(<MuiRemixServer />);
  
    // Grab the CSS from emotion
    const { styles } = extractCriticalToChunks(html);
  
    let stylesHTML = '';
  
    styles.forEach(({ key, ids, css }) => {
      const emotionKey = `${key} ${ids.join(' ')}`;
      const newStyleTag = `<style data-emotion="${emotionKey}">${css}</style>`;
      stylesHTML = `${stylesHTML}${newStyleTag}`;
    });
  
    // Add the Emotion style tags after the insertion point meta tag
    const markup = html.replace(
      /<meta(\s)*name="emotion-insertion-point"(\s)*content="emotion-insertion-point"(\s)*\/>/,
      `<meta name="emotion-insertion-point" content="emotion-insertion-point"/>${stylesHTML}`,
    );

  responseHeaders.set('Content-Type', 'text/html');
  responseHeaders.set("Set-Cookie", await themeCookie.serialize(userTheme));

  return new Response(`<!DOCTYPE html>${markup}`, {
    status: responseStatusCode,
    headers: responseHeaders,
  });

  // return new Promise((resolve, reject) => {
  //   let didError = false;

  //   const { pipe, abort } = renderToPipeableStream(
  //     markup,
  //     // <RemixServer context={remixContext} url={request.url} />,
  //     {
  //       [callbackName]: () => {
  //         const body = new PassThrough();

  //         responseHeaders.set("Content-Type", "text/html");

  //         resolve(
  //           new Response(body, {
  //             headers: responseHeaders,
  //             status: didError ? 500 : responseStatusCode,
  //           })
  //         );

  //         pipe(body);
  //       },
  //       onShellError: (err: unknown) => {
  //         reject(err);
  //       },
  //       onError: (error: unknown) => {
  //         didError = true;

  //         console.error(error);
  //       },
  //     }
  //   );

  //   setTimeout(abort, ABORT_DELAY);
  // });
}
