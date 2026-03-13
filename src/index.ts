import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { registerTimeEntryTools } from "./tools/time-entries.js";
import { registerProjectTools } from "./tools/projects.js";
import { registerClientTools } from "./tools/clients.js";
import { registerTaskTools } from "./tools/tasks.js";
import { registerUserTools } from "./tools/users.js";

const server = new McpServer({
  name: "harvest-mcp",
  version: "1.0.0",
});

registerTimeEntryTools(server);
registerProjectTools(server);
registerClientTools(server);
registerTaskTools(server);
registerUserTools(server);

const transport = new StdioServerTransport();
await server.connect(transport);
