import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { harvestRequest } from "../harvest.js";

export function registerUserTools(server: McpServer) {
  server.registerTool(
    "list_users",
    {
      description: "List all users",
      inputSchema: {
        is_active: z.boolean().optional().describe("Filter by active status"),
        page: z.number().optional().describe("Page number"),
        per_page: z.number().optional().describe("Results per page"),
      },
    },
    async (params) => {
      const data = await harvestRequest("/users", { params });
      return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
    }
  );

  server.registerTool(
    "get_user_details",
    {
      description: "Get details for a specific user",
      inputSchema: {
        user_id: z.number().describe("The user ID"),
      },
    },
    async ({ user_id }) => {
      const data = await harvestRequest(`/users/${user_id}`);
      return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
    }
  );

  server.registerTool(
    "list_project_assignments",
    {
      description: "List project assignments for a user — shows which project/task combos are available",
      inputSchema: {
        user_id: z.number().optional().describe("User ID (defaults to authenticated user via /users/me)"),
        is_active: z.boolean().optional().describe("Filter by active status"),
        page: z.number().optional().describe("Page number"),
        per_page: z.number().optional().describe("Results per page"),
      },
    },
    async ({ user_id, ...params }) => {
      const uid = user_id ?? "me";
      const data = await harvestRequest(`/users/${uid}/project_assignments`, { params });
      return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
    }
  );
}
