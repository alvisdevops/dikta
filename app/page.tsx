"use client";

import { useState } from "react";
import { Plus, Zap } from "lucide-react";
import { useTasks, type Task } from "@/hooks/use-tasks";
import { EisenhowerMatrix } from "./components/matrix/eisenhower-matrix";
import { TaskForm } from "./components/task-form";

export default function Home() {
  const { tasks, loading, creating, createTask, updateTask, deleteTask } =
    useTasks();
  const [formOpen, setFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const handleCreate = async (data: {
    title: string;
    description?: string;
    deadline?: string;
  }) => {
    await createTask(data);
  };

  const handleUpdate = async (
    id: string,
    data: Partial<Pick<Task, "title" | "description" | "deadline">>,
  ) => {
    await updateTask(id, data);
  };

  const handleToggleComplete = async (id: string, completed: boolean) => {
    await updateTask(id, { completed });
  };

  const handleEdit = (task: Task) => {
    setEditingTask(task);
    setFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    await deleteTask(id);
  };

  const handleMoveToQuadrant = async (
    id: string,
    quadrant: Task["quadrant"],
  ) => {
    await updateTask(id, { quadrant });
  };

  const handleCloseForm = () => {
    setFormOpen(false);
    setEditingTask(null);
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[var(--bg-primary)] bg-grid">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-[var(--border-color)] border-t-[var(--q2-color)]" />
          <span className="text-xs text-[var(--text-secondary)] tracking-widest uppercase">Cargando</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col bg-[var(--bg-primary)] bg-grid">
      {/* Header */}
      <header className="flex items-center justify-between border-b border-[var(--border-color)] px-6 py-3 bg-[var(--bg-secondary)]/60 backdrop-blur-xl">
        <div className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-[var(--q2-color)] to-[var(--q1-color)]">
            <Zap className="h-3.5 w-3.5 text-white" />
          </div>
          <h1 className="text-lg font-semibold font-[family-name:var(--font-space-grotesk)] text-[var(--text-primary)] tracking-tight">
            <span className="hidden md:inline">Dikta</span>
            <span className="md:hidden">Dikta</span>
          </h1>
          <span className="hidden md:inline-block text-[11px] text-[var(--text-muted)] tracking-widest uppercase ml-1">Eisenhower Matrix</span>
        </div>
        <button
          onClick={() => {
            setEditingTask(null);
            setFormOpen(true);
          }}
          className="flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-medium text-[var(--bg-primary)] transition-all hover:shadow-[0_0_20px_rgba(255,255,255,0.15)] active:scale-[0.97]"
        >
          <Plus className="h-4 w-4" />
          <span className="hidden md:inline">Nueva tarea</span>
          <span className="md:hidden">Nueva</span>
        </button>
      </header>

      {/* Matrix */}
      <main className="flex-1 overflow-hidden">
        <EisenhowerMatrix
          tasks={tasks}
          onToggleComplete={handleToggleComplete}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onMoveToQuadrant={handleMoveToQuadrant}
        />
      </main>

      {/* Footer */}
      <footer className="flex items-center justify-center border-t border-[var(--border-color)] bg-[var(--bg-secondary)]/40 px-4 py-1.5">
        <span className="text-[11px] text-[var(--text-muted)] tracking-widest uppercase font-[family-name:var(--font-space-grotesk)]">
          ALVIS Solutions
        </span>
      </footer>

      {/* Task Form (Create/Edit) */}
      <TaskForm
        open={formOpen}
        onClose={handleCloseForm}
        onSubmit={handleCreate}
        onUpdate={handleUpdate}
        editingTask={editingTask}
        loading={creating}
      />
    </div>
  );
}
