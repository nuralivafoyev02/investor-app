<template>
  <div class="dash">
    <!-- subtle ambient blur so aside/layout foniga mos tushadi -->
    <div class="ambient" aria-hidden="true"></div>

    <!-- Topbar (Figma) -->
    <header class="topbar">
      <div class="helloWrap">
        <div class="hello">Hi, <span class="helloName">{{ userName }}</span>!</div>
        <div class="sub">Here’s what’s happening today.</div>
      </div>

      <div class="actions">
        <div class="createWrap" ref="createWrap">
          <button class="btnPrimary" type="button" @click="toggleCreateMenu">
            <span aria-hidden="true">＋</span>
            Create
          </button>
          <div v-if="createMenu" class="menuPopup" role="menu">
            <button class="menuItem" type="button" @click="openTaskModal('task')">New task</button>
            <button class="menuItem" type="button" @click="openTaskModal('project')">New project</button>
            <div class="menuSep"></div>
            <button class="menuItem" type="button" @click="downloadReport">Download report</button>
          </div>
        </div>

        <button class="iconBtn" type="button" title="Search" @click="notify('Qidiruv: demo', 'info')">
          <svg viewBox="0 0 24 24" fill="none"><path d="M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15Z" stroke="currentColor" stroke-width="1.7"/><path d="M16.5 16.5 21 21" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg>
        </button>
        <button class="iconBtn" type="button" title="Notifications" @click="notify('Bildirishnoma: demo', 'info')">
          <svg viewBox="0 0 24 24" fill="none"><path d="M12 22a2.3 2.3 0 0 0 2.2-2H9.8A2.3 2.3 0 0 0 12 22Z" fill="currentColor" opacity=".75"/><path d="M18 16H6c1.2-1.2 2-2.6 2-5.5a4 4 0 0 1 8 0c0 2.9.8 4.3 2 5.5Z" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/></svg>
        </button>
        <button class="avatar" type="button" title="Profile" @click="notify('Profil: demo', 'info')">
          <span aria-hidden="true">{{ initials }}</span>
        </button>
      </div>
    </header>

    <!-- Widgets grid -->
    <section class="grid">
      <!-- Overall info (dark) -->
      <article class="card cardDark">
        <div class="cardHead">
          <h3>Over all information</h3>
          <div class="cardIcons">
            <button class="ghostIcon" type="button" title="Share" @click="shareReport">
              <svg viewBox="0 0 24 24" fill="none"><path d="M16 8a3 3 0 1 0-2.8-4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/><path d="M6 14a3 3 0 1 0 0 6 3 3 0 0 0 0-6Zm12-5a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z" stroke="currentColor" stroke-width="1.6"/><path d="M8.4 15.1 15.6 11.9M8.4 18.9 15.6 14.1" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>
            </button>
            <button class="ghostIcon" type="button" title="More" @click="notify('More: demo', 'info')">
              <svg viewBox="0 0 24 24" fill="none"><path d="M6 12h.01M12 12h.01M18 12h.01" stroke="currentColor" stroke-width="3" stroke-linecap="round"/></svg>
            </button>
          </div>
        </div>

        <div class="overallRow">
          <div class="bigNum">{{ stats.tasksDone }}</div>
          <div class="muted">Task done<br />for all time</div>
          <div class="divider"></div>
          <div class="bigNum">{{ stats.projectsStopped }}</div>
          <div class="muted">Project's<br />are stoped</div>
        </div>

        <div class="progressWrap">
          <div class="progressTrack">
            <div class="progressFill" :style="{ width: overallProgress + '%' }"></div>
          </div>
          <div class="progressMeta">{{ overallProgress }}% of monthly plan</div>
        </div>

        <div class="miniGrid">
          <button class="miniCard" type="button" @click="success('Projects: demo')">
            <div class="miniIco">◎</div>
            <div class="miniTitle">Project's</div>
            <div class="miniVal">{{ stats.projectsTotal }}</div>
          </button>
          <button class="miniCard miniCardLight" type="button" @click="success('In progress: demo')">
            <div class="miniIco">↻</div>
            <div class="miniTitle">In Progess</div>
            <div class="miniVal">{{ stats.inProgress }}</div>
          </button>
          <button class="miniCard" type="button" @click="success('Completed: demo')">
            <div class="miniIco">✓</div>
            <div class="miniTitle">Completed</div>
            <div class="miniVal">{{ stats.completed }}</div>
          </button>
        </div>
      </article>

      <!-- Weekly process (chart) -->
      <article class="card">
        <div class="cardHead">
          <h3>Weekly process</h3>
          <button class="ghostIcon" type="button" title="Quick" @click="randomizeWeek">
            <svg viewBox="0 0 24 24" fill="none"><path d="M4 12a8 8 0 0 1 14-5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/><path d="M18 4v5h-5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/><path d="M20 12a8 8 0 0 1-14 5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/><path d="M6 20v-5h5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </button>
        </div>

        <div class="legend">
          <button class="legendItem" type="button" :class="{ on: showWork }" @click="showWork = !showWork">
            <span class="swatch swatchWork" aria-hidden="true"></span>
            Work
          </button>
          <button class="legendItem" type="button" :class="{ on: showMeditation }" @click="showMeditation = !showMeditation">
            <span class="swatch swatchMeditation" aria-hidden="true"></span>
            Meditation
          </button>
        </div>

        <div class="chartWrap" @mouseleave="hoverIndex = null">
          <svg class="chart" viewBox="0 0 560 260" role="img" aria-label="Weekly process chart">
            <!-- grid -->
            <g opacity=".12">
              <path v-for="y in 5" :key="y" :d="`M40 ${30 + (y-1)*40} H520`" stroke="currentColor" stroke-width="1" />
            </g>

            <!-- area -->
            <path
              v-if="showWork"
              :d="workAreaPath"
              class="area areaWork"
            />
            <path
              v-if="showMeditation"
              :d="medAreaPath"
              class="area areaMeditation"
            />

            <!-- lines -->
            <path v-if="showWork" :d="workLinePath" class="line lineWork" />
            <path v-if="showMeditation" :d="medLinePath" class="line lineMeditation" />

            <!-- points -->
            <g v-for="(d, i) in weekDays" :key="d">
              <circle
                v-if="showWork"
                class="pt ptWork"
                :cx="xScale(i)"
                :cy="yScale(workData[i])"
                r="4"
                @mouseenter="hoverIndex = i"
              />
              <circle
                v-if="showMeditation"
                class="pt ptMeditation"
                :cx="xScale(i)"
                :cy="yScale(medData[i])"
                r="4"
                @mouseenter="hoverIndex = i"
              />
            </g>

            <!-- tooltip -->
            <g v-if="hoverIndex !== null" class="tip">
              <rect
                :x="Math.min(xScale(hoverIndex) + 10, 390)"
                :y="18"
                width="150"
                height="52"
                rx="12"
              />
              <text :x="Math.min(xScale(hoverIndex) + 20, 400)" y="42">
                {{ weekDays[hoverIndex] }}
              </text>
              <text :x="Math.min(xScale(hoverIndex) + 20, 400)" y="62" opacity=".85">
                Work: {{ workData[hoverIndex] }} • Meditation: {{ medData[hoverIndex] }}
              </text>
            </g>

            <!-- x labels -->
            <g class="xlab" opacity=".7">
              <text v-for="(d, i) in weekDays" :key="d" :x="xScale(i)" y="246" text-anchor="middle">{{ d }}</text>
            </g>
          </svg>
        </div>
      </article>

      <!-- Month Progress -->
      <article class="card cardTight">
        <div class="cardHead">
          <h3>Month Progress</h3>
          <button class="ghostIcon" type="button" title="Analytics" @click="notify('Analytics: demo', 'info')">
            <svg viewBox="0 0 24 24" fill="none"><path d="M6 19V5M12 19V9M18 19v-7" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/><path d="M4 19h16" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg>
          </button>
        </div>

        <div class="monthMeta">
          <div class="pct">{{ monthProgress }}%</div>
          <div class="muted">completed to last month*</div>
        </div>

        <div class="monthBody">
          <div class="overview">
            <div class="ovTitle">OVERVIEW</div>
            <div class="ovRow"><span class="dot dotWork"></span> Work</div>
            <div class="ovRow"><span class="dot dotMedit"></span> Meditation</div>
            <div class="ovRow"><span class="dot dotProj"></span> Project's</div>
          </div>

          <div class="donut" aria-label="month donut">
            <svg viewBox="0 0 120 120">
              <circle class="donutTrack" cx="60" cy="60" r="44" />
              <circle
                class="donutFill"
                cx="60"
                cy="60"
                r="44"
                :stroke-dasharray="donutDash"
                stroke-dashoffset="0"
              />
              <text x="60" y="63" text-anchor="middle" class="donutText">{{ monthProgress }}%</text>
            </svg>
          </div>
        </div>

        <div class="monthActions">
          <button class="pill" type="button" title="Share" @click="shareReport">
            <svg viewBox="0 0 24 24" fill="none"><path d="M16 8a3 3 0 1 0-2.8-4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/><path d="M6 14a3 3 0 1 0 0 6 3 3 0 0 0 0-6Zm12-5a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z" stroke="currentColor" stroke-width="1.6"/><path d="M8.4 15.1 15.6 11.9M8.4 18.9 15.6 14.1" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>
          </button>
          <button class="pill pillPrimary" type="button" @click="downloadReport">Download Report</button>
        </div>
      </article>

      <!-- Month goals -->
      <article class="card">
        <div class="cardHead">
          <h3>Month Goal’s</h3>
          <div class="rightTools">
            <div class="chip">{{ doneGoals }}/{{ goals.length }}</div>
            <button class="ghostIcon" type="button" title="Edit" @click="notify('Goals edit: demo', 'info')">
              <svg viewBox="0 0 24 24" fill="none"><path d="M4 20h4l10.5-10.5a2.8 2.8 0 0 0-4-4L4 16v4Z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><path d="M13.5 6.5 17.5 10.5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>
            </button>
          </div>
        </div>

        <div class="goalList">
          <label v-for="g in goals" :key="g.id" class="goalRow">
            <input type="checkbox" v-model="g.done" @change="persist()" />
            <span class="goalText">{{ g.text }}</span>
            <span class="goalTime">{{ g.time }}</span>
          </label>
        </div>
      </article>

      <!-- Small task cards row -->
      <article class="card tasksRow">
        <div class="taskMini" v-for="t in topTasks" :key="t.id">
          <div class="miniHead">
            <div class="miniTitle2">{{ t.title }}</div>
            <div class="kebabWrap" :ref="(el) => setKebabRef(t.id, el)">
              <button class="kebab" type="button" @click="toggleTaskMenu(t.id)">
                <svg viewBox="0 0 24 24" fill="none"><path d="M6 12h.01M12 12h.01M18 12h.01" stroke="currentColor" stroke-width="3" stroke-linecap="round"/></svg>
              </button>
              <div v-if="taskMenuId === t.id" class="menuPopup small" role="menu">
                <button class="menuItem" type="button" @click="addNote(t.id)">Add Note</button>
                <button class="menuItem" type="button" @click="editTask(t.id)">Edit</button>
                <button class="menuItem danger" type="button" @click="deleteTask(t.id)">Delete</button>
              </div>
            </div>
          </div>
          <div class="miniMeta">{{ t.when }}</div>
          <div class="miniFooter">
            <span class="badge" :class="t.type">{{ t.typeLabel }}</span>
            <span class="shield" title="Private">🛡️</span>
          </div>
        </div>

        <button class="addTask" type="button" @click="openTaskModal('task')">
          <div class="plus">＋</div>
          <div class="addText">Add a task</div>
        </button>
      </article>

      <!-- Last projects row (bottom) -->
      <article class="card lastProjects">
        <div class="cardHead">
          <h3>Last project’s</h3>
          <button class="ghostIcon" type="button" @click="success('Archive: demo')">Open archive</button>
        </div>

        <div class="projGrid">
          <div class="proj" v-for="p in lastProjects" :key="p.id" :class="{ done: p.status === 'completed' }">
            <div class="projTitle">{{ p.title }}</div>
            <div class="projStatus"><span class="dot" :class="p.status"></span> {{ p.statusLabel }}</div>
            <div class="projDesc">{{ p.desc }}</div>
            <div class="projTag">{{ p.tag }}</div>
          </div>
        </div>
      </article>
    </section>

    <!-- Modal: create/edit -->
    <div v-if="modal.open" class="modal" role="dialog" aria-modal="true" @click.self="closeModal">
      <div class="modalCard">
        <div class="modalHead">
          <div class="modalTitle">{{ modal.mode === 'edit' ? 'Edit' : 'Create' }} {{ modal.type === 'project' ? 'Project' : 'Task' }}</div>
          <button class="ghostIcon" type="button" @click="closeModal" title="Close">
            <svg viewBox="0 0 24 24" fill="none"><path d="M6 6l12 12M18 6 6 18" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>
          </button>
        </div>

        <form class="form" @submit.prevent="submitModal">
          <label class="field">
            <span>Title</span>
            <input v-model.trim="modal.form.title" required placeholder="e.g. Meet HR for project" />
          </label>

          <label class="field" v-if="modal.type === 'task'">
            <span>When</span>
            <input v-model.trim="modal.form.when" placeholder="Tonight / Next morning" />
          </label>

          <label class="field" v-if="modal.type === 'task'">
            <span>Type</span>
            <select v-model="modal.form.type">
              <option value="meeting">Meeting</option>
              <option value="work">Work</option>
              <option value="personal">Personal</option>
            </select>
          </label>

          <label class="field" v-if="modal.type === 'project'">
            <span>Status</span>
            <select v-model="modal.form.status">
              <option value="inprogress">In progress</option>
              <option value="completed">Completed</option>
            </select>
          </label>

          <label class="field" v-if="modal.type === 'project'">
            <span>Description</span>
            <textarea v-model.trim="modal.form.desc" rows="3" placeholder="Short description..."></textarea>
          </label>

          <div class="modalActions">
            <button class="btn" type="button" @click="closeModal">Cancel</button>
            <button class="btnPrimary" type="submit">Save</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, reactive, ref } from 'vue'
