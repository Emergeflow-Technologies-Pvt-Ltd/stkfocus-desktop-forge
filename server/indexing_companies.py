import json

# Read the JSON file
with open('nse_list.json', 'r') as json_file:
    data = json.load(json_file)

# Create an empty dictionary to hold the indexed list
indexed_data = {"Sheet1": {}}

# Iterate over each item in the data
for item in data["Sheet1"]:
    print(item)
    if item != None:
      # Get the first letter of the "Symbol"
      first_letter = item["Symbol"][0].upper()

      # Initialize the list if the first letter key doesn't exist
      if first_letter not in indexed_data["Sheet1"]:
          indexed_data["Sheet1"][first_letter] = []

      # Append the item to the corresponding list
      indexed_data["Sheet1"][first_letter].append(item)

# Save the indexed data as a JSON file
with open('indexed_data.json', 'w') as json_file:
    json.dump(indexed_data, json_file, indent=4)

print("Indexed data has been saved to 'indexed_data.json'.")
