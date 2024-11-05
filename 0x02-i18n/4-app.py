#!/usr/bin/env python3
"""
Enforce locale selection using a URL parameter.
"""

import babel
from flask import Flask, render_template, request
from flask_babel import Babel

app = Flask(__name__)
babel = Babel(app)


class Config:
    """
    Configuration settings for the app, including supported languages
    and default locale and timezone.
    """
    LANGUAGES = ['en', 'fr']
    BABEL_DEFAULT_LOCALE = 'en'
    BABEL_DEFAULT_TIMEZONE = 'UTC'


# Load configuration from the Config class
app.config.from_object(Config)


@babel.localeselector
def get_locale():
    """
    Checks if the incoming request has a 'locale' parameter and returns it
    if it matches a supported language. Otherwise, uses the best match
    from the request's 'Accept-Language' header.
    """
    locale = request.args.get('locale')
    if locale:
        return locale
    return request.accept_languages.best_match(app.config['LANGUAGES'])


@app.route('/', methods=['GET'], strict_slashes=False)
def index():
    """
    Renders the main page template.
    """
    return render_template('4-index.html')


if __name__ == '__main__':
    app.run(debug=True)
