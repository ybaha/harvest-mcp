import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { harvestRequest } from "../harvest.js";

export function registerClientTools(server: McpServer) {
  server.registerTool(
    "list_clients",
    {
      description: "List all clients",
      inputSchema: {
        is_active: z.boolean().optional().describe("Filter by active status"),
        page: z.number().optional().describe("Page number"),
        per_page: z.number().optional().describe("Results per page"),
      },
    },
    async (params) => {
      const data = await harvestRequest("/clients", { params });
      return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
    }
  );

  server.registerTool(
    "get_client_details",
    {
      description: "Get details for a specific client",
      inputSchema: {
        client_id: z.number().describe("The client ID"),
      },
    },
    async ({ client_id }) => {
      const data = await harvestRequest(`/clients/${client_id}`);
      return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
    }
  );
}
