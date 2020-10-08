from server import db,app
from sqlalchemy_utils import IPAddressType

from dataclasses import dataclass

@dataclass
class FileRouting(db.Model):
    id:int
    src:str
    dest:str
    protocol:str

    __tablename__ = 'FileRouting'
    id = db.Column(db.Integer, primary_key=True)
    src = db.Column(db.String(15), index=True)
    dest = db.Column(db.String(15))
    protocol = db.Column(db.String(32))

    def add_route(self):
        db.session.add(self)
        db.session.commit()

    @staticmethod
    def get_all():
        return FileRouting.query.all()
    
    @staticmethod
    def update_all(src):
        print("update that "+src+" changed")

    @staticmethod
    def delete(id):
        FileRouting.query.filter_by(id=id).delete()
        
