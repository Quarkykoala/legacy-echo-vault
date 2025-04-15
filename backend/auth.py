from flask import Blueprint, jsonify
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
import os

jwt = JWTManager()
auth_blueprint = Blueprint('auth', __name__)

@auth_blueprint.route('/login', methods=['POST'])
def login():
    """
    Example login endpoint. Replace with real authentication logic.
    Returns a JWT access token for a valid user.
    """
    # Placeholder: always returns a token for user_id 'demo'
    access_token = create_access_token(identity='demo')
    return jsonify(access_token=access_token), 200

@auth_blueprint.route('/protected', methods=['GET'])
@jwt_required()
def protected():
    """
    Example protected route. Requires a valid JWT.
    """
    user_id = get_jwt_identity()
    return jsonify(logged_in_as=user_id), 200 