import os
from flask import Flask, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
from backend.api.v1.routes import v1_blueprint

load_dotenv()

def create_app():
    """
    Flask application factory.
    Sets up CORS, registers blueprints, and configures error handling.
    """
    app = Flask(__name__)
    app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'changeme')
    app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY', 'changeme')
    CORS(app)

    # Register versioned API blueprint
    app.register_blueprint(v1_blueprint, url_prefix='/api/v1')

    @app.route('/health', methods=['GET'])
    def health_check():
        """Health check endpoint."""
        return jsonify({"status": "ok"}), 200

    @app.errorhandler(Exception)
    def handle_exception(e):
        """
        Global error handler. Returns structured JSON error responses.
        """
        return jsonify({
            "error": str(e),
            "type": e.__class__.__name__,
        }), 500

    return app

if __name__ == '__main__':
    app = create_app()
    app.run(host='0.0.0.0', port=int(os.getenv('PORT', 5000)), debug=True) 