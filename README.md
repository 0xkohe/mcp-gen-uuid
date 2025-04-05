# UUID MCP Server (Deno)

This MCP server provides a simple tool to generate Version 4 UUIDs. It is implemented using Deno.

## Features

*   Generates standard UUIDv4 strings.
*   Communicates using the Model Context Protocol (MCP).

## Tools

### `get_uuid`

Generates a new UUIDv4.

**Arguments:**

*   None

**Returns:**

*   MCP standard response containing the UUID as text content.

**Example Usage (via `use_mcp_tool`):**

```xml
<use_mcp_tool>
  <server_name>uuid-server</server_name>
  <tool_name>get_uuid</tool_name>
  <arguments>{}</arguments>
</use_mcp_tool>
```

**Example Response (Conceptual - SDK handles actual formatting):**

The server returns the UUID directly. The MCP client receives a standard `tool_result` message like this:

```json
{
  "protocol": "mcp",
  "version": 1,
  "id": "...", // Request ID
  "type": "tool_result",
  "result": {
    "content": [
      {
        "type": "text",
        "text": "f47ac10b-58cc-4372-a567-0e02b2c3d479" // The generated UUID
      }
    ]
  }
}
```

## Setup

1.  **Ensure Deno is installed:** Follow the instructions on the [official Deno website](https://deno.land/).
2.  **Register the server with MCP:**

    You can register this server using the command line or by adding it to your `settings.json`.

    **Command Line:**

    ```bash
    # From the directory containing the 'uuid-server' folder
    mcp install ./uuid-server/main.ts --name uuid-server --cmd "deno run -A ./uuid-server/main.ts"
    ```
    *(Adjust the path to `main.ts` if necessary)*

    **settings.json:**

    Add the following entry to your MCP server configurations:

    ```json
    {
      "mcpServers": {
        "uuid-server": {
          "command": "deno",
          "args": ["run", "-A", "./uuid-server/main.ts"], // Relative path is usually sufficient
          "disabled": false,
          "autoApprove": []
        }
        // ... other servers
      }
    }
    ```
    *(Ensure the path `./uuid-server/main.ts` is correct relative to your project root or adjust as needed)*

## Running

The MCP client (e.g., your IDE extension) will automatically start the server process when a tool request is made to `uuid-server`. Ensure Deno is in your system's PATH.# mcp-gen-uuid
