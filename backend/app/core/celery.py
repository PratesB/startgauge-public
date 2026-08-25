from celery import Celery
from app.core.config import settings



celery_app = Celery(
    "startgauge_worker",
    broker=settings.REDIS_URL,
    backend=settings.REDIS_URL
)


celery_app.conf.update(
    task_serializer="json",
    accept_content=["json"],
    result_serializer="json",
    timezone="UTC",
    enable_utc=True,
    task_time_limit=300,
    task_soft_time_limit=240,
)

# Auto-discover tasks in all apps. This automatically imports tasks.py from the modules listed below
celery_app.autodiscover_tasks(['app.ai'])
