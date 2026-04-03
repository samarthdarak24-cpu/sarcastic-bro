# 🚀 Running ODOP Connect

Follow these steps to start all three services of the platform.

### Prerequisites
- **Node.js**: v18+ 
- **Python**: v3.10+ (for AI Service)
- **PostgreSQL**: Running (for Prisma API)

---

### Phase 1: Setup (First time only)

```powershell
# 1. Install root dependencies
npm install

# 2. Setup Database (API)
cd apps/api
npx prisma generate
cd ../..

# 3. Setup AI Service (Python)
cd apps/ai-service
python -m venv venv
.\venv\Scripts\activate
pip install -r requirements.txt
cd ../..
```

---

### Phase 2: Execution (Start Services)

Open **three separate terminal windows** and run one command in each:

#### 🟢 Terminal 1: Backend API (Express)
```powershell
npm run dev:api
```
*Runs on [http://localhost:3001](http://localhost:3001)*

#### 🔵 Terminal 2: AI Microservice (Python)
```powershell
cd apps/ai-service
.\venv\Scripts\activate
uvicorn main:app --reload --port 8000
```
*Runs on [http://localhost:8000](http://localhost:8000)*

#### 🟠 Terminal 3: Frontend Web (Next.js)
```powershell
npm run dev:web
```
*Runs on [http://localhost:3000](http://localhost:3000)*

---

### 🔍 Verification
1. Open [http://localhost:3000](http://localhost:3000) for the **Buyer Dashboard**.
2. Open [http://localhost:3000/farmer/dashboard](http://localhost:3000/farmer/dashboard) for the **Farmer Dashboard**.
3. Check [http://localhost:8000/docs](http://localhost:8000/docs) to verify AI Service Swagger documentation.

---
**Enjoy exploring all 40+ features of ODOP Connect!**
