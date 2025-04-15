import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    """
    Configuration loader for Flask app using environment variables.
    """
    SECRET_KEY = os.getenv('SECRET_KEY', 'changeme')
    JWT_SECRET_KEY = os.getenv('JWT_SECRET_KEY', 'changeme')
    SQLALCHEMY_DATABASE_URI = os.getenv('DATABASE_URL', 'sqlite:///app.db')
    SQLALCHEMY_TRACK_MODIFICATIONS = False 