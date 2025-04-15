"""
Structured logging configuration for LegacyChain backend.
Provides consistent JSON logs with contextual information.
"""
import sys
import time
import logging
import structlog
from pythonjsonlogger import jsonlogger
import os
import traceback

# Define log levels based on environment
ENV = os.getenv("FLASK_ENV", "development")
LOG_LEVEL = logging.DEBUG if ENV == "development" else logging.INFO

# Configure standard logging first
handler = logging.StreamHandler(sys.stdout)
handler.setFormatter(jsonlogger.JsonFormatter(
    "%(timestamp)s %(level)s %(name)s %(message)s %(pathname)s %(lineno)d %(funcName)s %(process)d %(thread)d %(exc_info)s"
))

# Configure base logger
root_logger = logging.getLogger()
root_logger.handlers = [handler]
root_logger.setLevel(LOG_LEVEL)

# Disable default loggers for third-party libs to prevent double-logging
for logger_name in ["werkzeug", "sqlalchemy.engine"]:
    logging.getLogger(logger_name).setLevel(logging.WARNING)

# Structlog processors
processors = [
    # Add log level name as a key
    structlog.stdlib.add_log_level,
    # Add timestamp
    structlog.processors.TimeStamper(fmt="iso"),
    # Add caller information
    structlog.processors.CallsiteParameterAdder(
        [
            structlog.processors.CallsiteParameter.PATHNAME,
            structlog.processors.CallsiteParameter.LINENO,
            structlog.processors.CallsiteParameter.FUNC_NAME,
        ]
    ),
    # Collect event dict breadcrumbs
    structlog.processors.StackInfoRenderer(),
    # Format exceptions
    structlog.processors.format_exc_info,
    # Add process/thread IDs
    structlog.processors.add_log_level,
    # Format as JSON
    structlog.processors.JSONRenderer()
]

# Configure structlog
structlog.configure(
    processors=processors,
    logger_factory=structlog.stdlib.LoggerFactory(),
    wrapper_class=structlog.stdlib.BoundLogger,
    cache_logger_on_first_use=True,
)

# Create logger instance
logger = structlog.get_logger()

# Request middleware for Flask
class RequestLogger:
    """Middleware to log all requests with timing and result info."""
    
    def __init__(self, app):
        self.app = app
        
    def __call__(self, environ, start_response):
        request_time = time.time()
        
        # Capturing response from the request
        def custom_start_response(status, headers, exc_info=None):
            status_code = status.split()[0]
            duration_ms = (time.time() - request_time) * 1000
            
            # Log request details
            logger.info(
                "request_processed",
                method=environ.get("REQUEST_METHOD"),
                path=environ.get("PATH_INFO"),
                query=environ.get("QUERY_STRING"),
                status_code=status_code,
                duration_ms=f"{duration_ms:.2f}",
                remote_addr=environ.get("REMOTE_ADDR"),
                user_agent=environ.get("HTTP_USER_AGENT"),
            )
            
            return start_response(status, headers, exc_info)
        
        try:
            return self.app(environ, custom_start_response)
        except Exception as e:
            # Log any unhandled exceptions
            logger.error(
                "unhandled_exception",
                error=str(e),
                traceback=traceback.format_exc(),
                method=environ.get("REQUEST_METHOD"),
                path=environ.get("PATH_INFO"),
            )
            raise

# Utility function to create a contextual logger
def get_logger(**initial_values):
    """
    Creates a logger with initial contextual values.
    
    Example:
        log = get_logger(user_id="123", action="login")
        log.info("User logged in")
    """
    return logger.bind(**initial_values) 