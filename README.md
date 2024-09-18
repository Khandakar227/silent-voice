# Silent Voice

## Learn to Communicate with Your Hands

Silent Voice is a web application that helps people with hearing disabilities communicate with others. It's a sign language translator that converts sign language to text using a webcam. The model server is created using FastAPI.

## Installation

Clone the repository:
   ```bash
   git clone https://github.com/Khandakar227/silent-voice.git
   ```

The project contains two main folders: `client` and `server`.

### Server Setup

- Create a virtual environment:
```bash
python -m venv venv
```
- Activate the virtual environment:
```bash
source venv/bin/activate # Linux

.\venv\Scripts\activate # Windows
```

- Install the dependencies:
```bash
pip install mediapipe opencv-python tensorflow==2.15.1 fastapi uvicorn
```

- Run the server:
```bash
uvicorn server:app --reload
```

**_NOTE:_** Ensure your virtual environment is activated before running the server.

### Client Setup

Navigate to the `client` directory:

```bash
cd client
```

Install the dependencies:

```bash
npm install
```

Run the client in development mode

```bash
npm run dev
```

Open the browser and go to `http://localhost:3000` to see the application. You can interact with the application using webcam.

### Features

- Sign language to text translation
- ASL (American Sign Language) dictionary
- Practice sign language with Quiz
- Update dictionary with new signs as Admin

### Tech Stack

- Frontend: NextJs, Tailwind CSS
- Backend: FastAPI
- Machine Learning: MediaPipe, TensorFlow
- Model : MobileNetV2
  