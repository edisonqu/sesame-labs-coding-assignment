import os
import string

from flask import Flask, request, jsonify
from flask_jwt_extended import JWTManager, jwt_required, create_access_token
from datetime import timedelta
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
import random
import dotenv

dotenv.load_dotenv()

app = Flask(__name__)

# JWT secret decoder key
app.config['JWT_SECRET_KEY'] = os.getenv("JWT_SECRET_KEY")

# how long the JWT access token expires (30 minutes)
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(minutes=30)

# Postgres Database URL
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv("SQLALCHEMY_DATABASE_URI")

# Initialize Database, enable CORS, and enable JWT
db = SQLAlchemy(app)
CORS(app)
jwt = JWTManager(app)


# Create a user model for the database and table
class User(db.Model):
    # Initialize Database with three columns, wallet address, if there is USDC, and coupon code
    wallet_address = db.Column(db.String, primary_key=True) # string
    usdc_verified = db.Column(db.Boolean, default=False) # boolean
    coupon_code = db.Column(db.String) # string

    def __init__(self, wallet_address, usdc_verified, coupon_code):
        self.wallet_address = wallet_address
        self.usdc_verified = usdc_verified
        self.coupon_code = coupon_code

# Initialize Database
with app.app_context():
    db.create_all()


@app.route('/')
def hello_world():
    return 'Hello Sesame Labs!'


@app.route('/api/auth', methods=["POST"])
def authenticate():
    """
    Authenticate the Metamask Login
    - searching and updating the database with the wallet address
    - creating a jwt token to protect api on scale

    :return: jwt token, wallet address, user_state (if they have USDC or not), coupon code (if they have one)
    """
    wallet_address = request.json['walletAddress']
    user = User.query.filter_by(wallet_address=wallet_address).first()
    if user is None:
        user = User(wallet_address=wallet_address, usdc_verified=False, coupon_code=None)
        db.session.add(user)
        db.session.commit()
    access_token = create_access_token(wallet_address) # JWT creation
    return jsonify(access_token=access_token, wallet_address=wallet_address, user_state=user.usdc_verified,
                   coupon_code=user.coupon_code)


@app.route('/api/verify', methods=['POST'])
@jwt_required()
def verify_user_usdc():
    """
    ONLY CALLED IF USER HAS USDC
    A coupon generator and database updater gated using JWT for when the user has verified they have USDC.
    - Searches and updates the database with values
    - Adds and updates the usdc_verified state and the user coupon code

    :return: usdc_verified (if they have usdc) and coupon code (string)
    """
    wallet_address = request.json['walletAddress']
    user = User.query.filter_by(wallet_address=wallet_address).first()
    if user is not None:
        if not user.usdc_verified:
            # Random Coupon generation with 10 ASCII letters, all uppercase
            coupon_code = ''.join(random.choices(string.ascii_letters + string.digits, k=10)).upper()
            user.usdc_verified = True
            user.coupon_code = coupon_code
            db.session.commit()
        return jsonify(user_state=user.usdc_verified, coupon_code=user.coupon_code)
    else:
        return jsonify(error="User not found"), 404

if __name__ == '__main__':
    app.run()
