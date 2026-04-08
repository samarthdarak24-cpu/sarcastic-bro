"""
Bulk Image Processing System with Queue Management
Handles large-scale batch processing with parallel workers
"""

import asyncio
import uuid
from typing import List, Dict, Optional
from datetime import datetime
import json
from pathlib import Path
import aiofiles
from concurrent.futures import ThreadPoolExecutor
import numpy as np
from PIL import Image
import io

class BatchProcessor:
    """
    Manages bulk image processing with queue system
    """
    
    def __init__(self, max_workers: int = 4):
        self.max_workers = max_workers
        self.executor = ThreadPoolExecutor(max_workers=max_workers)
        self.active_batches: Dict[str, Dict] = {}
        self.batch_results: Dict[str, Dict] = {}
        
    def create_batch(self, batch_size: int, user_id: str) -> str:
        """Create a new batch processing job"""
        batch_id = f"BATCH-{datetime.now().strftime('%Y%m%d%H%M%S')}-{uuid.uuid4().hex[:8]}"
        
        self.active_batches[batch_id] = {
            "batch_id": batch_id,
            "user_id": user_id,
            "total_items": batch_size,
            "processed_items": 0,
            "good_items": 0,
            "defective_items": 0,
            "status": "queued",
            "created_at": datetime.now().isoformat(),
            "started_at": None,
            "completed_at": None,
            "items": []
        }
        
        return batch_id
    
    async def process_batch(
        self, 
        batch_id: str, 
        images: List[bytes],
        analyzer_func
    ) -> Dict:
        """
        Process a batch of images in parallel
        
        Args:
            batch_id: Unique batch identifier
            images: List of image bytes
            analyzer_func: Function to analyze each image
            
        Returns:
            Batch processing results
        """
        if batch_id not in self.active_batches:
            raise ValueError(f"Batch {batch_id} not found")
        
        batch = self.active_batches[batch_id]
        batch["status"] = "processing"
        batch["started_at"] = datetime.now().isoformat()
        
        # Process images in parallel
        tasks = []
        for idx, image_bytes in enumerate(images):
            task = self._process_single_image(
                batch_id, 
                idx, 
                image_bytes, 
                analyzer_func
            )
            tasks.append(task)
        
        # Wait for all tasks to complete
        results = await asyncio.gather(*tasks, return_exceptions=True)
        
        # Update batch status
        batch["status"] = "completed"
        batch["completed_at"] = datetime.now().isoformat()
        batch["processed_items"] = len(results)
        
        # Calculate statistics
        good_count = sum(1 for r in results if isinstance(r, dict) and r.get("status") == "GOOD")
        defective_count = sum(1 for r in results if isinstance(r, dict) and r.get("status") == "DEFECTED")
        
        batch["good_items"] = good_count
        batch["defective_items"] = defective_count
        batch["quality_percentage"] = (good_count / len(results) * 100) if results else 0
        batch["grade"] = self._calculate_batch_grade(batch["quality_percentage"])
        
        # Store results
        self.batch_results[batch_id] = batch
        
        return batch
    
    async def _process_single_image(
        self, 
        batch_id: str, 
        item_idx: int, 
        image_bytes: bytes,
        analyzer_func
    ) -> Dict:
        """Process a single image"""
        try:
            # Run analysis in thread pool to avoid blocking
            loop = asyncio.get_event_loop()
            result = await loop.run_in_executor(
                self.executor,
                analyzer_func,
                image_bytes
            )
            
            # Update batch progress
            batch = self.active_batches[batch_id]
            batch["items"].append({
                "item_id": item_idx + 1,
                "status": result.get("status", "UNKNOWN"),
                "quality_score": result.get("quality_score", 0),
                "processed_at": datetime.now().isoformat()
            })
            
            return result
            
        except Exception as e:
            return {
                "item_id": item_idx + 1,
                "status": "ERROR",
                "error": str(e)
            }
    
    def _calculate_batch_grade(self, quality_percentage: float) -> str:
        """Calculate batch grade based on quality percentage"""
        if quality_percentage >= 95:
            return "A+"
        elif quality_percentage >= 85:
            return "A"
        elif quality_percentage >= 75:
            return "B+"
        elif quality_percentage >= 65:
            return "B"
        elif quality_percentage >= 50:
            return "C"
        else:
            return "D"
    
    def get_batch_status(self, batch_id: str) -> Optional[Dict]:
        """Get current status of a batch"""
        return self.active_batches.get(batch_id) or self.batch_results.get(batch_id)
    
    def get_batch_results(self, batch_id: str) -> Optional[Dict]:
        """Get final results of a completed batch"""
        return self.batch_results.get(batch_id)


class QueueManager:
    """
    Manages processing queue with priority support
    """
    
    def __init__(self):
        self.queue: List[Dict] = []
        self.processing: Dict[str, Dict] = {}
        
    def add_job(self, job: Dict, priority: int = 0):
        """Add a job to the queue"""
        job["priority"] = priority
        job["queued_at"] = datetime.now().isoformat()
        self.queue.append(job)
        self.queue.sort(key=lambda x: x["priority"], reverse=True)
        
    def get_next_job(self) -> Optional[Dict]:
        """Get next job from queue"""
        if self.queue:
            job = self.queue.pop(0)
            self.processing[job["batch_id"]] = job
            return job
        return None
    
    def complete_job(self, batch_id: str):
        """Mark job as completed"""
        if batch_id in self.processing:
            del self.processing[batch_id]
    
    def get_queue_position(self, batch_id: str) -> int:
        """Get position of batch in queue"""
        for idx, job in enumerate(self.queue):
            if job["batch_id"] == batch_id:
                return idx + 1
        return -1
    
    def get_queue_stats(self) -> Dict:
        """Get queue statistics"""
        return {
            "queued_jobs": len(self.queue),
            "processing_jobs": len(self.processing),
            "total_jobs": len(self.queue) + len(self.processing)
        }


# Global instances
batch_processor = BatchProcessor(max_workers=4)
queue_manager = QueueManager()
