after pulling the code follow these steps to run the flask backend

# first Create venv
python -m venv .venv

# second step activate the virtual env
# Activate (Windows)
.venv\Scripts\activate
# OR Activate (BASH)
source .venv/Scripts/activate

# Third step install the requirement.txt file to install all the required packages
pip install -r requirements.txt

# Fourth step set the terminals location into the src folder then run this command 
flask --app app run --port=5001

# At first it'll download the model and it'll take 1.7 gb to download the model 
# after downloading it'll not require to download the model everytime you run the project 

# Follow all these steps to run the backend api's for the summarization task