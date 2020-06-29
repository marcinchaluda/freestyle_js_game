from flask import Flask, render_template, url_for
from random import sample

app = Flask(__name__)


@app.route('/')
def main():
    return render_template('game.html')


@app.route('/game')
def game():
    pass


if __name__ == '__main__':
    app.run()
