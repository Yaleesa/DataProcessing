#!/usr/bin/env python
# Name: Yaleesa Borgman
# Student number: 6215262
'''
This script scrapes IMDB and outputs a CSV file with highest ranking tv series.
'''
# IF YOU WANT TO TEST YOUR ATTEMPT, RUN THE test-tvscraper.py SCRIPT.
import csv
import re
import base64, unicodedata
import binascii

from pattern.web import URL, DOM, plaintext

TARGET_URL = "http://www.imdb.com/search/title?num_votes=5000,&sort=user_rating,desc&start=1&title_type=tv_series"
BACKUP_HTML = 'tvseries.html'
OUTPUT_CSV = 'tvseries.csv'


def extract_tvseries(dom):
    '''
    Extract a list of highest ranking TV series from DOM (of IMDB page).

    Each TV series entry should contain the following fields:
    - TV Title
    - Ranking
    - Genres (comma separated if more than one)
    - Actors/actresses (comma separated if more than one)
    - Runtime (only a number!)
    '''

    # ADD YOUR CODE HERE TO EXTRACT THE ABOVE INFORMATION ABOUT THE
    # HIGHEST RANKING TV-SERIES
    # NOTE: FOR THIS EXERCISE YOU ARE ALLOWED (BUT NOT REQUIRED) TO IGNORE
    # UNICODE CHARACTERS AND SIMPLY LEAVE THEM OUT OF THE OUTPUT.
    
    imdbList = []
    
    #Looping in de "title" table for the needed content
    for movie in dom.by_tag('td.title'):
        title = movie.by_tag('a')[0].content
        rating = movie.by_tag('span.value')[0].content
        runtimes = movie.by_tag('span.runtime')[0].content
        genres = movie.by_tag('span.genre')[0]
        actors = movie.by_tag('span.credit')[0]
        runtime = int(re.search(r'\d+', runtimes).group())

        #To get the individual genres and actors, it loops to ignore the | character
        #between them. Without this the genre.content fails.
        #after that the genres and actors are combined in a string.
        genreArr = []
        actorArr = []
        for genre in genres:
            try:
                genreArr.append(genre.content)
            except:
                pass
        genreStr = ', '.join(genreArr)
        for actor in actors:
            try:
                actorArr.append(actor.content)
            except:
                pass
        actorStr = ', '.join(actorArr)
    

        imdbList.append([title, rating, genreStr, actorStr, runtime])

    return imdbList # replace this line as well as appropriate


def save_csv(f, tvseries):
    '''
    Output a CSV file containing highest ranking TV-series.
    '''
    writer = csv.writer(f)
    print tvseries

    writer.writerow(['Title', 'Ranking', 'Genre', 'Actors', 'Runtime'])
    for serie in tvseries:
        try:
            writer.writerow(serie)
        except UnicodeEncodeError:
                #a not so awesome way to deal with unicode characters.
                print "UnicodeEncodeError, dummy data added"
                writer.writerow(["This", "is", "dummy", "data", 1])
                pass

if __name__ == '__main__':
    # Download the HTML file
    url = URL(TARGET_URL)
    html = url.download()

    # Save a copy to disk in the current directory, this serves as an backup
    # of the original HTML, will be used in testing / grading.
    with open(BACKUP_HTML, 'wb') as f:
        f.write(html)

    # Parse the HTML file into a DOM representation
    dom = DOM(html)

    # Extract the tv series (using the function you implemented)
    tvseries = extract_tvseries(dom)

    # Write the CSV file to disk (including a header)
    with open(OUTPUT_CSV, 'w') as output_file:
        save_csv(output_file, tvseries)
