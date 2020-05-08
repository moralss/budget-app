<template>
  <q-page>
    <h5 class="text-h5"> Budget Summary </h5>
    <div class="col">
      <!-- <q-item-label header> Salary Left {{salaryDetailList.total}} </!-->
      <h7 class="text-h7"> Fill in a Budget </h7>
      <q-input
        ref="budgetName"
        label="label"
        class="col q-pa-sm"
        type="text"
        v-model="budgetName"
        :rules="[val => !!val || 'Label is required']"
      />
      <q-input
        ref="budgetPrice"
        label="budget"
        class="col q-pa-sm"
        type="text"
        v-model="budgetPrice"
        :rules="[val => !!val || 'budget is required']"
      />

      <q-btn
        class="q-ma-md"
        label="submit budget"
        type="submit"
        @click="submitBudget"
      />
    </div>

    <div
      class="q-pa-md q-gutter-md"
      style="width:100%;"
    >
      <q-item-label header>monthly spent : {{monthlySpent}}</q-item-label>
      <q-item-label header>monthly budget left : {{budgetMoneyTotal}}</q-item-label>
      <q-item-label header>Budgets</q-item-label>
      <q-list>
        <q-item
          clickable
          v-ripple
          bordered
          padding
          class="rounded-borders"
          v-for="budget in budgetItemList "
          :key="budget.budgetId"
        >
          <q-item-section
            avatar
            top
          >
            <q-avatar
              icon="folder"
              color="primary"
              text-color="white"
            />
          </q-item-section>
          <q-item-section>
            <q-item-label lines="1">{{budget.budgetName}}</q-item-label>
            <q-item-label caption>R {{budget.budgetPrice}}</q-item-label>
          </q-item-section>
          <q-item-section side>
            <!-- {{budget.date}} -->
            <q-icon
              name="info"
              color="green"
            />

            <q-btn
              icon="delete"
              class="q-ma-md"
              label="delete"
              @click="deleteSelectedBudget(budget.budgetId)"
            />
          </q-item-section>
        </q-item>
        <q-separator spaced />
      </q-list>
    </div>
  </q-page>
</template>

<script>
import axios from 'axios'
export default {
  name: 'Dashboard',
  data () {
    return {
      drawerRight: false,
      budgetName: '',
      budgetPrice: 0
    }
  },
  computed: {
    budgetItemList () {
      return JSON.parse(JSON.stringify(this.$store.getters.budgetItemList))
    },
    userToken () {
      return JSON.parse(JSON.stringify(this.$store.getters.userToken))
    },
    monthlySpent () {
      return JSON.parse(JSON.stringify(this.$store.getters.monthlySpent))
    },
    budgetMoneyTotal () {
      return JSON.parse(JSON.stringify(this.$store.getters.budgetMoneyTotal))
    }
  },
  async created () {
    try {
      const query = `?id=${this.$route.params.id}`
      console.log(query)
      const headers = { headers: { Authorization: this.userToken } }
      const { data } = await axios.get(`http://localhost:8000/api/budget${query}`, headers)
      this.$store.dispatch('addBudgetItems',
        data
      )
      this.$store.dispatch('calculateTotalSpent'
      )
      this.$store.dispatch('calculateTotalRemaining',
        { id: this.$route.params.id }
      )
    } catch (e) {
      console.log(e)
    }
  },
  methods: {
    async submitBudget () {
      try {
        const dataObj = { budgetName: this.budgetName, budgetPrice: this.budgetPrice, monthlyBudgetId: this.$route.params.id }
        const query = `?id=${this.$route.params.id}`
        const url = 'http://localhost:8000/api/budget'
        const headers = { headers: { Authorization: this.userToken } }
        await axios.post(url, dataObj, headers)
        const response = await axios.get(url + query, headers)
        this.$store.dispatch('addBudgetItems',
          response.data
        )
        this.$store.dispatch('calculateTotalSpent'
        )
        this.$store.dispatch('calculateTotalRemaining',
          { id: this.$route.params.id }
        )
      } catch (e) {
        console.log(e)
      }
    },
    async deleteSelectedBudget (budgetId) {
      try {
        const query = `?id=${budgetId}`
        const headers = { headers: { Authorization: this.userToken } }
        const url = 'http://localhost:8000/api/budget'
        await axios.delete(url + query, headers)
        this.$store.dispatch('removeBudgetItems',
          { id: budgetId }
        )
        this.$store.dispatch('calculateTotalSpent'
        )
        this.$store.dispatch('calculateTotalRemaining',
          { id: this.$route.params.id }
        )
      } catch (e) {
        console.log(e)
      }
    }
  }
}
</script>