import { useNotification } from '@/composables/useNotification'

const { success, error: errorNotif, notify } = useNotification()

const userName = 'User'
const initials = computed(() => userName.split(' ').map(s => s[0]).slice(0,2).join('').toUpperCase() || 'U')

// LocalStorage key
const KEY = 'INVESTOR_DASH_V1'

// Default data
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
  } catch {
    // ignore
  }
}

function persist() {
  localStorage.setItem(KEY, JSON.stringify({
    stats: state.stats,
    week: state.week,
    monthProgress: state.monthProgress,
    goals: state.goals,
    tasks: state.tasks,
    projects: state.projects,
  }))
}

onMounted(() => {
  load()
  window.addEventListener('click', onGlobalClick)
})

onBeforeUnmount(() => {
  window.removeEventListener('click', onGlobalClick)
})

// --- computed / derived ---
const stats = computed(() => state.stats)
const monthProgress = computed(() => clamp(Math.round(state.monthProgress), 0, 100))

const overallProgress = computed(() => {
  const done = state.stats.completed
  const plan = state.stats.monthlyPlan || 1
  return clamp(Math.round((done / plan) * 100), 0, 100)
})

const doneGoals = computed(() => state.goals.filter(g => g.done).length)
const goals = computed(() => state.goals)

const topTasks = computed(() => {
  // max 2 small cards like figma
  return state.tasks.slice(0, 2).map(t => ({
    ...t,
    typeLabel: t.type === 'meeting' ? 'Meeting' : t.type === 'work' ? 'Work' : 'Personal'
  }))
})

