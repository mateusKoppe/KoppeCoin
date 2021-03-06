const TransactionPool = require('./transaction-pool')
const Blockchain = require('../blockchain')
const Wallet = require('../wallet')

describe('TransactionPool', () => {
  let tp, wallet, blockchain, transaction

  beforeEach(() => {
    tp = new TransactionPool()
    wallet = new Wallet()
    blockchain = new Blockchain()
    transaction = wallet.createTransaction('r4nd-4dr355', 30, blockchain, tp)
  })

  it('adds a transaction to the pool', () => {
    expect(tp.transactions.find(t => t.id === transaction.id))
      .toEqual(transaction)
  })

  it('updates a transaction in the poll', () => {
    const oldTransaction = JSON.stringify(transaction)
    const newTransaction = transaction.update(wallet, 'foo-4ddr355', 40)
    tp.updateOrAddTransaction(newTransaction)
    const transactionInPool = tp.transactions.find(t => t.id === newTransaction.id)

    expect(JSON.stringify(transactionInPool))
      .not.toEqual(oldTransaction)
  })

  it('clears transactions', () => {
    tp.clear()
    expect(tp.transactions).toEqual([])
  })

  describe('mixin valid and corrupt transactions', () => {
    let validTransactions

    beforeEach(() => {
      validTransactions = [...tp.transactions]
      for (let i = 0; i < 6; i++) {
        wallet = new Wallet()
        transaction = wallet.createTransaction('r4nd-4dr355', 30, blockchain, tp)
        if (i % 2 === 0) {
          transaction.input.amount = 9999
        } else {
          validTransactions.push(transaction)
        }
      }
    })

    it('shows a differecen betwen valid and corrput transaction', () => {
      expect(JSON.stringify(tp.transactions)).not.toEqual(JSON.stringify(validTransactions))
    })

    it('grabs valid transactions', () => {
      expect(tp.validTransactions()).toEqual(validTransactions)
    })
  })
})
