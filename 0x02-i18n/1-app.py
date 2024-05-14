#!/usr/bin/env python3
"""usingi18n"""
from flask import Flask
from flask_babel import Babel

# Create Flask app
app = Flask(__name__)


# Create Config class
class Config:
    """class to config lang and loc"""
    LANGUAGES = ["en", "fr"]
    BABEL_DEFAULT_LOCALE = "en"
    BABEL_DEFAULT_TIMEZONE = "UTC"


# Set Config as app's config
app.config.from_object(Config)

# Instantiate Babel object
babel = Babel(app)


@app.rout("/")
def index():
    """rendering 1-index.html"""
    render_template("1-index.html")


if __name__ == "__main__":
    app.run(host="0.0.0.0", port="5000")
