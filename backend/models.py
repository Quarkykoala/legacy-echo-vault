from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class Vault(db.Model):
    """
    SQLAlchemy model for a Vault.
    Matches the shared Database type definition.
    """
    __tablename__ = 'vaults'
    id = db.Column(db.String, primary_key=True)
    name = db.Column(db.String, nullable=False)
    creator_id = db.Column(db.String, nullable=False)
    theme = db.Column(db.ARRAY(db.String), nullable=False)
    created_at = db.Column(db.DateTime, nullable=False) 