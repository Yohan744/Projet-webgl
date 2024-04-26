#!/bin/bash

dir="public/assets/textures/attic/ground"
size=1024

if [ ! -d "$dir" ]; then
  echo "Le répertoire spécifié n'existe pas."
  exit 1
fi

find "$dir" -type f \( -iname "*.jpg" -o -iname "*.png" \) | while IFS= read -r file; do
    echo "Traitement de $file"
    directory=$(dirname "$file")

    case "$file" in
        *"_color"* | *"_basecolor"*)
            new_filename="diffuse.webp"
            ;;
        *"_height"*)
            new_filename="displacement.webp"
            ;;
        *"_normal"*)
            new_filename="normal.webp"
            ;;
        *"_roughness"*)
            new_filename="roughness.webp"
            ;;
        *"_ao"*)
                    new_filename="ao.webp"
                    ;;
        *)
            base=$(basename "${file%.*}")
            new_filename="${base}.webp"
            ;;
    esac

    read width height <<< $(magick identify -format "%w %h" "$file")

    if [ "$width" -gt $size ] || [ "$height" -gt $size ]; then
        magick convert "$file" -resize "${size}x${size}" "${directory}/${new_filename}"
    else
        magick convert "$file" "${directory}/${new_filename}"
    fi

    rm "$file"
done

echo "Conversion en webp et renommage terminés."
