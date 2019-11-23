from flask import Blueprint, render_template

home = Blueprint('home', __name__)


@home.route('/')
def index():
    return render_template('index.html', like_it_url='http://127.0.0.1:5000/stories/')
