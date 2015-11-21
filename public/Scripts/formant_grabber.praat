
# input form for directing the script to where the file is located, and what section to extract formant info from.
form Create a slow version
	sentence open_file_path ~/Audio/uploads/userAudio-2sb2nx8iAJW6Qntqd-undefined
	real start_time 0
	real end_time -1 
	optionmenu GenderAge 1
		option Adult male
		option Adult female
		option Child male
		option Child femalse
endform



# Setting the max frequency for Formant Detection based on Gender and Age
freqUpperLimit = 5000

if genderAge = 2
	freqUpperLimit = 5500

elif genderAge = 3
	freqUpperLimit = 8000
elif genderAge = 4
	freqUpperLimit = 8000
else
	freqUpperLimit = 5000	
endif


# Open file and extract formant information.  Note that formant info is measured at nucleus of vowel (center 25%)



Read from file: open_file_path$
soundfile = selected()
To Formant (burg): 0, 5, freqUpperLimit, 0.025, 50
formant_id = selected()

mid_point = start_time + ( (end_time -start_time)/2 )
eigth_length = (end_time-start_time) / 8

nuc_start = start_time + eigth_length
nuc_end = mid_point + eigth_length

Get quantile: 1, nuc_start, nuc_end, "Hertz", 0.5

Get quantile: 2, nuc_start, nuc_end, "Hertz", 0.5
Get quantile: 3, nuc_start, nuc_end, "Hertz", 0.5






