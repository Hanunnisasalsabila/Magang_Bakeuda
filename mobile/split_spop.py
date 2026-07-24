import os

file_path = r"lib/screens/spop_form_screen.dart"
with open(file_path, "r", encoding="utf-8") as f:
    lines = f.readlines()

def write_part(filename, extension_name, start_line, end_line):
    os.makedirs(r"lib/screens/spop_steps", exist_ok=True)
    content = "part of '../spop_form_screen.dart';\n\n"
    content += f"extension {extension_name} on _SpopFormScreenState {{\n"
    content += "".join(lines[start_line-1 : end_line])
    content += "}\n"
    
    with open(rf"lib/screens/spop_steps/{filename}", "w", encoding="utf-8") as f:
        f.write(content)
        
    return list(range(start_line-1, end_line))

indices_to_remove = set()

indices_to_remove.update(write_part("step0_layanan.dart", "Step0Extension", 643, 968))
indices_to_remove.update(write_part("step1_subjek.dart", "Step1Extension", 972, 1029))
indices_to_remove.update(write_part("step2_objek.dart", "Step2Extension", 1031, 1310))
indices_to_remove.update(write_part("step3_bangunan.dart", "Step3Extension", 1312, 1408))
indices_to_remove.update(write_part("step4_lampiran.dart", "Step4Extension", 1410, 1434))
indices_to_remove.update(write_part("step5_konfirmasi.dart", "Step5Extension", 1436, 1495))

new_lines = []
for i, line in enumerate(lines):
    if i not in indices_to_remove:
        new_lines.append(line)

with open(file_path, "w", encoding="utf-8") as f:
    f.writelines(new_lines)

print("Split successful!")
