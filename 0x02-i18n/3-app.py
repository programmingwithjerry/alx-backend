#!/usr/bin/env python3
"""
Template parameterization setup for a Flask application.
"""

import babel
from flask import Flask, render_template, request
from flask_babel import Babel


app = Flask(__name__)
babel = Babel(app)


class Config:
    """
    Application configuration settings,
    including supported languages and defaults.
    """
    LANGUAGES = ['en', 'fr']
    BABEL_DEFAULT_LOCALE = 'en'
    BABEL_DEFAULT_TIMEZONE = 'UTC'


# Load configuration settings into the Flask app
app.config.from_object(Config)


@babel.localeselector
def get_locale():
    """
    Determines the most appropriate language
    based on the request's headers.
    """
    return request.accept_languages.best_match(app.config['LANGUAGES'])


@app.route('/', methods=['GET'], strict_slashes=False)
def index():
    """
    Renders the main page template with a basic greeting.
    """
    return render_template('3-index.html')


if __name__ == '__main__':
    app.run(debug=True)
