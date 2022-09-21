from flask import Flask, render_template, session, request, jsonify
from boggle import Boggle


app = Flask(__name__)
app.config["SECRET_KEY"] = "aawboasbtrsu"

boggle_game = Boggle()


@app.route("/")
def home_page():
    boggle_board = boggle_game.make_board()
    session["board"] = boggle_board
    highscore = session.get("highscore", 0)
    num_plays = session.get("nplays", 0)

    return render_template("home.html", boggle_board = boggle_board, highscore= highscore, num_plays = num_plays)

@app.route("/validate-guess")
def validate_guess():
    word = request.args["word"]
    board = session["board"]
    response = boggle_game.check_valid_word(board, word)

    return jsonify({'result': response})

@app.route("/end-score", methods=["POST"])
def validate_end_score():
    
    score = request.json["score"]
    highscore = session.get("highscore", 0)
    num_plays = session.get("nplays", 0)

    session['num_plays'] = num_plays + 1
    session['highscore'] = max(score, highscore)

    return jsonify(brokeRecord=score > highscore)