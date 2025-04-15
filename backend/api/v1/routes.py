from flask import Blueprint, jsonify

v1_blueprint = Blueprint('v1', __name__)

@v1_blueprint.route('/ping', methods=['GET'])
def ping():
    """
    Simple ping endpoint for API v1.
    Returns a JSON response for health checks or connectivity tests.
    """
    return jsonify({"message": "pong", "version": 1}), 200

@v1_blueprint.route('/vaults', methods=['GET'])
def get_vaults():
    """
    Returns a list of sample vaults.
    Response structure matches the shared Database type definition.
    """
    try:
        sample_vaults = [
            {
                "id": "vault-1",
                "name": "Family Memories",
                "creator_id": "user-123",
                "theme": ["sepia"],
                "created_at": "2024-01-01T12:00:00Z"
            },
            {
                "id": "vault-2",
                "name": "Work Achievements",
                "creator_id": "user-456",
                "theme": ["midnight"],
                "created_at": "2024-02-01T09:30:00Z"
            }
        ]
        return jsonify({"vaults": sample_vaults}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500 