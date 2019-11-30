FROM python:3.7-slim

# User ID for the django user we're creating. The builder can set this to the
# host user's ID to avoid file permissions problems.
ARG USER_ID=1000

# Set a PyPI mirror for Pipenv. Useful for local caching via devpi or similar
ARG PIPENV_PYPI_MIRROR=https://pypi.python.org/simple

# Disable buffering on writing to stdout/stderr. This is to avoid loss of logs in
# the event of an application crash.
ENV PYTHONUNBUFFERED=1
# Disable Pipenv's spinner to stop it from filling logs with garbage
ENV PIPENV_NOSPIN=1
# Save the lock file here if this is the first build
ENV BUILD_PIPFILE_LOCK=$HOME/Pipfile.lock.build
ENV HOME=/home/django


RUN apt-get -qq update \
    && apt-get -qq -y install libpq-dev gcc vim gettext vim curl \
    && rm -rf /var/lib/apt/lists/* \
    && apt-get -qq -y clean


# Install pipenv globally
RUN pip install pipenv==2018.11.26
COPY ./backend /app
WORKDIR /app

# Generate the lockfile if it doesn't exist. We can't just `pipenv install` because
# that doesn't work with `--system` without a lockfile present. We then save the lockfile,
# as we don't want to regenerate it after the first build, and mounting our application
# code volume would make it inaccessible.
RUN if [ ! -f Pipfile.lock ]; then pipenv lock \
    && cp -f Pipfile.lock $BUILD_PIPFILE_LOCK \
    && pipenv --rm; \
    fi

# Install dependencies system-wide
RUN pipenv --bare install --system --dev

# Create the user and group to run the Django application as
RUN addgroup --system --gid $USER_ID django \
    && adduser --system --home $HOME --uid $USER_ID --ingroup django django

COPY ./docker/entrypoint_backend.sh /entrypoint.sh
RUN sed -i 's/\r//' /entrypoint.sh \
    && chmod +x /entrypoint.sh

COPY ./docker/local/backend/start.sh /start.sh
RUN sed -i 's/\r//' /start.sh \
    && chmod +x /start.sh

COPY ./docker/local/backend/celery/worker/start.sh /start-celeryworker.sh
RUN sed -i 's/\r//' /start-celeryworker.sh \
    && chmod +x /start-celeryworker.sh

COPY ./docker/local/backend/celery/beat/start.sh /start-celerybeat.sh
RUN sed -i 's/\r//' /start-celerybeat.sh \
    && chmod +x /start-celerybeat.sh

COPY ./docker/local/backend/celery/flower/start.sh /start-flower.sh
RUN sed -i 's/\r//' /start-flower.sh \
    && chmod +x /start-flower.sh


# Copy the rest of the application data in and set ownership to our newly created user
COPY ./shared/ /app/shared/
RUN chown -R django /app $HOME

USER django

ENTRYPOINT ["/entrypoint.sh"]
CMD ["/start.sh"]
