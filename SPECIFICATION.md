# DevFlow

## Project Title & Description
DevFlow is a full-stack web application for sprint and task management. It is built for small development teams (like two people). It helps teams track sprints, give tasks to people, change task status, and see project progress easily without using complicated enterprise tools.

The first version focuses on core features: user login, team workspaces, task creation, and sprint boards.

## Purpose & Target Audience
- **Audience:** Small development teams, student pairs, and independent developers who need a fast and simple agile tool.
- **Purpose:** Make task and sprint management easy with a clean interface, using strict TypeScript, Tailwind CSS, and good Git workflows.

## User Stories
1. As a developer, I want to sign up and log in securely so that I can use my team's workspace.
2. As a team member, I want to create and assign tasks (with titles, descriptions, and priorities) so that we know who is working on what.
3. As a team member, I want to organize tasks into sprints so that we can manage our schedule well.
4. As a team member, I want to update task status (Todo, In Progress, Done) using a board.
5. As a team member, I want to filter tasks by priority so I can see what is important.

## Acceptance Criteria

### Story 1: User Login
- Given a user on the sign-up page, when they write correct information, the system creates their account and goes to the dashboard.
- Given incorrect information, the system shows an error message.

### Story 2: Task Creation
- Given a user on the board, when they fill out the "Create Task" form and click submit, the task saves to the database and appears in the "Todo" column.
- Given missing required fields, the system stops the form and shows missing fields.

### Story 3: Status Updates
- Given a task card, when a user changes its status to "In Progress" or "Done", the database updates instantly and the screen shows the new column.

## Technical Requirements
- **Framework:** Next.js App Router (Server and Client components)
- **Language:** TypeScript (Strict mode, no `any`)
- **Styling:** Tailwind CSS (Utility-first, minimal custom CSS)
- **Database:** PostgreSQL with Prisma ORM
- **Auth:** NextAuth.js or Clerk for login

## Core API Endpoints
- `GET /api/tasks`
- `GET /api/tasks/:id`
- `POST /api/tasks`
- `PATCH /api/tasks/:id`
- `DELETE /api/tasks/:id`
- `GET /api/sprints`
- `POST /api/sprints`

## Implementation Priority
- **P0:** User login, database setup with Prisma, create tasks, and update task status.
- **P1:** Sprint management, assign tasks to people, filter by priority.
- **P2:** Nice UI animations, activity logs, and reminders.