import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'

Vue.use(Vuex)

const getDefaultState = () => {
  return {
    monthlySpent: 0,
    budgetMoneyTotal: 0,
    monthlyBudgetList: [],
    budgetItemList: [],
    user: null,
    token: null
  }
}

export default new Vuex.Store({
  state: getDefaultState(),
  getters: {
    isAuthenticated (state) {
      return state.user != null
    },
    userToken (state) {
      return state.token
    },
    monthlyBudgetList (state) {
      return state.monthlyBudgetList
    },
    monthlySpent (state) {
      return state.monthlySpent
    },
    budgetItemList (state) {
      return state.budgetItemList
    },
    budgetMoneyTotal (state) {
      return state.budgetMoneyTotal
    }
  },
  mutations: {
    login (state, data) {
      state.user = data.user
      state.userId = data.user.id
    },
    resetState (state) {
      Object.assign(state, getDefaultState())
    },
    logoutUser (state) {
      state.user = null
      state.userId = null
    },
    setToken (state, data) {
      state.token = data
    },
    setMonthlyBudgetList (state, data) {
      state.monthlyBudgetList = data
    },
    setSingleMonthlyBudget (state, data) {
      state.monthlyBudgetList.push(data)
    },
    setBudgetList (state, data) {
      state.budgetItemList = data
    },
    setSingleBudgetItem (state, data) {
      state.budgetItemList.push(data)
    },
    calculateTotal (state, data) {
      state.budgetItemList.push(data)
    },
    setNewTotalSpent (state, data) {
      var total = 0
      for (var item of state.budgetItemList) {
        total += item.budgetPrice
      }
      state.monthlySpent = total
    },
    setBudgetTotalRemaining (state, data) {
      const monthlyBudgetPrice = state.monthlyBudgetList.filter(item => item.budgetId === Number(data.id))
      state.budgetMoneyTotal = monthlyBudgetPrice[0].budgetTotal - state.monthlySpent
    },
    setRemovedItem (state, data) {
      const foundIndex = state.budgetItemList.findIndex(item => item.budgetId === data.id)
      state.budgetItemList.splice(foundIndex, 1)
    }
  },
  actions: {
    login ({
      commit
    }, authData) {
      commit('login', {
        user: authData.user,
        role: authData.user.role,
        propertyId: authData.user.propertyId,
        property: authData.user.property,
        propertyType: authData.user.propertyType
      })
    },
    logout ({
      commit
    }) {
      commit('resetState')
    },
    logoutUser ({
      commit
    }) {
      commit('logoutUser')
    },
    addMonthlyBudgetList ({
      commit
    }, data) {
      commit('setMonthlyBudgetList',
        data)
    },
    addSingleMonthlyBudget ({
      commit
    }, data) {
      commit('setSingleMonthlyBudget',
        data)
    },
    addSingleBudgetItem ({
      commit
    }, data) {
      commit('setSingleBudgetItem',
        data)
    },
    addToken ({
      commit
    }, data) {
      commit('setToken',
        data)
    },
    addBudgetItems ({
      commit
    }, data) {
      commit('setBudgetList',
        data)
    },
    calculateTotalSpent ({
      commit
    }, data) {
      commit('setNewTotalSpent',
        data)
    },
    calculateTotalRemaining ({
      commit
    }, data) {
      commit('setBudgetTotalRemaining',
        data)
    },
    removeBudgetItems ({
      commit
    }, data) {
      commit('setRemovedItem',
        data)
    }

  },
  // enable strict mode (adds overhead!)
  // for dev mode only
  strict: process.env.DEV,
  plugins: [createPersistedState()]
})
