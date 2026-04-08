"""
Training script for AI Quality Shield
Fine-tune EfficientNet and YOLOv8 on custom crop quality dataset
"""

import torch
import torch.nn as nn
import torch.optim as optim
from torch.utils.data import Dataset, DataLoader
from torchvision import transforms
import cv2
import numpy as np
from pathlib import Path
from typing import Tuple, List
import logging
from tqdm import tqdm
import json

from quality_shield_scanner import EfficientNetQualityClassifier

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class CropQualityDataset(Dataset):
    """Custom dataset for crop quality images"""
    
    def __init__(
        self,
        data_dir: str,
        split: str = "train",
        transform=None,
        augment: bool = True
    ):
        self.data_dir = Path(data_dir) / split
        self.transform = transform
        self.augment = augment and split == "train"
        
        # Load annotations
        self.samples = self._load_samples()
        
        # Quality mapping
        self.quality_map = {
            "premium": 0,
            "grade_a": 1,
            "grade_b": 2,
            "grade_c": 3,
            "rejected": 4
        }
    
    def _load_samples(self) -> List[Tuple[Path, int]]:
        """Load image paths and labels"""
        samples = []
        
        # Expected structure: data_dir/split/quality_grade/image.jpg
        for quality_dir in self.data_dir.iterdir():
            if not quality_dir.is_dir():
                continue
            
            quality_label = self.quality_map.get(quality_dir.name.lower())
            if quality_label is None:
                continue
            
            for img_path in quality_dir.glob("*.jpg"):
                samples.append((img_path, quality_label))
        
        logger.info(f"Loaded {len(samples)} samples from {self.data_dir}")
        return samples
    
    def __len__(self):
        return len(self.samples)
    
    def __getitem__(self, idx):
        img_path, label = self.samples[idx]
        
        # Load image
        image = cv2.imread(str(img_path))
        image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
        
        # Apply augmentation
        if self.augment:
            image = self._augment(image)
        
        # Apply transforms
        if self.transform:
            image = self.transform(image)
        
        return image, label
    
    def _augment(self, image: np.ndarray) -> np.ndarray:
        """Data augmentation"""
        # Random flip
        if np.random.rand() > 0.5:
            image = cv2.flip(image, 1)
        
        # Random rotation
        if np.random.rand() > 0.5:
            angle = np.random.randint(-15, 15)
            h, w = image.shape[:2]
            M = cv2.getRotationMatrix2D((w/2, h/2), angle, 1.0)
            image = cv2.warpAffine(image, M, (w, h))
        
        # Random brightness
        if np.random.rand() > 0.5:
            factor = np.random.uniform(0.8, 1.2)
            image = np.clip(image * factor, 0, 255).astype(np.uint8)
        
        # Random noise
        if np.random.rand() > 0.7:
            noise = np.random.normal(0, 5, image.shape)
            image = np.clip(image + noise, 0, 255).astype(np.uint8)
        
        return image


