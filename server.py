from flask import Flask, render_template, request, redirect
from random import sample

app = Flask(__name__)


@app.route('/')
def main():
    return render_template('main.html')


@app.route('/game')
def game():


if __name__ == '__main__':
    app.run()
