import { Server } from "npm:@modelcontextprotocol/sdk@1.5.0/server/index.js";
import { StdioServerTransport } from "npm:@modelcontextprotocol/sdk@1.5.0/server/stdio.js";
import {
  CallToolRequestSchema,
  ListResourcesRequestSchema,
  ListToolsRequestSchema,
  Tool,
  CallToolRequest,
  // Assuming CallToolResponse structure is handled by the SDK based on return value
} from "npm:@modelcontextprotocol/sdk@1.5.0/types.js";

// Define the get_uuid tool according to the SDK's Tool type
const GET_UUID_TOOL: Tool = {
  name: "get_uuid",
  description: "Generate a version 4 UUID",
  inputSchema: {
    type: "object",
    properties: {}, // No input arguments needed
    required: [],
  },
  // Optional: Define expected output structure
  outputSchema: {
      type: "object",
      properties: {
          uuid: { type: "string", description: "The generated v4 UUID" }
      },
      required: ["uuid"]
  }
};

const TOOLS: Tool[] = [GET_UUID_TOOL];

console.error("[uuid-server] Initializing MCP server using SDK...");

// Create the Server instance
const server = new Server(
  {
    // Metadata about this server
    name: "uuid-server",
    version: "0.1.0",
  },
  {
    // Declare the capabilities (tools and resources) provided
    capabilities: {
      resources: {}, // This server provides no resources
      tools: {
        get_uuid: GET_UUID_TOOL, // Register the tool by its name
      },
    },
  }
);

// --- Register Request Handlers ---

// Handler for ListResources requests
server.setRequestHandler(ListResourcesRequestSchema, () => {
  console.error("[uuid-server] Received ListResources request.");
  // Return an empty list as this server provides no resources
  return { resources: [] };
});

// Handler for ListTools requests
server.setRequestHandler(ListToolsRequestSchema, () => {
  console.error("[uuid-server] Received ListTools request.");
  // Return the list of tools this server provides
  return { tools: TOOLS };
});

// Handler for CallTool requests
server.setRequestHandler(CallToolRequestSchema, (request: CallToolRequest) => {
  console.error(`[uuid-server] Received CallTool request: ${JSON.stringify(request.params)}`);
  const toolName = request.params.name;
  // Arguments are not needed for get_uuid, but could be accessed via request.params.arguments

  switch (toolName) {
    case "get_uuid": {
      try {
        // Generate the UUID
        const uuid = crypto.randomUUID();
        console.error(`[uuid-server] Generated UUID: ${uuid}`);

        // Return the successful result payload.
        // The SDK will wrap this in the standard MCP response structure.
        // The structure should align with the conceptual output of the tool.
        // Return the successful result payload within the 'content' array.
        // The SDK expects the content to be structured according to the MCP spec.
        return {
          content: [{ type: "text", text: uuid }] // Return UUID as plain text in content
        };
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        console.error(`[uuid-server] Error generating UUID: ${errorMessage}`);

        // Return an error structure. The SDK should format this correctly.
        // Based on the provided example, returning an object with isError: true
        // and a content array seems to be the pattern for signaling errors.
        return {
          content: [{ type: "text", text: `Failed to generate UUID: ${errorMessage}` }],
          isError: true,
        };
        // Alternative (might depend on SDK version/implementation):
        // throw new Error(`Failed to generate UUID: ${errorMessage}`);
      }
    }
    default: {
      // Handle requests for unknown tools
      console.error(`[uuid-server] Unknown tool requested: ${toolName}`);
      return {
        content: [{ type: "text", text: `Unknown tool: ${toolName}` }],
        isError: true,
      };
    }
  }
});

// --- Start the Server ---
async function startServer() {
  try {
    // Connect the server using Standard Input/Output transport
    await server.connect(new StdioServerTransport());
    console.error("[uuid-server] MCP server connected via stdio and is running.");
  } catch (error) {
    console.error(`[uuid-server] Failed to start or connect the server: ${error}`);
    // Exit if the server cannot start, indicating a critical failure
    Deno.exit(1);
  }
}

// Execute the server startup logic
startServer();

// The server.connect() method with StdioServerTransport should keep the process
// running and listening for messages on stdin. No explicit keep-alive needed.