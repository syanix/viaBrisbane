import pandas as pd

# Load the Excel file
file_path = 'brisbane-city-council-events.xlsx'
data = pd.read_excel(file_path, sheet_name=0)

# Function to infer SQL data types
def infer_sql_type(column, series):
    if column == "bookingsrequired":  # Special handling for bookingsrequired
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
create_table_stmt += "  event_id INTEGER PRIMARY KEY AUTOINCREMENT,\n"  # Add primary key column
for column in columns:
    sql_type = infer_sql_type(column, data[column])
    column_name = column.replace(' ', '_').lower()  # Normalize column names
    create_table_stmt += f"  {column_name} {sql_type} NULL,\n"  # Make all fields nullable
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
            values.append("'" + value.replace("'", "''") + "'")  # Escape single quotes
        elif isinstance(value, pd.Timestamp):
            values.append(f"'{value.isoformat()}'")  # Use ISO format for datetime
        else:
            values.append(str(value))
    insert_stmt = f"INSERT INTO {table_name} ({', '.join(data.columns.str.replace(' ', '_').str.lower())}) VALUES ({', '.join(values)});"
    insert_stmts.append(insert_stmt)

# Combine all SQL statements
sql_script = create_table_stmt + "\n\n" + "\n".join(insert_stmts)

# Write to a .sql file
output_file = "events_migration.sql"
with open(output_file, "w") as file:
    file.write(sql_script)

print(f"SQL migration script has been written to {output_file}")