import os

base_path = r"d:\PBB_Bakeuda_Full\Magang_Bakeuda\mobile\lib\screens"
parts = ["spop_form_screen_pt1.dart", "spop_form_screen_pt2.dart", "spop_form_screen_pt3.dart"]
target = os.path.join(base_path, "spop_form_screen.dart")

with open(target, "w", encoding="utf-8") as outfile:
    for part in parts:
        part_path = os.path.join(base_path, part)
        with open(part_path, "r", encoding="utf-8") as infile:
            outfile.write(infile.read())
            outfile.write("\n")
        os.remove(part_path)

print("Combine successful")
