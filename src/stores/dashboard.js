import { reactive } from 'vue'
import { defineStore } from 'pinia'

const KEY = 'dashboard-state'

export const useDashboardStore = defineStore('dashboard', () => {
  const state = reactive({
    stats: {
      tasksDone: 17,
      projectsStopped: 2,
      projectsTotal: 27,
      inProgress: 2,
      completed: 25,
      monthlyPlan: 80
    },
    week: {
      work: [20, 40, 30, 55, 28, 46, 34],
      meditation: [12, 18, 14, 22, 15, 19, 16]
    },
    monthProgress: 30,
    goals: [
      { id: 'g1', textKey: 'dashboard.seed.goals.investorUpdate', time: '1h', done: true },
      { id: 'g2', textKey: 'dashboard.seed.goals.cashflowReview', time: '45m', done: false },
      { id: 'g3', textKey: 'dashboard.seed.goals.expenseApproval', time: '30m', done: false },
      { id: 'g4', textKey: 'dashboard.seed.goals.monitoring', time: '25m', done: false }
    ],
    tasks: [
      { id: 't1', titleKey: 'dashboard.seed.tasks.meetFinance', whenKey: 'dashboard.seed.when.tonight', type: 'meeting', note: '' },
      { id: 't2', titleKey: 'dashboard.seed.tasks.approvePayout', whenKey: 'dashboard.seed.when.nextMorning', type: 'work', note: '' }
    ],
    projects: [
      { id: 'p1', titleKey: 'dashboard.seed.projects.rolloutTitle', status: 'inprogress', descKey: 'dashboard.seed.projects.rolloutDesc' },
      { id: 'p2', titleKey: 'dashboard.seed.projects.warehouseTitle', status: 'completed', descKey: 'dashboard.seed.projects.warehouseDesc' },
      { id: 'p3', titleKey: 'dashboard.seed.projects.capitalTitle', status: 'completed', descKey: 'dashboard.seed.projects.capitalDesc' }
    ]
  })

  function load() {
    try {
      const raw = localStorage.getItem(KEY)
      if (!raw) return
      const parsed = JSON.parse(raw)
      if (parsed && typeof parsed === 'object') {
        Object.assign(state.stats, parsed.stats || {})
        if (parsed.week?.work) state.week.work = parsed.week.work
        if (parsed.week?.meditation) state.week.meditation = parsed.week.meditation
        if (typeof parsed.monthProgress === 'number') state.monthProgress = parsed.monthProgress
        if (Array.isArray(parsed.goals)) state.goals = parsed.goals
        if (Array.isArray(parsed.tasks)) state.tasks = parsed.tasks
        if (Array.isArray(parsed.projects)) state.projects = parsed.projects
      }
    } catch (error) {
      console.error('Failed to load dashboard state:', error)
    }
  }

  function persist() {
    localStorage.setItem(KEY, JSON.stringify(state))
  }

  function toggleGoal(id) {
    const goal = state.goals.find((item) => item.id === id)
    if (goal) {
      goal.done = !goal.done
      persist()
    }
  }

  function addTask(task) {
    state.tasks.unshift({ id: `t_${Date.now()}`, ...task, note: task.note || '' })
    state.stats.tasksDone += 1
    persist()
  }

  function addProject(project) {
    state.projects.unshift({
      id: `p_${Date.now()}`,
      ...project,
      status: project.status || 'planning'
    })
    state.stats.projectsTotal += 1
    if (project.status === 'completed') state.stats.completed += 1
    else state.stats.inProgress += 1
    persist()
  }

  return { state, load, persist, toggleGoal, addTask, addProject }
})
