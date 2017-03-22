#coding:utf-8

from flask import Flask, render_template, jsonify, request
import json
import os
import youtube_dl
import glob

playLists = {}
playListNames = []


app = Flask(__name__)

def scanPlayLists():
    global playLists
    global playListNames
    playLists.clear()
    del playListNames[:]
    playListNames = os.listdir('static/music')
    for name in playListNames:
        files = glob.glob('static/music/' + name + '/*.mp3')
        musics = []
        for f in files:
            title, ext = os.path.splitext(os.path.basename(f))
            music = dict(title=title, author="unknown", url=f)
            musics.append(music)
        playLists[name] = musics


# Index route.
@app.route("/")
def index():
    return render_template('index.html')

# Scan music directories.
@app.route("/scan")
def scan():
    scanPlayLists()
    return jsonify(playListNames)

# Return playlists.
@app.route('/playlists')
def getPlaylists():
    return jsonify(playListNames)

# Return musics in the playlist.
@app.route('/playlist/<name>')
def getPlaylist(name=None):
    if name is None:
        return 'error'
    if name not in playLists:
        return 'error'
    return jsonify(playLists[name])

@app.route('/download', methods=['POST'])
def download():
    json = request.json
    downloadFromYouTube(json['url'], json['playlistName'], json['name'])
    json['status'] = 'success'
    return jsonify(json)

@app.route('/addplaylist', methods=['POST'])
def addPlaylist():
    json = request.json
    p = 'static/music/' + json['name']
    if not os.path.exists(p):
        os.mkdir(p)
    return jsonify(stat='made')

def downloadFromYouTube(url, cat, name):
    outtmpl = u'static/music/{0}/{1}.%(ext)s'.format(cat, name)
    opts = {
            'format': 'bestaudio/best',
            'postprocessors': [{
                'key': 'FFmpegExtractAudio',
                'preferredcodec': 'mp3',
                'preferredquality': '192',
                }],
            'outtmpl': outtmpl,
            }
    print(url)
    with youtube_dl.YoutubeDL(opts) as ydl:
        ydl.download([url])


scanPlayLists()
if __name__ == "__main__":
    app.run()
