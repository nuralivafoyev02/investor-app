import { BaseService } from './base.service'

const fallbackInvestors = () => ([
  { id: 'inv_1', name: 'Mirsaid Karimov', email: 'mirsaid@example.com', phone: '+998 90 100 20 30', amount: 85000000, status: 'active' },
  { id: 'inv_2', name: 'Aziza Rahimova', email: 'aziza@example.com', phone: '+998 91 770 55 11', amount: 42000000, status: 'active' },
  { id: 'inv_3', name: 'Sardor Yuldashev', email: 'sardor@example.com', phone: '+998 93 555 90 10', amount: 26000000, status: 'inactive' },
])

class InvestorService extends BaseService {
  constructor() {
    super({
      storageKey: 'investors',
      endpoint: '/users?limit=12',
      collectionKey: 'users',
      fallbackFactory: fallbackInvestors,
      mapRemoteItem: (user) => ({
        id: `inv_remote_${user.id}`,
        name: `${user.firstName} ${user.lastName}`,
        email: user.email,
        phone: user.phone || '+998 90 000 00 00',
        amount: 15000000 + user.id * 3750000,
        status: user.id % 4 === 0 ? 'inactive' : 'active',
        source: 'remote'
      })
    })
  }
}

export const investorService = new InvestorService()
