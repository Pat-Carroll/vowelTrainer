#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <ctype.h>

/****************************************************/
/* input :                                          */
/*    une phrase a phonetiser (fichier texte)  */
/*    un seul dictionnaire ecrit a la mode Julius */
/* avec les _ devant et derriere les mots avec liaison */
/*    les [les_] l e z       _enfants */
/* output :                                         */
/*    un fichier gram HTK pour la phrase */
/*    ( (les [sil] | les_) _enfants) */
/*    un fichier lexique correspondant aux mots presents dans la phrase */
/*    un fichier contenant les mots manquants */ 
/**********************************************/

#define STRLEN 4096

typedef struct {
  char *graphie; //vraie graphie du mot ex: les
  char *graphie_l; //graphie qui etait entre [] avec les _ si liaison ex: les_
  char *pronom; //la phonetisation complete de graphie_l  ex: l e z
} DICO;

/*pour chaque mot de la pharse */
typedef struct {
  int numdico; //indice de la graphie du mot dans le dictionnaire
  int id; // indice de la premiere prononciation trouvee qui n'a pas de liaison (-1 sinon)
  int id_; //indice de la premiere prononciation trouvee qui a une liaison (-1 sinon)
} MOTSPHRASE;



/* rend le nombre d'entrees du dico dont le nom est donne en parametre*/
int nb_mots_dico(char *nomDico) 
{
  FILE *fich;
  char ligne[STRLEN];
  int nbmots;

  /* Ouverture du fichier */
  fich = fopen(nomDico,"r");
  if (fich==NULL)
    {
      fprintf(stderr,"unable to open %s\n",nomDico);
      exit(EXIT_FAILURE);
    }
  
  nbmots = 0;
  do 
    {
      if(fgets(ligne,STRLEN,fich) != NULL && strlen(ligne) > 5)
        {
          nbmots++;
        }
    }
  while (!feof(fich));
  fclose(fich);
  return(nbmots);
}


/*recupere dans ligne le mot commencant a l'indice i -> word */
/* met dans i l'indice du caractere suivant le mot */
/* retourne 1 si OK 0 si pas de mot trouve */

int extract_next_word(char *ligne, int *i, char *word)
{
  int deb=0;
  strcpy(word,"");
  while((ligne[(*i)] != '\0') && (ligne[(*i)] == ' '))(*i)++;
  if(ligne[(*i)]=='\0') return(0);
  while((ligne[(*i)] != '\0') && (ligne[(*i)] != ' ')) word[deb++] = ligne[(*i)++];
  word[deb]='\0';
  return(1);
}


/*lit le dictionnaire et remplit le tableau de structures DICO */ 
/* retourne le nombre de structures remplies */
int lire_dico(char *nomDico, DICO* tabGlobal) 
{
  FILE *fich;
  char ligne[STRLEN];
  char mot[STRLEN];
  int l,i;
  int nbMotLus;
  /* Ouverture du fichier */
  fich = fopen(nomDico,"r");
  if (fich==NULL)
    {
      fprintf(stderr,"unable to open %s\n",nomDico);
      exit(EXIT_FAILURE);
    }
  
  nbMotLus=0;

  do 
    {
      /* lire une entree valide  du dictionnaire */ 
      if(fgets(ligne,STRLEN,fich) != NULL && strlen(ligne) > 5)
        {
          
          /* on remplace le caractere fin de ligne par le caractere fin de chaine */
          if(ligne[strlen(ligne)-1]=='\n') ligne[strlen(ligne)-1]='\0';
          i=0;
          l=extract_next_word(ligne,&i,mot);
          /* stockage dans la liste globale */
	  if(l==1)
	    {
	      /* on range la graphie du mot*/
	      tabGlobal[nbMotLus].graphie = (char *) malloc(sizeof(char)*(strlen(mot)+1));
	      strcpy(tabGlobal[nbMotLus].graphie,mot);

              /* on recupere le champ entre [] */
              l=extract_next_word(ligne,&i,mot);
	      
	      /* cela doit commencer par [ et finir par ]*/
              if(mot[0]!='[')
                {
                  fprintf(stderr,"manque [ %s\n",ligne);
		  exit(EXIT_FAILURE); 
                }
              if(mot[strlen(mot)-1]!=']')
                {
                  fprintf(stderr,"manque ] %s\n",ligne);
                  exit(EXIT_FAILURE);
                }

              /* on supprime les crochets [] et on recopie le contenu dans graphie_l*/
              mot[strlen(mot)-1]= '\0';
              tabGlobal[nbMotLus].graphie_l = (char *) malloc(sizeof(char)*(strlen(mot)+1));
              strcpy(tabGlobal[nbMotLus].graphie_l,&mot[1]);

	      /* on range la prononciation dans pronon */
	      /* sans doute avec un espace devant*/
              l=strlen(ligne)-i;
              tabGlobal[nbMotLus].pronom = (char *) malloc((l+1) * sizeof(char));
              strcpy(tabGlobal[nbMotLus].pronom,&ligne[i]);

	      nbMotLus++;
	    }
        }
    }
  while (!feof(fich));
  fclose(fich);
  return(nbMotLus);
}



