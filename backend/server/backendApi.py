import os
from server import db, app, passauth, tokenauth
from server.user import User
import time
from flask import Flask, abort, request, jsonify, g, url_for
from flask_sqlalchemy import SQLAlchemy
from flask_httpauth import HTTPBasicAuth


live_tokens = {}
blacklisted = []
@passauth.verify_password
def verify_password(username_or_token, password):
    # first try to authenticate by token

    # try to authenticate with username/password
    user = User.query.filter_by(username=username_or_token).first()
    if not user or not user.verify_password(password):

        return False
    else:
        g.user = user
        return True


@tokenauth.verify_token
def verify_token(token):
    if token in blacklisted:
        return False
    user = User.verify_auth_token(token)
    if not user:
        return False
    if live_tokens[user.id].decode("utf-8")!=token:
        return False
    
    g.user = user
    return True
    
@app.route('/api/update', methods=['POST'])
def update_directory_change():
    src = request.get_json().get("src")
    FileRouting.update_all(src)
    return "success"

@app.route('/api/users', methods=['POST'])
def new_user():
    print("hey")
    username = request.get_json().get('username')
    password = request.get_json().get('password')
    print(password)
    if username is None or password is None:
        abort(400)    # missing arguments
    if User.query.filter_by(username=username).first() is not None:
        abort(400)    # existing user
    user = User(username=username)
    user.hash_password(password)
    user.add_user()
    return (jsonify({'username': user.username}), 201,
            {'Location': url_for('get_user', id=user.id, _external=True)})


@app.route('/api/users/<int:id>')
def get_user(id):
    user = User.query.get(id)
    if not user:
        abort(400)
    return jsonify({'username': user.username})


@app.route('/api/token')
@passauth.login_required
def get_auth_token():
    token = g.user.generate_auth_token()
    live_tokens[g.user.id]=token
    return jsonify({ 'token': token.decode('ascii') })

@app.route('/api/logout')
@tokenauth.login_required
def logout():
    blacklisted.append(request.headers.environ['HTTP_AUTHORIZATION'].replace('Bearer ',''))
    return "logged out"


@app.route('/api/resource')
@tokenauth.login_required
def get_resource():
    return jsonify({'data': 'Hello, %s!' % g.user.username})

@app.route('/routing')
@tokenauth.login_required
def get_routing():
    routing = FileRouting.query.all()
    return jsonify(routing)  

@app.route('/addrouting', methods=['POST'])
@tokenauth.login_required
def add_routing():
    src = request.get_json().get('src')
    dest = request.get_json().get('dest')
    protocol = request.get_json().get('protocol')
    routing = FileRouting(src = src,dest = dest,protocol = protocol)
    routing.add_route()
    return jsonify(routing)

@app.route('/deleterouting', methods=['POST'])
@tokenauth.login_required
def delete_routing():
    id = request.get_json().get('id')
    FileRouting.delete(id)
    return "success"

@app.route('/checktoken', methods=['get'])
@tokenauth.login_required
def check_token():
    return "success"

if not os.path.exists('db.sqlite'):
    from server.user import User
    from server.filerouting import FileRouting
    db.create_all()
    db.session.commit()
if __name__=='__main__':
    app.run(host='0.0.0.0',port=5000,debug=True)
