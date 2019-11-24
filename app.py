import os
import views

from flask import Flask


def create_app():
    app = Flask(__name__)

    # Registration of the error handlers
    from views import errors
    app.register_error_handler(400, errors.bad_request)
    app.register_error_handler(401, errors.unauthorized)
    app.register_error_handler(403, errors.forbidden)
    app.register_error_handler(404, errors.page_not_found)
    app.register_error_handler(410, errors.gone)

    # Required to avoid circular dependencies
    from views import blueprints
    for bp in blueprints:
        app.register_blueprint(bp)
        bp.app = app

    return app


if __name__ == '__main__':
    app = create_app()
    app.run(host='0.0.0.0', port=8080)
