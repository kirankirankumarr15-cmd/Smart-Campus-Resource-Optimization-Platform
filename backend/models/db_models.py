"""SQLAlchemy ORM models for Campus Autopilot."""
from sqlalchemy import (Column, Integer, BigInteger, String, ForeignKey, DateTime,
                        Boolean, Numeric, Text, JSON, SmallInteger, Time)
from sqlalchemy.orm import declarative_base, relationship
from sqlalchemy.sql import func

Base = declarative_base()


class Role(Base):
    __tablename__ = "roles"
    id = Column(BigInteger, primary_key=True)
    name = Column(String(60), unique=True, nullable=False)
    group_name = Column(String(40))


class User(Base):
    __tablename__ = "users"
    id = Column(BigInteger, primary_key=True)
    email = Column(String(120), unique=True, nullable=False)
    password_hash = Column(String(255))
    full_name = Column(String(120))
    role_id = Column(BigInteger, ForeignKey("roles.id"))
    google_sub = Column(String(64))
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class Permission(Base):
    __tablename__ = "permissions"
    id = Column(BigInteger, primary_key=True)
    role_id = Column(BigInteger, ForeignKey("roles.id"))
    resource = Column(String(60))
    action = Column(String(20))


class Building(Base):
    __tablename__ = "buildings"
    id = Column(BigInteger, primary_key=True)
    code = Column(String(8))
    name = Column(String(80))
    total_floors = Column(Integer)


class Floor(Base):
    __tablename__ = "floors"
    id = Column(BigInteger, primary_key=True)
    building_id = Column(BigInteger, ForeignKey("buildings.id"))
    level = Column(Integer)


class Room(Base):
    __tablename__ = "rooms"
    id = Column(BigInteger, primary_key=True)
    floor_id = Column(BigInteger, ForeignKey("floors.id"))
    code = Column(String(16))
    capacity = Column(Integer)
    type = Column(String(20))
    department = Column(String(40))
    status = Column(String(12))
    current_occupancy = Column(Integer, default=0)


class TimetableSlot(Base):
    __tablename__ = "timetable_slots"
    id = Column(BigInteger, primary_key=True)
    room_id = Column(BigInteger, ForeignKey("rooms.id"))
    course_code = Column(String(20))
    faculty_id = Column(BigInteger, ForeignKey("users.id"))
    day_of_week = Column(SmallInteger)
    start_time = Column(Time)
    end_time = Column(Time)
    expected_count = Column(Integer)


class AttendanceRecord(Base):
    __tablename__ = "attendance_records"
    id = Column(BigInteger, primary_key=True)
    slot_id = Column(BigInteger, ForeignKey("timetable_slots.id"))
    observed_count = Column(Integer)
    ts = Column(DateTime(timezone=True))


class AccessLog(Base):
    __tablename__ = "access_logs"
    id = Column(BigInteger, primary_key=True)
    ap_id = Column(String(40))
    room_id = Column(BigInteger, ForeignKey("rooms.id"))
    connected_count = Column(Integer)
    ts = Column(DateTime(timezone=True))


class IoTSensor(Base):
    __tablename__ = "iot_sensors"
    id = Column(BigInteger, primary_key=True)
    device_uid = Column(String(64), unique=True, nullable=False)
    room_id = Column(BigInteger, ForeignKey("rooms.id"))
    type = Column(String(20))
    mqtt_topic = Column(String(120))
    status = Column(String(12), default="offline")
    last_seen = Column(DateTime(timezone=True))
    firmware_version = Column(String(20))


class SensorReading(Base):
    __tablename__ = "sensor_readings"
    id = Column(BigInteger, primary_key=True)
    sensor_id = Column(BigInteger, ForeignKey("iot_sensors.id"))
    room_id = Column(BigInteger, ForeignKey("rooms.id"))
    value = Column(Numeric(10, 2))
    unit = Column(String(12))
    ts = Column(DateTime(timezone=True), server_default=func.now())


class IoTActuator(Base):
    __tablename__ = "iot_actuators"
    id = Column(BigInteger, primary_key=True)
    room_id = Column(BigInteger, ForeignKey("rooms.id"))
    type = Column(String(20))
    mqtt_command_topic = Column(String(120))
    current_state = Column(JSON)


class Prediction(Base):
    __tablename__ = "predictions"
    id = Column(BigInteger, primary_key=True)
    room_id = Column(BigInteger, ForeignKey("rooms.id"))
    horizon_min = Column(SmallInteger)
    probability = Column(Numeric(4, 3))
    run_id = Column(BigInteger, ForeignKey("optimization_runs.id"))


class OptimizationRun(Base):
    __tablename__ = "optimization_runs"
    id = Column(BigInteger, primary_key=True)
    triggered_by = Column(BigInteger, ForeignKey("users.id"))
    started_at = Column(DateTime(timezone=True), server_default=func.now())
    finished_at = Column(DateTime(timezone=True))
    total_actions = Column(Integer)
    auto_applied = Column(Integer)
    pending_approval = Column(Integer)
    energy_saved_kwh = Column(Numeric(10, 2))


class Action(Base):
    __tablename__ = "actions"
    id = Column(BigInteger, primary_key=True)
    run_id = Column(BigInteger, ForeignKey("optimization_runs.id"))
    room_id = Column(BigInteger, ForeignKey("rooms.id"))
    action_type = Column(String(40))
    safety_tag = Column(String(12))
    title = Column(String(160))
    reason = Column(Text)
    impact_metric = Column(String(40))
    impact_value = Column(Numeric(10, 2))
    confidence = Column(Numeric(4, 3))
    status = Column(String(20))
    params = Column(JSON)


class ActionFeedback(Base):
    __tablename__ = "action_feedback"
    id = Column(BigInteger, primary_key=True)
    action_id = Column(BigInteger, ForeignKey("actions.id"))
    user_id = Column(BigInteger, ForeignKey("users.id"))
    response = Column(String(12))
    edited_params = Column(JSON)
    ts = Column(DateTime(timezone=True), server_default=func.now())


class MaintenanceSchedule(Base):
    __tablename__ = "maintenance_schedules"
    id = Column(BigInteger, primary_key=True)
    room_id = Column(BigInteger, ForeignKey("rooms.id"))
    priority = Column(String(16))
    window_start = Column(DateTime(timezone=True))
    window_end = Column(DateTime(timezone=True))
    assigned_team = Column(String(40))
    status = Column(String(16))


class NavSession(Base):
    __tablename__ = "nav_sessions"
    id = Column(BigInteger, primary_key=True)
    user_id = Column(BigInteger, ForeignKey("users.id"))
    query_capacity = Column(Integer)
    query_block = Column(String(8))
    recommended_room_id = Column(BigInteger, ForeignKey("rooms.id"))
    ts = Column(DateTime(timezone=True), server_default=func.now())
