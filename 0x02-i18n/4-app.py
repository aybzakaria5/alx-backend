#!/usr/vin/env python3
"""working on task 4"""
from flask import Flask, request, render_template, g
from flask_babel import Babel, gettext as _
from typing import Optional


class Config(object):
    """doc doc doc"""

    LANGUAGES = ["en", "fr"]
    BABEL_DEFAULT_LOCALE = "en"
    BABEL_DEFAULT_TIMEZONE = "UTC"


app = Flask(__name__)
app.config.from_object(Config)
babel = Babel(app)


@babel.localeselector
def get_locale() -> Optional[str]:
    """
    Select the best matching locale from the request
    Returns:
        The locale if found in the request arguments and supported locales.
        Otherwise, returns the best match from the accepted languages.
    """
    locale = request.args.get('locale')
    if locale in app_config["LANGUAGES"]:
        return locale
    return request.accept_languages.best_match(app_config["LANGUAGES"])


@app.route('/')
def index() -> str:
    """
    Render the index page.

    Returns:
        The rendered HTML template for the index page.
    """
    return render_template('4-index.html')


if __name__ == '__main__':
    app.run(host="0.0.0.0", port="5000")
