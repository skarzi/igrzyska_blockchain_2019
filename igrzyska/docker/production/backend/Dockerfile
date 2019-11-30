FROM python:3.7-slim

# Set a PyPI mirror for Pipenv. Useful for local caching via devpi or similar
ARG PIPENV_PYPI_MIRROR=https://pypi.python.org/simple

# Disable buffering on writing to stdout/stderr. This is to avoid loss of logs in
# the event of an application crash.
ENV PYTHONUNBUFFERED 1
# Disable Pipenv's spinner to stop it from filling logs with garbage
ENV PIPENV_NOSPIN=1


RUN apt-get -qq update \
    && apt-get -qq -y install libpq-dev gcc vim curl \
    && rm -rf /var/lib/apt/lists/* \
    && apt-get -qq -y clean \
    && addgroup --system django \
    && adduser --system --ingroup django django


# Install pipenv globally
RUN pip install pipenv==2018.11.26
COPY ./backend /app
WORKDIR /app

# Install dependencies system-wide
RUN pipenv --bare install --system --deploy --ignore-pipfile

COPY ./docker/production/backend/gunicorn.sh /gunicorn.sh
RUN sed -i 's/\r//' /gunicorn.sh \
    && chmod +x /gunicorn.sh \
    && chown django /gunicorn.sh

COPY ./docker/entrypoint_backend.sh /entrypoint.sh
RUN sed -i 's/\r//' /entrypoint.sh \
    && chmod +x /entrypoint.sh \
    && chown django /entrypoint.sh


COPY ./docker/production/backend/celery/worker/start.sh /start-celeryworker.sh
RUN sed -i 's/\r//' /start-celeryworker.sh \
    && chmod +x /start-celeryworker.sh

COPY ./docker/production/backend/celery/beat/start.sh /start-celerybeat.sh
RUN sed -i 's/\r//' /start-celerybeat.sh \
    && chmod +x /start-celerybeat.sh

COPY ./docker/production/backend/celery/flower/start.sh /start-flower.sh
RUN sed -i 's/\r//' /start-flower.sh \
    && chmod +x /start-flower.sh


# Copy the rest of the application data in and set ownership to our newly created user
COPY ./shared/ /app/shared/
RUN chown -R django /app $HOME

USER django

ENTRYPOINT ["/entrypoint.sh"]
CMD ["/gunicorn.sh"]
