# 🔒 Splitt OCR Proxy Server

Secure backend proxy for OCR processing. Your Google Vision API key stays on the server and is never exposed to the mobile app.

## 🚀 Quick Deploy to Vercel (Free)

1. **Install Vercel CLI** (if you don't have it):
   ```bash
   npm i -g vercel
   ```

2. **Navigate to this directory**:
   ```bash
   cd ocr-proxy-server
   ```

3. **Deploy**:
   ```bash
   vercel
   ```

4. **Set your API key**:
   ```bash
   vercel env add GOOGLE_VISION_API_KEY
   # Paste your Google Vision API key when prompted
   ```

5. **Redeploy with the environment variable**:
   ```bash
   vercel --prod
   ```

6. **Copy your deployment URL** (e.g., `https://your-app.vercel.app`)

## 📱 Update Your App

Update `src/utils/googleVisionAPI.ts` to use your proxy URL instead of calling Google directly.

## 🔒 Security Features

- ✅ API key never exposed to client
- ✅ CORS enabled for your app only
- ✅ Error handling and validation
- ✅ Free hosting on Vercel

## 🧪 Test Locally

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Set environment variable**:
   ```bash
   export GOOGLE_VISION_API_KEY=your_key_here
   ```

3. **Run server**:
   ```bash
   npm start
   ```

4. **Test health endpoint**:
   ```bash
   curl http://localhost:3000/health
   ```

## 📝 Alternative Deployments

### Railway
1. Connect your GitHub repo
2. Select this directory
3. Add `GOOGLE_VISION_API_KEY` in environment variables
4. Deploy!

### Render
1. Create new Web Service
2. Connect your repo
3. Set build command: `npm install`
4. Set start command: `node index.js`
5. Add `GOOGLE_VISION_API_KEY` environment variable
