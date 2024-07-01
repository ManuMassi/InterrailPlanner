from flask import Flask, render_template, request, redirect, url_for
import json
import os

app = Flask(__name__)

data_file = 'days.json'

def load_trip_data():
    if os.path.exists(data_file):
        with open(data_file, 'r') as f:
            return json.load(f)
    return {}

def save_trip_data(data):
    with open(data_file, 'w') as f:
        json.dump(data, f, indent=4)


@app.route('/')
def index():
    trip_data = load_trip_data()
    return render_template('index.html', date_list=trip_data.keys(), trip_details=trip_data)

@app.route('/admin', methods=['GET', 'POST'])
def admin():
    trip_data = load_trip_data()
    if request.method == 'POST':
        date = request.form['date']
        print(f"Received date: {date}")  # Debugging line
        travel = request.form['travel']
        stay = request.form['stay']
        visit = request.form.get('visit-hidden', '').split(',') if request.form.get('visit-hidden', '') else []
        eat = request.form.get('eat-hidden', '').split(',') if request.form.get('eat-hidden', '') else []

        # Convert date back to dd/MM/yyyy format for storage
        year, month, day = date.split('-')
        formatted_date = f"{day}/{month}/{year}"
        print(f"Formatted date: {formatted_date}")  # Debugging line
        trip_data[formatted_date] = {
            'travel': travel,
            'stay': stay,
            'visit': visit,
            'eat': eat
        }

        save_trip_data(trip_data)
        return redirect(url_for('admin'))

    return render_template('admin.html', date_list=trip_data.keys(), trip_details=trip_data)

if __name__ == '__main__':
    app.run(debug=True)