const lastProjects = computed(() => {
  return state.projects.slice(0, 3).map(p => ({
    ...p,
    statusLabel: p.status === 'completed' ? 'Completed' : 'In progress'
  }))
})

// --- chart ---
const showWork = ref(true)
const showMeditation = ref(true)
const hoverIndex = ref(null)
const weekDays = ['M', 'T', 'W', 'T', 'F', 'S', 'S']

const workData = computed(() => state.week.work)
const medData = computed(() => state.week.meditation)

function xScale(i) {
  const left = 40
  const right = 520
  return left + (i * (right - left) / 6)
}
function yScale(v) {
  const top = 30
  const bottom = 220
  const min = 0
  const max = 60
  const t = (clamp(v, min, max) - min) / (max - min)
  return bottom - t * (bottom - top)
}

function linePath(vals) {
  return vals.map((v, i) => `${i === 0 ? 'M' : 'L'} ${xScale(i)} ${yScale(v)}`).join(' ')
}
function areaPath(vals) {
  const topLine = linePath(vals)
  const leftX = xScale(0)
  const rightX = xScale(6)
  const baseY = 220
  return `${topLine} L ${rightX} ${baseY} L ${leftX} ${baseY} Z`
}

const workLinePath = computed(() => linePath(workData.value))
const medLinePath = computed(() => linePath(medData.value))
const workAreaPath = computed(() => areaPath(workData.value))
const medAreaPath = computed(() => areaPath(medData.value))

