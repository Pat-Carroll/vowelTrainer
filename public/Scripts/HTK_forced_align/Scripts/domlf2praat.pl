#!/usr/bin/perl -w
# ___________________________________________________________________________
#					mlf2praat.pl
#
# Author:        Dom  (modif d un programme de Nadiya Yampolska)  
# Date           juin 2013 
#
# Script description: 
#			mlf2praat.pl takes a segmentation file in 
#			htk format (mlf) and returns a TextGrid (PRAAT) file
#
# Input (IMPORTANT):
#	words --> "WordTier"
#	phones --> "PhonTier"
#
# htk mlf format: 	start end phone likelihhod [word] 					
# start et end en  second * 10000000
# word present si le phoneme correspond au premier phoneme du mot
#						156000 157000 t 0.564 tu
#						157000 159000 u 0.57 
#
# TextGrid format:
#	item [1]:
#        class = "IntervalTier" 
#        name = "wordss" 
#        xmin = 0 
#        xmax = 1.94362811791383		(in seconds) 
#        intervals: size = 8 
#        intervals [1]:
#            xmin = 0 
#            xmax = 0.205170068027211 			(in seconds)
#            text = "<SIL>" 
#			...
#
# All levels of annotation are saved into the same TextGrid adding an "IntervalTier"
#
# _____________________________________________________________________________


use English;
use strict;

use Encode;
use File::Path;
use Getopt::Long;
use IO::Handle;
use File::Basename;
use Unicode::UCD 'charinfo';
use utf8;

# Option variables
my $help               = undef;
my $nomFichMlf         = undef;
my $nomFichPraat       = undef;
my $decal              = undef;
my $debug              = undef;



sub CmdDisplayUsage ($)
{
    my $STREAM = shift;
    my $progName = $PROGRAM_NAME;
    $progName =~ s?^.*\/??;
    print $STREAM <<EOD;

Object
        generation d un fichier praat (textgrid) a partir d un fichier mlf (alignement htk)
        genere deux tiers   une phonetique une en mot

Usage:
        $progName -help -mlf <fileName>  -praat <fileName> -shift <val> [-debug]

Options:
        -help                   Display this help data.
        -mlf <fileName>         fichier mlf (input) phonemes et mots
        -praat <fileName>       fichier texgrid (praat) (output) avec deux tiers phonemes et mot
        -shift <val>            decalage en ms a ajouter a chaque frontiere
        -debug                  Display extra information while processing data.
                                (mainly used for debugging purpose).

EOD
return;
}

sub HTK2sampa {
    my $ph = shift;

    # phoneme francais
    $ph =~ s/an/a~/;
    $ph =~ s/on/o~/;
    $ph =~ s/in/U~\//;
    $ph =~ s/swa/@/;
    $ph =~ s/euf/9/;
    $ph =~ s/eu/2/;
    $ph =~ s/eh/E\//;
    $ph =~ s/oh/O\//;
    $ph =~ s/sil/#/;

    # phoneme allemand
    $ph =~ s/oo/2/;
    $ph =~ s/er/6/;
    $ph =~ s/oe/9/;
    return($ph);
}



###############################################################################
# Main program
#

# Parsing command line
if ($#ARGV == -1) {
    CmdDisplayUsage (*STDOUT);
    exit 1;
}
my $results = GetOptions ('-help|h'           => \$help,
                          '-mlf=s'            => \$nomFichMlf,
                          '-praat=s'          => \$nomFichPraat,
                          '-shift=i'          => \$decal,
                          '-debug'            => \$debug
    );

if (defined $help) {
    CmdDisplayUsage (*STDOUT);
    exit 0;
}


if (! defined $nomFichMlf) {
    print STDERR "ERROR - Iutput file mlf missing\n";
    CmdDisplayUsage (*STDERR);
    exit 1;
}

if (! defined $nomFichPraat) {
    print STDERR "ERROR - Output file praat missing\n";
    CmdDisplayUsage (*STDERR);
    exit 1;
}

if (! defined $decal) {
    print STDERR "ERROR - decalage missing\n";
    CmdDisplayUsage (*STDERR);
    exit 1;
}

$decal = $decal/1000.;

# Data processing

binmode STDOUT,  ":utf8";
binmode STDERR,  ":utf8";

my @deb = ();
my @fin = ();
my @phone = ();
my @word = ();
my $num = 0;

my $nbTier = 1;

# lecture du chier mlf
open (my $FichMlf, "< $nomFichMlf") || die "\nERROR opening input file $nomFichMlf\n";
binmode $FichMlf,  ":utf8";

my $buffer = readline ($FichMlf);
chomp $buffer;
if($buffer ne "#!MLF!#") {
    print STDERR "manque #!MLF!#\n";
    exit 1;
}