class QualityShieldTrainer:
    """Trainer for Quality Shield models"""
    
    def __init__(
        self,
        data_dir: str,
        model_save_dir: str = "models",
        batch_size: int = 32,
        num_epochs: int = 50,
        learning_rate: float = 0.001
    ):
        self.data_dir = data_dir
        self.model_save_dir = Path(model_save_dir)
        self.model_save_dir.mkdir(exist_ok=True)
        
        self.batch_size = batch_size
        self.num_epochs = num_epochs
        self.learning_rate = learning_rate
        
        self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        logger.info(f"Using device: {self.device}")
        
        # Data transforms
        self.train_transform = transforms.Compose([
            transforms.ToPILImage(),
            transforms.Resize((300, 300)),
            transforms.RandomHorizontalFlip(),
            transforms.RandomRotation(15),
            transforms.ColorJitter(brightness=0.2, contrast=0.2, saturation=0.2),
            transforms.ToTensor(),
            transforms.Normalize(
                mean=[0.485, 0.456, 0.406],
                std=[0.229, 0.224, 0.225]
            )
        ])
        
        self.val_transform = transforms.Compose([
            transforms.ToPILImage(),
            transforms.Resize((300, 300)),
            transforms.ToTensor(),
            transforms.Normalize(
                mean=[0.485, 0.456, 0.406],
                std=[0.229, 0.224, 0.225]
            )
        ])
    
    def prepare_data(self):
        """Prepare data loaders"""
        train_dataset = CropQualityDataset(
            self.data_dir,
            split="train",
            transform=self.train_transform,
            augment=True
        )
        
        val_dataset = CropQualityDataset(
            self.data_dir,
            split="val",
            transform=self.val_transform,
            augment=False
        )
        
        self.train_loader = DataLoader(
            train_dataset,
            batch_size=self.batch_size,
            shuffle=True,
            num_workers=4,
            pin_memory=True
        )
        
        self.val_loader = DataLoader(
            val_dataset,
            batch_size=self.batch_size,
            shuffle=False,
            num_workers=4,
            pin_memory=True
        )
        
        logger.info(f"Train samples: {len(train_dataset)}")
        logger.info(f"Val samples: {len(val_dataset)}")
    
    def train_efficientnet(self):
        """Train EfficientNet quality classifier"""
        logger.info("Starting EfficientNet training...")
        
        # Initialize model
        model = EfficientNetQualityClassifier(num_classes=5, pretrained=True)
        model = model.to(self.device)
        
        # Loss and optimizer
        criterion = nn.CrossEntropyLoss()
        optimizer = optim.AdamW(
            model.parameters(),
            lr=self.learning_rate,
            weight_decay=0.01
        )
        
        # Learning rate scheduler
        scheduler = optim.lr_scheduler.ReduceLROnPlateau(
            optimizer,
            mode='min',
            factor=0.5,
            patience=5,
            verbose=True
        )
        
        best_val_acc = 0.0
        history = {"train_loss": [], "train_acc": [], "val_loss": [], "val_acc": []}
        
        for epoch in range(self.num_epochs):
            # Training phase
            model.train()
            train_loss = 0.0
            train_correct = 0
            train_total = 0
            
            pbar = tqdm(self.train_loader, desc=f"Epoch {epoch+1}/{self.num_epochs}")
            for images, labels in pbar:
                images = images.to(self.device)
                labels = labels.to(self.device)
                
                optimizer.zero_grad()
                outputs = model(images)
                loss = criterion(outputs, labels)
                loss.backward()
                optimizer.step()
                
                train_loss += loss.item()
                _, predicted = torch.max(outputs, 1)
                train_total += labels.size(0)
                train_correct += (predicted == labels).sum().item()
                
                pbar.set_postfix({
                    "loss": f"{loss.item():.4f}",
                    "acc": f"{100 * train_correct / train_total:.2f}%"
                })
            
            train_loss /= len(self.train_loader)
            train_acc = 100 * train_correct / train_total
            
            # Validation phase
            model.eval()
            val_loss = 0.0
            val_correct = 0
            val_total = 0
            
            with torch.no_grad():
                for images, labels in self.val_loader:
                    images = images.to(self.device)
                    labels = labels.to(self.device)
                    
                    outputs = model(images)
                    loss = criterion(outputs, labels)
                    
                    val_loss += loss.item()
                    _, predicted = torch.max(outputs, 1)
                    val_total += labels.size(0)
                    val_correct += (predicted == labels).sum().item()
            
            val_loss /= len(self.val_loader)
            val_acc = 100 * val_correct / val_total
            
            # Update scheduler
            scheduler.step(val_loss)
            
            # Save history
            history["train_loss"].append(train_loss)
            history["train_acc"].append(train_acc)
            history["val_loss"].append(val_loss)
            history["val_acc"].append(val_acc)
            
            logger.info(
                f"Epoch {epoch+1}: "
                f"Train Loss: {train_loss:.4f}, Train Acc: {train_acc:.2f}% | "
                f"Val Loss: {val_loss:.4f}, Val Acc: {val_acc:.2f}%"
            )
            
            # Save best model
            if val_acc > best_val_acc:
                best_val_acc = val_acc
                save_path = self.model_save_dir / "quality_classifier.pth"
                torch.save(model.state_dict(), save_path)
                logger.info(f"Saved best model with val_acc: {val_acc:.2f}%")
        
        # Save training history
        history_path = self.model_save_dir / "training_history.json"
        with open(history_path, "w") as f:
            json.dump(history, f, indent=2)
        
        logger.info(f"Training complete! Best val accuracy: {best_val_acc:.2f}%")
        return history
    
    def train_yolov8(self, dataset_yaml: str):
        """Train YOLOv8 for crop detection"""
        from ultralytics import YOLO
        
        logger.info("Starting YOLOv8 training...")
        
        # Initialize model
        model = YOLO("yolov8n.pt")
        
        # Train
        results = model.train(
            data=dataset_yaml,
            epochs=self.num_epochs,
            imgsz=640,
            batch=self.batch_size,
            device=self.device,
            project=str(self.model_save_dir),
            name="yolov8_crop_detector",
            patience=10,
            save=True,
            plots=True
        )
        
        logger.info("YOLOv8 training complete!")
        return results


def main():
    """Main training function"""
    import argparse
    
    parser = argparse.ArgumentParser(description="Train Quality Shield models")
    parser.add_argument("--data-dir", type=str, required=True, help="Path to dataset")
    parser.add_argument("--model-dir", type=str, default="models", help="Model save directory")
    parser.add_argument("--batch-size", type=int, default=32, help="Batch size")
    parser.add_argument("--epochs", type=int, default=50, help="Number of epochs")
    parser.add_argument("--lr", type=float, default=0.001, help="Learning rate")
    parser.add_argument("--train-yolo", action="store_true", help="Train YOLOv8")
    parser.add_argument("--yolo-yaml", type=str, help="YOLOv8 dataset YAML")
    
    args = parser.parse_args()
    
    # Initialize trainer
    trainer = QualityShieldTrainer(
        data_dir=args.data_dir,
        model_save_dir=args.model_dir,
        batch_size=args.batch_size,
        num_epochs=args.epochs,
        learning_rate=args.lr
    )
    
    # Prepare data
    trainer.prepare_data()
    
    # Train EfficientNet
    trainer.train_efficientnet()
    
    # Train YOLOv8 if requested
    if args.train_yolo and args.yolo_yaml:
        trainer.train_yolov8(args.yolo_yaml)


if __name__ == "__main__":
    main()