/* cherche un mot dans  le tableau global trie  */
/* utilise le champ graphie et rend l'index de la premiere occurrence */
/* rend -1 si mot pas trouve */
int recherche_dichotomique_dico(int nb, DICO *dico, char *aChercher)
{ 

  int  mini, maxi, milieu ;  // les indices
  int trouve = 0 ;
  int val;
  
  mini   = 0 ;
  maxi   = nb - 1 ; /* on examine tout le tableau */

  while ( !trouve && (mini <= maxi) ) 
    {
      milieu = ( mini + maxi ) / 2 ;
      val=strcmp(aChercher,dico[milieu].graphie);
      if (val<0)  maxi = milieu - 1 ;
      else if (val>0) mini = milieu + 1 ;
      else
        { 
          while((milieu-1 >= 0) && (strcmp(aChercher,dico[milieu-1].graphie)==0)) milieu--; 
          return(milieu);
        }
    }
  
  return -1 ;
  
}

/* fonction qui retourne la lettre en minuscule */
/* gere les majuscules accentuees code iso >= 192 */
unsigned char enminusculeaccentue_saufaprestiret(unsigned char l, unsigned char precedent)
{
  if(precedent!='-')
    {
      /* cas general A-Z */
      if(((int)l>=65) && ((int)l<=90)) return (unsigned char) tolower((int)l);
      /* cas majuscule accentuee */
      else if(((int)l>=192) && ((int)l<=221)) return (unsigned char) (l+32);
    }
  return(l);
}

/* fonction qui retourne la lettre en minuscule */
/* gere les majuscules accentuees code iso >= 192 */
unsigned char enminusculeaccentue(unsigned char l)
{
  /* cas general A-Z */
  if(((int)l>=65) && ((int)l<=90)) return (unsigned char) tolower((int)l);
  /* cas majuscule accentuee */
  else if(((int)l>=192) && ((int)l<=221)) return (unsigned char) (l+32);
  return(l);
}

/* transforme une majuscule accentuee en la majuscule sasn accent */
unsigned char majusculesansaccent(unsigned char l)
{
  if(((int)l>=192) && ((int)l<=197)) return ('A');
  else if(((int)l>=199) && ((int)l<=199)) return ('C');
  else if(((int)l>=200) && ((int)l<=203)) return ('E');
  else if(((int)l>=204) && ((int)l<=207)) return ('I');
  else if(((int)l>=209) && ((int)l<=209)) return ('N');
  else if(((int)l>=210) && ((int)l<=214)) return ('O');
  else if(((int)l>=217) && ((int)l<=220)) return ('U');
  
  return(l);
}

/* transforme met en majuscule (sait gerer les majuscule accentuees) */
unsigned char majuscules_avec_accent(unsigned char l)
{
  /* cas general a-z */
  if(((int)l>=97) && ((int)l<=122)) return (unsigned char) toupper((int)l);
  /* cas majuscule accentuee */
  else if(((int)l>=224) && ((int)l<=253)) return (unsigned char) (l-32);
  return(l);
}



