<template>
  <q-page>
    <div class="col">
      <q-date
        style="margin:3rem;width:2rem;"
        v-model="monthDate"
        todayBtn
        lang="en-AU"
        :display-value="true"
        auto-update-value
        lazy-rules
        :ref="'monthDate'"
        :date-options="'future'"
        :rules="[val => !!val || 'Date is required']"
      />
    </div>
    <!-- <q-datetime-picker
        v-if="f.type ==='datetime' || f.type ==='date'"
        :label="f.label+':'"
        todayBtn
        lang="en-AU"
        @show="currentTimeOptionRule = f.timeOptionRule;currentDateModel =f.name"
        class="col"
        :display-value="true"
        :rules="f.rules"
        :date-options="f.dateOptions"
        :time-options="getTimeOptions"
        :ref="f.name"
        :mode="f.type"
        color="primary"
        auto-update-value
        v-model="models[f.name]"
        format24h
        lazy-rules
      ></q-datetime-picker> -->
    <!--
        <h7
        class="text-h7"
      > Salary {{monthlySalary.monthlySalary}} </h7> -->
    <q-input
      ref="monthBudget"
      label="Enter Month Budget"
      class="col q-pa-sm"
      type="text"
      v-model="monthBudget"
      :rules="[val => !!val || 'month entered is required']"
    />
    <q-btn
      class="q-mt-sm q-pa-sm col"
      color="primary"
      label="submit"
      type="submit"
      @click="addToMonthlyBudget"
      :loading="submitting"
    />
    <!-- <q-btn
        type="submit"
        :loading="submitting"
        @click="submit"
        label="Submit"
        class="q-mt-sm q-pa-sm col"
        color="primary"
      > -->
    <!-- </div> -->
    <div class="q-pa-md">
      <q-table
        title="Monthly Budgets"
        :data="monthlyBudgetList"
        :columns="columns"
        row-key="name"
      >
        <template v-slot:body-cell="props">
          <q-td
            :props="props"
            @click.native="tappedRow(props.row.budgetId)"
          >
            <div>{{ props.value }}</div>
          </q-td>
        </template>

      </q-table>
    </div>
    <div
      v-if="loading"
      class="fixed-center"
    >
      <q-spinner-facebook
        class="text-secondary loader"
        size="6em"
      />
    </div>
  </q-page>
</template>
<script>
import axios from 'axios'
export default {
  name: 'PageHome',
  data () {
    return {
      monthBudget: 0,
      monthDate: 0,
      date: '2019/02/01',
      salaryDetailList: [],
      loading: false,
      submitting: false,
      columns: [
        {
          name: 'budgetTotal',
          align: 'left',
          label: 'budgetTotal',
          field: 'budgetTotal',
          sortable: true
        },
        // {
        //   name: 'total', align: 'left', label: 'salary spent', field: 'total', sortable: true
        // },
        {
          name: 'budgetDate', align: 'left', label: 'budgetDate', field: 'budgetDate', sortable: true
        }
      ]
    }
  },
  computed: {
    monthlyBudgetList () {
      return JSON.parse(JSON.stringify(this.$store.getters.monthlyBudgetList))
    },
    userToken () {
      return JSON.parse(JSON.stringify(this.$store.getters.userToken))
    }

  },
  async created () {
    try {
      this.$fireAuth.currentUser.getIdToken(true)
        .then((idToken) => {
          console.log('idToken', idToken)
          const headers = { headers: { Authorization: `Bearer ${idToken}` } }
          axios.get('http://localhost:8000/api/monthly', headers).then((response) => {
            this.$store.dispatch('addMonthlyBudgetList',
              response.data
            )
          }).catch(e => console.log(e))

          this.$store.dispatch('addToken',
            `Bearer ${idToken}`
          )
        }).catch(e => console.log(e))
      this.loading = false
    } catch (e) {
      console.log(e.response)
      this.loading = false
    }
  },
  methods: {
    validateFields () {
      // for (var i = 0; i < this.fields.length; i++) {
      //   // Date validation is broken on this component...
      //   const x = this.fields[i].name
      //   console.log('show me x please', x)
      //   //   if (this.fields[i].type === 'select') {
      //   //     this.$refs[x][0].validate()
      //   //   } else {
      //   //     this.$refs[x][0].validate()
      //   //   }
      // }
    },
    test () {

    },
    async addToMonthlyBudget () {
      // this.validateFields()
      try {
        this.submitting = true

        // if (!this.checkhaserror()) {
        //   this.submitting = true
        //   if (!this.uploadimages()) {
        //     if (this.mode === 'create') {
        //       this.adddata()
        //     } else {
        //       this.updatedata()
        //     }
        //   }
        // }
        const dataObj = { budgetDate: this.monthDate, budgetTotal: this.monthBudget }
        const headers = { headers: { Authorization: this.userToken } }
        const { data } = await axios.post('http://localhost:8000/api/monthly', dataObj, headers
        )
        console.log('data ', data)
        this.$store.dispatch('addSingleMonthlyBudget',
          data
        )

        this.submitting = false
      } catch (e) {
        console.log(e)
        this.submitting = false
      }
    },
    tappedRow (id) {
      this.$router.push(`/dashboard/${id}`)
    }
  }
}
</script>
<style lang="scss">
.loader {
  left: 50%;
  margin-left: -4em;
}
</style>
