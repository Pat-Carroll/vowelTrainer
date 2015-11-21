#!/usr/bin/perl -w

use English;
use strict;

use Encode;
use File::Path;
use Getopt::Long;
use IO::Handle;
use Unicode::UCD 'charinfo';
use utf8;

# Option variables
my $help               = undef;
my $nomFichMlf1        = undef;
my $nomFichMlf2        = undef;
my $nomFichMlfOut      = undef;
my $debug              = undef;



sub CmdDisplayUsage ($)
{
    my $STREAM = shift;
    my $progName = $PROGRAM_NAME;
    $progName =~ s?^.*\/??;
    print $STREAM <<EOD;

Object 
        deux fichiers mlf: le premier avec phonemes et mot le deuxieme avec phonemes seulement
        generation d un fichier mlf reprenant les limites de phnemes du deuxieme mlf avec les mots recuperes dans le premier

Usage:
        $progName -help -bdlex <fileName>  -dicooutput <fileName> [-debug]

Options:
        -help                   Display this help data.
        -mlf1 <fileName>       fichier mlf (input) phonemes et mots
        -mlf2 <fileName>       fichier mlf (input) phonemes seulement
        -mlfout <fileName>     fichier mlf (output) frontieres de mlf1  mots de mlf1 
        -debug                 Display extra information while processing data.
                                (mainly used for debugging purpose).

EOD
        return;
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
                          '-mlf1=s'           => \$nomFichMlf1,
                          '-mlf2=s'           => \$nomFichMlf2,
                          '-mlfout=s'         => \$nomFichMlfOut,
                          '-debug'            => \$debug
                          );
if (defined $help) {
    CmdDisplayUsage (*STDOUT);
    exit 0;
}


if (! defined $nomFichMlf1) {
    print STDERR "ERROR - Iutput file mlf1 missing\n";
    CmdDisplayUsage (*STDERR);
    exit 1;
}

if (! defined $nomFichMlf2) {
    print STDERR "ERROR - Iutput file mlf2 missing\n";
    CmdDisplayUsage (*STDERR);
    exit 1;
}

if (! defined $nomFichMlfOut) {
    print STDERR "ERROR - Output file mlf missing\n";
    CmdDisplayUsage (*STDERR);
    exit 1;
}

# Data processing

binmode STDOUT,  ":utf8";
binmode STDERR,  ":utf8";

open (my $FichMlf1, "< $nomFichMlf1") || die "\nERROR opening input file $nomFichMlf1\n";
binmode $FichMlf1,  ":utf8";

my @mots = ();
my $nb = 0;

while (my $buffer = readline ($FichMlf1)) {
    chomp $buffer;
    my @champs = split(/\s+/,$buffer);
    if($#champs == 4) {
	$mots[$nb] = $champs[4];
    } else {
	$mots[$nb] = "";
    }
    $nb++;
}
close($FichMlf1);

open (my $FichMlfOut, "> $nomFichMlfOut") || die "\nERROR opening output file $nomFichMlfOut\n";
binmode $FichMlfOut, ":utf8";

open (my $FichMlf2, "< $nomFichMlf2") || die "\nERROR opening input file $nomFichMlf2\n";
binmode $FichMlf2,  ":utf8";

$nb = 0;

while (my $buffer = readline ($FichMlf2)) {
    chomp $buffer;

    if($mots[$nb] ne "") {
	print $FichMlfOut $buffer." ".$mots[$nb]."\n";
    } else {
	print $FichMlfOut $buffer."\n";
    }

    $nb++;
}

close($FichMlfOut);
close($FichMlf2);