function randomizeWeek() {
  try {
    state.week.work = state.week.work.map(() => randInt(18, 56))
    state.week.meditation = state.week.meditation.map(() => randInt(10, 26))
    persist()
    success('Weekly data yangilandi')
  } catch (e) {
    errorNotif('Xatolik: ' + e.message)
  }
}

// --- donut ---
const donutDash = computed(() => {
  const r = 44
  const c = 2 * Math.PI * r
  const filled = c * (monthProgress.value / 100)
  return `${filled} ${c}`
})

// --- menus ---
const createMenu = ref(false)
const createWrap = ref(null)

const taskMenuId = ref(null)
const kebabRefs = new Map()

function setKebabRef(id, el) {
  if (!el) return
  kebabRefs.set(id, el)
}

function toggleCreateMenu() {
  createMenu.value = !createMenu.value
}

function toggleTaskMenu(id) {
  taskMenuId.value = taskMenuId.value === id ? null : id
}

function onGlobalClick(e) {
  const t = e.target

  // close create menu
  if (createMenu.value && createWrap.value && !createWrap.value.contains(t)) {
    createMenu.value = false
  }

  // close task menu
  if (taskMenuId.value) {
    const wrap = kebabRefs.get(taskMenuId.value)
    if (wrap && !wrap.contains(t)) taskMenuId.value = null
  }
}

// --- modal ---
const modal = reactive({
  open: false,
  type: 'task', // task | project
  mode: 'create', // create | edit
  editingId: null,
  form: {
    title: '',
    when: '',
    type: 'meeting',
    status: 'inprogress',
    desc: ''
  }
})

function openTaskModal(type) {
  createMenu.value = false
  modal.open = true
  modal.type = type
  modal.mode = 'create'
  modal.editingId = null
  modal.form.title = ''
  modal.form.when = ''
  modal.form.type = 'meeting'
  modal.form.status = 'inprogress'
  modal.form.desc = ''
}

function editTask(id) {
  taskMenuId.value = null
  const t = state.tasks.find(x => x.id === id)
  if (!t) return
  modal.open = true
  modal.type = 'task'
  modal.mode = 'edit'
  modal.editingId = id
  modal.form.title = t.title
  modal.form.when = t.when
  modal.form.type = t.type
}

function addNote(id) {
  taskMenuId.value = null
  const t = state.tasks.find(x => x.id === id)
  if (!t) return
  const note = prompt('Note kiriting:', t.note || '')
  if (note === null) return
  t.note = note
  persist()
  success('Note saqlandi')
}

function deleteTask(id) {
  taskMenuId.value = null
  state.tasks = state.tasks.filter(x => x.id !== id)
  persist()
  success('Task o‘chirildi')
}

