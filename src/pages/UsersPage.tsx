import { useState } from 'react';
import { useUsers } from '../users/useUsers';
import { ROLES, ROLE_LABELS, type Role } from '../constants/roles';

export default function UsersPage() {
  const { users, setUserRole, removeUser, currentUser } = useUsers();
  const [newEmail, setNewEmail] = useState('');
  const [newRole, setNewRole] = useState<Role>('VENDOR');

  const handleAdd = () => {
    const email = newEmail.trim().toLowerCase();
    if (!email || !email.includes('@')) return;
    if (users.some((u) => u.email === email)) return;
    setUserRole(email, newRole);
    setNewEmail('');
    setNewRole('VENDOR');
  };

  return (
    <div>
      <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 4 }}>User Management</h2>
      <p style={{ fontSize: 13, color: 'var(--text2)', marginBottom: 20 }}>
        Add users by email and assign roles. Users must sign in with Google to access the app.
      </p>

      {/* Add user form */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap' }}>
        <input
          type="email"
          placeholder="Email address"
          value={newEmail}
          onChange={(e) => setNewEmail(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
          style={{
            padding: '8px 12px',
            border: '1px solid var(--bdr)',
            borderRadius: 6,
            fontSize: 13,
            flex: '1 1 200px',
            minWidth: 200,
          }}
        />
        <select
          value={newRole}
          onChange={(e) => setNewRole(e.target.value as Role)}
          style={{
            padding: '8px 12px',
            border: '1px solid var(--bdr)',
            borderRadius: 6,
            fontSize: 13,
          }}
        >
          {ROLES.map((r) => (
            <option key={r} value={r}>
              {ROLE_LABELS[r]}
            </option>
          ))}
        </select>
        <button className="btn bp bsm" onClick={handleAdd}>
          + Add User
        </button>
      </div>

      {/* Users table */}
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
        <thead>
          <tr style={{ borderBottom: '2px solid var(--bdr)', textAlign: 'left' }}>
            <th style={{ padding: '8px 12px', fontWeight: 600 }}>User</th>
            <th style={{ padding: '8px 12px', fontWeight: 600 }}>Email</th>
            <th style={{ padding: '8px 12px', fontWeight: 600 }}>Role</th>
            <th style={{ padding: '8px 12px', fontWeight: 600 }}>Added</th>
            <th style={{ padding: '8px 12px', fontWeight: 600 }}></th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => {
            const isSelf = currentUser?.email === u.email;
            return (
              <tr key={u.email} style={{ borderBottom: '1px solid var(--bdr)' }}>
                <td style={{ padding: '8px 12px', display: 'flex', alignItems: 'center', gap: 8 }}>
                  {u.picture ? (
                    <img
                      src={u.picture}
                      alt=""
                      style={{ width: 28, height: 28, borderRadius: '50%' }}
                    />
                  ) : (
                    <div
                      style={{
                        width: 28,
                        height: 28,
                        borderRadius: '50%',
                        background: 'var(--text3)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#fff',
                        fontSize: 12,
                        fontWeight: 600,
                      }}
                    >
                      {u.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <span>
                    {u.name}
                    {isSelf && (
                      <span style={{ fontSize: 10, color: 'var(--text3)', marginLeft: 6 }}>(you)</span>
                    )}
                  </span>
                </td>
                <td style={{ padding: '8px 12px', color: 'var(--text2)' }}>{u.email}</td>
                <td style={{ padding: '8px 12px' }}>
                  <select
                    value={u.role}
                    onChange={(e) => setUserRole(u.email, e.target.value as Role)}
                    disabled={isSelf}
                    style={{
                      padding: '4px 8px',
                      border: '1px solid var(--bdr)',
                      borderRadius: 4,
                      fontSize: 12,
                      background: isSelf ? 'var(--bg)' : '#fff',
                    }}
                  >
                    {ROLES.map((r) => (
                      <option key={r} value={r}>
                        {ROLE_LABELS[r]}
                      </option>
                    ))}
                  </select>
                </td>
                <td style={{ padding: '8px 12px', color: 'var(--text3)', fontSize: 12 }}>{u.addedAt}</td>
                <td style={{ padding: '8px 12px' }}>
                  {!isSelf && (
                    <button
                      className="btn bs bsm"
                      onClick={() => {
                        if (confirm(`Remove ${u.name} (${u.email})?`)) {
                          removeUser(u.email);
                        }
                      }}
                      style={{ fontSize: 11, color: '#dc2626' }}
                    >
                      Remove
                    </button>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {users.length === 0 && (
        <div style={{ textAlign: 'center', padding: 40, color: 'var(--text3)' }}>
          No users registered yet.
        </div>
      )}
    </div>
  );
}
