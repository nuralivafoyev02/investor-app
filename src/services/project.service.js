import { BaseService } from './base.service'

const statusByIndex = ['planning', 'inprogress', 'completed']

const fallbackProjects = () => ([
  { id: 'proj_1', name: 'Yangi Toshkent 16-Lot', description: 'Investor mablagʻlari va qurilish xarajatlarini boshqarish paneli.', budget: 210000000, deadline: '2026-09-30', status: 'inprogress', progress: 58 },
  { id: 'proj_2', name: 'Savdo markazi renovatsiyasi', description: 'Bosqichma-bosqich xarajatlar va pudratchilar monitoringi.', budget: 145000000, deadline: '2026-07-20', status: 'planning', progress: 18 },
  { id: 'proj_3', name: 'Premium turar joy loyihasi', description: 'Investorlar bo‘yicha qaytim va likvidlik holatini ko‘rsatish.', budget: 310000000, deadline: '2026-12-15', status: 'completed', progress: 100 }
])

class ProjectService extends BaseService {
  constructor() {
    super({
      storageKey: 'projects',
      endpoint: '/posts?limit=12',
      collectionKey: 'posts',
      fallbackFactory: fallbackProjects,
      mapRemoteItem: (post) => {
        const status = statusByIndex[post.id % statusByIndex.length]
        const progress = status === 'completed' ? 100 : status === 'inprogress' ? 35 + (post.id % 40) : 10 + (post.id % 20)
        const deadline = new Date(Date.now() + (post.id + 10) * 86400000 * 7).toISOString().slice(0, 10)

        return {
          id: `proj_remote_${post.id}`,
          name: post.title,
          description: post.body,
          budget: 25000000 + post.id * 8500000,
          deadline,
          status,
          progress,
          source: 'remote'
        }
      }
    })
  }
}

export const projectService = new ProjectService()
