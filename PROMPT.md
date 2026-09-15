# PM Dashboard Assistant — Build Prompt

Copy everything below this line and paste into a new Claude Code session pointing at this folder.

---

Build a Personal PM Dashboard Assistant — a full-stack web application for Project Managers to manage their daily work across any project management tool, powered by an AI PM Co-Pilot that actively makes the PM's work more efficient.

## Tech Stack
- Frontend: React + Vite + TypeScript + Tailwind CSS + shadcn/ui
- Backend: Node.js + Express + TypeScript
- Database: PostgreSQL with Prisma ORM (generic, not tied to any PM tool)
- AI: Multi-provider (OpenAI, Gemini, Anthropic) for task creation, insights, and PM automation

## Port Configuration
- Frontend dev server: http://localhost:5174 (Vite config: server.port = 5174)
- Backend API server: http://localhost:3002
- Frontend proxy: /api → http://localhost:3002/api
- This avoids conflicts with other local projects (PMO Dashboard uses 5173/3001)

## Core Architecture

### Generic Data Model (Database)
Design a tool-agnostic schema that works regardless of whether the source is Jira, ClickUp, Asana, Monday.com, Odoo, or manual entry:

- **Projects**: id, name, category (implementation/support/internal), status (active/on-hold/completed), client_name, start_date, target_date, source_tool (jira/clickup/asana/odoo/manual), external_id
- **Tasks**: id, project_id, title, description, status (todo/in-progress/review/blocked/done), priority (low/normal/high/urgent), assignee, reporter, created_at, updated_at, completed_at, due_date, story_points, external_id, source_tool
- **Team Members**: id, name, email, role, department, team_type (functional/development/management)
- **Daily Logs**: id, date, tasks_completed, tasks_in_progress, tasks_blocked, notes
- **Blockers**: id, task_id, project_id, description, raised_date, resolved_date, severity (low/medium/high/critical), assigned_to
- **Syncs**: id, source_tool, last_synced_at, status, config (JSON)
- **AI_Actions**: id, action_type, context, suggestion, status (pending/accepted/dismissed), created_at
- **PM_Decisions**: id, decision, rationale, project_id, date, outcome, ai_suggested (boolean)
- **Meeting_Notes**: id, title, date, attendees, raw_notes, ai_summary, action_items (JSON), follow_ups (JSON)
- **Risk_Register**: id, project_id, risk_description, probability (low/medium/high), impact (low/medium/high), mitigation, status (open/mitigated/closed), identified_by, identified_date

### Integration Layer (Adapters Pattern)
Create a unified adapter interface that each PM tool implements:

```typescript
interface PMToolAdapter {
  name: string;
  connect(config: Record<string, string>): Promise<boolean>;
  syncProjects(): Promise<Project[]>;
  syncTasks(projectId?: string): Promise<Task[]>;
  syncTeamMembers(): Promise<TeamMember[]>;
  createTask(task: CreateTaskInput): Promise<Task>;
  updateTaskStatus(taskId: string, status: string): Promise<void>;
}
```

Build adapters for:
1. **Jira** — REST API v3 with OAuth2 or API token
2. **ClickUp** — REST API with API key
3. **Asana** — REST API with Personal Access Token
4. **Odoo** — XML-RPC with session auth
5. **Manual** — direct database entry (no external tool)

Each adapter maps the tool's native fields to the generic schema. The UI should let users configure which tool(s) to connect and map their project/status fields.

---

## AI PM Co-Pilot (Core Differentiator)

This is not just a dashboard — it's an AI-powered PM assistant that actively reduces the PM's manual work. The AI layer runs across all features and learns from the PM's patterns over time.

### 1. Smart Morning Briefing (Daily Auto-Generated)
Every morning, AI generates a personalized briefing based on synced data:
- **What happened yesterday**: tasks completed, blockers raised, missed deadlines
- **Today's priorities**: auto-ranked tasks by urgency (deadline proximity × priority × blocker impact)
- **Risk alerts**: "Project X has 3 tasks overdue and 2 blocked — consider escalation"
- **Team pulse**: "Ali has 12 tasks in progress, 0 completed this week — may be stuck"
- **Suggested actions**: specific next steps like "Follow up with [name] on [task] — blocked 4 days"
- Delivered as a page in the dashboard + optionally saved as Gmail draft

