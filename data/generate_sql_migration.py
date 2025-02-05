import pandas as pd
import sys
from datetime import datetime
import os

def infer_sql_type(column, series):
    if column == "bookingsrequired":
        return "BOOLEAN"
    elif column == "web_link" or column == "externalEventId":
        return "VARCHAR(255)"  # Ensure sufficient length for URLs and IDs
    elif pd.api.types.is_integer_dtype(series):
        return "INTEGER"
    elif pd.api.types.is_float_dtype(series):
        return "FLOAT"
    elif pd.api.types.is_datetime64_any_dtype(series):
        return "DATETIME"
    else:
        max_length = series.astype(str).map(len).max()
        return f"VARCHAR({max_length if max_length > 0 else 255})"

def extract_event_id(url):
    if pd.isna(url):
        return None
    try:
        # Extract everything after 'eventid%3d'
        event_id = url.split('eventid%3d')[-1]
        return event_id
    except:
        return None

def generate_sql_migration(file_path):
    # Load the Excel file
    data = pd.read_excel(file_path, sheet_name=0)
    
    # Extract event IDs from web_link and create externalEventId column
    data['externalEventId'] = data['web_link'].apply(extract_event_id)

    # Function to infer SQL data types
    def infer_sql_type(column, series):
        if column == "bookingsrequired":
            return "BOOLEAN"
        elif pd.api.types.is_integer_dtype(series):
            return "INTEGER"
        elif pd.api.types.is_float_dtype(series):
            return "FLOAT"
        elif pd.api.types.is_datetime64_any_dtype(series):
            return "DATETIME"
        else:
            max_length = series.astype(str).map(len).max()
            return f"VARCHAR({max_length if max_length > 0 else 255})"

    # Generate the CREATE TABLE statement
    table_name = "events"
    columns = data.columns
    create_table_stmt = f"CREATE TABLE {table_name} (\n"
    create_table_stmt += "  event_id INTEGER PRIMARY KEY AUTOINCREMENT,\n"
    for column in columns:
        sql_type = infer_sql_type(column, data[column])
        column_name = column.replace(' ', '_').lower()
        create_table_stmt += f"  {column_name} {sql_type} NULL,\n"
    create_table_stmt = create_table_stmt.rstrip(",\n") + "\n);"

    # Generate the INSERT statements
    insert_stmts = []
    for _, row in data.iterrows():
        values = []
        for column, value in row.items():
            if pd.isnull(value):
                values.append("NULL")
            elif column == "bookingsrequired":
                values.append("TRUE" if value else "FALSE")
            elif isinstance(value, str):
                values.append("'" + value.replace("'", "''") + "'")
            elif isinstance(value, pd.Timestamp):
                values.append(f"'{value.isoformat()}'")
            else:
                values.append(str(value))
        insert_stmt = f"INSERT INTO {table_name} ({', '.join(data.columns.str.replace(' ', '_').str.lower())}) VALUES ({', '.join(values)});"
        insert_stmts.append(insert_stmt)

    # Combine all SQL statements
    sql_script = create_table_stmt + "\n\n" + "\n".join(insert_stmts)

    # Generate timestamp and output filename
    timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
    output_dir = 'migrations'
    os.makedirs(output_dir, exist_ok=True)
    output_file = os.path.join(output_dir, f'events_migration_{timestamp}.sql')

    # Write to a .sql file
    with open(output_file, "w") as file:
        file.write(sql_script)

    print(f"SQL migration script has been written to {output_file}")

if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: python generate_sql_migration.py <path_to_excel_file>")
        sys.exit(1)
    
    file_path = sys.argv[1]
    generate_sql_migration(file_path)