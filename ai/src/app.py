from flask import Flask, request, jsonify
import os
from transformers import pipeline

app = Flask(__name__)


def load_summary_model():
    try:
        model_path = os.path.join(os.path.dirname(__file__), "../summaryModel")
        summarizer = pipeline("summarization", model=model_path)
        return summarizer
    except Exception as e:
        print(f"Error loading model: {e}")
        return None


summarizer = load_summary_model()

print("Model: ", summarizer)


@app.route("/")
def hello():
    return "<h1>Hello From the Flask App</h1>"

@app.route("/summary", methods=["POST"])
def summary():
    try:
        #conversation data
        data = request.get_json(force=True)

        #checking is data exists or not
        if not data or "conversation" not in data:
            return jsonify({"error": "Missing conversation in the request!"}), 402
        
        conversation_text = data["conversation"]

        # validation for conversation text
        if not conversation_text or len(conversation_text.strip()) == 0:
            return jsonify({"error": "Empty conversation text"}), 400
            

        #check if the model is loaded or not 
        if summarizer is None:
            return jsonify({"error": "There is an error while loading the summary model!"}), 500

        # split the long text into the chunks 
        max_chunk_size = 1000
        chunks = [conversation_text[i:i + max_chunk_size] 
                 for i in range(0, len(conversation_text), max_chunk_size)]
        
        
        # Summarize each chunk
        summaries = []
        for chunk in chunks:
            chunk_summary = summarizer(
                chunk,
            )
            summaries.append(chunk_summary[0]['summary_text'])
        
        # Combine all summaries
        final_summary = " ".join(summaries)
        
        return jsonify({
            "summary": final_summary,
            "chunks_processed": len(chunks)
        }), 200
        
    except Exception as e:
        return jsonify({"error": f"Error in the summary request: {str(e)}"}), 500



if __name__ == "__main__":
    app.run(debug=True,host='localhost',port=6000)

