import sqlite3

# Connect to SQLite database (creates file if it doesn't exist)
conn = sqlite3.connect('mandi_data.db')
cursor = conn.cursor()

# Create table if not exists
cursor.execute('''
CREATE TABLE IF NOT EXISTS mandi_prices (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    market TEXT NOT NULL,
    crop TEXT NOT NULL,
    price INTEGER NOT NULL
)
''')

# Sample data
mandi_items = [
    ("पटना", "धान", 1920),
    ("लखनऊ", "गेहूं", 2120),
    ("जयपुर", "चना", 4400),
    ("भोपाल", "मक्का", 1800)
]

# Insert sample data
cursor.executemany("INSERT INTO mandi_prices (market, crop, price) VALUES (?, ?, ?)", mandi_items)

# Save and close connection
conn.commit()
conn.close()

print("✅ Mandi database created and populated successfully.")
