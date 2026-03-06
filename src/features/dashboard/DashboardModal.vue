<template>
  <div v-if="visible" class="modal-overlay" role="dialog" aria-modal="true" @click.self="emit('close')">
    <div class="modal-content premium-glow">
      <div class="modal-header">
        <h2 class="modal-title">{{ resolvedTitle }}</h2>
        <button class="close-btn" type="button" @click="emit('close')" :title="t('common.close')">
          <IconClose />
        </button>
      </div>

      <template v-if="hasCustomContent">
        <div class="modal-slot-body">
          <slot />
        </div>
      </template>

      <form v-else class="modal-form" @submit.prevent="handleSubmit">
        <div class="form-group">
          <label>{{ t('dashboard.modal.fields.title') }}</label>
          <input
            v-model.trim="form.title"
            required
            :placeholder="type === 'project' ? t('dashboard.modal.placeholders.projectTitle') : t('dashboard.modal.placeholders.taskTitle')"
            class="form-input"
          />
        </div>

        <template v-if="type === 'task'">
          <div class="form-group">
            <label>{{ t('dashboard.modal.fields.when') }}</label>
            <input
              v-model.trim="form.when"
              :placeholder="t('dashboard.modal.placeholders.when')"
              class="form-input"
            />
          </div>

          <div class="form-group">
            <label>{{ t('dashboard.modal.fields.type') }}</label>
            <select v-model="form.type" class="form-select">
              <option value="meeting">{{ t('dashboard.modal.options.meeting') }}</option>
              <option value="work">{{ t('dashboard.modal.options.work') }}</option>
              <option value="personal">{{ t('dashboard.modal.options.personal') }}</option>
            </select>
          </div>
        </template>

        <template v-else>
          <div class="form-group">
            <label>{{ t('dashboard.modal.fields.status') }}</label>
            <select v-model="form.status" class="form-select">
              <option value="inprogress">{{ t('projects.status.inProgress') }}</option>
              <option value="completed">{{ t('projects.status.completed') }}</option>
            </select>
          </div>

          <div class="form-group">
            <label>{{ t('dashboard.modal.fields.description') }}</label>
            <textarea
              v-model.trim="form.desc"
              rows="3"
              :placeholder="t('dashboard.modal.placeholders.description')"
              class="form-textarea"
            />
          </div>
        </template>

        <div class="modal-footer">
          <button class="btn-ghost" type="button" @click="emit('close')">{{ t('common.cancel') }}</button>
          <button class="btn-primary" type="submit">
            {{ mode === 'edit' ? t('common.save') : t('dashboard.modal.create') }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { computed, reactive, useSlots, watch } from 'vue'
import { useI18n } from '@/composables/useI18n'
import IconClose from '@/ui/icons/IconClose.vue'

const props = defineProps({
  isOpen: { type: Boolean, default: true },
  title: { type: String, default: '' },
  type: { type: String, default: 'task' },
  mode: { type: String, default: 'create' },
  initialData: { type: Object, default: () => ({}) }
})

const emit = defineEmits(['close', 'submit'])
const { t } = useI18n()
const slots = useSlots()

const hasCustomContent = computed(() => Boolean(slots.default))
const visible = computed(() => hasCustomContent.value || props.isOpen)
const resolvedTitle = computed(() => {
  if (props.title) return props.title
  return t(props.mode === 'edit' ? 'dashboard.modal.editTitle' : 'dashboard.modal.createTitle', {
    type: props.type === 'project' ? t('projects.title') : t('dashboard.tasks.title')
  })
})

const form = reactive({
  title: '',
  when: '',
  type: 'meeting',
  status: 'inprogress',
  desc: ''
})

watch(
  () => [props.isOpen, props.initialData, props.type],
  ([isOpen]) => {
    if (!isOpen && !hasCustomContent.value) return
    form.title = props.initialData.title || ''
    form.when = props.initialData.when || ''
    form.type = props.initialData.type || 'meeting'
    form.status = props.initialData.status || 'inprogress'
    form.desc = props.initialData.desc || ''
  },
  { immediate: true, deep: true }
)

const handleSubmit = () => {
  emit('submit', { ...form })
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(8px);
  display: grid;
  place-items: center;
  z-index: 1000;
  padding: var(--space-md);
}

.modal-content {
  background: var(--bg-card);
  width: 100%;
  max-width: 520px;
  border-radius: var(--radius-xl);
  padding: var(--space-xl);
  box-shadow: var(--shadow-premium);
  border: 1px solid var(--border-light);
}

.modal-slot-body {
  margin-top: var(--space-md);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-lg);
}

.modal-title {
  font-size: 24px;
  font-weight: 800;
  color: var(--text-main);
  letter-spacing: -0.01em;
}

.close-btn {
  background: var(--bg-main);
  border: none;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  cursor: pointer;
  color: var(--text-muted);
  transition: var(--trans-fast);
}

.close-btn:hover {
  transform: rotate(90deg);
  background: #fee2e2;
  color: var(--danger);
}

.modal-form {
  display: flex;
  flex-direction: column;
  gap: var(--space-lg);
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: var(--space-xs);
}

.form-group label {
  font-size: 13px;
  font-weight: 700;
  color: var(--text-muted);
  margin-left: 4px;
}

.form-input,
.form-select,
.form-textarea {
  width: 100%;
  padding: 12px 16px;
  border-radius: var(--radius-md);
  border: 2px solid var(--bg-main);
  background: var(--bg-main);
  font-size: 15px;
  font-weight: 600;
  color: var(--text-main);
  transition: var(--trans-fast);
}

.form-input:focus,
.form-select:focus,
.form-textarea:focus {
  outline: none;
  border-color: var(--primary);
  background: var(--bg-card);
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: var(--space-md);
  margin-top: var(--space-md);
}

.btn-ghost {
  padding: 12px 24px;
  border-radius: var(--radius-full);
  border: none;
  background: transparent;
  font-weight: 700;
  cursor: pointer;
  color: var(--text-muted);
}

.btn-primary {
  padding: 12px 32px;
  border-radius: var(--radius-full);
  border: none;
  background: var(--primary);
  color: #fff;
  font-weight: 700;
  cursor: pointer;
  transition: var(--trans-fast);
  box-shadow: var(--shadow-md);
}

.btn-primary:hover {
  transform: translateY(-2px);
  background: var(--primary-hover);
  box-shadow: var(--shadow-lg);
}
</style>
