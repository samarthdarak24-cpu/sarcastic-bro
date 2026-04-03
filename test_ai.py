import http.client
import json

conn = http.client.HTTPConnection("localhost", 8000)
headers = {'Content-type': 'application/json'}
data = {
    "crop_type": "Wheat",
    "district": "Ambala",
    "area_ha": 5.0,
    "soil_type": "Alluvial",
    "rainfall_mm": 400.0,
    "fertilizer_used_kg": 100.0
}
json_data = json.dumps(data)

try:
    conn.request("POST", "/ai/yield-prediction", json_data, headers)
    response = conn.getresponse()
    print(f"Status Code: {response.status}")
    print(f"Response: {response.read().decode()}")
except Exception as e:
    print(f"Error: {e}")
finally:
    conn.close()
