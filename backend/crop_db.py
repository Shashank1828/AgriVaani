import sqlite3

# Connect to database (will create if not exists)
conn = sqlite3.connect("crop_calendar.db")
cur = conn.cursor()

# Drop existing table if any (optional)
cur.execute("DROP TABLE IF EXISTS calendar")

# Create table
cur.execute("""
CREATE TABLE calendar (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    state TEXT NOT NULL,
    month INTEGER NOT NULL,
    crops TEXT NOT NULL,
    activities TEXT NOT NULL,
    precautions TEXT NOT NULL
)
""")

# Hindi month numbers (1–12) are used in app.py for matching
data = [
    # Bihar
    ("Bihar", 1, "गेहूं, मटर", "खरपतवार नियंत्रण, सिंचाई", "ठंडी हवा से फसल को बचाएं"),
    ("Bihar", 2, "चना, मसूर", "सिंचाई और निराई", "पाला से बचाव करें"),
    ("Bihar", 3, "सरसों, गेहूं", "कटाई की तैयारी", "अनावश्यक सिंचाई न करें"),
    ("Bihar", 7, "धान, मक्का", "धान की रोपाई", "जल जमाव से बचाएं"),

    # Uttar Pradesh
    ("Uttar Pradesh", 3, "गेहूं", "सिंचाई और उर्वरक प्रबंधन", "रोग और कीट नियंत्रण रखें"),
    ("Uttar Pradesh", 6, "धान, गन्ना", "धान की नर्सरी, गन्ना निराई", "सिंचाई सही समय पर करें"),
    ("Uttar Pradesh", 8, "धान", "सिंचाई और उर्वरक प्रबंधन", "कीट नियंत्रण अवश्य करें"),
    ("Uttar Pradesh", 10, "चना, सरसों", "भूमि की तैयारी", "बीज उपचार करें"),

    # Madhya Pradesh
    ("Madhya Pradesh", 4, "चना, मसूर", "बुवाई की तैयारी", "बीज का उपचार आवश्यक है"),
    ("Madhya Pradesh", 7, "सोयाबीन", "बुवाई और खाद देना", "नमी बनाए रखें"),
    ("Madhya Pradesh", 10, "गेहूं", "भूमि की तैयारी", "खाद का समुचित प्रयोग करें"),
    ("Madhya Pradesh", 12, "लहसुन, प्याज", "बुवाई", "नमी बनाए रखें"),

    # Rajasthan
    ("Rajasthan", 5, "मूंग", "बुवाई प्रारंभ", "कीटों से फसल की सुरक्षा करें"),
    ("Rajasthan", 6, "बाजरा, ज्वार", "सिंचाई और निराई", "खरपतवार हटाएं"),
    ("Rajasthan", 9, "तिल, उड़द", "सिंचाई और देखरेख", "खाद संतुलित रखें"),
    ("Rajasthan", 11, "सरसों", "बुवाई करें", "बीज का उपचार ज़रूरी है"),

    # Odisha
    ("Odisha", 6, "धान", "धान की नर्सरी", "जलभराव से बचाव करें"),
    ("Odisha", 7, "मक्का, मूंगफली", "बुवाई और खाद देना", "सिंचाई नियमित करें"),
    ("Odisha", 9, "धान", "फसल की देखभाल", "खरपतवार हटाएं"),
    ("Odisha", 11, "मूली, गाजर", "बुवाई और खाद देना", "कीट और रोग से बचाव करें")
]

# Insert data
cur.executemany("INSERT INTO calendar (state, month, crops, activities, precautions) VALUES (?, ?, ?, ?, ?)", data)

# Commit and close
conn.commit()
conn.close()

print("✅ Database and crop calendar data created successfully.")
