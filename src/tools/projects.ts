import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { harvestRequest } from "../harvest.js";

export function registerProjectTools(server: McpServer) {
  server.registerTool(
    "list_projects",
    {
      description: "List all projects",
      inputSchema: {
        client_id: z.number().optional().describe("Filter by client ID"),
        is_active: z.boolean().optional().describe("Filter by active status"),
        page: z.number().optional().describe("Page number"),
        per_page: z.number().optional().describe("Results per page"),
      },
    },
    async (params) => {
      const data = await harvestRequest("/projects", { params });
      return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
    }
  );

  server.registerTool(
    "get_project_details",
    {
      description: "Get details for a specific project",
      inputSchema: {
        project_id: z.number().describe("The project ID"),
      },
    },
    async ({ project_id }) => {
      const data = await harvestRequest(`/projects/${project_id}`);
      return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
    }
  );
}
