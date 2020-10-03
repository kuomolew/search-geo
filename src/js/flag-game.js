$(() => {
  const MAX_ROUNDS = 4;
  const VARIANTS_AMOUNT = 3;

  new Vue({
    el: "#app",
    data() {
      return {
        gamePlaying: false,
        gameScore: false,
        gameMode: "flag",
        isFlagGame: true,
        isCapitalGame: false,
        area: "europe",
        maxRounds: MAX_ROUNDS,
        currentRound: 0,
        currentPersent: 0,
        variantsAmount: VARIANTS_AMOUNT,
        variants: [],
        chosen: -1,
        data: [],
        areFlagsOpen: false,
        answers: 0,
        answersPersent: 0,
        wrongAnswersPersent: 0,
      };
    },
    methods: {
      reset() {
        this.gamePlaying = false;
        this.gameScore = false;
        this.gameMode = "flag";
        this.isFlagGame = true;
        this.isCapitalGame = false;
        this.area = "europe";
        this.currentRound = 0;
        this.currentPersent = 0;
        this.variants = [];
        this.chosen = -1;
        this.data = [];
        this.areFlagsOpen = false;
        this.answers = 0;
        this.answersPersent = 0;
        this.wrongAnswersPersent = 0;
      },
      capitalMode() {
        this.gameMode = "capital";
        this.checkGameType();
      },
      flagMode() {
        this.gameMode = "flag";
        this.checkGameType();
      },
      checkGameType() {
        if (this.gameMode == "flag") {
          this.isFlagGame = true;
          this.isCapitalGame = false;
        } else if (this.gameMode == "capital") {
          this.isFlagGame = false;
          this.isCapitalGame = true;
        } else {
          this.isFlagGame = false;
          this.isCapitalGame = false;
        }
      },
      startGame() {
        this.gamePlaying = true;
        this.answers = 0;
        this.requestAreaList(this.area);
      },
      requestAreaList(area) {
        let api = `https://restcountries.eu/rest/v2/region/${area}`;

        fetch(api)
          .then((response) => {
            return response.json();
          })
          .then((data) => {
            if (data.status != 404) {
              this.data = data;
              this.setCountries();
            } else {
              console.log("Data receiving Error");
            }
          })
          .catch((err) => {
            console.log("ERROR:", err.toString());
          });
      },
      setCountries() {
        this.variants = [];
        this.chosen = -1;
        this.areFlagsOpen = false;
        this.currentRound++;
        this.currentPersentCalc();
        let min = 0;
        let max = this.data.length - 1;
        let check = true;
        let rand;

        while (check) {
          rand = Math.floor(min + Math.random() * (max + 1 - min));
          !this.variants.includes(rand)
            ? this.variants.push(rand)
            : this.variants;
          this.variants.length >= this.variantsAmount ? (check = false) : check;
        }
        max = this.variants.length - 1;
        rand = Math.floor(min + Math.random() * (max + 1 - min));
        this.chosen = this.variants[rand];
        if (this.isCapitalGame) {
          this.askQuestion();
        }
      },
      printFlag() {
        if (this.variants.length == this.variantsAmount) {
          return this.data[this.chosen].flag;
        }
      },
      askQuestion() {
        if (this.variants.length == this.variantsAmount) {
          return this.data[this.chosen].capital;
        }
      },
      playersAnswer(e) {
        if (
          this.areFlagsOpen == false &&
          e.target.innerText == this.data[this.chosen].name
        ) {
          this.answers++;
        }
        if (this.currentRound >= this.maxRounds) {
          this.gameScore = true;
          this.totalScoreCalc();
        }
        this.areFlagsOpen = true;
      },
      currentPersentCalc() {
        this.currentPersent = (this.currentRound * 100) / this.maxRounds;
        this.currentPersent += "%";
      },
      totalScoreCalc() {
        this.answersPersent = (this.answers * 100) / this.maxRounds;
        this.wrongAnswersPersent = 100 - this.answersPersent;
        this.answersPersent += "%";
        this.wrongAnswersPersent += "%";
      },
    },
    computed: {},
    created() {},
  });

  $("#nav-trigger").click(function () {
    $("#header-menu").slideToggle();
    $("#nav-trigger").toggleClass("nav-trigger-active");
  });
});
