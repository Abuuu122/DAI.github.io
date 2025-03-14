from PIL import Image

def resize_and_center_crop(image_path, output_path, target_width, target_height):
    with Image.open(image_path) as img:
        # Resize the image to the target height while maintaining aspect ratio
        img = img.resize((int(img.width * target_height / img.height), target_height), Image.LANCZOS)
        
        # Calculate the cropping box
        width, height = img.size
        left = (width - target_width) / 2
        right = (width + target_width) / 2
        top = 0
        bottom = height

        # Crop the image
        img_cropped = img.crop((left, top, right, bottom))
        img_cropped.save(output_path)

# Example usage:
resize_and_center_crop('D:/DAI/static/images/teaser/3.png', 'D:/DAI/static/images/teaser/3_crop.png', 768, 576)