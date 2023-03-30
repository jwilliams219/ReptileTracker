type Method = "get" | "post" | "put" | "delete";

export class Api {
  private async makeRequest(
    url: string,
    method: Method,
    token: string,
    body?: Record<string, any>
  ) {
    const headers: Record<string, string> = {
      Authorization: `Bearer ${token}`,
    };

    if (method === "post" || method === "put") {
      headers["Content-Type"] = "application/json";
    }

    const options: RequestInit = {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    };

    const result = await fetch(url, options);
    return result.json();
  }

  get(url: string, token: string) {
    return this.makeRequest(url, "get", token);
  }

  post(url: string, token: string, body?: Record<string, any>) {
    return this.makeRequest(url, "post", token, body);
  }

  put(url: string, token: string, body?: Record<string, any>) {
    return this.makeRequest(url, "put", token, body);
  }

  delete(url: string, token: string) {
    return this.makeRequest(url, "delete", token);
  }
}