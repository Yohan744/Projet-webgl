#!/bin/bash

dir="public/assets/textures/attic/ground"
size=1024

# Assurez-vous que le chemin spécifié existe
if [ ! -d "$dir" ]; then
  echo "Le répertoire spécifié n'existe pas."
  exit 1
fi

# Boucle sur les fichiers avec des extensions spécifiques
find "$dir" -type f \( -iname "*.jpg" -o -iname "*.png" \) | while IFS= read -r file; do
    echo "Traitement de $file"
    directory=$(dirname "$file")

    # Définir le nouveau nom en fonction du type de texture
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
            *)
                # Utiliser un nom générique si aucun motif n'est trouvé
                base=$(basename "${file%.*}")
                new_filename="${base}.webp"
                ;;
        esac

    # Utiliser magick pour obtenir les dimensions de l'image
    read width height <<< $(magick identify -format "%wx%h" "$file")

    # Vérifier si l'image doit être redimensionnée
    if [ "$width" -gt $size ] || [ "$height" -gt $size ]; then
        # Redimensionner et convertir l'image
        magick convert "$file" -resize "${size}x${size}" "${directory}/${new_filename}"
    else
        # Convertir l'image sans redimensionnement
        magick convert "$file" "${directory}/${new_filename}"
    fi

    # Supprimer le fichier original après conversion
    rm "$file"
done

echo "Conversion en webp et renommage terminés."
