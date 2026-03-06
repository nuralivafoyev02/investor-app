import { BaseService } from './base.service'

class ProjectService extends BaseService {
    constructor() {
        super('projects')
    }

    async updateStatus(id, status) {
        return this.update(id, {
            status,
            tag: status === 'completed' ? 'Completed' : 'In progress'
        })
    }
}

export const projectService = new ProjectService()
