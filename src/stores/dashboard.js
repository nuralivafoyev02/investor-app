import { defineStore } from 'pinia'
import { reactive, computed } from 'vue'

export const useDashboardStore = defineStore('dashboard', () => {
    const KEY = 'INVESTOR_DASH_V1'

    const state = reactive({
        stats: {
            tasksDone: 43,
            projectsStopped: 2,
            projectsTotal: 7,
            inProgress: 2,
            completed: 25,
            monthlyPlan: 80,
        },
        week: {
            work: [20, 40, 30, 55, 28, 46, 34],
            meditation: [12, 18, 14, 22, 15, 19, 16],
        },
        monthProgress: 30,
        goals: [
            { id: 'g1', text: '1h Meditation', time: '1h', done: true },
            { id: 'g2', text: '10 m Running', time: '10m', done: false },
            { id: 'g3', text: '30 m Workout', time: '30m', done: false },
            { id: 'g4', text: '30 m Pooja & reed book', time: '30m', done: false },
        ],
        tasks: [
            { id: 't1', title: 'Meet HR for project', when: 'Tonight', type: 'meeting', note: '' },
            { id: 't2', title: 'Boss Appointment', when: 'Next Morning', type: 'work', note: '' },
        ],
        projects: [
            { id: 'p1', title: 'New Schedule', status: 'inprogress', desc: 'Done: Create a new and unique ui design for my youtube family.', tag: 'In progress' },
            { id: 'p2', title: 'Anime ui design', status: 'completed', desc: '', tag: 'Completed' },
            { id: 'p3', title: 'Creative Ui design', status: 'completed', desc: '', tag: 'Completed' },
        ]
    })

    // Persistence
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
        } catch (e) {
            console.error('Failed to load dashboard state:', e)
        }
    }

    function persist() {
        localStorage.setItem(KEY, JSON.stringify(state))
    }

    // Actions
    function toggleGoal(id) {
        const goal = state.goals.find(g => g.id === id)
        if (goal) {
            goal.done = !goal.done
            persist()
        }
    }

    function addTask(task) {
        state.tasks.unshift({
            id: `t_${Date.now()}`,
            ...task,
            note: ''
        })
        state.stats.tasksDone += 1
        persist()
    }

    function addProject(project) {
        state.projects.unshift({
            id: `p_${Date.now()}`,
            ...project,
            tag: project.status === 'completed' ? 'Completed' : 'In progress'
        })
        state.stats.projectsTotal += 1
        if (project.status === 'completed') state.stats.completed += 1
        else state.stats.inProgress += 1
        persist()
    }

    return {
        state,
        load,
        persist,
        toggleGoal,
        addTask,
        addProject
    }
})
