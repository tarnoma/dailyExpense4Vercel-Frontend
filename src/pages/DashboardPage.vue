<template>
  <q-page padding>
    <div class="q-mb-md text-h3 text-bold flex flex-center">Dashboard</div>

    <div class="full-width row flex flex-center">
      <q-card flat bordered class="q-mb-sm" style="width: 100%">
        <q-card-section>
          <apexchart
            height="400"
            type="line"
            :options="options"
            :series="series"
            color="grey-10"
          />
        </q-card-section>
      </q-card>
    </div>
    <div class="row flex flex-center">
      <DashboardCardComponent
        color="text-pink"
        title="Today"
        :spent="`${expenese.today.toFixed(2)}`"
      />
      <DashboardCardComponent
        color="text-blue"
        title="Yesterday"
        :spent="`${expenese.yesterday.toFixed(2)}`"
      />
      <DashboardCardComponent
        color="text-green"
        title="Last 7 day"
        :spent="`${expenese.sevenday.toFixed(2)}`"
      />
      <DashboardCardComponent
        color="text-pink-4"
        title="Last 30 day"
        :spent="`${expenese.month.toFixed(2)}`"
      />
      <DashboardCardComponent
        color="text-grey-6"
        title="Current Year"
        :spent="`${expenese.year.toFixed(2)}`"
      />
      <DashboardCardComponent
        color="text-red"
        title="Total"
        :spent="`${expenese.total.toFixed(2)}`"
      />

      <DashboardCardComponent
        color="text-purple"
        :title="dateShow"
        :spent="`${expenese.custom.toFixed(2)}`"
      >
        <template v-slot:addmore>
          <q-icon name="event" class="cursor-pointer" size="1.5rem">
            <q-popup-proxy
              cover
              transition-show="scale"
              transition-hide="scale"
            >
              <q-date
                v-model="dateRange"
                @update:model-value="rangeToShow"
                range
                color="grey-10"
                mask="MM/DD/YYYY"
              >
                <div class="row items-center justify-end">
                  <q-btn v-close-popup label="Close" color="primary" flat />
                </div>
              </q-date>
            </q-popup-proxy>
          </q-icon> </template
      ></DashboardCardComponent>
    </div>
  </q-page>
</template>
<script>
import { defineComponent } from "vue";
import DashboardCardComponent from "src/components/DashboardCardComponent.vue";
import { useMockDatabase } from "src/stores/database";
import { useStoreUser } from "stores/user";

export default defineComponent({
  name: "DashboardPage",
  components: { DashboardCardComponent },
  data() {
    return {
      dateRange: null,
      dateShow: "Please select date",
      database: useMockDatabase(),
      userStore: useStoreUser(),
      allMyExpenese: null,
      expenese: {
        today: 0,
        yesterday: 0,
        sevenday: 0,
        month: 0,
        year: 0,
        total: 0,
        custom: 0,
      },
      options: {
        chart: {
          id: "spending-chart",
        },
        xaxis: {
          type: "datetime",
        },
        dataLabels: {
          enabled: false,
        },
        colors: ["#363636"],
        markers: {
          size: 5,
        },
        stroke: {
          curve: "smooth",
        },
      },
      series: [
        {
          name: "Spending",
          data: [],
        },
      ],
    };
  },
  methods: {
    rangeToShow() {
      if (this.dateRange) {
        this.expenese.custom = 0;
        var from = new Date(this.dateRange.from);

        var to = new Date(this.dateRange.to);
        if (this.dateRange.from != null || this.dateRange.to != null) {
          this.dateShow = `${from.toLocaleDateString()} - ${to.toLocaleDateString()}`;
          for (const i in this.allMyExpenese) {
            var disday = new Date(this.allMyExpenese[i].date);
            if (disday >= from && to >= disday) {
              this.expenese.custom += parseFloat(this.allMyExpenese[i].spent);
            }
          }
        } else {
          var ff = new Date(this.dateRange);
          this.dateShow = ff.toLocaleDateString();
          for (const i in this.allMyExpenese) {
            var disday = new Date(this.allMyExpenese[i].date);
            if (disday.toLocaleDateString() == ff.toLocaleDateString()) {
              this.expenese.custom += parseFloat(this.allMyExpenese[i].spent);
            }
          }
        }
      } else {
        this.expenese.custom = 0;
        this.dateShow = "Please select date";
      }
    },
    getExpenses() {
      this.allMyExpenese = this.database.getMyExpeneses(
        this.userStore.userid,
        this.userStore.accessToken
      );
    },
    calculateExpenses() {
      var d = new Date();
      var temp = new Date();
      for (const i in this.allMyExpenese) {
        var disday = new Date(this.allMyExpenese[i].date);

        //today
        if (this.allMyExpenese[i].date == d.toLocaleDateString()) {
          this.expenese.today += parseFloat(this.allMyExpenese[i].spent);
        }

        //yesterday
        temp = new Date();
        temp.setDate(d.getDate() - 1);
        if (this.allMyExpenese[i].date == temp.toLocaleDateString()) {
          this.expenese.yesterday += parseFloat(this.allMyExpenese[i].spent);
        }

        //last 7 day
        temp = new Date();
        temp.setDate(d.getDate() - 7);
        if (disday > temp && disday <= d) {
          this.expenese.sevenday += parseFloat(this.allMyExpenese[i].spent);
        }

        //last 30 day
        temp = new Date();
        temp.setDate(d.getDate() - 30);
        if (disday > temp && disday <= d) {
          this.expenese.month += parseFloat(this.allMyExpenese[i].spent);
        }

        //year
        if (disday.getFullYear() == d.getFullYear()) {
          this.expenese.year += parseFloat(this.allMyExpenese[i].spent);
        }

        //all
        this.expenese.total += parseFloat(this.allMyExpenese[i].spent);
        //this.options.xaxis.categories.push(disday.toLocaleDateString());
        var yesir = false;
        this.series[0].data.forEach((item, index) => {
          if (item[0] == disday.getTime() + 86400000) {
            this.series[0].data[index][1] += parseFloat(
              this.allMyExpenese[i].spent
            );
            yesir = true;
          }
        });
        if (!yesir)
          this.series[0].data.push([
            disday.getTime() + 86400000,
            parseFloat(this.allMyExpenese[i].spent),
          ]);
      }
    },
  },
  created() {
    this.getExpenses();
    this.calculateExpenses();
    if (!this.userStore.userid) this.$router.push("/login");
  },
});
</script>
