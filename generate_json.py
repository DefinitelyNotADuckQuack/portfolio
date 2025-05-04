import os
import json

thumbnail_map = {
    "art_thumbnails": ("Art", "art"),
    "VN_thumbnails": ("Visual Novel", "VN"),
    "apps_thumbnails": ("Apps", "apps")
}

base_thumb_dir = "img/portfolio/thumbnails"
base_full_dir = "img/portfolio"
output = {}

allowed_extensions = {".png", ".mp4"}

for thumb_folder, (category_name, full_folder) in thumbnail_map.items():
    thumb_path = os.path.join(base_thumb_dir, thumb_folder)
    full_path = os.path.join(base_full_dir, full_folder)

    if not os.path.isdir(thumb_path):
        continue

    entries = []
    for filename in sorted(os.listdir(thumb_path)):
        ext = os.path.splitext(filename)[1].lower()
        if ext not in allowed_extensions:
            continue

        thumb_file = os.path.join(thumb_path, filename).replace("\\", "/")
        full_file = os.path.join(full_path, filename.replace("_thumbnail", "")).replace("\\", "/")

        if os.path.exists(full_file):
            entries.append({
                "thumb": thumb_file,
                "full": full_file,
                "link": "https://www.instagram.com/kikuqueen/"
            })

    if entries:
        output[category_name] = entries

with open("portfolio_data.json", "w") as f:
    json.dump(output, f, indent=2)

print("Generated portfolio_data.json with default link field.")