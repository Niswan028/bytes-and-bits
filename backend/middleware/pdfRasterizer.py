import sys
import os
import json
import math
import fitz  # PyMuPDF
from PIL import Image, ImageOps, ImageEnhance, ImageFilter

def deskew_image_cv2(cv_img):
    """
    Detect document tilt angle using Hough lines / threshold coordinates
    and rotate back to 0 degrees for optimal OCR token recognition.
    """
    try:
        import cv2
        import numpy as np

        gray = cv2.cvtColor(cv_img, cv2.COLOR_BGR2GRAY) if len(cv_img.shape) == 3 else cv_img
        # Invert colors so text is white
        thresh = cv2.threshold(gray, 0, 255, cv2.THRESH_BINARY_INV | cv2.THRESH_OTSU)[1]
        
        # Find all white pixels (text characters)
        coords = np.column_stack(np.where(thresh > 0))
        if len(coords) < 100:
            return cv_img, 0.0

        # Compute minimum area rectangle
        rect = cv2.minAreaRect(coords)
        angle = rect[-1]

        # Determine true skew angle
        if angle < -45:
            angle = -(90 + angle)
        elif angle > 45:
            angle = 90 - angle
        else:
            angle = -angle

        # If angle is negligible, don't rotate
        if abs(angle) < 0.2 or abs(angle) > 25.0:
            return cv_img, 0.0

        (h, w) = cv_img.shape[:2]
        center = (w // 2, h // 2)
        M = cv2.getRotationMatrix2D(center, angle, 1.0)
        rotated = cv2.warpAffine(cv_img, M, (w, h), flags=cv2.INTER_CUBIC, borderMode=cv2.BORDER_REPLICATE)
        return rotated, float(angle)
    except Exception:
        return cv_img, 0.0

def preprocess_image_file(image_path, output_path=None):
    """
    Multistage clinical image preprocessor:
    1. Deskew phone-captured prescription photos
    2. Normalize uneven background illumination (removes shadows/folds)
    3. Suppress interfering medical chart grid lines
    4. Adaptive contrast enhancement (CLAHE)
    5. Mild unsharp mask for crisp character stroke edges
    """
    if output_path is None:
        output_path = image_path

    try:
        import cv2
        import numpy as np

        img = cv2.imread(image_path)
        if img is None:
            raise ValueError(f"Failed to read image: {image_path}")

        # 1. Deskew
        img, skew_angle = deskew_image_cv2(img)

        # Ensure minimum resolution for crisp character strokes
        h, w = img.shape[:2]
        if w < 2200:
            scale = 2200.0 / w
            img = cv2.resize(img, (2200, int(h * scale)), interpolation=cv2.INTER_LANCZOS4)

        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY) if len(img.shape) == 3 else img

        # 2. Background illumination normalization
        kernel_bg = cv2.getStructuringElement(cv2.MORPH_RECT, (41, 41))
        bg = cv2.dilate(gray, kernel_bg)
        bg = cv2.medianBlur(bg, 21)
        diff = 255 - cv2.absdiff(gray, bg)
        norm = cv2.normalize(diff, None, alpha=0, beta=255, norm_type=cv2.NORM_MINMAX, dtype=cv2.CV_8UC1)

        # 3. Suppress interfering chart grid lines
        inv = 255 - norm
        h_kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (35, 1))
        h_lines = cv2.morphologyEx(inv, cv2.MORPH_OPEN, h_kernel)

        v_kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (1, 35))
        v_lines = cv2.morphologyEx(inv, cv2.MORPH_OPEN, v_kernel)

        table_lines = cv2.add(h_lines, v_lines)
        no_lines = cv2.subtract(inv, table_lines)
        cleaned = 255 - no_lines

        # 4. Adaptive contrast enhancement (CLAHE)
        clahe = cv2.createCLAHE(clipLimit=2.2, tileGridSize=(8, 8))
        enhanced = clahe.apply(cleaned)

        # 5. Mild unsharp masking
        gaussian = cv2.GaussianBlur(enhanced, (0, 0), 2.0)
        unsharp = cv2.addWeighted(enhanced, 1.4, gaussian, -0.4, 0)

        cv2.imwrite(output_path, unsharp)
        return output_path

    except Exception:
        # Fallback to high-quality PIL pipeline
        with Image.open(image_path) as im:
            if im.width < 2200:
                scale = 2200.0 / im.width
                new_w = 2200
                new_h = int(im.height * scale)
                im = im.resize((new_w, new_h), Image.Resampling.LANCZOS)

            gray = im.convert('L')
            contrasted = ImageOps.autocontrast(gray, cutoff=1)
            enhancer = ImageEnhance.Sharpness(contrasted)
            sharpened = enhancer.enhance(1.4)
            sharpened.save(output_path, 'PNG')
        return output_path

def rasterize_pdf(pdf_path, output_dir, dpi=250, preprocess=True):
    """
    Rasterize all PDF pages to high-resolution PNGs with automatic OCR contrast preprocessing.
    """
    os.makedirs(output_dir, exist_ok=True)
    doc = fitz.open(pdf_path)
    results = []
    zoom = dpi / 72.0
    matrix = fitz.Matrix(zoom, zoom)

    for i in range(len(doc)):
        page_num = i + 1
        page = doc[i]
        pix = page.get_pixmap(matrix=matrix, alpha=False)
        out_name = f"page_{page_num}.png"
        out_path = os.path.join(output_dir, out_name)
        pix.save(out_path)

        if preprocess:
            try:
                preprocess_image_file(out_path, out_path)
            except Exception:
                pass

        results.append({
            "page": page_num,
            "imagePath": out_path,
            "width": pix.width,
            "height": pix.height
        })

    doc.close()
    return results

if __name__ == '__main__':
    if len(sys.argv) < 3:
        print(json.dumps({"error": "Usage: python pdfRasterizer.py <pdf_path> <output_dir> [dpi] OR --preprocess-single <in> <out>"}))
        sys.exit(1)

    if sys.argv[1] == '--preprocess-single':
        in_img = sys.argv[2]
        out_img = sys.argv[3] if len(sys.argv) > 3 else in_img
        try:
            preprocess_image_file(in_img, out_img)
            print(json.dumps({"success": True, "outputPath": out_img}))
        except Exception as e:
            print(json.dumps({"success": False, "error": str(e)}))
            sys.exit(1)
    else:
        pdf_path = sys.argv[1]
        output_dir = sys.argv[2]
        dpi = int(sys.argv[3]) if len(sys.argv) > 3 else 250

        try:
            pages = rasterize_pdf(pdf_path, output_dir, dpi)
            print(json.dumps({"success": True, "pages": pages}))
        except Exception as e:
            print(json.dumps({"success": False, "error": str(e)}))
            sys.exit(1)