function closeModal() {
  modal.open = false
}

function submitModal() {
  // Validatsiya
  if (!modal.form.title || !modal.form.title.trim()) {
    errorNotif('Sarlavha talab qilinadi')
    return
  }

  if (modal.type === 'task' && modal.form.when && modal.form.when.length > 50) {
    errorNotif('When 50 ta belgidan ortiq bo\'lmasligi kerak')
    return
  }

  if (modal.type === 'project' && modal.form.desc && modal.form.desc.length > 200) {
    errorNotif('Tavsif 200 ta belgidan ortiq bo\'lmasligi kerak')
    return
  }

  if (modal.type === 'task') {
    if (modal.mode === 'edit' && modal.editingId) {
      const t = state.tasks.find(x => x.id === modal.editingId)
      if (t) {
        t.title = modal.form.title
        t.when = modal.form.when || '—'
        t.type = modal.form.type
      }
    } else {
      state.tasks.unshift({
        id: uid('t'),
        title: modal.form.title,
        when: modal.form.when || '—',
        type: modal.form.type,
        note: ''
      })
      state.stats.tasksDone += 1
    }
  } else {
    // project
    state.projects.unshift({
      id: uid('p'),
      title: modal.form.title,
      status: modal.form.status,
      desc: modal.form.desc || '',
      tag: modal.form.status === 'completed' ? 'Completed' : 'In progress'
    })
    state.stats.projectsTotal += 1
    if (modal.form.status === 'completed') state.stats.completed += 1
    else state.stats.inProgress += 1
  }

  persist()
  success('Saqlandi')
  closeModal()
}

// --- report / share ---
function buildReport() {
  return {
    generatedAt: new Date().toISOString(),
    stats: state.stats,
    monthProgress: monthProgress.value,
    goals: state.goals,
    tasks: state.tasks,
    projects: state.projects,
    week: state.week
  }
}

function downloadReport() {
  createMenu.value = false
  const data = buildReport()
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `dashboard-report-${new Date().toISOString().slice(0, 10)}.json`
  a.click()
  URL.revokeObjectURL(url)
  success('Report yuklab olindi')
}

async function shareReport() {
  const data = buildReport()
  const text = `Dashboard report (${monthProgress.value}%)\nTasks: ${state.tasks.length} • Projects: ${state.projects.length}`

  try {
    if (navigator.share) {
      await navigator.share({ title: 'Dashboard Report', text })
      success('Share qilindi')
      return
    }
  } catch {
    // ignore
  }

  try {
    await navigator.clipboard.writeText(text + '\n\n' + JSON.stringify(data, null, 2))
    success('Clipboardga copy qilindi')
  } catch {
    success('Share: ruxsat yo‘q')
  }
}

// --- utils ---
function clamp(n, a, b) { return Math.max(a, Math.min(b, n)) }
function randInt(a, b) { return Math.floor(Math.random() * (b - a + 1)) + a }
function uid(prefix) { return `${prefix}_${Math.random().toString(16).slice(2)}_${Date.now().toString(16)}` }

</script>

<style scoped>
.dash{
  position: relative;
  padding: 22px;
}

.ambient{
  position:absolute;
  inset: -40px;
  background:
    radial-gradient(800px 500px at 20% 10%, rgba(255,255,255,.45), transparent 55%),
    radial-gradient(700px 420px at 85% 25%, rgba(255,255,255,.35), transparent 60%),
    radial-gradient(700px 500px at 50% 90%, rgba(255,255,255,.25), transparent 60%);
  filter: blur(22px);
  opacity: .55;
  pointer-events:none;
}

.topbar{
  position: relative;
  z-index: 1;
  display:flex;
  align-items:center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 18px;
}

