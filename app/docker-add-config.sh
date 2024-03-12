#!/usr/bin/env sh

INDEX_HTML=/usr/share/nginx/html/index.html

sed -i -e 's,__API_URL__,'"$API_URL"',g' $INDEX_HTML

exec "$@"
