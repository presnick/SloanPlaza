from PIL import Image

def remove_black_background(input_path, output_path):
    img = Image.open(input_path).convert("RGBA")
    datas = img.getdata()

    newData = []
    for item in datas:
        # Check if the pixel is black (or very dark)
        # item[0] = R, item[1] = G, item[2] = B
        if item[0] < 50 and item[1] < 50 and item[2] < 50:
            # Replaced with transparent
            newData.append((255, 255, 255, 0))
        else:
            newData.append(item)

    img.putdata(newData)
    img.save(output_path, "PNG")
    print(f"Saved transparent image to {output_path}")

if __name__ == "__main__":
    remove_black_background("public/images/SloanIcon.png", "public/images/SloanIcon_transparent.png")
