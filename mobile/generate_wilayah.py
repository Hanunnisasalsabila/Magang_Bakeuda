import json
import os

json_path = r"d:\PBB_Bakeuda_Full\Magang_Bakeuda\frontend-bakeuda\src\utils\wilayahData.json"
dart_path = r"d:\PBB_Bakeuda_Full\Magang_Bakeuda\mobile\lib\utils\wilayah_data.dart"

with open(json_path, "r", encoding="utf-8") as f:
    data = json.load(f)

dart_content = "class WilayahData {\n"
dart_content += "  static const List<Map<String, String>> data = [\n"

for item in data:
    dart_content += "    {\n"
    for k, v in item.items():
        dart_content += f"      '{k}': '{v}',\n"
    dart_content += "    },\n"

dart_content += "  ];\n"
dart_content += "}\n"

with open(dart_path, "w", encoding="utf-8") as f:
    f.write(dart_content)

print("Generated wilayah_data.dart")
