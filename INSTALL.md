npm install \
  @hapi/joi@17.1.1 \
  axios@1.2.3 \
  bcrypt@5.0.1 \
  bluebird@3.7.2 \
  compression@1.7.4 \
  cors@2.8.5 \
  dotenv@16.0.3 \
  express@4.17.1 \
  http-status-codes@2.2.0 \
  json2xml@0.1.3 \
  jsonwebtoken@9.0.0 \
  liquidjs@10.4.0 \
  lodash@4.17.21 \
  moment@2.29.1 \
  moneysafe@2.2.1 \
  mongoose@6.8.4 \
  morgan@1.10.0 \
  node-cron@3.0.0 \
  node-polyglot@2.4.0 \
  nodemailer@6.6.0 \
  passport@0.6.0 \
  passport-jwt@4.0.0 \
  pino@8.8.0 \
  querystring@0.2.1 \
  redis@4.5.1 \
  slugify@1.6.1 \
  static-asset@0.6.0 \
  stripe@11.7.0 \
  uuid@9.0.0
npm install --save-dev \
  chai@4.3.4 \
  mocha@10.2.0 \
  nodemon@2.0.7 \
  pino-pretty@9.1.1 \
  supertest@6.1.3 \
  prettier@2.8.7


npm install \
  @hapi/joi \
  axios \
  bcrypt \
  bluebird \
  compression \
  cors \
  dotenv \
  express \
  http-status-codes \
  json2xml \
  jsonwebtoken \
  liquidjs \
  lodash \
  moment \
  moneysafe \
  mongoose \
  morgan \
  node-cron \
  node-polyglot \
  nodemailer \
  passport \
  passport-jwt \
  pino \
  querystring \
  redis \
  slugify \
  static-asset \
  stripe \
  uuid
npm install --save-dev \
  chai \
  mocha \
  nodemon \
  pino-pretty \
  supertest \
  prettier

curl -fsSL https://pgp.mongodb.com/server-4.4.asc | \
   gpg -o /usr/share/keyrings/mongodb-server-4.4.gpg \
   --dearmor
echo "deb [ signed-by=/usr/share/keyrings/mongodb-server-4.4.gpg ] http://repo.mongodb.org/apt/debian buster/mongodb-org/4.4 main" | \
   tee /etc/apt/sources.list.d/mongodb-org-4.4.list
aptitude update
aptitude install mongodb-org
service mongod start
service mongod enable
service mongod status
aptitude install golang-go
export GOPATH=$HOME/go
mkdir -p $HOME/go/bin
go get github.com/mailhog/MailHog
$HOME/go/bin/MailHog
ls /root/go/bin/MailHog
/root/go/bin/MailHog

sudo nano /etc/systemd/system/mailhog.service
[Unit]
Description=MailHog SMTP Server
After=network.target

[Service]
Type=simple
ExecStart=/root/go/bin/MailHog
User=root
Restart=always
RestartSec=10
LimitNOFILE=4096

[Install]
WantedBy=multi-user.target

sudo systemctl daemon-reload
sudo systemctl start mailhog
sudo systemctl status mailhog
sudo systemctl enable mailhog


aptitude install \
python3-certbot-apache
sudo systemctl stop mailhog
sudo systemctl disable mailhog
sudo apt remove --purge mailhog -y
sudo rm -f /etc/systemd/system/mailhog.service
aptitude install postfix
aptitude install \
dovecot-core \
dovecot-imapd \
dovecot-lmtpd \
dovecot-sasl
systemctl restart postfix dovecot
adduser mailuser
passwd mailuser
create main.cf
create master.cf
postfix reload
postfix start
telnet mail.domain.com 587
echo "Test email from Postfix" | mail -s "Postfix Test" your-email@example.com
postmap -q mailuser /etc/postfix/sasl_passwd
postmap /etc/postfix/sasl_passwd
systemctl restart postfix
postmap -q mailuser /etc/postfix/sasl_passwd
postmap -q mail.domain.com /etc/postfix/sasl_passwd
mailuser:password
echo -n "mailuser" | base64
echo -n "password" | base64
openssl s_client -connect mail.domain.com:465 -crlf
EHLO locahost
AUTH PLAIN
\x00username\x00password
openssl s_client -starttls smtp -connect mail.domain.com:587 -crlf
EHLO localhost
AUTH LOGIN
bWFpbHVzZXI=
cGFzc3dvcmQ=

# create main.cf
# create master.cf
# create 10-auth.conf


npm install -g \
  pm2
pm2 -v
pm2 start npm \
  --name development \
  -- run start
pm2 start node \
  --name frontend \
  -- server.js
pm2 start node \
  --name backend \
  -- index.js

npm init -y
npm install
pm2 save

