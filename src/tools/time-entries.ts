import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { harvestRequest } from "../harvest.js";

export function registerTimeEntryTools(server: McpServer) {
  server.registerTool(
    "list_time_entries",
    {
      description: "List time entries with optional filters",
      inputSchema: {
        user_id: z.number().optional().describe("Filter by user ID"),
        client_id: z.number().optional().describe("Filter by client ID"),
        project_id: z.number().optional().describe("Filter by project ID"),
        task_id: z.number().optional().describe("Filter by task ID"),
        is_billed: z.boolean().optional().describe("Filter by billed status"),
        is_running: z.boolean().optional().describe("Filter by running status"),
        approval_status: z.string().optional().describe("Filter by approval status"),
        external_reference_id: z.string().optional().describe("Filter by external reference ID"),
        updated_since: z.string().optional().describe("Only entries updated after this datetime (ISO 8601)"),
        from_date: z.string().optional().describe("Start date (YYYY-MM-DD)"),
        to_date: z.string().optional().describe("End date (YYYY-MM-DD)"),
        page: z.number().optional().describe("Page number"),
        per_page: z.number().optional().describe("Results per page (max 2000)"),
      },
    },
    async (params) => {
      const data = await harvestRequest("/time_entries", { params });
      return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
    }
  );

  server.registerTool(
    "get_time_entry",
    {
      description: "Get a single time entry by ID",
      inputSchema: {
        time_entry_id: z.number().describe("The time entry ID"),
      },
    },
    async ({ time_entry_id }) => {
      const data = await harvestRequest(`/time_entries/${time_entry_id}`);
      return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
    }
  );

  server.registerTool(
    "create_time_entry",
    {
      description: "Create a new time entry (use hours for a fixed entry, or omit hours to start a running timer)",
      inputSchema: {
        project_id: z.number().describe("Project ID"),
        task_id: z.number().describe("Task ID"),
        spent_date: z.string().describe("Date (YYYY-MM-DD)"),
        hours: z.number().optional().describe("Hours worked (omit to start a running timer)"),
        notes: z.string().optional().describe("Notes"),
        user_id: z.number().optional().describe("User ID (defaults to authenticated user)"),
      },
    },
    async (params) => {
      const data = await harvestRequest("/time_entries", { method: "POST", body: params as Record<string, unknown> });
      return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
    }
  );

  server.registerTool(
    "update_time_entry",
    {
      description: "Update an existing time entry",
      inputSchema: {
        time_entry_id: z.number().describe("The time entry ID to update"),
        project_id: z.number().optional().describe("New project ID"),
        task_id: z.number().optional().describe("New task ID"),
        spent_date: z.string().optional().describe("New date (YYYY-MM-DD)"),
        hours: z.number().optional().describe("New hours"),
        notes: z.string().optional().describe("New notes"),
      },
    },
    async ({ time_entry_id, ...body }) => {
      const data = await harvestRequest(`/time_entries/${time_entry_id}`, { method: "PATCH", body });
      return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
    }
  );

  server.registerTool(
    "delete_time_entry",
    {
      description: "Delete a time entry",
      inputSchema: {
        time_entry_id: z.number().describe("The time entry ID to delete"),
      },
    },
    async ({ time_entry_id }) => {
      const data = await harvestRequest(`/time_entries/${time_entry_id}`, { method: "DELETE" });
      return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
    }
  );

  server.registerTool(
    "start_timer",
    {
      description: "Start a running timer for today",
      inputSchema: {
        project_id: z.number().describe("Project ID"),
        task_id: z.number().describe("Task ID"),
        notes: z.string().optional().describe("Notes"),
      },
    },
    async ({ project_id, task_id, notes }) => {
      const today = new Date().toISOString().slice(0, 10);
      const data = await harvestRequest("/time_entries", {
        method: "POST",
        body: { project_id, task_id, spent_date: today, notes },
      });
      return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
    }
  );

  server.registerTool(
    "stop_timer",
    {
      description: "Stop a running timer",
      inputSchema: {
        time_entry_id: z.number().describe("The time entry ID of the running timer"),
      },
    },
    async ({ time_entry_id }) => {
      const data = await harvestRequest(`/time_entries/${time_entry_id}/stop`, { method: "PATCH" });
      return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
    }
  );

  server.registerTool(
    "restart_timer",
    {
      description: "Restart a stopped timer",
      inputSchema: {
        time_entry_id: z.number().describe("The time entry ID to restart"),
      },
    },
    async ({ time_entry_id }) => {
      const data = await harvestRequest(`/time_entries/${time_entry_id}/restart`, { method: "PATCH" });
      return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
    }
  );

  server.registerTool(
    "get_unsubmitted_timesheets",
    {
      description: "Get time entries that have not been submitted (is_closed=false)",
      inputSchema: {
        user_id: z.number().optional().describe("User ID"),
        from_date: z.string().optional().describe("Start date (YYYY-MM-DD)"),
        to_date: z.string().optional().describe("End date (YYYY-MM-DD)"),
        page: z.number().optional().describe("Page number"),
        per_page: z.number().optional().describe("Results per page"),
      },
    },
    async (params) => {
      const data = await harvestRequest("/time_entries", { params }) as { time_entries: unknown[] };
      const entries = data.time_entries ?? [];
      const unsubmitted = entries.filter((e: unknown) => !(e as Record<string, unknown>).is_closed);
      return {
        content: [{ type: "text", text: JSON.stringify({ time_entries: unsubmitted, total: unsubmitted.length }, null, 2) }],
      };
    }
  );
}
