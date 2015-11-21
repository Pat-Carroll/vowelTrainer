#!/usr/bin/perl -w

use English;
use strict;

use Encode;
use File::Path;
use Getopt::Long;
use IO::Handle;
use Unicode::UCD 'charinfo';
use File::Basename;

# Option variables
my $help                = undef;
my $nomFichTri          = undef;
my $nomFichMono          = undef;
my $debug               = undef;

sub CmdDisplayUsage ($)
{
    my $STREAM = shift;
    my $progName = $PROGRAM_NAME;
    $progName =~ s?^.*\/??;
    print $STREAM <<EOD;
    
Object 
        generation d un fichier mlf a partir d un fichier textgrid

Usage:
        $progName -help -mlftri <fileName> -mlfmono <fileName> [-debug]

Options:
        -help                      Display this help data.
        -mlftri <fileName>         fichier mlf triphone (input)
        -mlfmono <fileName>        fichier mlf mono (output)
        -debug                     Display extra information while processing data.
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
my $results = GetOptions ('-help|h'             => \$help,
                          '-mlftri=s'           => \$nomFichTri,
                          '-mlfmono=s'          => \$nomFichMono,
                          '-debug'              => \$debug
                          );

if (!$results) {
        CmdDisplayUsage (*STDERR);
        exit 1;
}

if (defined $help) {
        CmdDisplayUsage (*STDOUT);
        exit 0;
}

if (! defined $nomFichTri) {
        print STDERR "ERROR - Input fich mlftri missing\n";
        CmdDisplayUsage (*STDERR);
        exit 1;
}

if (! defined $nomFichMono) {
        print STDERR "ERROR - Input fich mlfmono missing\n";
        CmdDisplayUsage (*STDERR);
        exit 1;
}

binmode STDOUT,  ":utf8";
binmode STDERR,  ":utf8";

open (my $FichTri, "< $nomFichTri") || die "\nERROR opening file $nomFichTri\n";
binmode $FichTri, ":utf8";

open (my $FichMono, "> $nomFichMono") || die "\nERROR creating file $nomFichMono\n";
binmode $FichMono, ":utf8";

# on lit entete MLF 
my $buffer = readline ($FichTri);
chomp $buffer;
if($buffer ne "#!MLF!#") {
    print "manque entete ".$buffer."\n";
}

print $FichMono $buffer."\n";

# on lit le nom du fichier
$buffer = readline ($FichTri);
chomp $buffer;

print $FichMono $buffer."\n";

while ($buffer = readline ($FichTri)) {
    chomp $buffer;
    $buffer =~ s/^ +//;
    $buffer =~ s/ +$//;
    $buffer =~ s/ +/ /g;
    
    if($buffer ne ".") {
	my @champs = split(/ +/, $buffer);
	if($#champs < 2) {
	    print "pas 3 champs: ".$buffer."\n";
	} else {
	    # split triphone 
	    my @mots = split(/[+\-]/, $champs[2]);
	    if($#mots > 0) {
		print $FichMono $mots[1]."\n";
	    } else {
		# pas un triphone on recopie
		print $FichMono $buffer."\n";
	    }
	}
    } else {
	print $FichMono $buffer."\n";
    }
}
close($FichTri);
close($FichMono);

