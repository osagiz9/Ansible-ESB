import sys
import time
import logging
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler
import requests
from threading import Timer
# importing socket module
import socket


def getIP():
    # getting the hostname by socket.gethostname() method
    hostname = socket.gethostname()
    # getting the IP address using socket.gethostbyname() method
    ip_address = socket.gethostbyname(hostname)
    # printing the hostname and ip_address
    print(f"Hostname: {hostname}")
    print(f"IP Address: {ip_address}")
    return ip_address


def send_notification():
    print("sending")
    requests.post('http://127.0.0.1:5000/api/update', json={'src': getIP()})

t = Timer(60, send_notification)
def newTimer():
    global t
    t = Timer(60, send_notification)
    

def event_accured():
    if t.is_alive():
        print("reset timer")
        t.cancel()
        newTimer()
        t.start()
    else:
        print("start timer")
        newTimer()
        t.start()


class Handler(FileSystemEventHandler):
    

    @staticmethod
    def on_any_event(event):
        print(event)
        print(getIP())
        event_accured()
        



if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO,
                        format='%(asctime)s - %(message)s',
                        datefmt='%Y-%m-%d %H:%M:%S')
    path = sys.argv[1] if len(sys.argv) > 1 else '.'
    event_handler = Handler()
    observer = Observer()
    observer.schedule(event_handler, path, recursive=True)
    observer.start()
    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        observer.stop()
    observer.join()
