#!/usr/bin/env python3
""" task 2 langs based on location """
from flask import Flask, render_template, request
from flask_babel import Babel


class Config(object):
    """class configs"""

    LANGUAGES = ["en", "fr"]
    BABEL_DEFAULT_LOCALE = "en"
    BABEL_DEFAULT_TIMEZONE = "UTC"


app = Flask(__name__)
app.config.from_object(Config)
babel = Babel(app)


@babel.localeselector
def get_locale():
    """ Determine the best language to use based on user's
    preferred languages.
    """
    return request.accept_languages.best_match(app.config["LANGUAGES"])


@app.route("/")
def index():
    """doc doc doc"""
    return render_template("2-index.html")


if __name__ == "__main__":
    app.run(host="0.0.0.0", port="5000")
