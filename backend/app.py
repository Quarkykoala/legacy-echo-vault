import os
import sentry_sdk
from sentry_sdk.integrations.flask import FlaskIntegration
from flask import Flask, jsonify, request, g
from flask_cors import CORS
from dotenv import load_dotenv
from backend.api.v1.routes import v1_blueprint
from backend.logger import RequestLogger, get_logger

load_dotenv()

# Initialize Sentry if DSN is provided
sentry_dsn = os.getenv('SENTRY_DSN')
if sentry_dsn:
    sentry_sdk.init(
        dsn=sentry_dsn,
        integrations=[FlaskIntegration()],
        traces_sample_rate=0.2,  # Adjust sampling rate as needed
        environment=os.getenv('FLASK_ENV', 'development'),
        send_default_pii=False,  # Important for GDPR compliance
    )

# Initialize logger
logger = get_logger(service="legacychain-api")

def create_app():
    """
    Flask application factory.
    Sets up CORS, registers blueprints, and configures error handling.
    """
    app = Flask(__name__)
    app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'changeme')
    app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY', 'changeme')
    CORS(app)

    # Apply request logging middleware
    app.wsgi_app = RequestLogger(app.wsgi_app)
    
    # Register versioned API blueprint
    app.register_blueprint(v1_blueprint, url_prefix='/api/v1')
    
    # Add request ID to each request for tracing
    @app.before_request
    def before_request():
        request_id = request.headers.get('X-Request-ID') or os.urandom(8).hex()
        g.request_id = request_id
        g.logger = logger.bind(request_id=request_id)

    @app.route('/health', methods=['GET'])
    def health_check():
        """Health check endpoint."""
        g.logger.info("health_check_called")
        return jsonify({
            "status": "ok",
            "version": os.getenv('API_VERSION', '1.0.0'),
            "environment": os.getenv('FLASK_ENV', 'development')
        }), 200

    @app.errorhandler(Exception)
    def handle_exception(e):
        """
        Global error handler. Returns structured JSON error responses.
        """
        g.logger.error(
            "unhandled_exception",
            error=str(e),
            error_type=e.__class__.__name__,
            endpoint=request.endpoint
        )
        
        return jsonify({
            "error": str(e),
            "type": e.__class__.__name__,
            "request_id": getattr(g, 'request_id', None)
        }), 500

    return app

if __name__ == '__main__':
    app = create_app()
    port = int(os.getenv('PORT', 5000))
    debug = os.getenv('FLASK_ENV', 'development') == 'development'
    
    logger.info(
        "server_starting",
        port=port,
        debug=debug,
        environment=os.getenv('FLASK_ENV', 'development')
    )
    
    app.run(host='0.0.0.0', port=port, debug=debug) 