import { QueryClient, QueryFunction } from "@tanstack/react-query";

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
): Promise<Response> {
  // Check if data is FormData to handle file uploads correctly
  const isFormData = data instanceof FormData;
  
  console.log(`API Request: ${method} ${url}`);
  console.log("Is FormData:", isFormData);
  
  // Create headers object - either with Content-Type or empty
  const headers: Record<string, string> = {};
  if (data && !isFormData) {
    headers["Content-Type"] = "application/json";
  }
  
  const requestOptions: RequestInit = {
    method,
    headers,
    // Don't stringify FormData objects
    body: data 
      ? isFormData 
        ? data
        : JSON.stringify(data)
      : undefined,
    credentials: "include" as RequestCredentials,
  };
  
  console.log("Request options:", {
    method: requestOptions.method,
    headers: requestOptions.headers,
    hasBody: !!requestOptions.body,
    credentials: requestOptions.credentials
  });
  
  try {
    const res = await fetch(url, requestOptions);
    console.log(`Response status: ${res.status} ${res.statusText}`);
    
    // Get headers as an object for logging
    const responseHeaders: Record<string, string> = {};
    res.headers.forEach((value, key) => {
      responseHeaders[key] = value;
    });
    console.log("Response headers:", responseHeaders);
    
    await throwIfResNotOk(res);
    return res;
  } catch (error) {
    console.error("API request error:", error);
    throw error;
  }
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    const res = await fetch(queryKey[0] as string, {
      credentials: "include",
    });

    if (unauthorizedBehavior === "returnNull" && res.status === 401) {
      return null;
    }

    await throwIfResNotOk(res);
    return await res.json();
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});
