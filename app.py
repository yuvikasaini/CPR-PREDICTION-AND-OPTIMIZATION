
"""CTR Prediction and Optimization"""

import pandas as pd
import numpy as np
from flask_cors import CORS  # Import CORS
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler, OneHotEncoder
import tensorflow as tf
from tensorflow.keras import layers, models
from flask import Flask, request, jsonify




data = pd.read_csv('Dataset.csv')
data['Hour'] = pd.to_datetime(data['Time of Checking Messages'], format='%I %p').dt.hour

encoder = OneHotEncoder(sparse_output=False)
encoded_features = encoder.fit_transform(data[['City', 'Preferred Messaging Channel', 'Type of Device', 'Type of CTA']])
features = np.concatenate([encoded_features, data[['Hour']].values], axis=1)
target = data['CTR Rate'].values


X_train, X_val, y_train, y_val = train_test_split(features, target, test_size=0.2, random_state=42)


scaler = StandardScaler()
X_train = scaler.fit_transform(X_train)
X_val = scaler.transform(X_val)


model = models.Sequential()
model.add(layers.Dense(128, input_dim=X_train.shape[1], activation='relu'))
model.add(layers.Dense(64, activation='relu'))
model.add(layers.Dense(32, activation='relu'))
model.add(layers.Dense(1, activation='linear'))

model.compile(optimizer='adam', loss='mean_absolute_error', metrics=['mae'])
model.fit(X_train, y_train, validation_data=(X_val, y_val), epochs=100, batch_size=16)


model.save('ctr_model.h5')


app = Flask(__name__)
CORS(app)


model = tf.keras.models.load_model('ctr_model.h5')


encoder = OneHotEncoder(sparse_output=False)
encoder.fit(data[['City', 'Preferred Messaging Channel', 'Type of Device', 'Type of CTA']])
scaler = StandardScaler()
scaler.fit(X_train)


def preprocess_input(data):
   
    encoded_features = encoder.transform([[data['city'], data['channel'],
                                           data['type_of_device'], data['type_of_cta']]])
    
    hour_feature = np.array([[data['timeOfDay']]])
   
    input_features = np.concatenate([encoded_features, hour_feature], axis=1)
    
    input_scaled = scaler.transform(input_features)
    return input_scaled


@app.route('/predict_ctr', methods=['POST'])
def predict_ctr():
    data = request.json  
    processed_input = preprocess_input(data)
    prediction = model.predict(processed_input)
    return jsonify({'predicted_ctr': float(prediction[0][0])})


if __name__ == '__main__':
    app.run(debug=True, port=8080)

