import csv, json

def readCSV(infile):
	jsonData = []

	with open(infile,'r') as f:
		reader = csv.reader(f)
		for i, row in enumerate(reader):
			print i
			jsonData.append({"date": row[0], "temp": int(row[1])})

	with open('data.json', 'w') as outfile:
	    json.dump(jsonData, outfile)

	print jsonData

readCSV("datacelcius.csv")