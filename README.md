Igrzyska
========

A short description of the project.

![Built with Cookiecutter Django https://github.com/pydanny/cookiecutter-django/](https://img.shields.io/badge/built%20with-Cookiecutter%20Django-ff69b4.svg)




Settings
--------

Moved to [settings](https://github.com/10clouds/project-template/master/docs/settings.md).


A note for Linux users
----------------------

On Linux, Docker runs as a system daemon with root privileges, and can actively create
files inaccessible to the host user. If you'd like to avoid that, you'll need to create
an .env file with your UID - the containers started by docker-compose will create files 
owned by this UID. Run 
```bash
echo "UID=${UID}" > .env
```
to do so.

#### *IMPORTANT*: Don't run compose as root

Your Linux user won't have permission to use docker by default. This can be fixed by
adding them to the `docker` group, as explained in the [official docs](https://docs.docker.com/install/linux/linux-postinstall/#manage-docker-as-a-non-root-user).

Running docker and compose commands with `sudo` will break the setup in this template
and re-introduce file permission problems we've worked hard to avoid. Please don't.


Basic Commands
--------------

#### Dependency management

This project uses [Pipenv](https://pipenv.kennethreitz.org) for dependency management.
Pipenv generates a lockfile containing pinned dependencies, and dependencies are
installed based on said lockfile, which should be added to source control and updated
manually when needed.

Pipenv's dependency specification lives in a [Pipfile](backend/Pipfile). Please note
that Pipenv stores both base and dev dependencies in the same file, and take care
to add your custom dependencies to the right section.

##### Managing the lockfile

After you first build the project, you need to run
```bash
docker-compose run --rm app lock-dependencies
```
and add the `backend/Pipfile.lock` file it creates to git.

This procedure should be repeated every time you modify the Pipfile, or when you'd like
to update the pinned versions of your dependencies while keeping them within the spec.

#### Setting Up Your Users

* To create a **normal user account**, just go to Sign Up and fill out the form. 
Once you submit it, you'll see a "Verify Your E-mail Address" page. Go to your 
console to see a simulated email verification message. Copy the link into your 
browser. Now the user's email should be verified and ready to go.

To create an **superuser account**, use this command:
```bash
docker-compose run --rm app ./manage.py createsuperuser
```

For convenience, you can keep your normal user logged in on Chrome and your 
superuser logged in on Firefox (or similar), so that you can see how the site 
behaves for both kinds of users.

#### Test coverage

To run the tests, check your test coverage, and generate an HTML coverage report::

```bash
docker-compose run --rm app pytest --cov-report html --cov . --verbose
open backend/htmlcov/index.html
```

#### Running tests with py.test

```bash
docker-compose run --rm app pytest .
```

#### Celery

This app comes with Celery. By default all tasks is run not async.
If you need work local with async you must change `CELERY_ALWAYS_EAGER` on `False`
in `backend/settings/local.py` then all tasks will use `redis`
and docker configurations.
 
```
CELERY_ALWAYS_EAGER = False
```

#### Sentry

Sentry is an error logging aggregator service. You can send email to DevOps 
team and asking about you account and project igrzyska.

You must set the DSN url in production.

#### Graphene

Graphene is a library for GraphQL API implementation. All the requests to GraphQL 
server are handled by a single URL and Graphene's `GraphQLView` view. The view has
a parameter to enable a web-based integrated development environment, GraphiQL
(`graphiql=True`). If you set the GraphQL endpoint behind an authorization feature
like a token, this tool becomes inconvenient to use because of the need to modify
the headers which is not implemented in GraphiQL. A solution to this is to prepare 
a separate, development-only endpoint with GraphiQL enabled and not requiring 
authentication.


Deployment
----------

The following details how to deploy this application.

#### Docker

See detailed [project-template Docker documentation](https://github.com/10clouds/project-template/blob/master/docs/developing-locally-docker.md).