### 2. Intelligent Task Prioritization Engine
AI analyzes all tasks across projects and suggests daily focus:
- **Auto-priority scoring**: weighs deadline, dependencies, client impact, team capacity
- **"What should I focus on today?"** — one-click answer with reasoning
- **Rebalancing alerts**: "You have 3 deadlines Friday but nothing scheduled Wed/Thu — consider moving [task]"
- **Dependency detection**: "Task B is blocked until Task A is done — Task A should be priority"
- PM can accept/dismiss suggestions — AI learns from decisions over time

### 3. Meeting Minutes to Action Items (Paste & Parse)
PM pastes raw meeting notes or voice transcript, AI extracts:
- **Summary**: 2-3 sentence meeting overview
- **Action items**: task title, owner, deadline — with "Create as Task" button for each
- **Decisions made**: logged with date and context for future reference
- **Follow-ups needed**: auto-creates follow-up reminders
- **Risk items mentioned**: auto-added to project risk register
- Supports both typed notes and voice-to-text input

### 4. Automated Stakeholder Communication Drafts
AI generates ready-to-review communication drafts:
- **Weekly status report**: pulls completed tasks, blockers, project health → professional email
- **Escalation email**: when a blocker is stale >3 days, AI drafts escalation to manager/client
- **Client update**: project progress summary tailored for non-technical stakeholders
- **Deadline reminder**: polite follow-up email to team member with overdue task
- **Sprint summary**: what was planned vs delivered, carryover items
- All saved as Gmail Drafts — NEVER auto-sent. PM reviews and sends manually.

### 5. Risk & Blocker Intelligence
AI proactively identifies risks before they become problems:
- **Velocity tracking**: "Team velocity dropped 30% this sprint — investigate"
- **Pattern detection**: "This project historically slows down during UAT phase — plan buffer"
- **Blocker prediction**: "Task X has been in review for 3 days with no update — likely blocked"
- **Resource conflict**: "Ahmed is assigned to 4 projects with overlapping deadlines next week"
- **Scope creep detection**: "15 new tasks added to Project X this week vs 3 last week — flag to stakeholder"
- Each risk gets a severity score and suggested mitigation

### 6. Smart Delegation Assistant
AI suggests optimal task assignments:
- **Workload balancing**: "Sarah has capacity, consider assigning [task] to her instead of overloaded Ali"
- **Skill matching**: learns which team members handle which task types (based on history)
- **Availability awareness**: factors in who completed tasks recently vs who's been idle
- **Handoff summaries**: when reassigning, AI generates context summary so new assignee ramps up fast

### 7. Decision Log & Context Memory
AI maintains a searchable decision history:
- **"Why did we decide X?"** — PM can ask and AI finds the relevant meeting/note/context
- **Decision impact tracking**: link decisions to outcomes over time
- **Project context cards**: AI builds a living summary of each project's history, key decisions, stakeholders
- **Onboarding helper**: new team member asks "What's the status of Project X?" — AI provides full context

### 8. Retrospective & Learning Engine
AI analyzes completed sprints/weeks and provides insights:
- **What went well**: "Team completed 95% of planned tasks — highest this quarter"
- **What didn't**: "3 blockers from same client — consider dedicated sync call"
- **Estimation accuracy**: "Team consistently underestimates QA tasks by 40%"
- **Suggestions**: "Based on last 4 sprints, reduce sprint capacity by 2 tasks for realistic planning"
- **Team growth**: "Ali's completion rate improved 25% since last month"

### 9. Natural Language Query Interface
PM can ask questions in plain English and get answers from their data:
- "How many tasks did we complete last week?"
- "Which projects are at risk?"
- "What's blocking the CRM project?"
- "Show me Ali's workload for this week"
- "Compare this sprint's velocity to last sprint"
- "What tasks are due this Friday?"
- AI queries the database, formats the answer, and suggests follow-up actions

### 10. Quick Automations (One-Click PM Actions)
Reduce repetitive PM work to single clicks:
- **End of Day Log**: AI summarizes what happened today based on task updates → saved to daily log
- **Sprint Planning Prep**: AI pulls backlog, suggests sprint scope based on team velocity
- **Standup Generator**: AI creates standup notes from yesterday's task changes for each team member
- **Follow-up Checker**: scans all action items from meetings — highlights ones with no progress
- **Weekly Digest**: one click generates the full weekly report with all sections

