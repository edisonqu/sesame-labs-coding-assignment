import os
import string

from flask import *
from flask_jwt_extended import *
from datetime import *
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
import random
import dotenv

dotenv.load_dotenv()

app = Flask(__name__)

app.config['JWT_SECRET_KEY'] = os.getenv("JWT_SECRET_KEY")
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(minutes=30)
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv("SQLALCHEMY_DATABASE_URI")

db = SQLAlchemy(app)
CORS(app)
jwt = JWTManager(app)

class User(db.Model):
    wallet_address = db.Column(db.String, primary_key=True)
    usdc_verified = db.Column(db.Boolean, default=False)
    coupon_code = db.Column(db.String)

    def __init__(self, wallet_address, usdc_verified, coupon_code):
        self.wallet_address = wallet_address
        self.usdc_verified = usdc_verified
        self.coupon_code = coupon_code

with app.app_context():
    db.create_all()

@app.route('/')
def hello_world():  # put application's code here
    return 'Hello'


@app.route('/api/auth', methods=["POST"])
def authenticate():
    wallet_address = request.json['walletAddress']
    user = User.query.filter_by(wallet_address=wallet_address).first()
    if user is None:
        user = User(wallet_address=wallet_address, usdc_verified=False, coupon_code=None)
        db.session.add(user)
        db.session.commit()
    access_token = create_access_token(wallet_address)
    return jsonify(access_token=access_token,wallet_address=wallet_address, user_state=user.usdc_verified, coupon_code=user.coupon_code)

@app.route('/api/verify', methods =['POST'])
@jwt_required()
def verify_user_usdc():
    wallet_address = request.json['walletAddress']
    user = User.query.filter_by(wallet_address=wallet_address).first()
    if user is not None:
        if not user.usdc_verified:
            # random generator
            coupon_code = ''.join(random.choices(string.ascii_letters + string.digits, k=10)).upper()
            user.usdc_verified = True
            user.coupon_code = coupon_code
            db.session.commit()
        return jsonify(user_state=user.usdc_verified, coupon_code=user.coupon_code)
    else:
        return jsonify(error="User not found"), 404


"""
Example JWT Auth Token : eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmcmVzaCI6ZmFsc2UsImlhdCI6MTY4MjgyOTgyMywianRpIjoiYTU1Y2FkMDUtODhhOS00MTI3LWJjMTEtYmFhMGQ3ODk0YmI1IiwidHlwZSI6ImFjY2VzcyIsInN1YiI6IjB4Mzc4OUM2NGNDM0E4MTIwYTkzRTk0ODNkNTI2ZDQ0YkU3MzA1ZTQ1NSIsIm5iZiI6MTY4MjgyOTgyMywiZXhwIjoxNjgyODMxNjIzfQ.sPGt2IYSdONwpuFRUubKB2Tu9Uu5DsaB6Pv07Rk9tjk
"""

if __name__ == '__main__':
    app.run()