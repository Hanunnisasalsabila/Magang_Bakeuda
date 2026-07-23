import os
import glob

directory = r"lib/screens/spop_steps"
files = glob.glob(os.path.join(directory, "*.dart"))

for file_path in files:
    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()
    
    # Replace public extension name with private
    content = content.replace("extension Step", "extension _Step")
    
    # Replace setState with updateFormState
    content = content.replace("setState(", "updateFormState(")
    
    with open(file_path, "w", encoding="utf-8") as f:
        f.write(content)

print("Fixes applied!")
