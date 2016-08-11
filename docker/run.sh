if [ ! -d /srv/dankbot/node_modules ]; then
  cd /srv/dankbot
  npm install --no-bin-links
fi
/usr/bin/supervisord -c /etc/supervisord.conf &
exec /bin/bash
