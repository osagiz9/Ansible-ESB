- [Ansible-ESB](#ansible-esb)
- [Installation](#installation)
  * [Server](#server)
  * [Agent](#agent)
  * [Dashboard](#dashboard)


# Ansible-ESB
Ansible Project ESB


# Installation
## Server
run:
```
git clone https://github.com/osagiz9/Ansible-ESB.git
cd Ansible-ESB/backend
virtualenv backend-env
cd backend-env/Scripts
activate
cd ../..
pip install requirements.txt
set FLASK_APP=server/backendApi.py
flask run

```

docker:
```
cd backend
docker-compose run -p 5000:5000
```

## Agent
run:
```
git clone https://github.com/osagiz9/Ansible-ESB.git
cd Ansible-ESB/agent
virtualenv agent-env
cd agent-env/Scripts
activate
cd ../..
pip install requirements.txt
python agent.py
```
## Dashboard
run:
```
git clone https://github.com/osagiz9/Ansible-ESB.git
cd Ansible-ESB/dashboard
npm install
npm start

```
docker:
```
docker-compose run -p 3000:3000 dashboard
```
