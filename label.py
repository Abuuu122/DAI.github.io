import os
from PIL import Image, ImageDraw, ImageFont

def load_local_font(font_path, font_size):
    font = ImageFont.truetype(font_path, font_size)
    return font

def add_label_to_images(input_directory, output_directory, font_path):
    if not os.path.exists(output_directory):
        os.makedirs(output_directory)

    for root, _, files in os.walk(input_directory):
        for file in files:
            if file.lower().endswith(('.png', '.jpg', '.jpeg', '.bmp', '.gif')):
                image_path = os.path.join(root, file)
                image = Image.open(image_path).convert("RGBA")

                # Calculate font size based on image size
                font_size = int(min(image.size) * 0.08)  # 5% of the smaller dimension
                font = load_local_font(font_path, font_size)

                # Create a transparent overlay
                txt = Image.new('RGBA', image.size, (255, 255, 255, 0))

                # Initialize ImageDraw
                draw = ImageDraw.Draw(txt)

                # Extract basename without extension
                basename = os.path.splitext(os.path.basename(file))[0]

                # Determine text and position
                if basename == "DAI":
                    text = "DAI (Ours)"
                    position = (10, 10)
                else:
                    text = basename
                    position = (image.width - 10 - draw.textsize(text, font=font)[0], 10)

                # Add semi-transparent background for text
                text_width, text_height = draw.textsize(text, font=font)
                background = Image.new('RGBA', (text_width + 20, text_height + 10), (0, 0, 0, 128))
                txt.paste(background, (position[0] - 10, position[1] - 5))

                # Add text to the overlay
                draw.text(position, text, font=font, fill=(255, 255, 255, 255))

                # Combine the image with the overlay
                combined = Image.alpha_composite(image, txt)

                # Save the image to the output directory
                output_path = os.path.join(output_directory, file)
                combined.save(output_path)

if __name__ == "__main__":
    input_directory = "D:/DAI.github.io/static/images/comparison/scene1"  # Replace with the path to your input directory
    output_directory = "D:/DAI.github.io/static/images/comparison/scene1_label"  # Replace with the path to your output directory
    font_path = "D:/.Download/Times New Roman.ttf"  # Replace with the path to your local font file
    add_label_to_images(input_directory, output_directory, font_path)
