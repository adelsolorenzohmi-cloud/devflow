export interface FilterableTask {
  id: string;
  title: string;
  status?: string | null;
  priority?: string | null;
  assignee?: string | null;
}

export interface TaskFilterOptions {
  search?: string;
  status?: string;
  priority?: string;
}

export function filterTasks<T extends FilterableTask>(
  tasks: T[],
  { search = "", status = "ALL", priority = "ALL" }: TaskFilterOptions
): T[] {
  const normalizedQuery = search.trim().toLowerCase();

  return tasks.filter((task) => {
    const matchesStatus =
      status === "ALL" || (task.status ?? "").toUpperCase() === status.toUpperCase();
    const matchesPriority =
      priority === "ALL" ||
      (task.priority ?? "").toUpperCase() === priority.toUpperCase();
    const matchesSearch =
      normalizedQuery.length === 0 ||
      task.title.toLowerCase().includes(normalizedQuery) ||
      (task.assignee ?? "").toLowerCase().includes(normalizedQuery);

    return matchesStatus && matchesPriority && matchesSearch;
  });
}
