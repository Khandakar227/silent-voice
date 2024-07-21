from fastapi import FastAPI
import cv2
from cvzone.HandTrackingModule import HandDetector
from cvzone.ClassificationModule import Classifier
import numpy as np
import math
import base64
import socketio


detector = HandDetector()

model_path = "Model/keras_model.h5"
label_path = "Model/labels.txt"

classifier = Classifier("Model/keras_model.h5" , "Model/labels.txt")
offset = 20
imgSize = 300
counter = 0

labels = []
with open(label_path, 'r') as file:
    for line in file:
        label = line.split(maxsplit=1)[1]
        labels.append(label.strip())


# Define connections between landmarks (based on the standard hand model)
connections = [
    (0, 1), (1, 2), (2, 3), (3, 4),  # Thumb
    (0, 5), (5, 6), (6, 7), (7, 8),  # Index finger
    (5, 9), (9, 10), (10, 11), (11, 12),  # Middle finger
    (9, 13), (13, 14), (14, 15), (15, 16),  # Ring finger
    (13, 17), (0, 17), (17, 18), (18, 19), (19, 20)  # Pinky
]


def getSign(_img):
    try:
        if _img is None:
            return ('', _img)
        hands, img = detector.findHands(_img)
        if hands:
            hand = hands[0]
            lmList = hand['lmList']  # List of 21 landmark points
            x, y, w, h = hand['bbox']


            # Calculate the bounding box of the hand landmarks
            x_min = min([lm[0] for lm in lmList])
            x_max = max([lm[0] for lm in lmList])
            y_min = min([lm[1] for lm in lmList])
            y_max = max([lm[1] for lm in lmList])

            bbox_width = x_max - x_min
            bbox_height = y_max - y_min

            # Create a blank image with a white background
            imgBlank = np.ones((300, 300, 3), np.uint8) * 255

            # Determine scaling factor and offset for centering
            scale = min(300 / bbox_width, 300 / bbox_height)
            offset_x = (300 - bbox_width * scale) // 2 + 20
            offset_y = (300 - bbox_height * scale) // 2 + 20

            # Draw the landmarks (keypoints) on the blank image, scaled and centered
            for lm in lmList:
                lm_x = int((lm[0] - x_min) * scale + offset_x)
                lm_y = int((lm[1] - y_min) * scale + offset_y)
                cv2.circle(imgBlank, (lm_x, lm_y), 5, (0, 0, 0), cv2.FILLED)

            # Draw the connections (lines) between the landmarks, scaled and centered
            for conn in connections:
                pt1 = (int((lmList[conn[0]][0] - x_min) * scale + offset_x),
                    int((lmList[conn[0]][1] - y_min) * scale + offset_y))
                pt2 = (int((lmList[conn[1]][0] - x_min) * scale + offset_x),
                    int((lmList[conn[1]][1] - y_min) * scale + offset_y))
                cv2.line(imgBlank, pt1, pt2, (0, 0, 0), 2)
            
            
            prediction , index = classifier.getPrediction(imgBlank, draw= False)

            if prediction[index] > 0.6:
                cv2.rectangle(img,(x-offset,y-offset-70),(x -offset+400, y - offset+60-50),(0,255,0),cv2.FILLED)  
                cv2.putText(img,labels[index],(x,y-30),cv2.FONT_HERSHEY_COMPLEX,2,(0,0,0),2) 

                cv2.rectangle(img,(x-offset,y-offset),(x + w + offset, y+h + offset),(0,255,0),4)
            
            return (labels[index] if prediction[index] > 0.6 else '', img)
        else:
            return ('', img)
    except Exception as e:
        print(e)
        return ('', img)

app = FastAPI()
sio=socketio.AsyncServer(cors_allowed_origins='*', async_mode='asgi')
socket_app = socketio.ASGIApp(sio)
app.mount("/", socket_app)


@sio.on('frame')
async def client_side_receive_msg(sid, msg):
    nparr = np.frombuffer(base64.b64decode(msg), np.uint8)
    frame = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    
    if frame is None:
        print("Failed to decode frame")
        return
    
    sign, img = getSign(frame)
    await sio.emit('word', {'word': sign}, room=sid)
    if(img is not None):
        await sio.emit('keypoints', base64.b64encode(cv2.imencode('.jpg', img)[1]).decode(), room=sid)