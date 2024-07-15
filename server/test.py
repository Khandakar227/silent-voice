import cv2
from cvzone.HandTrackingModule import HandDetector
from cvzone.ClassificationModule import Classifier
import numpy as np
import math

cap = cv2.VideoCapture(0)
detector = HandDetector()
classifier = Classifier("Model.5/keras_model.h5" , "Model.5/labels.txt")
offset = 20
imgSize = 300
counter = 0

# labels = ["Hello","I love you","No","Okay","Please","Thank you","Yes"]
labels = [ "Hello", "I Love You", "Ok", "No", "Yes"]

# Define connections between landmarks (based on the standard hand model)
connections = [
    (0, 1), (1, 2), (2, 3), (3, 4),  # Thumb
    (0, 5), (5, 6), (6, 7), (7, 8),  # Index finger
    (5, 9), (9, 10), (10, 11), (11, 12),  # Middle finger
    (9, 13), (13, 14), (14, 15), (15, 16),  # Ring finger
    (13, 17), (0, 17), (17, 18), (18, 19), (19, 20)  # Pinky
]



while True:
    success, img = cap.read()
    hands, img = detector.findHands(img)
    imgOutput = img.copy()
    try:
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

            if prediction[index] > 0.7:
                cv2.rectangle(imgOutput,(x-offset,y-offset-70),(x -offset+400, y - offset+60-50),(0,255,0),cv2.FILLED)  
                cv2.putText(imgOutput,labels[index],(x,y-30),cv2.FONT_HERSHEY_COMPLEX,2,(0,0,0),2) 

                cv2.rectangle(imgOutput,(x-offset,y-offset),(x + w + offset, y+h + offset),(0,255,0),4)   

                # cv2.imshow('ImageCrop', imgCrop)
                # cv2.imshow('ImageWhite', imgWhite)
                
            key = cv2.waitKey(1)
            if key == 27:
                break
    except Exception as e:
        print(e)

    cv2.imshow('Image', imgOutput)
    cv2.waitKey(1)
    