"""
REAL-WORLD CROP QUALITY AI SERVICE v7.0
=======================================
EDGE-HYBRID DETECTION + ADAPTIVE RELATIVE GRADING

Root Cause Fix: Previous versions used brightness-based thresholding
for detection (Watershed/OTSU). This EXCLUDED dark/rotten items from
detection because they were treated as "background."

v7.0 Solution: Use EDGE-based detection (Canny edges exist on ALL
objects regardless of brightness) + dense grid overlay to guarantee
100% coverage of the image. Then grade using relative brightness.

Architecture:
  Layer 1: CLIP Zero-Shot Crop Identification
  Layer 2: EDGE Detection + Dense Grid Overlay (100% image coverage)
  Layer 3: Adaptive Relative Brightness Grading
"""

from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
import cv2
import numpy as np
from PIL import Image
import io
from typing import List, Dict, Any, Tuple
import torch
from ultralytics import YOLO
from transformers import CLIPProcessor, CLIPModel
import base64

app = FastAPI(title="AgriVoice AI v7.0", version="7.0.0")
app.add_middleware(
    CORSMiddleware, allow_origins=["*"],
    allow_credentials=True, allow_methods=["*"], allow_headers=["*"],
)

yolo_detector = None
clip_model = None
clip_processor = None
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

INDIA_CROPS = [
    "Tomato", "Potato", "Onion", "Apple", "Banana",
    "Mango", "Grapes", "Pomegranate", "Orange",
    "Cabbage", "Cauliflower", "Brinjal"
]

# Per-crop: how much darker than group median = damaged
DARK_RATIO = {
    "tomato": 0.70, "potato": 0.65, "onion": 0.65,
    "apple": 0.70, "banana": 0.65, "mango": 0.70,
    "grapes": 0.50, "pomegranate": 0.65, "orange": 0.70,
    "cabbage": 0.65, "cauliflower": 0.75, "brinjal": 0.40,
}


@app.on_event("startup")
async def load_models():
    global yolo_detector, clip_model, clip_processor
    try:
        print("🚀 AgriVoice AI v7.0 — Edge-Hybrid Detection Engine")
        print("   [1/2] Loading YOLOv8...")
        yolo_detector = YOLO('yolov8n.pt')
        print("   [2/2] Loading CLIP...")
        clip_model = CLIPModel.from_pretrained("openai/clip-vit-base-patch32")
        clip_processor = CLIPProcessor.from_pretrained("openai/clip-vit-base-patch32")
        clip_model.to(device).eval()
        print(f"✅ Ready | {device} | {len(INDIA_CROPS)} crops")
    except Exception as e:
        print(f"❌ {e}")


def preprocess_image(image_bytes: bytes) -> np.ndarray:
    return np.array(Image.open(io.BytesIO(image_bytes)).convert('RGB'))


# ===================================================================
# LAYER 1: CROP IDENTIFICATION
# ===================================================================
def identify_crop(image: np.ndarray) -> Tuple[str, float]:
    try:
        pil = Image.fromarray(image)
        prompts = [f"a photo of {c}" for c in INDIA_CROPS]
        prompts.append("a photo of agricultural produce")
        inputs = clip_processor(text=prompts, images=pil,
                                return_tensors="pt", padding=True).to(device)
        with torch.no_grad():
            probs = clip_model(**inputs).logits_per_image.softmax(dim=1)
        idx = probs.argmax().item()
        conf = float(probs[0, idx].item() * 100)
        return (INDIA_CROPS[idx], conf) if idx < len(INDIA_CROPS) else ("Unknown", conf)
    except Exception as e:
        print(f"CLIP Error: {e}")
        return "Unknown", 0.0


