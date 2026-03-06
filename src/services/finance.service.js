import { BaseService } from './base.service'

const expenseCategories = ['Operations', 'Marketing', 'Infrastructure', 'Personnel', 'Miscellaneous']
const vaultTypes = ['Cash', 'Card', 'Bank']
const vaultColors = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#14b8a6']

const fallbackCashboxes = () => ([
  { id: 'cash_1', name: 'Main Reserve', type: 'Bank', balance: 180000000, color: '#6366f1', transactions: [] },
  { id: 'cash_2', name: 'Operational Cash', type: 'Cash', balance: 46000000, color: '#10b981', transactions: [] },
  { id: 'cash_3', name: 'Card Pool', type: 'Card', balance: 27500000, color: '#f59e0b', transactions: [] },
])

const fallbackExpenses = () => ([
  { id: 'exp_1', category: 'Operations', description: 'Site logistics and daily supplies', amount: 2800000, date: '2026-03-01' },
  { id: 'exp_2', category: 'Infrastructure', description: 'Server and platform maintenance', amount: 1350000, date: '2026-03-03' },
  { id: 'exp_3', category: 'Personnel', description: 'Field supervision payout', amount: 4200000, date: '2026-03-05' },
])

class CashboxService extends BaseService {
  constructor() {
    super({
      storageKey: 'cashboxes',
      endpoint: '/users?limit=5',
      collectionKey: 'users',
      fallbackFactory: fallbackCashboxes,
      mapRemoteItem: (user) => ({
        id: `cash_remote_${user.id}`,
        name: `${user.firstName} ${user.lastName} ${vaultTypes[user.id % vaultTypes.length]} Account`,
        type: vaultTypes[user.id % vaultTypes.length],
        balance: 15000000 + user.id * 6700000,
        color: vaultColors[user.id % vaultColors.length],
        transactions: [],
        source: 'remote'
      })
    })
  }

  async addTransaction(cashboxId, transaction) {
    await this.simulate()
    const cashboxes = this.getAll()
    const cashbox = cashboxes.find((item) => String(item.id) === String(cashboxId))

    if (!cashbox) throw new Error('Cashbox not found')

    const newTransaction = {
      ...transaction,
      id: `txn_${Date.now()}`,
      timestamp: new Date().toISOString()
    }

    if (!cashbox.transactions) cashbox.transactions = []
    cashbox.transactions.unshift(newTransaction)

    const amount = Number(transaction.amount || 0)
    cashbox.balance += transaction.type === 'income' ? amount : -amount

    this.save(cashboxes)
    return cashbox
  }
}

class ExpenseService extends BaseService {
  constructor() {
    super({
      storageKey: 'expenses',
      endpoint: '/todos?limit=15',
      collectionKey: 'todos',
      fallbackFactory: fallbackExpenses,
      mapRemoteItem: (todo) => ({
        id: `exp_remote_${todo.id}`,
        category: expenseCategories[todo.id % expenseCategories.length],
        description: todo.todo,
        amount: 350000 + todo.id * 125000,
        date: new Date(Date.now() - todo.id * 86400000).toISOString().slice(0, 10),
        source: 'remote'
      })
    })
  }
}

export const financeService = new CashboxService()
export const expenseService = new ExpenseService()
