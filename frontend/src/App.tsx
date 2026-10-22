import { useMemo, useState, type FormEvent } from 'react'
import { ArrowRight, Check, CheckCircle2, Circle, CloudSun, ListTodo, MoreHorizontal, Pencil, Plus, RefreshCw, Sparkles, Trash2, X } from 'lucide-react'
import { useTasks } from './features/tasks/useTasks'
import { useWeather } from './features/weather/useWeather'
import type { Task } from './features/tasks/api'

type Filter = 'all' | 'open' | 'done'

function dateLabel(date: string) {
  return new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric' }).format(new Date(date))
}

function TaskRow({ task, pending, onToggle, onSave, onDelete }: {
  task: Task
  pending: boolean
  onToggle: () => void
  onSave: (title: string) => Promise<boolean>
  onDelete: () => void
}) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(task.title)

  const save = async (event: FormEvent) => {
    event.preventDefault()
    const title = draft.trim()
    if (!title) return
    if (title === task.title || await onSave(title)) setEditing(false)
  }

  return (
    <li className={`task-row ${task.completed ? 'task-row--done' : ''}`}>
      <button className="task-check" onClick={onToggle} disabled={pending} aria-label={task.completed ? `Mark ${task.title} incomplete` : `Mark ${task.title} complete`}>
        {task.completed ? <Check size={16} strokeWidth={3} /> : null}
      </button>
      {editing ? (
        <form className="edit-form" onSubmit={save}>
          <input autoFocus value={draft} onChange={event => setDraft(event.target.value)} maxLength={160} aria-label="Edit task title" />
          <button type="submit" className="icon-button" disabled={pending || !draft.trim()} aria-label="Save task"><Check size={18} /></button>
          <button type="button" className="icon-button" onClick={() => { setDraft(task.title); setEditing(false) }} aria-label="Cancel editing"><X size={18} /></button>
        </form>
      ) : (
        <div className="task-copy">
          <span className="task-title">{task.title}</span>
          <span className="task-date">Added {dateLabel(task.createdAt)}</span>
        </div>
      )}
      {!editing && (
        <div className="task-actions">
          <button className="icon-button" onClick={() => setEditing(true)} disabled={pending} aria-label={`Edit ${task.title}`}><Pencil size={17} /></button>
          <button className="icon-button icon-button--danger" onClick={onDelete} disabled={pending} aria-label={`Delete ${task.title}`}><Trash2 size={17} /></button>
        </div>
      )}
    </li>
  )
}

