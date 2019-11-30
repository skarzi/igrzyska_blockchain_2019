#!/usr/bin/env bash

set -o errexit
set -o pipefail
set -o nounset

celery -A igrzyska.taskapp beat -l INFO
