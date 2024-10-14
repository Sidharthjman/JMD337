# Required Imports
# pip install pandas sqlalchemy psycopg2
import pandas as pd
import os
from sqlalchemy import create_engine

# Connection strings for source and target databases
source_db_url = 'postgresql://postgres:root@localhost:5432/online_course_app'
target_db_url = 'postgresql://postgres:root@localhost:5432/online_course_DE'

# Step 1: Extract data from source database and load into DataFrames
source_engine = create_engine(source_db_url)
target_engine = create_engine(target_db_url)

# Query to get the list of tables from the source database
tables_query = "SELECT table_name FROM information_schema.tables WHERE table_schema='public'"
tables = pd.read_sql(tables_query, source_engine)

# Step 2: Loop through each table and extract data
data_frames = {}  # Dictionary to store DataFrames

for table in tables['table_name']:
    # Extract data for each table
    query = f"SELECT * FROM {table}"
    raw_data = pd.read_sql(query, source_engine)
    
    # Store the DataFrame in the dictionary using table name as the key
    data_frames[table] = raw_data

    # Print first few rows of each DataFrame
    print(f"Data from table: {table}")
    print(raw_data.head())

# Step 3: Load data into the raw schema and save as CSV locally
local_raw_folder = 'raw'
os.makedirs(local_raw_folder, exist_ok=True)  # Create folder if it doesn't exist

with target_engine.connect() as conn:
    for table_name, df in data_frames.items():
        # Load DataFrame to the raw schema in the target database
        df.to_sql(table_name, conn, schema='raw', index=False, if_exists='replace')
        print(f"Loaded data from {table_name} into raw.{table_name}")

        # Save DataFrame to local CSV file
        csv_file_path = os.path.join(local_raw_folder, f"{table_name}_raw.csv")
        df.to_csv(csv_file_path, index=False)
        print(f"Saved {table_name} data to {csv_file_path}")

# Step 4: Transform and load users data into prep schema
users_df = data_frames['users'].drop(columns=['password', 'role'])
users_df = users_df.rename(columns={'id': 'userId'})
print("Null value counts in users_df:", users_df.isna().sum())
print(users_df.head())

# Save transformed users data to local folder
local_prep_folder = 'prep'
os.makedirs(local_prep_folder, exist_ok=True)
local_file_path = os.path.join(local_prep_folder, 'prep_users.csv')
users_df.to_csv(local_file_path, index=False)
print(f"Transformed users data saved to {local_file_path}")

# Load transformed users data into prep schema in the target database
with target_engine.connect() as conn:
    users_df.to_sql('users', conn, schema='prep', index=False, if_exists='replace')
    print("Transformed users data loaded into prep.users in the database.")

# Step 5: Transform and load courses data into prep schema
course_df = data_frames['courses'].drop(columns=['short_intro'])
course_df['completion_rate'] = (course_df['completions'] / course_df['enrollments']) * 100
course_df = course_df.rename(columns={'id': 'courseid'})
print(course_df.head())

# Save transformed courses data to local folder
local_file_path = os.path.join(local_prep_folder, 'prep_courses.csv')
course_df.to_csv(local_file_path, index=False)
print(f"Transformed course data saved to {local_file_path}")

# Load transformed courses data into prep schema in the target database
with target_engine.connect() as conn:
    course_df.to_sql('course', conn, schema='prep', index=False, if_exists='replace')
    print("Transformed course data loaded into prep.course in the database.")

# Step 6: Load enrollment data into prep schema without any transformations
enrollment_df = data_frames['enrollment']
print(enrollment_df.head())

# Save enrollment data to local folder
local_file_path = os.path.join(local_prep_folder, 'prep_enrollment.csv')
enrollment_df.to_csv(local_file_path, index=False)
print(f"Enrollment data saved to {local_file_path}")

# Load enrollment data into prep schema in the target database
with target_engine.connect() as conn:
    enrollment_df.to_sql('enrollment', conn, schema='prep', index=False, if_exists='replace')
    print("Enrollment data loaded into prep.enrollment in the database.")

# Step 7: Combine data for the final mart layer
with target_engine.connect() as conn:
    users_df = pd.read_sql("SELECT * FROM prep.users", conn)
    course_df = pd.read_sql("SELECT * FROM prep.course", conn)
    enrollment_df = pd.read_sql("SELECT * FROM prep.enrollment", conn)

# Merge enrollment with courses on 'CourseId'
combined_enrollment_courses = pd.merge(enrollment_df, course_df, on='courseid', how='inner')

# Merge the result with users on 'UserId'
final_combined_df = pd.merge(combined_enrollment_courses, users_df, on='userid', how='inner')

# Preview the combined data
print("Combined data preview:")
print(final_combined_df.head())

# Save final mart data to local folder
local_mart_folder = 'mart'
os.makedirs(local_mart_folder, exist_ok=True)
local_file_path = os.path.join(local_mart_folder, 'final_mart.csv')
final_combined_df.to_csv(local_file_path, index=False)
print(f"Final mart data saved to {local_file_path}")

# Load the final combined data into the mart schema in the target database
with target_engine.connect() as conn:
    final_combined_df.to_sql('final_mart', conn, schema='mart', index=False, if_exists='replace')
    print("Final combined data loaded into mart.final_mart in the database.")

# Preview the final combined data
print(final_combined_df.head())
