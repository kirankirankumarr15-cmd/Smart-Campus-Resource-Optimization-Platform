"""Configuration for Campus Autopilot backend."""
import os

class Config:
    JWT_SECRET = os.getenv("JWT_SECRET", "pesitm-campus-autopilot-dev-secret")
    JWT_ALGORITHM = "HS256"
    JWT_EXPIRE_HOURS = 12

    DATABASE_URL = os.getenv("DATABASE_URL",
        "postgresql://campus:autopilot@localhost:5432/campus_autopilot")

    MQTT_BROKER = os.getenv("MQTT_BROKER", "localhost")
    MQTT_PORT = int(os.getenv("MQTT_PORT", "1883"))
    MQTT_TOPIC_PREFIX = "pesitm"

    MOCK_MODE = os.getenv("MOCK_MODE", "true").lower() == "true"
    MOCK_DIR = os.getenv("MOCK_DIR", "../mock")

config = Config()
