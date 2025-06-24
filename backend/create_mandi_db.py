import sqlite3

# Connect to (or create) the database
conn = sqlite3.connect('mandi_data.db')
cursor = conn.cursor()

# Create the table
cursor.execute('''
CREATE TABLE IF NOT EXISTS mandi_prices (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    market TEXT NOT NULL,
    crop TEXT NOT NULL,
    price INTEGER NOT NULL
)
''')

# Optional: Clear previous data to avoid duplicates
cursor.execute('DELETE FROM mandi_prices')

# Sample Data
mandi_items = [
    ("पटना", "धान", 1920),
    ("लखनऊ", "गेहूं", 2120),
    ("जयपुर", "चना", 4400),
    ("भोपाल", "मक्का", 1800)
]

# Insert sample records
cursor.executemany("INSERT INTO mandi_prices (market, crop, price) VALUES (?, ?, ?)", mandi_items)

# Commit and close
conn.commit()
conn.close()

print("✅ मंडी डेटा सफलतापूर्वक जोड़ा गया।")
