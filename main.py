import streamlit as st
import requests

# Functions

def calculate_bmi(weight, height):
    bmi = weight / ((height / 100) ** 2)
    return round(bmi, 2)

def health_status(bmi):
    if bmi < 18.5:
        return "Underweight"
    elif 18.5 <= bmi < 24.9:
        return "Healthy"
    elif 25 <= bmi < 29.9:
        return "Overweight"
    else:
        return "Obese"

def fetch_spoonacular_diet_plan(conditions, allergies, calorie_target, diet_preference):
    url = "https://api.spoonacular.com/recipes/complexSearch"
    api_key = "87a614b4d79b40b4b95babd76e33093c"  # Your Spoonacular API key

    health_conditions = {
        "Diabetes": "diabetic",
        "Heart Problems": "heart-healthy",
        "Asthma": "asthma",
        "Hypertension": "low-sodium",
        "Obesity": "low-carb",
    }
    health_params = [health_conditions[condition] for condition in conditions if condition in health_conditions]

    # Add diet preference filter (vegetarian, non-vegetarian, or both)
    diet_filter = ""
    if diet_preference == "Vegetarian":
        diet_filter = "vegetarian"
    elif diet_preference == "Non-Vegetarian":
        diet_filter = "non-vegetarian"

    params = {
        "apiKey": api_key,
        "diet": "balanced",
        "maxCalories": calorie_target,
        "health": ",".join(health_params),
        "excludeIngredients": ",".join(allergies),
        "number": 5,  # Adjust the number of recipes to fetch
        "type": diet_filter if diet_filter else "any",  # Apply diet preference
    }

    response = requests.get(url, params=params)
    if response.status_code == 200:
        return response.json().get("results", [])
    else:
        st.error(f"API Error: {response.status_code} - {response.text}")
        return [{"error": "Could not fetch diet plan."}]

# Streamlit App
st.title("AI-Driven Smart Diet Planner")

# Input Form
st.header("Enter Your Details")
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

diet_preference = st.selectbox(
    "Diet Preference",
    ["Vegetarian", "Non-Vegetarian", "Both"]
)

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
        diet_plan = fetch_spoonacular_diet_plan(conditions, allergies, calorie_target, diet_preference)

        if diet_plan and "error" not in diet_plan[0]:
            for item in diet_plan:
                title = item.get('title', 'No Title')
                image_url = item.get('image', '')
                calories = item.get('nutrition', {}).get('nutrients', [{}])[0].get('amount', 'N/A')
                ingredients = item.get('usedIngredients', [])
                recipe_link = f"https://spoonacular.com/recipes/{title.replace(' ', '-')}-{item.get('id')}"
                
                # Display Recipe Info
                st.image(image_url, caption=title, width=300)
                st.write(f"**{title}**")
                st.write(f"Calories: {calories} kcal")
                st.write(f"Ingredients: {', '.join([ingredient['name'] for ingredient in ingredients]) if ingredients else 'N/A'}")
                st.write(f"Recipe Link: [View Full Recipe]({recipe_link})")
        else:
            st.error("Error fetching diet plan.")
    else:
        st.error("Please enter valid weight and height values.")
