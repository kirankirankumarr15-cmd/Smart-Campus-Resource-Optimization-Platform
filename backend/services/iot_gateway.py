"""
IoT Gateway — MQTT subscribe/publish service.
For Phase-1 hackathon: stub implementation that simulates an MQTT broker
using in-memory storage. Phase-2 swaps to paho-mqtt + Mosquitto.
"""
import json
from datetime import datetime
from typing import Callable, Dict, Any

# Topic format: pesitm/<block>/<room>/<sensor_type>
# Cmd format:   pesitm/<block>/<room>/cmd/<actuator_type>

_subscribers: Dict[str, list] = {}
_published_log: list = []


def publish(topic: str, payload: Dict[str, Any]) -> dict:
    """Publish a JSON payload to a topic. Stub for Phase 1."""
    record = {
        "topic": topic,
        "payload": payload,
        "ts": datetime.utcnow().isoformat(),
    }
    _published_log.append(record)
    # Notify any in-memory subscribers
    for pattern, callbacks in _subscribers.items():
        if _topic_matches(pattern, topic):
            for cb in callbacks:
                cb(topic, payload)
    return record


def subscribe(topic_pattern: str, callback: Callable[[str, dict], None]) -> None:
    _subscribers.setdefault(topic_pattern, []).append(callback)


def _topic_matches(pattern: str, topic: str) -> bool:
    """Supports + (single level) and # (multi level) wildcards."""
    p = pattern.split("/")
    t = topic.split("/")
    for i, seg in enumerate(p):
        if seg == "#":
            return True
        if i >= len(t):
            return False
        if seg == "+":
            continue
        if seg != t[i]:
            return False
    return len(p) == len(t)


def get_published_log():
    return _published_log[-50:]


# === Production stub (paho-mqtt) ===========================================
# Uncomment when Mosquitto broker is available.
#
# import paho.mqtt.client as mqtt
# from config import config
#
# _client = mqtt.Client(client_id="campus-autopilot-gateway")
#
# def _on_message(client, userdata, msg):
#     try:
#         payload = json.loads(msg.payload.decode())
#         # Persist to sensor_readings table here
#         print(f"[MQTT] {msg.topic} → {payload}")
#     except Exception as e:
#         print(f"[MQTT] decode error: {e}")
#
# def start():
#     _client.on_message = _on_message
#     _client.connect(config.MQTT_BROKER, config.MQTT_PORT, 60)
#     _client.subscribe(f"{config.MQTT_TOPIC_PREFIX}/+/+/+")
#     _client.loop_start()
#
# def production_publish(topic: str, payload: dict):
#     _client.publish(topic, json.dumps(payload))
