from PIL import Image

def crop_bottom_text(input_path, output_path):
    img = Image.open(input_path).convert("RGBA")
    width, height = img.size
    
    # Estimate that the text is in the bottom 25% of the image
    # We will crop to keep top 75%
    new_height = int(height * 0.75)
    
    cropped_img = img.crop((0, 0, width, new_height))
    
    # Now let's trim any extra whitespace around the remaining logo
    bbox = cropped_img.getbbox()
    if bbox:
        cropped_img = cropped_img.crop(bbox)
        
    cropped_img.save(output_path, "PNG")
    print(f"Saved cropped image to {output_path} (Size: {cropped_img.size})")

if __name__ == "__main__":
    crop_bottom_text("public/images/SloanIcon_transparent.png", "public/images/SloanIcon_cropped.png")
