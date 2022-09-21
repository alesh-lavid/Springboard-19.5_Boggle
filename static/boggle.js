class Boggle {
    constructor(){
        this.board = $('#boggle-game');
        this.time = 60;
        this.timeInterval = setInterval(this.timer.bind(this), 1000);
        this.displayTimer();
        this.words = new Set();
        this.score = 0;

        $('#guess-form').on('submit', this.handleSubmit.bind(this))
    }

    displayResponse(word, status){
        $('#response')
        .text(word)
        .removeClass()
        .addClass(`${status}`)
    }

    displayWord(word){
        $('#correct-words').append($('<li>', { text: word}));
    }

    displayScore(){
        $('#score').text(`Score: ${this.score}`)
    }


    async handleSubmit(evt){
        evt.preventDefault();

        const $guessWord = $('.guess-word');
        let word = $guessWord.val(); 
        if (!word) return;

        const res = await axios.get('/validate-guess', { params: { word: word }});

        if (res.data.result === 'not-word') {
            this.displayResponse(`${word} is not a word`, 'err');

          } else if (res.data.result === 'not-on-board') {
            this.displayResponse(`${word} is not on the board`, 'err');

          } else {
            this.displayWord(word);
            this.score += word.length;
            this.displayScore();
            this.words.add(word);
            this.displayResponse(`Added: ${word}`, "ok");
          }
    }


    displayTimer() {
        $("#timer").text(this.time);
      }

    async timer(){
        this.time -= 1;
        this.showTime();

        if(this.time === 0){
            clearInterval(this.timeInterval);
            await this.endGame();
        }
    }

    async endgame(){
        $("#guess-form").hide();

        const res = await axios.post("/end-score", { score: this.score });
        if (res.data.brokeRecord) {
          this.displayResponse(`New record: ${this.score}`, "ok");
        } else {
          this.displayResponse(`Final score: ${this.score}`, "ok");
        }
    }
    
}
