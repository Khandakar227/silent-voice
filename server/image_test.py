import cv2
from cvzone.HandTrackingModule import HandDetector
from cvzone.ClassificationModule import Classifier
import numpy as np
import math

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



img = cv2.imread('test.jpg')
hands, img = detector.findHands(img)
imgOutput = img.copy()

try:
    prediction , index = classifier.getPrediction(img, draw= False)
        # cv2.imshow('ImageCrop', imgCrop)
        # cv2.imshow('ImageWhite', imgWhite)
    print(labels[index])
except Exception as e:
    print(e)

