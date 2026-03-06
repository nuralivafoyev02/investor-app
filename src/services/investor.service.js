import { BaseService } from './base.service'

class InvestorService extends BaseService {
    constructor() {
        super('investors')
    }

    // Domain specific logic can be added here
    async getInvestmentTiers() {
        await this.simulate()
        return [
            { id: 'seed', label: 'Seed Investor', min: 1000 },
            { id: 'seriesA', label: 'Series A', min: 50000 },
            { id: 'whale', label: 'Institutional Whale', min: 1000000 }
        ]
    }
}

export const investorService = new InvestorService()
