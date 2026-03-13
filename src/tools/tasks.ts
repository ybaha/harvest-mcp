import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { harvestRequest } from "../harvest.js";

export function registerTaskTools(server: McpServer) {
  server.registerTool(
    "list_tasks",
    {
      description: "List all tasks",
      inputSchema: {
        is_active: z.boolean().optional().describe("Filter by active status"),
        page: z.number().optional().describe("Page number"),
        per_page: z.number().optional().describe("Results per page"),
      },
    },
    async (params) => {
      const data = await harvestRequest("/tasks", { params });
      return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
    }
  );
}
