import pandas as pd

# Input and output file paths
input_file = "brisbane-parking-meters.xlsx"  # Replace with your Excel file path
output_file = "insert_parking_meters.sql"  # Output SQL file

# Table name
table_name = "parking_meters"

def wrap_column_name(column_name):
    """Wrap column names in quotes if needed for SQL."""
    return f'"{column_name}"'

def format_value(value):
    """Format the value for SQL."""
    if pd.isna(value):  # Handle NaN or None values
        return "NULL"
    if isinstance(value, str):  # Escape single quotes for SQL
        value = value.replace("'", "''")
        return f"'{value}'"
    return str(value)  # For numeric values or other types

def main():
    # Read the Excel file
    df = pd.read_excel(input_file)

    # Debug: Print available columns
    print("Available columns:", df.columns)

    # Ensure `ObjectId` is the first column and convert it to INT
    if "ObjectId" not in df.columns:
        raise KeyError("The 'ObjectId' column is missing from the dataset.")
    df["ObjectId"] = pd.to_numeric(df["ObjectId"], errors="coerce").fillna(0).astype(int)
    df = df[["ObjectId"] + [col for col in df.columns if col != "ObjectId"]]

    # Generate CREATE TABLE statement
    create_table_stmt = f"CREATE TABLE {table_name} (\n"
    create_table_stmt += "    ObjectId INT PRIMARY KEY,\n"
    for column in df.columns[1:]:
        col_name = wrap_column_name(column)
        if df[column].dtype == "object":
            create_table_stmt += f"    {col_name} VARCHAR(255),\n"
        elif "int" in str(df[column].dtype):
            create_table_stmt += f"    {col_name} INT,\n"
        elif "float" in str(df[column].dtype):
            create_table_stmt += f"    {col_name} FLOAT,\n"
        else:
            create_table_stmt += f"    {col_name} TEXT,\n"
    create_table_stmt = create_table_stmt.rstrip(",\n") + "\n);"

    # Generate INSERT statements
    sql_statements = [create_table_stmt]
    for _, row in df.iterrows():
        columns = ", ".join(wrap_column_name(col) for col in df.columns)
        values = ", ".join(format_value(value) for value in row)
        sql_statements.append(f"INSERT INTO {table_name} ({columns}) VALUES ({values});")

    # Write SQL statements to the output file
    with open(output_file, "w") as file:
        file.write("\n".join(sql_statements))

    print(f"SQL schema and insert statements have been written to {output_file}")

if __name__ == "__main__":
    main()