function App() {
  const { tasks, loading, error, pendingId, creating, refresh, create, update, remove, clearError } = useTasks()
  const weather = useWeather()
  const [title, setTitle] = useState('')
  const [filter, setFilter] = useState<Filter>('all')

  const completed = tasks.filter(task => task.completed).length
  const open = tasks.length - completed
  const progress = tasks.length ? Math.round(completed / tasks.length * 100) : 0
  const visibleTasks = useMemo(() => tasks.filter(task => filter === 'all' || (filter === 'done' ? task.completed : !task.completed)), [tasks, filter])

  const add = async (event: FormEvent) => {
    event.preventDefault()
    const trimmed = title.trim()
    if (!trimmed) return
    if (await create(trimmed)) {
      setTitle('')
      setFilter('all')
    }
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <a className="brand" href="#top" aria-label="IQT-FSD-2026 home"><span className="brand-mark"><Check size={19} strokeWidth={3} /></span><span>IQT-FSD-2026</span></a>
        <span className="topbar-note"><span className="status-dot" /> A little progress, every day</span>
      </header>

      <main id="top" className="layout">
        <section className="main-column" aria-labelledby="page-title">
          <div className="eyebrow"><Sparkles size={15} /> YOUR SPACE TO FOCUS</div>
          <h1 id="page-title">Make room for<br /><em>what matters.</em></h1>
          <p className="intro">A simple place to keep your day moving. Add what needs doing, then enjoy checking it off.</p>

          <div className="board">
            <div className="board-heading">
              <div><span className="section-kicker">YOUR TASKS</span><h2>Today’s list <span className="count-pill">{tasks.length}</span></h2></div>
              <span className="board-subtitle">One step at a time <ArrowRight size={16} /></span>
            </div>

            <form className="add-form" onSubmit={add}>
              <span className="add-icon"><Plus size={20} /></span>
              <input value={title} onChange={event => setTitle(event.target.value)} maxLength={160} placeholder="What do you need to get done?" aria-label="New task title" />
              <button type="submit" disabled={creating || !title.trim()}>{creating ? 'Adding…' : 'Add task'} <ArrowRight size={17} /></button>
            </form>

            {error && <div className="error-banner" role="alert"><span>{error}</span><button onClick={clearError} aria-label="Dismiss error"><X size={16} /></button></div>}

            <div className="list-toolbar">
              <div className="filters" role="group" aria-label="Filter tasks">
                {(['all', 'open', 'done'] as Filter[]).map(option => <button key={option} className={filter === option ? 'active' : ''} onClick={() => setFilter(option)}>{option === 'all' ? 'All tasks' : option === 'open' ? 'To do' : 'Done'}</button>)}
              </div>
              <span className="remaining-count">{open} remaining</span>
            </div>

            {loading ? <div className="list-state">Loading your tasks…</div> : visibleTasks.length ? (
              <ul className="task-list">
                {visibleTasks.map(task => <TaskRow key={task.id} task={task} pending={pendingId === task.id} onToggle={() => void update(task.id, { completed: !task.completed })} onSave={newTitle => update(task.id, { title: newTitle })} onDelete={() => void remove(task.id)} />)}
              </ul>
            ) : (
              <div className="empty-state"><div className="empty-icon">{filter === 'done' ? <CheckCircle2 size={29} /> : filter === 'open' ? <Circle size={29} /> : <ListTodo size={29} />}</div><strong>{filter === 'all' ? 'A fresh start.' : filter === 'done' ? 'Nothing completed yet.' : 'All caught up.'}</strong><p>{filter === 'all' ? 'Add your first task above and make today count.' : filter === 'done' ? 'Complete a task to see it here.' : 'Enjoy the breathing room.'}</p>{error && <button className="retry-button" onClick={() => void refresh()}>Try again</button>}</div>
            )}
            <div className="board-footer"><span><MoreHorizontal size={19} /> Keep going at your own pace</span><span>{completed} completed</span></div>
          </div>
        </section>

        <aside className="side-column" aria-label="Daily overview">
          <div className="side-label">YOUR DAY AT A GLANCE</div>
          <section className="progress-card">
            <div className="card-topline"><span>Daily progress</span><span className="round-icon"><CheckCircle2 size={18} /></span></div>
            <div className="progress-number">{progress}<span>%</span></div>
            <p>{tasks.length ? `${completed} of ${tasks.length} tasks done` : 'Your day starts here'}</p>
            <div className="progress-track"><div style={{ width: `${progress}%` }} /></div>
            <div className="progress-caption">{completed === tasks.length && tasks.length ? 'Everything is checked off. Nice work!' : 'Every checkmark counts.'}</div>
          </section>

          <section className="weather-card" aria-label="Karachi weather">
            <div className="weather-head"><span>OUTSIDE RIGHT NOW</span><CloudSun size={23} /></div>
            <h3>Karachi</h3>
            {weather.loading ? <p className="weather-loading">Checking the weather…</p> : weather.error ? <div className="weather-error"><p>Weather unavailable</p><button onClick={() => void weather.refresh()}><RefreshCw size={15} /> Retry</button></div> : <><div className="temperature">{weather.weather?.temperature}°<span>C</span></div><p className="weather-description">{weather.weather?.description}</p></>}
            <div className="weather-source">Live data from <a href="https://open-meteo.com/" target="_blank" rel="noreferrer">Open-Meteo</a></div>
          </section>

          <div className="note-card"><span className="note-spark">✦</span><p>“The secret of getting ahead is getting started.”</p><span>ONE TASK AT A TIME</span></div>
        </aside>
      </main>
      <footer className="site-footer">IQT-FSD-2026 <span>•</span> Made for focused days</footer>
    </div>
  )
}

export default App
