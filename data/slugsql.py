import json

# Path to your JSON file containing the generated URLs
input_json = "generatedurl.json"
# Output SQL file
output_sql = "update_event_slug.sql"

with open(input_json, "r", encoding="utf-8") as f_json, open(output_sql, "w", encoding="utf-8") as f_sql:
    data = json.load(f_json)
    
    f_sql.write("BEGIN TRANSACTION;\n")
    
    for item in data:
        # Example URL: "/events/1/brisbane-city-christmas-tree-king-george-square"
        parts = item["URL"].split("/")
        event_id = parts[2]       # "1"
        slug_raw = parts[3]      # "brisbane-city-christmas-tree-king-george-square"
        
        # Escape single quotes in the slug if any
        slug_escaped = slug_raw.replace("'", "''")
        
        # Write the UPDATE statement
        f_sql.write(f"UPDATE events SET slug = '{slug_escaped}' WHERE event_id = {event_id};\n")
    
    f_sql.write("COMMIT;\n")