int recherche_dico(int nb, DICO *dico, char *aChercher)
{

  int num, i;
  char mot[1024];
  
  /* rechercher le mot tel quel */
  num=recherche_dichotomique_dico(nb, dico, aChercher);
  if(num >=0) return(num);

  /* rechercher le mot tout en minuscule */
  strcpy(mot,aChercher);
  for(i=0;i<strlen(mot);i++) mot[i] = enminusculeaccentue(mot[i]);
  num=recherche_dichotomique_dico(nb, dico, mot);
  if(num >=0) return(num);

  /* rechercher le mot tout en minuscule sauf initiale et apres tiret */
  strcpy(mot,aChercher);
  for(i=1;i<strlen(mot);i++) mot[i] = enminusculeaccentue_saufaprestiret(mot[i],mot[i-1]);
  num=recherche_dichotomique_dico(nb, dico, mot);
  if(num >=0) return(num);

  /* rechercher le mot avec initiale en majuscule (accentuee) */
  strcpy(mot,aChercher);
  mot[0]=majuscules_avec_accent(mot[0]);
  num=recherche_dichotomique_dico(nb, dico, mot);
  if(num >=0) return(num);

  /* rechercher le mot avec initiale en majuscule (sans accent) */
  strcpy(mot,aChercher);
  mot[0]=majuscules_avec_accent(mot[0]);
  mot[0]=majusculesansaccent(mot[0]);
  num=recherche_dichotomique_dico(nb, dico, mot);
  if(num >=0) return(num);
  
  /* rechercher le mot tout en majuscule (acentuee) */
  strcpy(mot,aChercher);
  for(i=0;i<strlen(mot);i++) mot[i] = majuscules_avec_accent(mot[i]);
  num=recherche_dichotomique_dico(nb, dico, mot);
  if(num >=0) return(num);
  
  /* rechercher le mot tout en majuscule sans accents */
  strcpy(mot,aChercher);
  for(i=0;i<strlen(mot);i++) { mot[i] = majuscules_avec_accent(mot[i]); mot[i]=majusculesansaccent(mot[i]); }
  num=recherche_dichotomique_dico(nb, dico, mot);
  if(num >=0) return(num);
  
  return(num);
}

/* met la chaine item + espace  en debut de la chaine ligne */ 
void mettre_en_tete(char *item, char *ligne)
{
  char temp[STRLEN];

  if(strlen(item)+1+strlen(ligne)>STRLEN)
    {
      fprintf(stderr,"ca deborde dans gram");
    }
  else
    {
      strcpy(temp,item);
      strcat(temp," ");
      strcat(temp,ligne);
      strcpy(ligne,temp);
    }
}

/* fonction inutile ! 
static int cmpstringp(const void *p1, const void *p2)
{
  The actual arguments to this function are "pointers to
              pointers to char", but strcmp() arguments are "pointers
              to char", hence the following cast plus dereference 

  return strcmp(* (char * const *) p1, * (char * const *) p2);
} */

/* fonction permettant a quicksort de trier alphabetiquement le tableau global sur le champ graphie */ 
static int cmpdico(const void *p1, const void *p2)
{
  /* The actual arguments to this function are "pointers to
              pointers to char", but strcmp() arguments are "pointers
              to char", hence the following cast plus dereference */
  DICO *pp1, *pp2;
  pp1 = (DICO *) p1;
  pp2 = (DICO *) p2;
  
  return strcmp(pp1->graphie, pp2->graphie);
}


/* fonction qui rend 0 si pas de tiret ou tiret en dernier caractere */
/* fonction qui rend 1 si c'est un mot compose (avec un tiret) */
/* fonction qui rend 2 si c'est un mot compose (avec deux tirets) */
/*                   et mot1 contiendra la premiere partie (avant le tiret) */
/*                   et mot2 contiendra la deuxieme partie (apres le tiret) */
/*                   et mot3 contiendra la troisieme partie (apres le tiret) */
int yauntiret(char *mot, char *mot1, char *mot2, char *mot3)
{
  int i;

  /* si le mot se termine ou commence par tiret on ne le traite pas */
  if( (mot[0]=='\0') || (mot[strlen(mot)-1] =='-') || (mot[0]=='-') ) return(0);

  i=0;
  while((mot[i]!='\0') && (mot[i]!='-')) i++;
  if(mot[i]=='-')
    {
      strcpy(mot2,&(mot[i+1]));
      strcpy(mot1,mot);
      mot1[i]='\0';
      i=0;
      while((mot2[i]!='\0') && (mot2[i]!='-')) i++;
      if(mot2[i]=='-')
	{
	  strcpy(mot3,&(mot2[i+1]));
	  mot2[i]='\0';
	  return(2);
	}
      mot3[i]='\0';
      return(1);
    }
  return(0);
}

void remplir_phrase(MOTSPHRASE *p_phrase, int id, DICO *dico, int nb_dico, char *mot)
{
  int id1;
  char graphie[1024];

  /* attention la graphie de id peut etre differente de mot */
  /* par exemmple iPad et ipad */
  /* graphie du dico differente de l ecriture dans les transcriptions */

  strcpy(graphie,dico[id].graphie);
  id1 = id;
  //on remplit la structure MOTSPHRASE pour ce mot
  p_phrase->numdico = id1;
  p_phrase->id  = -1;
  p_phrase->id_ = -1;

  while((id1<nb_dico) && (strcmp(dico[id1].graphie,graphie)==0))
     {
        if(dico[id1].graphie_l[strlen(dico[id1].graphie_l)-1] == '_') p_phrase->id_ = id1;
        else  p_phrase->id = id1;
        id1++;
     }
}