my $nommlf = readline ($FichMlf);
if( $nommlf ) {
    chomp $nommlf;
    $nommlf =~ s/"//g;
    my $base = basename($nommlf);
    while (my $ligne = readline ($FichMlf)) {
	chomp $ligne;
	my @champs = split(/ /, $ligne);
	if($champs[0] ne ".") {
	    # on convertit en secondes
	    $deb[$num] = $champs[0]/10000000.;
	    $fin[$num] = $champs[1]/10000000.;
	    $phone[$num] = HTK2sampa($champs[2]);
	    $word[$num] ="";
	    if($#champs == 4) { 
		my $wd = $champs[4];
		$wd =~ s/\\302/Â/g;
		$wd =~ s/\\316/Î/g;
		$wd =~ s/\\326/Ö/g;  
		$wd =~ s/\\340/à/g;
		$wd =~ s/\\342/â/g;
		$wd =~ s/\\343/ã/g;
		$wd =~ s/\\344/ä/g;
		$wd =~ s/\\347/ç/g;
		$wd =~ s/\\350/è/g;
		$wd =~ s/\\351/é/g;
		$wd =~ s/\\352/ê/g;
		$wd =~ s/\\353/ë/g;
		$wd =~ s/\\356/î/g;
		$wd =~ s/\\357/ï/g;
		$wd =~ s/\\364/ô/g;
		$wd =~ s/\\366/ö/g;
		$wd =~ s/\\371/ù/g;
		$wd =~ s/\\373/û/g;
		$wd =~ s/\\374/ü/g;
		$word[$num] = $wd;
		# il y a au moins un mot donc il y aura deux tiers
		$nbTier = 2;
	    }
	    $num++;
	}
    }
    
}

close($FichMlf);

for(my $i=0; $i<$num-1; $i++) {

    if($fin[$i] > $deb[$i+1]) {
	$fin[$i] = $deb[$i+1];
    }
}


for(my $i=0; $i<$num; $i++) {
    $deb[$i] = $deb[$i];
    if($i != 0) {
	$deb[$i] = $deb[$i] + $decal;
    }
    if($deb[$i] < 0.0 ) {
	$deb[$i] = 0;
    }
    $fin[$i] = $fin[$i];
    if($i != $num-1){
	$fin[$i] = $fin[$i] + $decal;
    }
}

for(my $i=0; $i<$num-1; $i++) {

    if($fin[$i] > $deb[$i+1]) {
	$fin[$i] = $deb[$i+1];
    }
}



open (my $FichPraat, "> $nomFichPraat") || die "\nERROR opening file $nomFichPraat\n";

binmode $FichPraat, ":utf8";

			
# TextGrid Intro
my $xmax_global = $fin[$num-1];

print $FichPraat "File type = \"ooTextFile\"\n";
print $FichPraat "Object class = \"TextGrid\"\n\n";

print $FichPraat "xmin = 0\n";
print $FichPraat "xmax = $xmax_global\n";

print $FichPraat "tiers? <exists>\n"; 
print $FichPraat "size = $nbTier\n";
print $FichPraat "item []:\n"; 
# end TG Intro			
			
# tier phoneme
my $item = 1;

print $FichPraat "\titem [$item]:\n";
print $FichPraat "\t\tclass = \"IntervalTier\"\n"; 
   
print $FichPraat "\t\tname = \"PhonTier\"\n"; 
print $FichPraat "\t\txmin = 0\n"; 
print $FichPraat "\t\txmax = $xmax_global\n"; 
print $FichPraat "\t\tintervals: size = $num\n"; 
	
for(my $i=0; $i<$num; $i++) {
    my $ip1 = $i + 1;
    print $FichPraat "\t\tintervals [".$ip1."]:\n"; 
    print $FichPraat "\t\t\txmin = $deb[$i]\n";
    print $FichPraat "\t\t\txmax = $fin[$i]\n"; 
    print $FichPraat "\t\t\ttext = \"$phone[$i]\"\n"; 
    
}
	

# tier words
my @finword = ();
if($nbTier == 2) {
    my $lastword = -1;
    my $nbwrd = 0;
    for(my $i=0; $i<$num; $i++) {
	if($word[$i] ne "") {
	    $finword[$i]= $fin[$i];
	    $lastword = $i;
	    $nbwrd++;
	} else {
	    if($lastword != -1) {
		$finword[$lastword]= $fin[$i];
	    }
	}
    }
    
    
    
    
    
    my $item = 2;
    
    print $FichPraat "\titem [$item]:\n";
    print $FichPraat "\t\tclass = \"IntervalTier\"\n"; 
    
    print $FichPraat "\t\tname = \"WordTier\"\n"; 
    print $FichPraat "\t\txmin = 0\n"; 
    print $FichPraat "\t\txmax = $xmax_global\n"; 
    print $FichPraat "\t\tintervals: size = $nbwrd\n";
    my $n = 1;
    for(my $i=0; $i<$num; $i++) {
	if($word[$i] ne "") {
	    print $FichPraat "\t\tintervals [".$n."]:\n"; 
	    print $FichPraat "\t\t\txmin = $deb[$i]\n";
	    print $FichPraat "\t\t\txmax = $finword[$i]\n"; 
	    print $FichPraat "\t\t\ttext = \"$word[$i]\"\n"; 
	    $n++;
	}
    }
    
}

close($FichPraat);

