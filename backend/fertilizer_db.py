# fertilizer_db.py

import sqlite3

conn = sqlite3.connect("fertilizer.db")
cursor = conn.cursor()

cursor.execute('''
CREATE TABLE IF NOT EXISTS fertilizer_data (
    crop TEXT PRIMARY KEY,
    urea_kg_per_hectare REAL,
    dap_kg_per_hectare REAL,
    potash_kg_per_hectare REAL,
    water_liters_per_hectare REAL
)
''')

fertilizer_info = [
    ("धान", 100, 60, 40, 5000),
    ("गेहूं", 120, 50, 30, 4000),
    ("मक्का", 90, 70, 50, 4500),
    ("चना", 20, 40, 20, 2000),
    ("सरसों", 60, 30, 20, 3000),
    ("टमाटर", 200, 100, 80, 6000),
    ("आलू", 250, 120, 100, 7000),
    ("प्याज", 150, 80, 70, 5500)
]

cursor.executemany('''
INSERT OR REPLACE INTO fertilizer_data (crop, urea_kg_per_hectare, dap_kg_per_hectare, potash_kg_per_hectare, water_liters_per_hectare)
VALUES (?, ?, ?, ?, ?)
''', fertilizer_info)

conn.commit()
conn.close()

print("✅ Fertilizer database created successfully.")
