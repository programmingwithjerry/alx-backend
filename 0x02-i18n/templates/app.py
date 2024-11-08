#!/usr/bin/env python3

"""
Flask application for multilingual and timezone-specific rendering.
"""

from flask import Flask, render_template, request, g
from flask_babel import Babel
import pytz
from pytz.exceptions import UnknownTimeZoneError


app = Flask(__name__)
babel = Babel(app)


class AppSettings:
    """
    Application configuration settings.
    """
    LANGUAGES = ["en", "fr"]
    BABEL_DEFAULT_LOCALE = "en"
    BABEL_DEFAULT_TIMEZONE = "UTC"


app.config.from_object(AppSettings)


user_data = {
    1: {"name": "Balou", "locale": "fr", "timezone": "Europe/Paris"},
    2: {"name": "Beyonce", "locale": "en", "timezone": "US/Central"},
    3: {"name": "Spock", "locale": "kg", "timezone": "Vulcan"},
    4: {"name": "Teletubby", "locale": None, "timezone": "Europe/London"},
}


def fetch_user(user_id):
    """
    Retrieve user details based on the provided user ID.
    """
    try:
        return user_data.get(int(user_id))
    except (ValueError, TypeError):
        return None


@app.before_request
def set_current_user():
    """
    Assign the current user to the global context before handling the request.
    """
    g.user = fetch_user(request.args.get("login_as"))


@babel.localeselector
def select_locale():
    """
    Determine the locale for the current request.
    """
    locale = request.args.get("locale")
    if locale:
        return locale
    user_id = request.args.get("login_as")
    if user_id:
        user_locale = user_data.get(int(user_id)).get("locale")
        if user_locale in app.config["LANGUAGES"]:
            return user_locale
    header_locale = request.headers.get("locale")
    if header_locale:
        return header_locale
    return request.accept_languages.best_match(app.config["LANGUAGES"])


@babel.timezoneselector
def select_timezone():
    """
    Determine the timezone for the current request.
    """
    try:
        timezone = request.args.get("timezone")
        if timezone:
            return pytz.timezone(timezone)
        user_id = request.args.get("login_as")
        if user_id:
            user_timezone = user_data.get(int(user_id)).get("timezone")
            if user_timezone:
                return pytz.timezone(user_timezone)
        header_timezone = request.headers.get("timezone")
        if header_timezone:
            return pytz.timezone(header_timezone)
    except UnknownTimeZoneError:
        return app.config.get("BABEL_DEFAULT_TIMEZONE")
    return app.config.get("BABEL_DEFAULT_TIMEZONE")


@app.route("/", methods=["GET"], strict_slashes=False)
def home():
    """
    Render the home page.
    """
    return render_template("index.html")


if __name__ == "__main__":
    app.run(host="0.0.0.0", port="5000")
