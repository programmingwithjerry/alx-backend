#!/usr/bin/env python3
"""
Initial Babel configuration with locale selection for a Flask app.
"""

import babel
from flask import Flask, render_template, request
from flask_babel import Babel


app = Flask(__name__)
babel = Babel(app)


class Config:
    """
    Configuration settings for the app,
    including language support and time zone.
    """
    LANGUAGES = ['en', 'fr']
    BABEL_DEFAULT_LOCALE = 'en'
    BABEL_DEFAULT_TIMEZONE = 'UTC'


# Apply the configuration to the Flask app
app.config.from_object(Config)


@babel.localeselector
def get_locale():
    """
    Determines the best match for supported languages based on the request's
    Accept-Language header.
    """
    return request.accept_languages.best_match(app.config['LANGUAGES'])


@app.route('/', methods=['GET'], strict_slashes=False)
def index():
    """
    Renders the main page with a simple greeting.
    """
    return render_template('1-index.html')


if __name__ == '__main__':
    app.run(debug=True)
