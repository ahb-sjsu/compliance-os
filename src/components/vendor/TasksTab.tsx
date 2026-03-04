import { useState } from 'react';
import type { Vendor, VendorTask } from '../../types/vendor';
import { can, type Role } from '../../constants/roles';
import { daysUntil } from '../../helpers/dates';

interface TaskForm {
  text: string;
  due: string;
}

interface TasksTabProps {
  vendor: Vendor;
  role: Role;
  onAddTask: (vendorId: number, task: TaskForm) => void;
  onToggle: (vendorId: number, taskId: number) => void;
}

function TaskRow({
  t,
  vendorId,
  onToggle,
}: {
  t: VendorTask;
  vendorId: number;
  onToggle: (vendorId: number, taskId: number) => void;
}) {
  const d2 = daysUntil(t.due);
  return (
    <div
      style={{
        display: 'flex',
        gap: 12,
        padding: '11px 14px',
        borderRadius: 8,
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        marginBottom: 7,
        alignItems: 'center',
      }}
    >
      <input
        type="checkbox"
        checked={t.done}
        onChange={() => onToggle(vendorId, t.id)}
        style={{ width: 16, height: 16, cursor: 'pointer' }}
      />
      <div style={{ flex: 1 }}>
        <div
          style={{
            fontSize: 13,
            textDecoration: t.done ? 'line-through' : 'none',
            color: t.done ? 'var(--text3)' : 'var(--text)',
          }}
        >
          {t.text}
        </div>
        <div style={{ fontSize: 10, color: 'var(--text3)', fontFamily: '"JetBrains Mono",monospace', marginTop: 2 }}>
          Created by {t.createdBy}
        </div>
      </div>
      {t.due && (
        <span
          style={{
            fontSize: 11,
            fontFamily: '"JetBrains Mono",monospace',
            color: d2 !== null && d2 < 0 ? 'var(--red)' : d2 !== null && d2 <= 7 ? 'var(--yellow)' : 'var(--text3)',
          }}
        >
          {d2 !== null && d2 < 0 ? 'OVERDUE' : d2 !== null ? 'Due in ' + d2 + 'd' : ''}
        </span>
      )}
    </div>
  );
}

export default function TasksTab({ vendor, role, onAddTask, onToggle }: TasksTabProps) {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<TaskForm>({ text: '', due: '' });
  const open = (vendor.tasks || []).filter((t) => !t.done);
  const done = (vendor.tasks || []).filter((t) => t.done);

  return (
    <>
      {can(role, 'create') && (
        <div style={{ marginBottom: 14 }} className="np">
          <button className="btn bs bsm" onClick={() => setShowForm(!showForm)}>
            + Add Task
          </button>
        </div>
      )}
      {showForm && (
        <div className="card cp" style={{ marginBottom: 14 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 12, marginBottom: 12 }}>
            <div className="fg" style={{ marginBottom: 0 }}>
              <label className="fl">Task</label>
              <input
                value={form.text}
                onChange={(e) => setForm((f) => ({ ...f, text: e.target.value }))}
                placeholder="Task description..."
              />
            </div>
            <div className="fg" style={{ marginBottom: 0 }}>
              <label className="fl">Due Date</label>
              <input type="date" value={form.due} onChange={(e) => setForm((f) => ({ ...f, due: e.target.value }))} />
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              className="btn bp bsm"
              onClick={() => {
                if (!form.text) return;
                onAddTask(vendor.id, form);
                setShowForm(false);
                setForm({ text: '', due: '' });
              }}
            >
              Add
            </button>
            <button className="btn bs bsm" onClick={() => setShowForm(false)}>
              Cancel
            </button>
          </div>
        </div>
      )}
      {open.length === 0 && done.length === 0 && <div className="es">No tasks</div>}
      {open.map((t) => (
        <TaskRow key={t.id} t={t} vendorId={vendor.id} onToggle={onToggle} />
      ))}
      {done.length > 0 && (
        <>
          <div className="sd" style={{ marginTop: 16 }}>
            Completed
          </div>
          {done.map((t) => (
            <TaskRow key={t.id} t={t} vendorId={vendor.id} onToggle={onToggle} />
          ))}
        </>
      )}
    </>
  );
}