.hello{font-size: 28px; font-weight: 760; letter-spacing: -0.02em;}
.helloName{color:#111;}
.sub{color: rgba(17,17,17,.55); margin-top: 4px; font-weight: 520;}

.actions{display:flex; align-items:center; gap: 10px;}

.btnPrimary{
  height: 40px;
  padding: 0 14px;
  border-radius: 999px;
  border: 1px solid rgba(17,17,17,.12);
  background: #0f0f0f;
  color:#fff;
  font-weight: 700;
  display:flex; align-items:center; gap: 8px;
  cursor: pointer;
  box-shadow: 0 16px 40px rgba(0,0,0,.22);
}
.btnPrimary:hover{transform: translateY(-1px);}
.btnPrimary:active{transform: translateY(0px);}

.iconBtn{
  width: 40px; height: 40px;
  border-radius: 999px;
  border: 1px solid rgba(17,17,17,.10);
  background: rgba(255,255,255,.55);
  backdrop-filter: blur(10px);
  cursor:pointer;
  display:grid; place-items:center;
}
.iconBtn svg{width:20px; height:20px;}

.avatar{
  width: 40px; height: 40px;
  border-radius: 999px;
  border: 1px solid rgba(17,17,17,.10);
  background: rgba(0,0,0,.08);
  cursor:pointer;
  font-weight: 800;
}

.createWrap{position: relative; z-index: 100;}
.menuPopup{
  position:absolute;
  right: 0;
  top: 48px;
  width: 190px;
  padding: 8px;
  border-radius: 16px;
  border: 1px solid rgba(17,17,17,.12);
  background: rgba(255,255,255,.78);
  backdrop-filter: blur(18px);
  box-shadow: 0 24px 70px rgba(0,0,0,.18);
  z-index: 1000;
}
.menuPopup.small{width: 160px; top: 38px; z-index: 1000;}
.menuItem{
  width:100%;
  text-align:left;
  border:0;
  background: transparent;
  padding: 10px 10px;
  border-radius: 12px;
  cursor:pointer;
  font-weight: 650;
  color:#111;
}
.menuItem:hover{background: rgba(0,0,0,.06);}
.menuItem.danger{color:#b42318;}
.menuItem.danger:hover{background: rgba(180,35,24,.08);}
.menuSep{height:1px; background: rgba(17,17,17,.10); margin: 6px 8px;}

.grid{
  position: relative;
  z-index: 1;
  display:grid;
  grid-template-columns: 1.2fr 1.1fr .75fr;
  grid-auto-rows: minmax(120px, auto);
  gap: 14px;
}

.card{
  border-radius: 22px;
  border: 1px solid rgba(17,17,17,.10);
  background: rgba(255,255,255,.55);
  backdrop-filter: blur(14px);
  box-shadow: 0 18px 55px rgba(0,0,0,.12);
  padding: 16px;
}
.cardTight{padding: 16px 16px 14px;}

.cardDark{
  background: rgba(15,15,15,.92);
  color:#fff;
  border-color: rgba(255,255,255,.12);
}
.cardDark .muted{color: rgba(255,255,255,.62);}

.cardHead{
  display:flex;
  align-items:center;
  justify-content: space-between;
  gap: 10px;
  margin-bottom: 12px;
}
.cardHead h3{font-size: 15px; font-weight: 800; letter-spacing: -0.01em;}

.cardIcons{display:flex; gap: 6px;}
.ghostIcon{
  width: 36px; height: 36px;
  border-radius: 12px;
  border: 1px solid rgba(255,255,255,.14);
  background: rgba(255,255,255,.06);
  color: currentColor;
  cursor:pointer;
  display:grid; place-items:center;
}
.card:not(.cardDark) .ghostIcon{border-color: rgba(17,17,17,.10); background: rgba(255,255,255,.35);}
.ghostIcon svg{width:18px; height:18px;}

.overallRow{
  display:grid;
  grid-template-columns: auto 1fr 1px auto 1fr;
  gap: 10px;
  align-items:center;
  margin: 6px 0 12px;
}
.bigNum{font-size: 44px; font-weight: 900; letter-spacing: -0.04em;}
.muted{font-size: 12px; font-weight: 650; opacity:.95;}
.divider{height: 38px; background: rgba(255,255,255,.18);}

.progressWrap{margin: 10px 0 14px;}
.progressTrack{height: 8px; border-radius: 999px; background: rgba(255,255,255,.12); overflow:hidden;}
.progressFill{height:100%; border-radius: 999px; background: rgba(255,255,255,.75);}
.progressMeta{margin-top: 8px; font-size: 12px; color: rgba(255,255,255,.62); font-weight: 650;}

.miniGrid{
  display:grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
}
.miniCard{
  border-radius: 16px;
  border: 1px solid rgba(255,255,255,.14);
  background: rgba(255,255,255,.08);
  color:#fff;
  padding: 12px;
  cursor:pointer;
  text-align:left;
}
.miniCardLight{background: rgba(255,255,255,.92); color:#111; border-color: rgba(255,255,255,.0);}
.miniIco{font-weight: 900; opacity:.9;}
.miniTitle{font-size: 12px; font-weight: 700; margin-top: 8px; opacity:.85;}
.miniVal{font-size: 18px; font-weight: 900; margin-top: 2px;}

.legend{display:flex; gap: 10px; margin-bottom: 8px;}
.legendItem{
  border: 1px solid rgba(17,17,17,.10);
  background: rgba(255,255,255,.35);
  padding: 8px 10px;
  border-radius: 999px;
  cursor:pointer;
  font-weight: 700;
  display:flex; align-items:center; gap: 8px;
  opacity: .8;
}
.legendItem.on{opacity: 1;}

.swatch{width:10px; height:10px; border-radius: 999px; display:inline-block;}
.swatchWork{background: #111;}
.swatchMeditation{background: rgba(17,17,17,.40);}

.chartWrap{border-radius: 16px; overflow:hidden; background: rgba(255,255,255,.25); border: 1px solid rgba(17,17,17,.08);}
.chart{width:100%; height: 220px; display:block;}

.area{opacity: .18;}
.areaWork{fill: rgba(0,0,0,.65);}
.areaMeditation{fill: rgba(0,0,0,.25);}
.line{fill:none; stroke-width: 3;}
.lineWork{stroke: rgba(0,0,0,.85);}
.lineMeditation{stroke: rgba(0,0,0,.38);}
.pt{cursor: pointer; opacity: .95;}
.ptWork{fill: rgba(0,0,0,.88);}
.ptMeditation{fill: rgba(0,0,0,.35);}
.tip rect{fill: rgba(0,0,0,.80);}
.tip text{fill: #fff; font-size: 12px; font-weight: 700;}
.xlab text{fill: rgba(17,17,17,.65); font-size: 12px; font-weight: 700;}

.monthMeta{display:flex; align-items:baseline; gap: 8px; margin-bottom: 10px;}
.pct{font-weight: 900; font-size: 18px;}

.monthBody{display:flex; align-items:center; justify-content: space-between; gap: 12px;}
.overview{display:flex; flex-direction:column; gap: 8px;}
.ovTitle{font-size: 12px; font-weight: 900; letter-spacing: .02em; opacity:.75;}
.ovRow{font-weight: 750; font-size: 13px; display:flex; align-items:center; gap: 8px;}
.dot{width:8px; height:8px; border-radius: 999px; display:inline-block; background: rgba(17,17,17,.2);}
.dotWork{background: rgba(0,0,0,.85);}
.dotMedit{background: rgba(0,0,0,.40);}
.dotProj{background: rgba(0,0,0,.20);}

.donut{width: 120px; height: 120px; display:grid; place-items:center;}
.donutTrack{fill:none; stroke: rgba(0,0,0,.12); stroke-width: 10;}
.donutFill{fill:none; stroke: rgba(0,0,0,.85); stroke-width: 10; stroke-linecap: round; transform: rotate(-90deg); transform-origin: 60px 60px;}
.donutText{font-size: 16px; font-weight: 900; fill: rgba(0,0,0,.85);}

.monthActions{display:flex; gap: 10px; margin-top: 12px;}
.pill{
  height: 40px;
  border-radius: 999px;
  border: 1px solid rgba(17,17,17,.10);
  background: rgba(255,255,255,.35);
  cursor:pointer;
  padding: 0 14px;
  display:flex; align-items:center; gap: 8px;
  font-weight: 800;
}
.pill svg{width:18px; height:18px;}
.pillPrimary{background: rgba(0,0,0,.88); color:#fff; border-color: rgba(0,0,0,.0);}

.rightTools{display:flex; align-items:center; gap: 10px;}
.chip{border: 1px solid rgba(17,17,17,.10); background: rgba(255,255,255,.35); padding: 6px 10px; border-radius: 999px; font-weight: 850; font-size: 12px;}

.goalList{display:flex; flex-direction:column; gap: 10px; margin-top: 6px;}
.goalRow{display:flex; align-items:center; gap: 10px; font-weight: 750;}
.goalRow input{width: 18px; height: 18px;}
.goalText{flex:1;}
.goalTime{opacity: .55; font-weight: 800; font-size: 12px;}

.tasksRow{grid-column: 1 / -1; display:grid; grid-template-columns: 1fr 1fr 1.2fr; gap: 14px; align-items: stretch;}
.taskMini{
  border-radius: 18px;
  border: 1px solid rgba(17,17,17,.10);
  background: rgba(255,255,255,.35);
  padding: 14px;
}
.miniHead{display:flex; align-items:flex-start; justify-content: space-between; gap: 10px;}
.miniTitle2{font-weight: 900; letter-spacing: -0.02em;}
.miniMeta{margin-top: 8px; opacity: .6; font-weight: 750;}

.kebabWrap{position: relative; z-index: 100;}
.kebab{
  width: 34px; height: 34px;
  border-radius: 12px;
  border: 1px solid rgba(17,17,17,.10);
  background: rgba(255,255,255,.5);
  cursor:pointer;
  display:grid; place-items:center;
}
.kebab svg{width:18px; height:18px;}

.miniFooter{display:flex; align-items:center; justify-content: space-between; margin-top: 12px;}
.badge{font-size: 12px; font-weight: 900; padding: 6px 10px; border-radius: 999px; border: 1px solid rgba(17,17,17,.10); background: rgba(255,255,255,.45);}
.badge.meeting{background: rgba(0,0,0,.08);}
.badge.work{background: rgba(0,0,0,.06);}
.badge.personal{background: rgba(0,0,0,.04);}
.shield{opacity:.55;}

.addTask{
  border-radius: 18px;
  border: 2px dashed rgba(17,17,17,.18);
  background: rgba(255,255,255,.25);
  display:flex;
  flex-direction: column;
  align-items:center;
  justify-content:center;
  gap: 6px;
  cursor:pointer;
}
.plus{font-size: 28px; font-weight: 900; opacity: .7;}
.addText{font-weight: 900; opacity: .7;}

.lastProjects{grid-column: 1 / -1;}
.projGrid{display:grid; grid-template-columns: repeat(3, 1fr); gap: 14px;}
.proj{
  border-radius: 18px;
  border: 1px solid rgba(17,17,17,.10);
  background: rgba(0,0,0,.88);
  color:#fff;
  padding: 14px;
}
.proj.done{background: rgba(0,0,0,.88);}
.projTitle{font-weight: 900;}
.projStatus{margin-top: 8px; font-weight: 750; opacity: .8; display:flex; align-items:center; gap: 8px;}
.projStatus .dot{background: rgba(255,255,255,.30);}
.projStatus .dot.completed{background: rgba(255,255,255,.68);}
.projStatus .dot.inprogress{background: rgba(255,255,255,.38);}
.projDesc{margin-top: 10px; font-size: 12px; opacity: .75; line-height: 1.35;}
.projTag{margin-top: 12px; font-weight: 900; font-size: 12px; opacity:.7;}

.modal{
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,.35);
  display:grid;
  place-items:center;
  z-index: 999;
  padding: 18px;
}
.modalCard{
  width: min(560px, 100%);
  border-radius: 22px;
  border: 1px solid rgba(255,255,255,.18);
  background: rgba(255,255,255,.88);
  backdrop-filter: blur(18px);
  box-shadow: 0 40px 120px rgba(0,0,0,.28);
  padding: 14px;
}
.modalHead{display:flex; align-items:center; justify-content: space-between; gap: 10px; margin-bottom: 8px;}
.modalTitle{font-weight: 950; letter-spacing: -0.02em;}

.form{display:grid; gap: 10px; padding: 6px 2px 2px;}
.field{display:grid; gap: 6px;}
.field span{font-weight: 850; font-size: 12px; opacity: .75;}
.field input, .field select, .field textarea{
  border-radius: 14px;
  border: 1px solid rgba(17,17,17,.12);
  background: rgba(255,255,255,.70);
  padding: 12px 12px;
  outline: none;
  font-weight: 650;
}
.field input:focus, .field select:focus, .field textarea:focus{border-color: rgba(0,0,0,.35);}

.modalActions{display:flex; justify-content:flex-end; gap: 10px; margin-top: 4px;}
.btn{
  height: 40px;
  padding: 0 14px;
  border-radius: 999px;
  border: 1px solid rgba(17,17,17,.12);
  background: rgba(255,255,255,.60);
  cursor:pointer;
  font-weight: 800;
}

@media (max-width: 1100px){
  .grid{grid-template-columns: 1fr;}
  .tasksRow{grid-template-columns: 1fr;}
  .projGrid{grid-template-columns: 1fr;}
}

@media (max-width: 768px) {
  .dash {
    padding: 16px;
  }

  .topbar {
    flex-direction: column;
    gap: 16px;
  }

  .hello {
    font-size: 20px;
  }

  .actions {
    width: 100%;
    flex-wrap: wrap;
  }

  .btnPrimary {
    flex: 1;
    min-width: 120px;
  }

  .grid {
    gap: 12px;
  }

  .card {
    padding: 12px;
  }

  .miniGrid {
    grid-template-columns: 1fr;
  }

  .monthBody {
    flex-direction: column;
    align-items: stretch;
  }

  .donut {
    width: 100px;
    height: 100px;
  }

  .projGrid {
    grid-template-columns: 1fr;
  }

  .modalCard {
    padding: 12px;
  }

  .form {
    gap: 8px;
  }
}

@media (max-width: 480px) {
  .dash {
    padding: 12px;
  }

  .hello {
    font-size: 18px;
  }

  .helloWrap {
    flex: 1;
  }

  .actions {
    width: 100%;
  }

  .btnPrimary {
    width: 100%;
  }

  .iconBtn {
    width: 36px;
    height: 36px;
  }

  .avatar {
    width: 36px;
    height: 36px;
    font-size: 12px;
  }

  .grid {
    grid-template-columns: 1fr;
    gap: 10px;
  }

  .overallRow {
    flex-direction: column;
    gap: 6px;
  }

  .bigNum {
    font-size: 28px;
  }

  .miniGrid {
    grid-template-columns: 1fr;
  }

  .chartWrap {
    height: 200px;
  }

  .chart {
    height: 180px;
  }

  .legend {
    flex-wrap: wrap;
  }

  .monthActions {
    flex-direction: column;
  }

  .pill {
    width: 100%;
  }

  .rightTools {
    flex-wrap: wrap;
    width: 100%;
  }

  .goalList {
    gap: 8px;
  }

  .tasksRow {
    grid-template-columns: 1fr;
  }

  .taskMini {
    padding: 10px;
  }

  .miniHead {
    gap: 6px;
  }

  .kebab {
    width: 30px;
    height: 30px;
  }

  .menuPopup {
    width: 120px;
  }

  .projGrid {
    grid-template-columns: 1fr;
  }

  .proj {
    padding: 10px;
  }

  .modalCard {
    border-radius: 16px;
    padding: 12px;
  }

  .modalHead {
    margin-bottom: 6px;
  }

  .modalTitle {
    font-size: 16px;
  }

  .field input, .field select, .field textarea {
    padding: 10px;
    font-size: 16px;
  }
}
</style>
