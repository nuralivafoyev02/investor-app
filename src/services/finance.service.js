import { BaseService } from './base.service'

class FinanceService extends BaseService {
    constructor() {
        super('cashboxes')
    }

    async addTransaction(cashboxId, transaction) {
        await this.simulate()
        const cashboxes = this.getAll()
        const cashbox = cashboxes.find(cb => cb.id === cashboxId)
        if (!cashbox) throw new Error('Cashbox not found')

        const newTrans = {
            ...transaction,
            id: 'trans_' + Date.now(),
            timestamp: new Date().toISOString()
        }

        if (!cashbox.transactions) cashbox.transactions = []
        cashbox.transactions.unshift(newTrans)

        if (transaction.type === 'income') {
            cashbox.balance += Number(transaction.amount)
        } else {
            cashbox.balance -= Number(transaction.amount)
        }

        this.save(cashboxes)
        return cashbox
    }
}

export const financeService = new FinanceService()
