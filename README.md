# csv-export-task
in this task we have to export data of .csv file and store it into PostgreSQL database  according to file name  and creates table according to it . In this you can also show data with different functionality.
->Here is in Detail Description: 
Here’s a detailed breakdown of the outputs and functionality of your Django application:

1. File Upload:
   - Users upload CSV files using a form. The form includes an `input` for file selection and a `submit` button labeled "Submit."
   - Upon submission, the file is sent to the server, where it’s processed to extract data.

2. CSV File Processing:
   - The uploaded CSV file is read and parsed. The application:
     - Extracts the file name and headers.
     - Creates a new table in the database based on the CSV’s headers if it doesn’t already exist.
     - Inserts the CSV data into this newly created table.

3. File List Display:
   - A separate form allows users to request a list of all uploaded files.
   - When the "Show files" button is clicked, an AJAX request is made to retrieve the list of files from the database.
   - This list is then displayed on the web page, with each file name and upload timestamp.

4. Modal for Data Viewing:
   - When a file is selected from the displayed list, another AJAX request fetches the file’s data from the corresponding table.
   - This data is shown in a modal window, which includes a close button to dismiss the modal.

5. Data Retrieval and Manipulation:
   - Users can view the data from the uploaded CSV files in the modal.
   - The application supports inserting new records into the CSV data tables and updating existing records.
   - AJAX endpoints handle data insertion and updating, allowing users to modify data directly through the interface.

6. AJAX Interaction:
   - JavaScript handles the dynamic interactions:
     - Submitting forms without reloading the page.
     - Fetching and displaying data in the modal using AJAX requests.
     - Updating records in the database based on user input.

In summary, your application facilitates uploading CSV files, managing and displaying a list of uploaded files, and interacting with the data through a web interface with AJAX-based dynamic updates.