int main(int argc, char *argv[])
{
  /* premier argument : nom du fichier dictionnaire */
  /* deuxieme argument : fichier texte de la phrase dont on veut construire la grammaire */ 
  /* troisieme argument : fichier grammaire pour HTK */
  /* quatrieme argument : fichier mots manquants */
  /* cinquieme argument : fichier lexique pour HTK */

  FILE *fichphrase;
  FILE *fichmotsmanquants;
  FILE *fichgram;
  FILE *dicomotsphrase;
  int nb_dico;
  DICO *dico;
  int i,j;
  char mot[STRLEN];
  char mot1[STRLEN];
  char mot_tiret[3][STRLEN];
  int id;
  int nb_mots;
  MOTSPHRASE *phrase;
  char gram[STRLEN];
  int last_deb_voy;
  int il_manque_des_mots; //=1 si au moins un mot manquant 
  int nbtirets;

  if(argc!=6)
    {
      fprintf(stderr,"usage <dico> <phrase> <gram> <motsmanquants> <dico mots phrase>\n");
      exit(EXIT_FAILURE);
    }

  /* lecture du dictionnaire */
  nb_dico =  nb_mots_dico(argv[1]);
  dico = (DICO *) malloc(sizeof(DICO) * nb_dico);
  nb_dico = lire_dico(argv[1], dico);
  /* printf("%d %s %s \n", nb_dico, dico[0].graphie,  dico[nb_dico-1].graphie); */

  /*tri alphabetique du dictionnaire sur la graphie */
  qsort(dico, nb_dico, sizeof(DICO), cmpdico);
  /* printf("%d %s %s \n", nb_dico, dico[0].graphie,  dico[nb_dico-1].graphie); */
  

  /* ouverture fichier mots manquants */
  fichmotsmanquants = fopen(argv[4],"w");
  if (fichmotsmanquants == NULL)
    {
      fprintf(stderr,"unable to create %s\n",argv[4]);
      exit(EXIT_FAILURE);
    }
  
  /* ouverture fichier texte de la phrase */
  fichphrase = fopen(argv[2],"r");
  if (fichphrase == NULL)
    {
      fprintf(stderr,"unable to open %s\n",argv[2]);
      exit(EXIT_FAILURE);
    }
  
  /*compte nb de mots dans la phrase */
  nb_mots=0;
  while(fscanf (fichphrase,"%s",mot) != EOF) nb_mots++;
  
  rewind (fichphrase);
  /* on reserve 3 fois plus de place que le nombre de mots  */
  /* car un mot peut contenir 2 tirest et donc 3 sous mots */
  phrase  = (MOTSPHRASE *) malloc(sizeof(MOTSPHRASE) * nb_mots * 3);

  il_manque_des_mots = 0;
  i=0;

  nb_mots=0;
  /* pour chaque mot de la phrase */
  /* on remplit le tableau de structures MOTSPHRASE */
  while(fscanf (fichphrase,"%s",mot) != EOF)
    {
      //recherche du mot dans le dictionnaire
      id = recherche_dico(nb_dico, dico, mot);

      if(id == -1)
	{
          /* traiter les mots avec tirets */
          nbtirets = yauntiret(mot,mot_tiret[0],mot_tiret[1],mot_tiret[2]);

	  if(nbtirets==0)
            {
	        // mot pas trouve dans dictionnaire
	        fprintf(fichmotsmanquants,"%s\n",mot);
                il_manque_des_mots = 1;
            }
          else
            {
               for(j=0; j<=nbtirets; j++)
                 {
	           id = recherche_dico(nb_dico, dico, mot_tiret[j]);
                   if(id == -1)
                     {
		        // mot pas trouve dans dictionnaire
                        fprintf(fichmotsmanquants,"%s\n",mot_tiret[j]);
                        il_manque_des_mots = 1;
                     }
                   else
                     {
	                //on remplit la structure MOTSPHRASE pour ce mot
                        remplir_phrase(&phrase[i], id, dico, nb_dico, mot_tiret[j]);
                        i++;
                        nb_mots++;
                     }
                  }
             }
	}
      else
        {
	  //on remplit la structure MOTSPHRASE pour ce mot
          remplir_phrase(&phrase[i], id, dico, nb_dico, mot);
          i++;
          nb_mots++;
        }
    }

  fclose(fichphrase);
  fclose(fichmotsmanquants);
 
  //si la pharse contient des mots manquants pas de grammaire !
  if(il_manque_des_mots)
    {
       remove(argv[3]);
       exit(EXIT_FAILURE);
    }


  /* generation grammaire  */
  /* on part du dernier mot de la phrase */

  /* dernier mot de la phrase */
  /* il est forcement sans liaison champ id */
  strcpy(gram,dico[phrase[nb_mots-1].id].graphie_l);
  /*ajout d'un silence optionnel en fin de phrase */
  strcat(gram," [sil] )");

  /* on memorise si on peut faire une liaison avec ce mot */
  /* a priori _ au debut si prononciation commence par une voyelle ou semi-voyelle */
 
  if(dico[phrase[nb_mots-1].id].graphie_l[0]=='_') 
    last_deb_voy=1;
  else
    last_deb_voy=0;

  /* on remonte dans la phrase */
  for(i=nb_mots-2;i>=0;i--)
    {
      /* liaison possible entre ce mot et le suivant */
      if((last_deb_voy == 1) && (phrase[i].id_ != -1))
	{
	  /* on range dans la grammaire soit la graphie[] du mot sans liaison suivi d'un silence optionnel */
	  /*                            soit la graphie[] du  mot avec liaison */
	  sprintf(mot1,"( %s [sil] | %s ) ", dico[phrase[i].id].graphie_l, dico[phrase[i].id_].graphie_l);

	  /* version speciale */
	  /* pour prendre en compte en plus la prononciation l e sil z an f an */
	  /* cette prononciation specilae est notee les__ */
	  /* sprintf(mot1,"( %s [sil] | %s | %s_ ) ", dico[phrase[i].id].graphie_l, dico[phrase[i].id_].graphie_l, dico[phrase[i].id_].graphie_l); */
	}
      else
	{
	  /* pas de liaison possible */
	  /* on range dans la grammaire soit la graphie[] du mot  suivi d'un silence optionnel sauf si le mot fini par ' */
	  if(phrase[i].id != -1)
             {
               if(dico[phrase[i].id].graphie_l[strlen(dico[phrase[i].id].graphie_l)-1] != '\'' )
		 {
		   sprintf(mot1," %s [sil]" , dico[phrase[i].id].graphie_l);
		 }
	       else
		 {
		   sprintf(mot1," %s " , dico[phrase[i].id].graphie_l);
		 }
             }
          else
	    fprintf(stderr,"etrange il n y a pas de pronontiation sans liaison pour le mot %s\n",dico[phrase[i].numdico].graphie);
	}
      
      /* on range dans grammaire */
      mettre_en_tete(mot1,gram);

      /* on memorise si on peut faire une liaison avec ce mot */
      if (phrase[i].id != -1)
        {
          if(dico[phrase[i].id].graphie_l[0]=='_') 
	    last_deb_voy=1;
          else
	    last_deb_voy=0;
        }
      else if(phrase[i].id_ != -1)
        {
          if(dico[phrase[i].id_].graphie_l[0]=='_')
            last_deb_voy=1;
          else
            last_deb_voy=0;
        }
       else 
        { 
           fprintf(stderr,"etrange un mot bizarre %s\n",dico[phrase[i].numdico].graphie);
           exit(EXIT_FAILURE);
        }
    }

  /* la phrase peut commencer par un silence */
  mettre_en_tete("( [sil] ",gram);

  /* on ecrit la grammaire dans le fichier */
  fichgram = fopen(argv[3],"w");
  if (fichgram == NULL)
    {
      fprintf(stderr,"unable to create %s\n",argv[3]);
      exit(EXIT_FAILURE);
    }

  fprintf(fichgram,"%s\n",gram);
  fclose(fichgram);

  /* generation du lexique qui correspond a cette phrase */
  dicomotsphrase = fopen(argv[5],"w");
  if (dicomotsphrase == NULL)
    {
      fprintf(stderr,"unable to create %s\n",argv[5]);
      exit(EXIT_FAILURE);
    }

  /* le lexique doit comporter toutes les prononciations du mot */
  /* entre autresnotamment celles avec et sans liaison */

  for(i=0; i<nb_mots; i++)
    {
       id=phrase[i].numdico;
       strcpy(mot,dico[id].graphie);
       while((id < nb_dico) && (strcmp(mot,dico[id].graphie)==0))
	 {
	   /* on recopie directement dans le fichier toutes les prononciations du mot */
            fprintf(dicomotsphrase,"%s %s\n",dico[id].graphie_l,dico[id].pronom);
            id++;
         }
    }
 
  fclose(dicomotsphrase);
  exit(EXIT_SUCCESS);

}


