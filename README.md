# harvest-mcp

A Model Context Protocol (MCP) server for the [Harvest](https://www.getharvest.com/) time tracking API, built with Bun and TypeScript. Provides 17 tools covering time entries, projects, clients, tasks, users, and project assignments — including operations missing from other Harvest MCP implementations such as updating, deleting, and restarting timers.

## Requirements

- [Bun](https://bun.sh) v1.0 or later
- A Harvest account with a [Personal Access Token](https://id.getharvest.com/developers)

## Installation

```bash
git clone https://github.com/ybaha/harvest-mcp.git
cd harvest-mcp
bun install
```

## Configuration

Set the following environment variables:

| Variable | Description |
|----------|-------------|
| `HARVEST_ACCOUNT_ID` | Your Harvest account ID (found on the developer token page) |
| `HARVEST_API_KEY` | Your Harvest personal access token |

## Claude Code Setup

Add the following to your `~/.claude.json` under `mcpServers`:

```json
"harvest": {
  "type": "stdio",
  "command": "bun",
  "args": ["run", "/path/to/harvest-mcp/src/index.ts"],
  "env": {
    "HARVEST_ACCOUNT_ID": "your_account_id",
    "HARVEST_API_KEY": "your_api_key"
  }
}
```

Restart Claude Code after updating the config.

## Tools

### Time Entries

| Tool | Description |
|------|-------------|
| `list_time_entries` | List time entries with filters: user, client, project, task, date range, billed status, running status, approval status, pagination |
| `get_time_entry` | Get a single time entry by ID |
| `create_time_entry` | Create a time entry; omit `hours` to start a running timer |
| `update_time_entry` | Update project, task, date, hours, or notes on an existing entry |
| `delete_time_entry` | Delete a time entry by ID |
| `start_timer` | Start a running timer for today |
| `stop_timer` | Stop a running timer |
| `restart_timer` | Restart a previously stopped timer |
| `get_unsubmitted_timesheets` | List time entries that have not been submitted (`is_closed=false`) |

### Projects

| Tool | Description |
|------|-------------|
| `list_projects` | List projects with optional client and active filters |
| `get_project_details` | Get full details for a specific project |

### Clients

| Tool | Description |
|------|-------------|
| `list_clients` | List clients with optional active filter |
| `get_client_details` | Get full details for a specific client |

### Tasks

| Tool | Description |
|------|-------------|
| `list_tasks` | List all tasks with optional active filter |

### Users

| Tool | Description |
|------|-------------|
| `list_users` | List users with optional active filter and pagination |
| `get_user_details` | Get full details for a specific user |
| `list_project_assignments` | List all project/task combinations available to a user — useful for discovering valid IDs before creating entries |

## Development

```bash
# Run with hot reload
bun run dev

# Run once
bun run start
```

## License

MIT
