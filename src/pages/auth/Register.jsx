import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../../utils/api';
import { authStore, getDefaultAppPathForRole } from '../../utils/auth';

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', department: '' });
  const [touched, setTouched] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const errors = useMemo(() => {
    const e = {};
    if (!form.name.trim()) e.name = 'Full name is required';
    if (!form.email.trim()) e.email = 'Email is required';
    if (!form.password.trim()) e.password = 'Password is required';
    else if (form.password.trim().length < 6) e.password = 'Password must be at least 6 characters';
    if (!form.department.trim()) e.department = 'Department is required';
    return e;
  }, [form]);

  const onChange = (key) => (ev) => setForm((f) => ({ ...f, [key]: ev.target.value }));
  const onBlur = (key) => () => setTouched((t) => ({ ...t, [key]: true }));

  const onSubmit = async (ev) => {
    ev.preventDefault();
    setError('');
    setTouched({ name: true, email: true, password: true, department: true });
    if (Object.keys(errors).length > 0) return;

    try {
      setSubmitting(true);
      const result = await api.auth.register({
        name: form.name,
        email: form.email,
        password: form.password,
        role: 'USER', // Default role, admin can change later
        department: form.department,
      });
      authStore.setToken(result.token);
      authStore.setUser(result.user);
      navigate(getDefaultAppPathForRole(result.user.role), { replace: true });
    } catch (e) {
      setError(e.message || 'Registration failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-md py-10">
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-950/40 backdrop-blur shadow-soft p-8">
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">Join GearGuard</h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Register to manage equipment and requests.</p>

        {error ? (
          <div className="mt-4 rounded-xl border border-rose-200 dark:border-rose-900 bg-rose-50/70 dark:bg-rose-950/30 p-3 text-sm text-rose-700 dark:text-rose-200">
            {error}
          </div>
        ) : null}

        <form className="mt-6 space-y-4" onSubmit={onSubmit}>
          <div>
            <label className="text-sm font-medium text-slate-700 dark:text-slate-200">Full Name</label>
            <input
              value={form.name}
              onChange={onChange('name')}
              onBlur={onBlur('name')}
              className="mt-2 w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-950/40 px-4 py-3 text-slate-900 dark:text-slate-100"
              placeholder="John Doe"
            />
            {touched.name && errors.name ? <div className="mt-1 text-sm text-rose-600">{errors.name}</div> : null}
          </div>

          <div>
            <label className="text-sm font-medium text-slate-700 dark:text-slate-200">Email</label>
            <input
              value={form.email}
              onChange={onChange('email')}
              onBlur={onBlur('email')}
              className="mt-2 w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-950/40 px-4 py-3 text-slate-900 dark:text-slate-100"
              placeholder="john@company.com"
            />
            {touched.email && errors.email ? <div className="mt-1 text-sm text-rose-600">{errors.email}</div> : null}
          </div>

          <div>
            <label className="text-sm font-medium text-slate-700 dark:text-slate-200">Department</label>
            <select
              value={form.department}
              onChange={onChange('department')}
              onBlur={onBlur('department')}
              className="mt-2 w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-950/40 px-4 py-3 text-slate-900 dark:text-slate-100"
            >
              <option value="">Select department</option>
              <option value="Operations">Operations</option>
              <option value="Maintenance">Maintenance</option>
              <option value="Engineering">Engineering</option>
              <option value="IT">IT</option>
              <option value="HR">HR</option>
              <option value="Finance">Finance</option>
            </select>
            {touched.department && errors.department ? <div className="mt-1 text-sm text-rose-600">{errors.department}</div> : null}
          </div>

          <div>
            <label className="text-sm font-medium text-slate-700 dark:text-slate-200">Password</label>
            <input
              type="password"
              value={form.password}
              onChange={onChange('password')}
              onBlur={onBlur('password')}
              className="mt-2 w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-950/40 px-4 py-3 text-slate-900 dark:text-slate-100"
              placeholder="••••••••"
            />
            {touched.password && errors.password ? (
              <div className="mt-1 text-sm text-rose-600">{errors.password}</div>
            ) : null}
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full inline-flex items-center justify-center rounded-xl px-6 py-3 font-semibold text-white bg-gradient-to-r from-indigo-500 to-cyan-500 shadow-soft hover:shadow-soft-lg transition disabled:opacity-60"
          >
            {submitting ? 'Creating…' : 'Create Account'}
          </button>
        </form>

        <div className="mt-4 rounded-xl border border-blue-200 dark:border-blue-900 bg-blue-50/70 dark:bg-blue-950/30 p-3 text-xs text-blue-700 dark:text-blue-200">
          <strong>Note:</strong> Your account will require admin approval before you can access the system. You'll be notified once approved.
        </div>

        <div className="mt-6 text-sm text-slate-600 dark:text-slate-300">
          Already have an account?{' '}
          <Link className="font-medium text-slate-900 dark:text-white hover:underline" to="/auth/login">
            Login
          </Link>
        </div>

        <Link to="/" className="mt-2 block text-sm text-slate-600 dark:text-slate-300 hover:underline">
          Back to Home
        </Link>
      </div>
    </div>
  );
}