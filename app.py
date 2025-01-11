import streamlit as st
import requests
from dotenv import load_dotenv
import os

# Load environment variables from .env file
load_dotenv()

# Get the API key from the environment
api_key = os.getenv("SPOONACULAR_API_KEY")

# Background Image URL
background_image_url = "https://img.freepik.com/photos-gratuite/vue-grand-angle-divers-legumes-fond-noir_23-2147917348.jpg?t=st=1736581532~exp=1736585132~hmac=10d33fe52cbd68b004bf9305e1c7a5dd1b3d891bc08453d143a51997d25aae1b&w=996"

# Custom CSS to set background image
st.markdown(
    f"""
    <style>
        .stApp {{
            background-image: url('{background_image_url}');
            background-size: cover;
            background-position: center center;
            background-repeat: no-repeat;
        }}
        .stTitle, .stHeader, .stSubheader {{
            color: white;
        }}
        .stText, .stMarkdown {{
            color: white;
        }}
    </style>
    """,
    unsafe_allow_html=True
)

# Functions
def fetch_spoonacular_diet_plan(conditions, allergies, calorie_target, diet_type):
    url = "https://api.spoonacular.com/recipes/complexSearch"
    
    health_conditions = {
        "Diabetes": "diabetic",
        "Heart Problems": "heart-healthy",
        "Asthma": "asthma",
        "Hypertension": "low-sodium",
        "Obesity": "low-carb",
    }
    health_params = [health_conditions[condition] for condition in conditions if condition in health_conditions]

    params = {
        "apiKey": api_key,
        "diet": diet_type,  
        "maxCalories": calorie_target,
        "health": ",".join(health_params),
        "excludeIngredients": ",".join(allergies),
        "number": 5,  
    }

    response = requests.get(url, params=params)
    if response.status_code == 200:
        return response.json().get("results", [])
    else:
        st.error(f"API Error: {response.status_code} - {response.text}")
        return [{"error": "Could not fetch diet plan."}]

# Streamlit App
st.title("Welcome to MealCraft AI!")
st.header("Your Personalized Diet Planner")

# Input Form
st.subheader("Enter Your Details")
age = st.number_input("Age", min_value=1, max_value=120, step=1)
weight = st.number_input("Weight (kg)", min_value=1.0, step=0.1)
height = st.number_input("Height (cm)", min_value=50.0, step=0.1)

gender = st.radio("Gender", ("Male", "Female", "Other"))
activity_level = st.selectbox(
    "Activity Level",
    ["Sedentary", "Lightly Active", "Moderately Active", "Very Active", "Extra Active"]
)

conditions = st.multiselect(
    "Medical Conditions",
    ["Diabetes", "Heart Problems", "Asthma", "Cancer", "Hypertension", "Obesity"]
)

allergies = st.multiselect(
    "Allergies",
    ["Lactose Intolerance", "Gluten Intolerance", "Nut Allergy", "Shellfish Allergy"]
)

# Veg/Non-Veg Preference
diet_type = st.radio("Select your Diet Preference", ("Veg", "Non-Veg", "Both"))

# Display Results
if st.button("Calculate BMI & Generate Diet Plan"):
    if weight > 0 and height > 0:
        bmi = calculate_bmi(weight, height)
        status = health_status(bmi)
        st.subheader("Health Report")
        st.write(f"Your BMI: {bmi}")
        st.write(f"Health Status: {status}")

        calorie_target = 2000  # Placeholder for dynamic calorie calculation

        st.subheader("Personalized Diet Plan")
        diet_plan = fetch_spoonacular_diet_plan(conditions, allergies, calorie_target, diet_type)

        if diet_plan and "error" not in diet_plan[0]:
            for item in diet_plan:
                title = item.get('title', 'N/A')
                calories = item.get('nutrition', {}).get('nutrients', [{}])[0].get('amount', 'N/A')
                image = item.get('image', '')
                recipe_url = f"https://spoonacular.com/recipes/{item.get('id')}"

                # Displaying the cleaned output
                st.write(f"**{title}**")
                st.write(f"Calories: {calories} kcal")
                st.write(f"[View Full Recipe]({recipe_url})")
                
                # Displaying the recipe image (if available)
                if image:
                    st.image(image, caption=title, use_column_width=True)

                st.markdown("---")
        else:
            st.error("Error fetching diet plan.")
    else:
        st.error("Please enter valid weight and height values.")
