const oilGasWords: string[] = [
    'Neft', 'Gaz', 'Skvazhina', 'Mestorozhdenie', 'Burovaya', 'Plast', 'Zalez', 'Fontan',
    'Debit', 'Pritok', 'Kollektor', 'Poristost', 'Pronitsaemost', 'Nedra', 'Razvedka', 'Burenie',
    'Ekspluatatsia', 'Dobycha', 'Truboprovod', 'Magistral', 'Neftprovod', 'Gazoprovod', 'Kompressor',
    'Separator', 'PereRabotka', 'Rektifikatsia', 'Kreking', 'Fraktsia', 'Distillat', 'Benzin',
    'Kerosin', 'Dizel', 'Bitum', 'Parafin', 'Kondensat', 'NeftProdukt', 'Polimer', 'Kauchuk',
    'Metan', 'Etan', 'Propan', 'Butan', 'Alkan', 'Alken', 'Izomer', 'Asfalten', 'Smola', 'Vosk',
    'Rezervuar', 'Tank', 'TsisterNa', 'Peschanik', 'Glina', 'Izvestnyak', 'Dolomit', 'Karbonat',
    'Kaverna', 'Treshina', 'Geofizika', 'Seismika', 'Korotazh', 'Geologorazvedka', 'Nagnetanie',
    'Zakachka', 'Vodonagnetanie', 'Gidrorazryv', 'Tsementirovanie', 'Obsadnaya', 'Konduktor',
    'Zaboy', 'Ustye', 'Fontanniy', 'Erlift', 'Kachalka', 'Shtanga', 'Pogruzhnoi', 'Vintovoi',
    'Obvodnenie', 'Vodoneftyanoi', 'Neftegazoviy', 'Nefteotdacha', 'Zapasy', 'Litsenziya', 'Royalty',
    'Aktsiz', 'Tanker', 'Gazovoz', 'Szhizhenie', 'Metanol', 'Biotoplivo', 'Vodorod', 'Dekarbonizatsia',
    'Uglerodniy', 'Khranilishche', 'Podzemnoe', 'Otbenzinivanie', 'Stabilizatsia', 'Reforming',
    'Izomerizatsia', 'Alkilirovanie', 'Gidrokreking', 'Koksovanie', 'Vakuumnaya', 'Atmosfernaya',
    'Neftopromysel', 'Gazopromysel', 'Bassein', 'Gorizont', 'Flyuidy', 'Modelirovanie', 'Tsifrovizatsia',
    'Avtomatizatsia', 'Telemetria', 'Datchik', 'Raskhodomer', 'Debitomer', 'Zamernaya', 'Dozhimnaya',
    'Kompressornaya', 'Raspredelitelnaya', 'Uzel', 'Kommercheskiy', 'Reglament', 'Tekhnologicheskaya',
    'Obyazka', 'Armatura', 'Zadvizhka', 'Kran', 'Klanpan', 'Predohranitelniy', 'Reduktsionniy',
    'Obratniy', 'Filtr', 'Gidrotsiklon', 'Tsentrifuga', 'Otdelitel', 'Absorber', 'Adsorber',
    'Regeneratsia', 'Tseolit', 'Aktinirovanniy', 'Membrana', 'Kriogennoe', 'Nizkotemperaturnaya',
    'Turbodetaider', 'Teploobmennik', 'Rekuperator', 'Kondensator', 'Isparitel', 'Reaktor',
    'Rektifikatsionnaya', 'Tarelka', 'Nasadka', 'Kipyatilnik', 'Deflegmator', 'Flegma', 'Kuboviy',
    'Distillyatsionnaya', 'Legkie', 'Srednie', 'Tyazhelie', 'Uglevodorody', 'Neftekhimia', 'Sintetika',
    'Poputniy', 'Merkaptan', 'Sera', 'Mazut', 'Solyarka', 'Ostatok', 'Neftkhranilishche', 'Otstoinik',
    'Lovushka', 'Antiklinal', 'Sinklinal', 'Razlom', 'Osadochniy', 'Litologiya', 'Stratigrafiya',
    'Tektonika', 'Gravirazvedka', 'Magnitorazvedka', 'Elektrorazvedka', 'Poisk', 'Otsenka',
    'Razvedochniy', 'Nablyudatelniy', 'Piezometricheskiy', 'Dobyvayushiy', 'Podderzhanie', 'Vtorichniy',
    'Tretichniy', 'Zavodnenie', 'Polimernoe', 'Teplovoe', 'Paroteplovoe', 'Vnutriplastovoe',
    'Kislotnaya', 'Intensifikatsia', 'Osvoenie', 'Ispytanie', 'Oprobovanie', 'Gernietizatsia',
    'Tamponazh', 'Ekspluatatsionnaya', 'Napravlenie', 'Tekhnicheskaya', 'Khvostovik', 'Zaboynoe',
    'UstyeVoe', 'Zatrubnoe', 'Mezhtrubnoe', 'Galift', 'Shtangoviy', 'Stanok', 'Plunzher',
    'Beshtangoviy', 'Elektropogruzhnoi', 'Tsentrobezhniy', 'Obvodnennost', 'Gazovodyanoi',
    'Neftegazovodyanoi', 'Koeffitsient', 'Izvlekaemie', 'Balansovie', 'Geologicheskie', 'Kategoria',
    'Razvedannost', 'Nedropolzovanie', 'Subsidia', 'Kvota', 'Neftenalivnoy', 'Regazifikatsia',
    'Etanol', 'Sinteticheskoe', 'Vodorodnaya', 'Ulavlivanie', 'Glubokaya', 'Oligomerizatsia',
    'Degazatsia', 'Obezvozhivanie', 'Deemulsatsia', 'Stabilizator', 'Katalizator', 'Gidroochistka',
    'Kataliz', 'Distillyatsia', 'Ochistka', 'Apparat', 'Ustanovka', 'Protsess', 'Tekhnologiya',
    'Oborudovanie', 'Mekhanizm', 'Agregat', 'Sistema', 'Kontur', 'Skhema', 'Rezhim', 'Parametr',
    'Pokazatel', 'Kharakteristika', 'Svoistvo', 'Kachestvo', 'Sostav', 'Struktura', 'FormatSia'
];


export const getRandomCustomWord = () => {
    return oilGasWords[Math.round(Math.random() * oilGasWords.length)] as string;
};

export default oilGasWords;
