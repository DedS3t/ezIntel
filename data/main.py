"""
Run every X threshold

1. Queries API for deltas (on all agents)
2. Saves deltas to Flask
3. Runs blog proposal agent
"""

import requests 
import firebase_admin
from firebase_admin import credentials, firestore
from agents.BlogProposalAgent import run_agent_workflow

DATA_AGENT_ID = "WVWTRfBVxNYO3f9e555L"
ACTION_AGENT_ID = "ia17UGVHOBUmIndUMKfi"

base_url = ""

cred = credentials.Certificate("/home/deds3t/Downloads/ezintel-bca58-firebase-adminsdk-24sw0-ef024b095e.json")
app = firebase_admin.initialize_app(cred)
db = firestore.client()

def get_text_from_file(file_path):
    with open(file_path, 'r') as file:
        return file.read()

def add_log_to_data_agent(agent_doc_id, log):
    agent_ref = db.collection("data_agents").document(agent_doc_id)
    agent_ref.update({"logs": firestore.ArrayUnion([log])})

def get_company_context():
    settings_ref = db.collection('settings').limit(1)
    docs = settings_ref.stream()


    for doc in docs:
        dic = doc.to_dict()
        return dic["context"] + "\n\n" + dic["performance"]

def add_log_to_action_agent(agent_doc_id, log):
    agent_ref = db.collection("action_agents").document(agent_doc_id)
    agent_ref.update({"logs": firestore.ArrayUnion([log])})


def get_deltas():
    # response = requests.get(base_url + "/deltas")
    return [
        {
            "title": "How to Train a YOLOv11 Object Detection Model on a Custom Dataset",
            "url": "",
            "description": "",
            "body": get_text_from_file("/home/deds3t/Desktop/coding/ezml/ezIntel/data/data/tech_news_content.txt"),
            "time": "",

        }
    ]
    # return response.json()

def save_deltas_to_flask(deltas):
    response = requests.post(base_url + "/save_deltas", json=deltas)
    return response.status_code



if __name__ == "__main__":
    company_context = get_company_context()
    tech_context = get_deltas()
    
    for tech_news in tech_context:
        add_log_to_data_agent(DATA_AGENT_ID, tech_news)

        blog = run_agent_workflow(tech_news["body"], company_context)

        if blog == None:
            print("Blog is empty")
        else:
            add_log_to_action_agent(ACTION_AGENT_ID, blog)
    
    # Get deltas from the API
    # deltas = get_deltas()

    # run_agent_workflow(deltas, "")

    


