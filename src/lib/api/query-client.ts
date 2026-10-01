import { QueryClient, isServer } from "@tanstack/react-query";

import { isApiError } from "./errors";

function makeQueryClientOptions() {
  return {
    defaultOptions: {
      queries: {
        staleTime: 60_000,
        refetchOnWindowFocus: false,
        retry: (failureCount: number, error: unknown) => {
          if (isApiError(error) && error.status >= 400 && error.status < 500) {
            return false;
          }

          return failureCount < 1;
        },
      },
    },
  };
}

let browserQueryClient: QueryClient | undefined;

export function makeQueryClient() {
  return new QueryClient(makeQueryClientOptions());
}

export function getQueryClient() {
  if (isServer) {
    return makeQueryClient();
  }

  if (!browserQueryClient) {
    browserQueryClient = makeQueryClient();
  }

  return browserQueryClient;
}
