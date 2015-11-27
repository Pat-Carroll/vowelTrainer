#!/bin/csh

setenv LC_ALL "POSIX"
setenv LC_NUMERIC "POSIX"

# install csh perl and sox

# set directory of alignement tool *** change the directory to where the software is
set DIRTOOL = /Users/patrick/Saarland_Documents/Saarland_Masters2015/alignment/Carroll

# do not forget to compilie generation_gram.c    
# cc -O generation_gram.c  -o generation_gram

# set HTKBIN
set HTKBIN = /usr/local/bin/

set SCRIPTS = $DIRTOOL/Scripts

if ($# != 4) then
echo "usage file.wav file.txt file.textgrid file.mlf"
exit
endif

set WAV = $1
set TXT = $2
set RES = $3
set MLF = $4

set CONFIG_1 = $DIRTOOL/HMMKiel/config_notel_mcr_En_r5
set HMM_1    = $DIRTOOL/HMMKiel/hmm16_silk_r5_dipht
set TIED_1   = $DIRTOOL/HMMKiel/phones.lst
set STATS_1  = $DIRTOOL/HMMKiel/stats_16

set CONFIG_2 = $DIRTOOL/HMMKiel/config_notel_mcr_En_r5
set HMM_2    = $DIRTOOL/HMMKiel/hmm2_silk_r5_dipht
set STATS_2  = $DIRTOOL/HMMKiel/stats_2

set PHONELIST = $DIRTOOL/HMMKiel/phones.lst
set DICOWORD  = $DIRTOOL/Data/dicocanon_cl
set DICOPHN   = $DIRTOOL/HMMKiel/dicophn

set TMPDIR    = /tmp/$$
mkdir -p $TMPDIR

sox $WAV -c 1 -b 16 -e signed-integer $TMPDIR/file.raw rate -h 16000

/bin/rm -f dico2
$SCRIPTS/generation_gram $DICOWORD $TXT $TMPDIR/gram.htk $TMPDIR/motsmanquants $TMPDIR/dico2

if(-z $TMPDIR/motsmanquants) then
else
  echo -n "missing words "
  cat $TMPDIR/motsmanquants
  exit
endif



$HTKBIN/HParse $TMPDIR/gram.htk $TMPDIR/gram.net
echo "sil [sil] sil" >> $TMPDIR/dico2

/bin/rm -f $TMPDIR/dico
sed -e "s/  / /g" $TMPDIR/dico2 | sed -e "s/  / /g" | sort -u > $TMPDIR/dico

# alignement first pass 
$HTKBIN/HVite -C ${CONFIG_1} -m -o M -w $TMPDIR/gram.net -l '*' -y lab -i $TMPDIR/file.mlf11 -H ${HMM_1} $TMPDIR/dico ${TIED_1} $TMPDIR/file.raw 

$SCRIPTS/domlftri2mono.pl -mlftri $TMPDIR/file.mlf11 -mlfmono $TMPDIR/file.mlf1

# alignement second pass
$HTKBIN/HVite -a -C ${CONFIG_2}  -l '*' -y lab -I $TMPDIR/file.mlf1 -i $TMPDIR/file.mlf2 -H ${HMM_2} $DICOPHN $PHONELIST $TMPDIR/file.raw

$SCRIPTS/dofusionmlf.pl -mlf1 $TMPDIR/file.mlf1 -mlf2 $TMPDIR/file.mlf2 -mlfout $TMPDIR/file.mlffus

sed -f $SCRIPTS/utf8txt2utf8.sed $TMPDIR/file.mlffus > $TMPDIR/file.mlf

/bin/rm -f $RES
$SCRIPTS/domlf2praat.pl -mlf $TMPDIR/file.mlf -praat $RES -shift 12

echo -n $MLF
cp $TMPDIR/file.mlf $MLF

/bin/rm -fr $TMPDIR



