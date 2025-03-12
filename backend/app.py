# backend/app.py
from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
from scipy import stats

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "http://localhost:3000"}})

@app.route('/api/stats/basic', methods=['POST'])
def basic_statistics():
    """Calculate basic statistics for an array of numbers"""
    data = request.json.get('data', [])
    
    if not data:
        return jsonify({
            "mean": "N/A", 
            "median": "N/A", 
            "std_dev": "N/A", 
            "count": 0
        })
    
    data_array = np.array(data)
    
    result = {
        "mean": float(np.mean(data_array)),
        "median": float(np.median(data_array)),
        "std_dev": float(np.std(data_array, ddof=1)),  # Sample standard deviation
        "count": len(data_array),
        "min": float(np.min(data_array)),
        "max": float(np.max(data_array)),
        "quartiles": [
            float(np.percentile(data_array, 25)),
            float(np.percentile(data_array, 50)),
            float(np.percentile(data_array, 75))
        ]
    }
    
    return jsonify(result)

@app.route('/api/stats/histogram', methods=['POST'])
def histogram():
    """Generate histogram data"""
    payload = request.json
    data = payload.get('data', [])
    bins = payload.get('bins', 5)
    
    if len(data) < 2:
        return jsonify([])
    
    data_array = np.array(data)
    hist, bin_edges = np.histogram(data_array, bins=bins)
    
    result = []
    for i in range(len(hist)):
        result.append({
            "range": f"{bin_edges[i]:.2f}-{bin_edges[i+1]:.2f}",
            "count": int(hist[i])
        })
    
    return jsonify(result)

@app.route('/api/stats/filter', methods=['POST'])
def filter_data():
    """Filter data based on min and max constraints"""
    payload = request.json
    data = payload.get('data', [])
    min_value = payload.get('min_value')
    max_value = payload.get('max_value')
    
    data_array = np.array(data)
    
    if min_value is not None:
        data_array = data_array[data_array >= min_value]
    
    if max_value is not None:
        data_array = data_array[data_array <= max_value]
    
    return jsonify({"filtered_data": data_array.tolist()})

@app.route('/api/stats/operation', methods=['POST'])
def apply_operation():
    """Apply a mathematical operation to each value"""
    payload = request.json
    data = payload.get('data', [])
    operation = payload.get('operation', '')
    value = payload.get('value', 0)
    
    data_array = np.array(data)
    
    if operation == "add":
        result = data_array + value
    elif operation == "subtract":
        result = data_array - value
    elif operation == "multiply":
        result = data_array * value
    elif operation == "divide":
        if value == 0:
            return jsonify({"error": "Cannot divide by zero"}), 400
        result = data_array / value
    else:
        return jsonify({"error": f"Unknown operation: {operation}"}), 400
    
    return jsonify({"result": result.tolist()})

@app.route('/api/stats/regression', methods=['POST'])
def linear_regression():
    """Perform linear regression on x,y pairs"""
    data = request.json.get('data', [])
    
    if len(data) % 2 != 0 or len(data) < 4:
        return jsonify({
            "slope": "N/A",
            "intercept": "N/A",
            "r_squared": "N/A",
            "error": "Need at least two x,y pairs for regression"
        })
    
    # Reshape into x,y pairs
    data_array = np.array(data)
    xy_pairs = data_array.reshape(-1, 2)
    x = xy_pairs[:, 0]
    y = xy_pairs[:, 1]
    
    # Calculate linear regression
    slope, intercept, r_value, p_value, std_err = stats.linregress(x, y)
    
    return jsonify({
        "slope": float(slope),
        "intercept": float(intercept),
        "r_squared": float(r_value ** 2),
        "p_value": float(p_value),
        "std_error": float(std_err)
    })

@app.route('/api/stats/correlation', methods=['POST'])
def calculate_correlation():
    """Calculate correlation between pairs of values"""
    data = request.json.get('data', [])
    
    if len(data) % 2 != 0 or len(data) < 4:
        return jsonify({
            "correlation": "N/A",
            "error": "Need at least two x,y pairs"
        })
    
    # Reshape into x,y pairs
    data_array = np.array(data)
    xy_pairs = data_array.reshape(-1, 2)
    x = xy_pairs[:, 0]
    y = xy_pairs[:, 1]
    
    # Calculate correlation
    correlation, p_value = stats.pearsonr(x, y)
    
    return jsonify({
        "correlation": float(correlation),
        "p_value": float(p_value)
    })

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=8000)