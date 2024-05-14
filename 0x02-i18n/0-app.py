#!/usr/bin/env python3
"""basic route rendring"""
from flask import Flask, render_template

app = Flask(__name__)


@app.route("/")
def index():
    """rednring the 0indexhtml to route /"""
    return render_template("0-index.html")


if __name__ == "__main__":
    app.run(host="0.0.0.0", port="5000")