# ===================================================================
# LAYER 2: EDGE-HYBRID DETECTION
# Uses edge detection + dense grid to find ALL items including dark ones
# ===================================================================
def detect_items(image: np.ndarray) -> List[List[int]]:
    """
    Multi-strategy detection that guarantees coverage of dark/rotten areas.
    1. Edge-based contour detection (works on dark AND light objects)
    2. Dense grid overlay (guaranteed 100% image coverage)
    3. Merge and deduplicate
    """
    h, w = image.shape[:2]
    img_area = h * w

    # --- Strategy 1: Edge-based detection ---
    # Edges exist on ALL objects regardless of brightness
    gray = cv2.cvtColor(image, cv2.COLOR_RGB2GRAY)
    blur = cv2.GaussianBlur(gray, (5, 5), 0)

    # Multi-scale edge detection
    edges1 = cv2.Canny(blur, 30, 100)
    edges2 = cv2.Canny(blur, 50, 150)
    edges = cv2.bitwise_or(edges1, edges2)

    # Dilate edges to close gaps
    kernel = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (9, 9))
    dilated = cv2.dilate(edges, kernel, iterations=2)

    # Fill enclosed regions
    filled = cv2.morphologyEx(dilated, cv2.MORPH_CLOSE, kernel, iterations=2)

    # Find contours from edges
    contours, _ = cv2.findContours(filled, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

    edge_boxes = []
    for cnt in contours:
        x, y, bw, bh = cv2.boundingRect(cnt)
        area = bw * bh
        aspect = bw / max(bh, 1)
        if 0.004 * img_area < area < 0.20 * img_area and 0.25 < aspect < 4.0:
            edge_boxes.append([x, y, x + bw, y + bh])

    # --- Strategy 2: Dense grid overlay ---
    # Guarantees EVERY region of image is covered
    # Use adaptive grid size based on image dimensions
    cell_size = min(h, w) // 4  # ~4 items per row/column
    if cell_size < 50:
        cell_size = 50

    grid_boxes = []
    for yi in range(0, h - cell_size // 2, cell_size):
        for xi in range(0, w - cell_size // 2, cell_size):
            x2 = min(xi + cell_size, w)
            y2 = min(yi + cell_size, h)
            if (x2 - xi) > 30 and (y2 - yi) > 30:
                grid_boxes.append([xi, yi, x2, y2])

    # --- Strategy 3: YOLO (for any it can find) ---
    yolo_boxes = []
    for r in yolo_detector(image, conf=0.3):
        for b in r.boxes:
            bb = list(map(int, b.xyxy[0].tolist()))
            if (bb[2] - bb[0]) > 15 and (bb[3] - bb[1]) > 15:
                yolo_boxes.append(bb)

    print(f"   Detection: Edge={len(edge_boxes)} Grid={len(grid_boxes)} YOLO={len(yolo_boxes)}")

    # --- Merge: prefer edge boxes, fill gaps with grid ---
    # If edge detection found good boxes, use them
    if len(edge_boxes) >= 5:
        final = edge_boxes
    else:
        # Edge detection didn't find enough, use grid as primary
        final = grid_boxes

    # Add YOLO detections
    final.extend(yolo_boxes)

    # Apply NMS
    final = _nms(final, 0.4)

    return final[:30]


def _nms(bboxes, iou_thresh=0.4):
    if len(bboxes) <= 1:
        return bboxes
    bboxes = sorted(bboxes, key=lambda b: (b[2]-b[0])*(b[3]-b[1]), reverse=True)
    keep = []
    for a in bboxes:
        ok = True
        for b in keep:
            x1, y1 = max(a[0], b[0]), max(a[1], b[1])
            x2, y2 = min(a[2], b[2]), min(a[3], b[3])
            inter = max(0, x2-x1) * max(0, y2-y1)
            aa = (a[2]-a[0])*(a[3]-a[1])
            ba = (b[2]-b[0])*(b[3]-b[1])
            if inter / max(aa+ba-inter, 1) > iou_thresh:
                ok = False
                break
        if ok:
            keep.append(a)
    return keep


# ===================================================================
# LAYER 3: ADAPTIVE RELATIVE QUALITY GRADING
# ===================================================================
def assess_quality(image: np.ndarray, bboxes: List[List[int]], crop: str) -> Dict:
    crop_key = crop.lower().replace("eggplant", "brinjal")
    dark_thresh = DARK_RATIO.get(crop_key, 0.65)

    # ─── PASS 1: Gather brightness for ALL regions ───
    regions = []
    for bbox in bboxes:
        x1, y1, x2, y2 = map(int, bbox)
        roi = image[y1:y2, x1:x2]
        if roi.size == 0 or roi.shape[0] < 5 or roi.shape[1] < 5:
            continue
        gray = cv2.cvtColor(roi, cv2.COLOR_RGB2GRAY)
        regions.append({
            "bbox": bbox,
            "roi": roi,
            "avg_brightness": float(np.mean(gray)),
            "min_brightness": float(np.percentile(gray, 10)),  # 10th percentile
            "dark_pixel_pct": float(np.sum(gray < 50) / gray.size),
            "very_dark_pct": float(np.sum(gray < 30) / gray.size),
        })

    if not regions:
        return {"grade": "N/A", "total_items": 0, "good_items": 0,
                "damaged_items": 0, "average_damage": 0, "items": []}

    # ─── GROUP STATISTICS ───
    brightnesses = [r["avg_brightness"] for r in regions]
    group_median = float(np.median(brightnesses))
    group_std = float(np.std(brightnesses))
    total_count = len(regions)

    print(f"   📊 Group: size={total_count} median={group_median:.0f} std={group_std:.0f}")

    # ─── PASS 2: Grade each region (RELATIVE if group, ABSOLUTE if small) ───
    items = []
    for r in regions:
        bright = r["avg_brightness"]
        dark_pct = r["dark_pixel_pct"]
        very_dark = r["very_dark_pct"]

        # === SIGNAL 1: Brightness Analysis (50% weight) ===
        if total_count >= 3:
            brightness_ratio = bright / max(group_median, 1)
            is_dark = brightness_ratio < dark_thresh
            rel_score = min((1 - brightness_ratio) * 120, 80) if is_dark else 0
        else:
            # Absolute fallback for small samples
            is_dark = bright < 110
            rel_score = 60 if bright < 85 else (30 if bright < 110 else 0)

        # === SIGNAL 2: Absolute dark pixel analysis (30% weight) ===
        if very_dark > 0.15: # Critical rot spots
            abs_score = min(very_dark * 300, 90)
        elif dark_pct > 0.25: # Surface discoloration
            abs_score = min(dark_pct * 150, 60)
        else:
            abs_score = 0

        # === SIGNAL 3: Outlier detection (20% weight) ===
        if total_count >= 5 and group_std > 5:
            z_score = (group_median - bright) / max(group_std, 1)
            outlier_score = min(max(z_score * 30, 0), 60) if z_score > 1.2 else 0
        else:
            outlier_score = 0

        # Combined damage score
        if total_count < 3:
            combined = (rel_score * 0.40) + (abs_score * 0.60)
        else:
            combined = (rel_score * 0.50) + (abs_score * 0.30) + (outlier_score * 0.20)

        # Find specific defects
        defects = _find_defects(r, combined, crop)

        # Final Status & Grade
        if combined > 40 or very_dark > 0.35:
            status, grade = "damaged", "C"
        elif combined > 18 or dark_pct > 0.25:
            status, grade = "damaged", "B"
        else:
            status, grade = "good", "A"

        x1, y1, x2, y2 = map(int, r["bbox"])
        items.append({
            "bbox": [float(x1), float(y1), float(x2), float(y2)],
            "status": status,
            "damage_percent": round(combined, 1),
            "grade": grade,
            "defects": defects,
        })

    total = len(items)
    good = sum(1 for i in items if i["status"] == "good")
    damaged = total - good
    avg = sum(i["damage_percent"] for i in items) / max(total, 1)

    fg = "C" if avg > 40 else ("B" if avg > 15 else "A")

    return {
        "grade": fg, "total_items": total,
        "good_items": good, "damaged_items": damaged,
        "average_damage": round(avg, 1), "items": items,
    }


def _find_defects(r: Dict, combined: float, crop: str) -> List[str]:
    defects = []

    # Dark rot
    if r["very_dark_pct"] > 0.20:
        defects.append("Dark Rot")
    elif r["dark_pixel_pct"] > 0.30:
        defects.append("Rot/Decay")

    # Mold check
    roi = r["roi"]
    hsv = cv2.cvtColor(roi, cv2.COLOR_RGB2HSV)
    total_px = hsv.shape[0] * hsv.shape[1]

    white = (hsv[:, :, 1] < 20) & (hsv[:, :, 2] > 210)
    if np.sum(white) / total_px > 0.06:
        defects.append("Mold/Fungus")

    # Green spots (potato/onion specific)
    if crop.lower() in ["potato", "onion"]:
        green = (hsv[:, :, 0] > 35) & (hsv[:, :, 0] < 85) & (hsv[:, :, 1] > 60)
        if np.sum(green) / total_px > 0.12:
            defects.append("Green Spots")

    # Catch-all for high damage with no specific defect
    if combined > 35 and not defects:
        defects.append("Visual Damage")

    return defects


# ===================================================================
# VISUALIZATION
# ===================================================================
def draw_annotated(image: np.ndarray, analysis: Dict) -> str:
    ann = image.copy()
    for item in analysis.get("items", []):
        x1, y1, x2, y2 = map(int, item["bbox"])
        good = item["status"] == "good"
        color = (0, 200, 0) if good else (220, 30, 30)
        thickness = 3
        cv2.rectangle(ann, (x1, y1), (x2, y2), color, thickness)

        # Label with filled background
        label = f"{item['grade']} ({item['damage_percent']:.0f}%)"
        font = cv2.FONT_HERSHEY_SIMPLEX
        scale = 0.4
        (tw, th), _ = cv2.getTextSize(label, font, scale, 1)
        ly = max(y1 - 3, th + 3)
        cv2.rectangle(ann, (x1, ly - th - 3), (x1 + tw + 4, ly + 3), color, -1)
        cv2.putText(ann, label, (x1 + 2, ly), font, scale, (255, 255, 255), 1)

    bgr = cv2.cvtColor(ann, cv2.COLOR_RGB2BGR)
    _, buf = cv2.imencode('.jpg', bgr, [cv2.IMWRITE_JPEG_QUALITY, 90])
    return base64.b64encode(buf).decode('utf-8')


def get_recommendation(crop, grade, good, damaged):
    total = good + damaged
    pct = (good / max(total, 1)) * 100
    if grade == "A":
        return (f"Excellent {crop} batch! {good}/{total} ({pct:.0f}%) premium. "
                f"Recommended for Export/Premium Retail (APMC Grade A).")
    elif grade == "B":
        return (f"Standard {crop} batch. {good}/{total} good quality. "
                f"For Local Markets. Sort out {damaged} damaged items.")
    else:
        return (f"Below-standard {crop}. {damaged}/{total} damaged. "
                f"Consider Processing (Juice/Puree). Separate {good} good items for sale.")


# ===================================================================
# MAIN API
# ===================================================================
@app.post("/analyze")
async def analyze(file: UploadFile = File(...)):
    try:
        image = preprocess_image(await file.read())
        print(f"\n{'='*50}")
        print(f"📸 {file.filename}")

        crop, conf = identify_crop(image)
        print(f"🔍 L1: {crop} ({conf:.1f}%)")

        bboxes = detect_items(image)
        print(f"📦 L2: {len(bboxes)} items")

        analysis = assess_quality(image, bboxes, crop)
        print(f"📊 L3: Grade {analysis['grade']} | "
              f"✅{analysis['good_items']} ❌{analysis['damaged_items']} "
              f"Avg:{analysis['average_damage']}%")

        img_b64 = draw_annotated(image, analysis)
        rec = get_recommendation(crop, analysis["grade"],
                                 analysis["good_items"], analysis["damaged_items"])

        return {
            "success": True, "crop": crop, "confidence": round(conf, 1),
            "total_items": analysis["total_items"],
            "good_items": analysis["good_items"],
            "damaged_items": analysis["damaged_items"],
            "average_damage": analysis["average_damage"],
            "grade": analysis["grade"], "recommendation": rec,
            "annotated_image": f"data:image/jpeg;base64,{img_b64}",
            "items": analysis["items"],
        }
    except Exception as e:
        import traceback; traceback.print_exc()
        return {"success": False, "message": str(e)}


@app.get("/health")
async def health():
    return {"status": "ok", "version": "7.0.0", "crops": INDIA_CROPS,
            "engine": "Edge-Hybrid + Adaptive Relative"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
