#!/usr/bin/env python3
"""
Initial Babel configuration for a Flask application.
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

@app.route('/', methods=['GET'], strict_slashes=False)
def index():
    """
    Renders the main page with a simple greeting.
    """
    return render_template('1-index.html')

if __name__ == '__main__':
    app.run(debug=True)