---

### Pages & Features

1. **Dashboard** — KPI cards (completed, in-progress, blocked, overdue, active projects), daily activity chart, project health overview, blockers requiring attention, AI morning briefing widget

2. **AI Co-Pilot** — Central AI interface with:
   - Morning briefing (auto-generated)
   - Priority recommendations for today
   - Risk alerts and suggestions
   - Natural language query box
   - Quick action buttons (End of Day Log, Sprint Prep, Follow-up Check)
   - Decision log search

3. **Progress Hub (Mon-Fri Weekly View)**
   - Daily breakdown tabs showing what was done each day
   - Completed tasks list with task name, project, assignee, day completed
   - Project-wise progress with status badges (on-track, at-risk, critical, blocked)
   - Blocker escalation section highlighting stale blockers
   - "Preview & Share Report" — generates professional HTML email report, saves as Gmail Draft only (NEVER auto-send)
   - Report includes: Executive Summary, KPI cards, Daily Activity, Completed Tasks grouped by project, Project Progress tables (Implementation vs Support), Blockers section

4. **AI Task Creator**
   - Prompt-based: describe work in natural language, AI breaks into structured tasks
   - Fields: title, description, project (searchable dropdown), assignee, priority, story points, due date
   - AI generates description and estimates story points
   - "Create in [Tool]" button pushes to connected PM tool via adapter
   - Project Charter mode: paste SOW/project brief, AI generates full task breakdown with phases and milestones
   - Meeting-to-Tasks: paste meeting notes, extract action items as tasks

5. **Team Workload View**
   - Visual workload per team member (capacity bars)
   - AI delegation suggestions
   - Skill mapping and availability
   - Overload/underload alerts

6. **Risk Register**
   - All identified risks across projects
   - AI-detected risks highlighted
   - Probability x impact matrix view
   - Mitigation tracking and status

7. **Communication Hub**
   - Draft stakeholder updates
   - Escalation emails for stale blockers
   - Client progress updates
   - Deadline reminders to team members
   - Sprint summaries
   - All as Gmail Drafts — NEVER auto-send

8. **Meeting Notes**
   - Paste raw notes or voice transcript
   - AI extracts summary, action items, decisions, follow-ups, risks
   - One-click create tasks from action items
   - Searchable meeting history

9. **Retrospective & Insights**
   - Sprint/week analysis
   - Estimation accuracy trends
   - Team performance patterns
   - AI improvement suggestions
   - Historical velocity charts

10. **Settings**
    - Tool connections: configure Jira/ClickUp/Asana/Odoo credentials and field mappings
    - Sync config: manual sync button + optional auto-sync interval
    - Gmail OAuth2 setup for draft creation (compose scope only)
    - AI provider configuration (API keys stored in backend .env only, never exposed to frontend)
    - Company name and branding for reports
    - Morning briefing preferences
    - PM profile: name, email, role, timezone

### Email Reports (Gmail Draft Only)
- Professional HTML email with configurable company branded header
- Executive summary paragraph
- KPI cards (Completed, In Progress, Blocked, Overdue, Projects)
- Daily activity Mon-Fri
- Completed tasks grouped by project with task name, assignee, day completed
- Project progress tables (Implementation vs Support)
- Blocker escalation section with days stale
- Footer with PM contact info
- CRITICAL: Never send emails automatically. Only create Gmail Drafts via gmail.compose scope. PM reviews and sends manually.

### Key Constraints
- All API keys and credentials stored in backend .env, NEVER exposed to frontend
- JWT authentication with secure token handling
- Frontend uses /api proxy to backend (Vite proxy config)
- Mobile responsive design with Tailwind breakpoints
- Dark/light theme support
- Data works offline from local PostgreSQL DB even if PM tool sync fails
- Gmail integration is compose/draft only — NEVER auto-send emails
- AI suggestions are always reviewable — PM has final say on every action
- AI learns from PM's accept/dismiss patterns to improve suggestions over time
- Use local date formatting (avoid UTC timezone bugs — use getFullYear/getMonth/getDate not toISOString for dates)
- Sanitize all user inputs and AI outputs before rendering (prevent XSS)
- Rate limit AI API calls to control costs
