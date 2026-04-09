# Frontend Dependencies Installation

## Required Package

To use the AI Fruit & Vegetable Analyzer component, you need to install `react-dropzone`:

```bash
cd apps/web
npm install react-dropzone
```

## What is react-dropzone?

`react-dropzone` is a React library that provides:
- Drag and drop file upload
- Click to upload
- File type validation
- File size validation
- Multiple file support
- Accessible file input

## Usage in the Component

The `FruitVegetableAnalyzer` component uses it like this:

```typescript
import { useDropzone } from 'react-dropzone';

const { getRootProps, getInputProps, isDragActive } = useDropzone({
  onDrop,
  accept: {
    'image/*': ['.png', '.jpg', '.jpeg', '.webp']
  },
  maxFiles: 1,
  maxSize: 10485760 // 10MB
});
```

## Alternative: Manual Installation

If you prefer to add it to package.json manually:

```json
{
  "dependencies": {
    "react-dropzone": "^14.2.3"
  }
}
```

Then run:
```bash
npm install
```

## Verification

After installation, verify it's installed:

```bash
npm list react-dropzone
```

You should see:
```
web@0.1.0 /path/to/apps/web
└── react-dropzone@14.2.3
```

## That's it!

You're now ready to use the AI Analyzer component.
