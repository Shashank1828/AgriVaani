import google.generativeai as genai

# Step 1: Add your API Key here
GOOGLE_API_KEY = "👇Yahan apna sahi API key daalo👇"
genai.configure(api_key="AIzaSyDkON7bo8BWTI_bI3-cO7uKzxPuuw53Coo")

# Step 2: Load Gemini model
model = genai.GenerativeModel("models/gemini-1.5-pro")

# Step 3: Ask a question
response = model.generate_content("क्या आज बारिश होगी?")

# Step 4: Print the response
print("Gemini's Reply:", response.text)


