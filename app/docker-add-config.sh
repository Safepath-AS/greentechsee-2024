#!/usr/bin/env sh

INDEX_HTML=/usr/share/nginx/html/index.html

sed -i e 's,__API_URL__,'"$API_URL"',' $INDEX_HTML

exec "$@"
