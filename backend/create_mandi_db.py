import sqlite3
import random

# Sample states and crops
states = ['Bihar', 'Punjab', 'Haryana', 'Madhya Pradesh', 'Uttar Pradesh', 'Maharashtra', 'Rajasthan', 'Gujarat', 'Odisha', 'West Bengal']
crops = ['गेहूं', 'धान', 'चना', 'मक्का', 'सरसों', 'बाजरा', 'गन्ना', 'आलू', 'प्याज', 'टमाटर', 'कपास', 'सोयाबीन']

# Create DB connection
conn = sqlite3.connect('mandi_data.db')
cursor = conn.cursor()

# Create table
cursor.execute('''
CREATE TABLE IF NOT EXISTS mandi_rates (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    crop TEXT NOT NULL,
    state TEXT NOT NULL,
    rate INTEGER NOT NULL
)
''')

# Insert 1000 rows of random data
for _ in range(1000):
    crop = random.choice(crops)
    state = random.choice(states)
    rate = random.randint(800, 5000)  # Random rate between ₹800 to ₹5000
    cursor.execute('INSERT INTO mandi_rates (crop, state, rate) VALUES (?, ?, ?)', (crop, state, rate))

conn.commit()
conn.close()
print("✅ Database 'mandi_data.db' created with 1000 records.")
